import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { registration_id } = await request.json();
    if (!registration_id) {
      return NextResponse.json({ error: 'Missing registration_id' }, { status: 400 });
    }
    const supabase = await createClient();
    // Get admin user id from token (assume token is admin id for simplicity)
    const verified_by_admin_id = token;
    // Update the registration's payment verification fields
    const { error: regError } = await supabase
      .from('registrations')
      .update({
        status: 'verified',
        verification_status: 'verified',
        verified_by_admin_id,
        verified_at: new Date().toISOString(),
      })
      .eq('id', registration_id);
    if (regError) {
      return NextResponse.json({ error: regError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Registration payment verified' }, { status: 200 });
  } catch (error) {
    console.error('Verify payment by registration error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
