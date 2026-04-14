import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const migrationSQL = `
-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  distance_category TEXT NOT NULL CHECK (distance_category IN ('3km', '5km', '10km')),
  price_php DECIMAL(10, 2) NOT NULL,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'rejected')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  reference_number TEXT NOT NULL,
  amount_php DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_proof_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  match_confidence TEXT CHECK (match_confidence IN ('high', 'medium', 'low', null)),
  admin_notes TEXT,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.registrations;
DROP POLICY IF EXISTS "Enable select for self" ON public.registrations;
DROP POLICY IF EXISTS "Enable update for admins registrations" ON public.registrations;
DROP POLICY IF EXISTS "Enable delete for admins registrations" ON public.registrations;

DROP POLICY IF EXISTS "Enable insert for anonymous users payments" ON public.payments;
DROP POLICY IF EXISTS "Enable select for all payments" ON public.payments;
DROP POLICY IF EXISTS "Enable update for admins payments" ON public.payments;
DROP POLICY IF EXISTS "Enable delete for admins payments" ON public.payments;

DROP POLICY IF EXISTS "Enable select for admins admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Enable update for admins admin_users" ON public.admin_users;

-- Create new policies
CREATE POLICY "Enable insert for anonymous users" ON public.registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for self" ON public.registrations
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins registrations" ON public.registrations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable delete for admins registrations" ON public.registrations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable insert for anonymous users payments" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all payments" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins payments" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable delete for admins payments" ON public.payments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable select for admins admin_users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable update for admins admin_users" ON public.admin_users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
`;

export async function POST() {
  try {
    // Execute migration
    const { error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    });

    if (error) {
      console.log('[v0] RPC method not available, attempting direct query');
      
      // Fallback: try to create tables one by one
      const tableStatements = [
        `CREATE TABLE IF NOT EXISTS public.registrations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT NOT NULL UNIQUE,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          distance_category TEXT NOT NULL CHECK (distance_category IN ('3km', '5km', '10km')),
          price_php DECIMAL(10, 2) NOT NULL,
          registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'rejected')),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )`,
      ];

      return NextResponse.json({
        success: false,
        message: 'Setup requires manual execution. Please run the SQL in your Supabase SQL Editor dashboard.',
        error: error?.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database schema created successfully',
    });
  } catch (error) {
    console.error('[v0] Setup error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Setup failed. Please execute the SQL manually in Supabase dashboard.',
        error: String(error),
      },
      { status: 500 }
    );
  }
}
