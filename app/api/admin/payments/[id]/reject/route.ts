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

    // Update payment status to rejected
    const { error: updateError } = await supabase
      .from('payments')
      .update({ status: 'rejected' })
      .eq('id', paymentId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(
      { success: true, message: 'Payment rejected' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reject payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
