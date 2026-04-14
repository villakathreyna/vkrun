import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const registrationRaw = formData.get('registration');
    const referenceNumber = formData.get('referenceNumber');
    const amount = formData.get('amount');
    const paymentMethod = formData.get('paymentMethod');
    const file = formData.get('file');

    if (!registrationRaw || !referenceNumber || !amount || !paymentMethod || !file) {
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

    let registrationId = existing?.id;
    if (!registrationId) {
      // Create registration
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
          status: 'pending',
        })
        .select()
        .single();
      if (regError) {
        return NextResponse.json({ error: 'Failed to create registration', details: regError.message }, { status: 500 });
      }
      registrationId = reg.id;
    }

    // TODO: Handle file upload (Vercel Blob or Supabase Storage)
    // For now, skip file upload and just store payment record
    const { data: payment, error: payError } = await supabase
      .from('payments')
      .insert({
        registration_id: registrationId,
        reference_number: referenceNumber,
        amount_php: amount,
        payment_method: paymentMethod,
        // payment_proof_url: 'TODO',
        verification_status: 'pending',
      })
      .select()
      .single();
    if (payError) {
      return NextResponse.json({ error: 'Failed to create payment', details: payError.message }, { status: 500 });
    }

    return NextResponse.json({ paymentId: payment.id, registrationId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}
