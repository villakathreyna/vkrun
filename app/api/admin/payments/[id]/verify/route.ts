import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const paymentId = params.id;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Update payment status to verified
    const { data: payment, error: updateError } = await supabase
      .from('payments')
      .update({ status: 'verified' })
      .eq('id', paymentId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Update corresponding registration to confirmed
    if (payment.registration_id) {
      await supabase
        .from('registrations')
        .update({ status: 'confirmed' })
        .eq('id', payment.registration_id);
    }

    return NextResponse.json(
      { success: true, message: 'Payment verified' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
