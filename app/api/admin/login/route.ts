
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === 'admin@villakathreyna.com' && password === 'admin') {
      // Hardcoded admin login for demo/testing
      return NextResponse.json(
        {
          success: true,
          token: 'demo-token',
          user: {
            id: 'demo-id',
            email: 'admin@villakathreyna.com',
            name: 'Admin',
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
