import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const status = request.nextUrl.searchParams.get('status') || 'pending';
    const registrationId = request.nextUrl.searchParams.get('registration_id');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();


    let query = supabase.from('payments').select('*');
    if (registrationId) {
      query = query.eq('registration_id', registrationId);
    } else if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: payments, error } = await query.order('created_at', {
      ascending: false,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { payments: payments || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Payments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
