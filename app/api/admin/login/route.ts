
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === 'admin@villakathreyna.com' && password === 'admin') {
      // Use the real admin UUID
      const realAdminId = '95a4d6d1-eb9e-4ab5-aa10-d8d6aecf24ba';
      return NextResponse.json(
        {
          success: true,
          token: realAdminId,
          user: {
            id: realAdminId,
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
