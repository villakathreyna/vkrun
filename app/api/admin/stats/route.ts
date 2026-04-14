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

    // Get all registrations
    const { data: registrations, error: regError } = await supabase
      .from('registrations')
      .select('*');
    if (regError) {
      throw new Error('Failed to fetch registrations');
    }

    // Calculate stats from registrations table
    const totalRegistrations = registrations?.length || 0;
    // Payments are registrations with payment_proof_url
    const totalPayments = registrations?.filter((r) => r.payment_proof_url).length || 0;
    const pendingPayments = registrations?.filter((r) => r.payment_proof_url && r.verification_status === 'pending').length || 0;
    const verifiedPayments = registrations?.filter((r) => r.payment_proof_url && r.verification_status === 'verified').length || 0;
    const totalRevenue = registrations
      ?.filter((r) => r.payment_proof_url && r.verification_status === 'verified')
      .reduce((sum, r) => sum + (Number(r.amount_php) || 0), 0) || 0;

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
