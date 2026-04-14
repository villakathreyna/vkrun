import { put } from '@vercel/blob';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const registrationId = formData.get('registrationId') as string;
    const referenceNumber = formData.get('referenceNumber') as string;
    const amount = formData.get('amount') as string;
    const file = formData.get('file') as File;
    const email = formData.get('email') as string;

    if (!registrationId || !referenceNumber || !amount || !file || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload file to Vercel Blob
    const filename = `payments/${registrationId}-${Date.now()}-${file.name}`;
    const blob = await put(filename, file, {
      access: 'private',
    });

    // Save payment record to Supabase
    const supabase = await createClient();
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        registration_id: registrationId,
        email,
        reference_number: referenceNumber,
        amount: parseFloat(amount),
        proof_url: blob.url,
        status: 'pending',
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error saving payment:', paymentError);
      return NextResponse.json(
        { error: 'Failed to save payment record' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        paymentId: payment.id,
        message: 'Payment submitted successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments' },
        { status: 500 }
      );
    }

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error('Payment GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
