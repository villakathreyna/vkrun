import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        first_name,
        last_name,
        email,
        phone,
        address,
        birthday,
        gender,
        team,
        distance_category,
        price_php,
        finisher_shirt,
        status,
        created_at
      `)
      .order('created_at', { ascending: false });
    if (error) {
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
    return NextResponse.json(
      { registrations: registrations || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Registrations API error:', error);
    return NextResponse.json(
      { error: (error as any)?.message || 'Internal server error', details: error },
      { status: 500 }
    );
  }
}
