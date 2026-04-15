
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { put } from '@vercel/blob';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    // Import sendEmail utility
    const { sendEmail } = await import('@/lib/sendEmail');
  try {

    const formData = await request.formData();
    const registrationRaw = formData.get('registration');
    const amount = formData.get('amount');
    const paymentMethod = formData.get('paymentMethod');
    const file = formData.get('file');

    if (!registrationRaw || !amount || !paymentMethod || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const registration = JSON.parse(registrationRaw as string);
    const supabase = await createClient();

    // Check for existing registration
    const { data: existing, error: checkError } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('email', registration.email)
      .maybeSingle();

    if (checkError) {
      return NextResponse.json({ error: 'Failed to check registration', details: checkError.message }, { status: 500 });
    }

    if (existing?.id) {
      return NextResponse.json({ error: 'This email has already been used to register.' }, { status: 400 });
    }

    // Upload payment proof to Vercel Blob using PUBLIC_BLOB_READ_WRITE_TOKEN
    let paymentProofUrl = '';
    if (file && typeof file === 'object' && 'name' in file) {
      const filename = `payments/${Date.now()}-${file.name}`;
      const blob = await put(filename, file, {
        access: 'public',
        token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN,
      });
      paymentProofUrl = blob.url;
    }

    // Create registration with payment fields
    const { data: reg, error: regError } = await supabase
      .from('registrations')
      .insert({
        first_name: registration.firstName,
        last_name: registration.lastName,
        email: registration.email,
        phone: registration.phone,
        address: registration.address,
        birthday: registration.birthday,
        gender: registration.gender === 'specify' ? registration.genderSpecify : registration.gender,
        distance_category: registration.distanceCategory,
        price_php: registration.pricePHP,
        entitlement_size: registration.entitlementSize,
        emergency_contact_name: registration.emergencyContactName,
        emergency_contact_number: registration.emergencyContactNumber,
        finisher_shirt: !!registration.finisherShirt,
        status: 'pending',
        amount_php: amount,
        payment_method: paymentMethod,
        payment_proof_url: paymentProofUrl,
        verification_status: 'pending',
      })
      .select()
      .single();
    if (regError) {
      return NextResponse.json({ error: 'Failed to create registration', details: regError.message }, { status: 500 });
    }
    const registrationId = reg.id;

    try {
      await sendEmail({
        to: registration.email,
        subject: 'Villa Kathreyna Run: Spectrum of Strength - A Pride & Fiesta Run 2026 Registration Receipt',
        registrant: {
          firstName: registration.firstName,
          lastName: registration.lastName,
          email: registration.email,
          phone: registration.phone,
          address: registration.address,
          birthday: registration.birthday,
          gender: registration.genderSpecify || registration.gender,
          distanceCategory: registration.distanceCategory,
          pricePHP: registration.pricePHP,
          finisherShirt: typeof registration.finisherShirt !== 'undefined' ? registration.finisherShirt : false,
          entitlementSize: registration.entitlementSize,
          emergencyContactName: registration.emergencyContactName,
          emergencyContactNumber: registration.emergencyContactNumber,
          team: registration.team,
        },
        payment: {
          method: paymentMethod === 'gcash' ? 'GCash' : 'BDO Savings Account',
          amount: Number(amount),
          date: new Date().toLocaleString('en-PH', { timeZone: 'Asia/Manila' }),
        },
      });
    } catch (e) {
      // Cleanup: delete the registration if email fails
      await supabase.from('registrations').delete().eq('id', registrationId);
      return NextResponse.json({ error: 'Failed to send confirmation email', details: (e as Error).message }, { status: 500 });
    }

    return NextResponse.json({ registrationId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}
