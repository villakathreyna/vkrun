import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data: payments, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Generate CSV
    const headers = [
      'ID',
      'Registration ID',
      'Email',
      'Reference Number',
      'Amount',
      'Status',
      'Proof URL',
      'Created At',
    ];

    const rows = (payments || []).map((payment) => [
      payment.id,
      payment.registration_id,
      payment.email,
      payment.reference_number,
      payment.amount,
      payment.status,
      payment.proof_url,
      new Date(payment.created_at).toLocaleDateString(),
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="payments.csv"',
      },
    });
  } catch (error) {
    console.error('Export payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
