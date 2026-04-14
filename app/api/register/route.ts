import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, distanceCategory, pricePHP } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !distanceCategory || !pricePHP) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate distance category
    if (!['3km', '5km', '10km'].includes(distanceCategory)) {
      return NextResponse.json(
        { error: 'Invalid distance category' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if email already registered
    const { data: existingRegistration } = await supabase
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Create registration
    const { data: registration, error } = await supabase
      .from('registrations')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        distance_category: distanceCategory,
        price_php: pricePHP,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('[v0] Registration error:', error);
      
      // Check if it's a missing table error
      if (error.message && error.message.includes("Could not find the table")) {
        return NextResponse.json(
          {
            error: 'Database not initialized',
            message: 'Please visit /setup-db to initialize the database first',
            details: error.message,
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to create registration', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: registration.id,
      email: registration.email,
      message: 'Registration created successfully. Proceed to payment.',
    });
  } catch (error) {
    console.error('[v0] API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
