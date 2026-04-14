import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, distanceCategory, pricePHP } = body;

    console.log('[REGISTER] Request received:', { email, distanceCategory });

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !distanceCategory || !pricePHP) {
      console.log('[REGISTER] Missing fields:', { firstName, lastName, email, phone, distanceCategory, pricePHP });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('[REGISTER] Invalid email format:', email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate distance category
    if (!['3km', '5km', '10km'].includes(distanceCategory)) {
      console.log('[REGISTER] Invalid distance category:', distanceCategory);
      return NextResponse.json(
        { error: 'Invalid distance category' },
        { status: 400 }
      );
    }

    console.log('[REGISTER] Creating Supabase client...');
    const supabase = await createClient();
    console.log('[REGISTER] Supabase client created');

    // Check if email already registered
    console.log('[REGISTER] Checking for existing registration with email:', email);
    const { data: existingRegistration, error: checkError } = await supabase
      .from('registrations')
      .select('id, status')
      .eq('email', email)
      .maybeSingle();

    console.log('[REGISTER] Check result:', { existingRegistration, checkError });

    if (checkError) {
      console.error('[REGISTER] Error checking existing registration:', checkError);
      if (checkError.message && checkError.message.includes("Could not find the table")) {
        return NextResponse.json(
          {
            error: 'Database not initialized',
            message: 'Please visit /setup-db to initialize the database first',
            details: checkError.message,
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to check registration', details: checkError.message },
        { status: 500 }
      );
    }

    let registration;
    let error;

    if (existingRegistration) {
      console.log('[REGISTER] Existing registration found, status:', existingRegistration.status);
      // If registration exists but payment is not completed, allow update
      if (existingRegistration.status === 'pending') {
        // Update existing pending registration
        console.log('[REGISTER] Updating pending registration:', existingRegistration.id);
        const { data: updatedReg, error: updateError } = await supabase
          .from('registrations')
          .update({
            first_name: firstName,
            last_name: lastName,
            phone,
            distance_category: distanceCategory,
            price_php: pricePHP,
          })
          .eq('id', existingRegistration.id)
          .select()
          .single();

        console.log('[REGISTER] Update result:', { updatedReg, updateError });
        registration = updatedReg;
        error = updateError;
      } else {
        // Registration is paid, cannot register again
        console.log('[REGISTER] Registration already paid, cannot update');
        return NextResponse.json(
          { error: 'Email already registered and payment completed' },
          { status: 409 }
        );
      }
    } else {
      // Create new registration
      console.log('[REGISTER] Creating new registration');
      const { data: newReg, error: insertError } = await supabase
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

      console.log('[REGISTER] Insert result:', { newReg, insertError });
      registration = newReg;
      error = insertError;
    }

    if (error) {
      console.error('[REGISTER] Registration error:', error);
      
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

    if (!registration) {
      console.error('[REGISTER] Registration is null after operation');
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    console.log('[REGISTER] Success:', registration.id);
    return NextResponse.json({
      id: registration.id,
      email: registration.email,
      message: existingRegistration 
        ? 'Registration updated successfully. Proceed to payment.'
        : 'Registration created successfully. Proceed to payment.',
    });
  } catch (error) {
    console.error('[REGISTER] Catch block - API error:', error);
    const errorMessage = (error as Error).message || 'Unknown error';
    console.error('[REGISTER] Error details:', { name: (error as Error).name, message: errorMessage, stack: (error as Error).stack });
    
    // Check if it's a missing environment variables error
    if (errorMessage.includes('Missing Supabase environment variables')) {
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Supabase environment variables are not configured. Please contact the administrator.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
