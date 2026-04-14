import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import * as crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch admin user
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !adminUser) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password (in production, use bcrypt)
    const passwordHash = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex');

    if (passwordHash !== adminUser.password_hash) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString('hex');

    // You could save this token to a sessions table for validation
    // For now, we'll include user info in the token response

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
