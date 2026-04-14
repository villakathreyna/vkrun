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

    // Get registration stats
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact' });

    // Get payment stats
    const { data: payments, error: payError } = await supabase
      .from('payments')
      .select('*', { count: 'exact' });

    if (regError || payError) {
      throw new Error('Failed to fetch data');
    }

    // Calculate stats
    const totalRegistrations = registrations?.length || 0;
    const totalPayments = payments?.length || 0;
    const pendingPayments = payments?.filter((p) => p.status === 'pending').length || 0;
    const verifiedPayments = payments?.filter((p) => p.status === 'verified').length || 0;
    const totalRevenue = payments
      ?.filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

    return NextResponse.json(
      {
        stats: {
          totalRegistrations,
          totalPayments,
          pendingPayments,
          verifiedPayments,
          totalRevenue,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
