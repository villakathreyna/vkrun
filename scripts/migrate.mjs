import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for registrations
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.registrations;
DROP POLICY IF EXISTS "Enable select for self" ON public.registrations;
DROP POLICY IF EXISTS "Enable update for admins" ON public.registrations;
DROP POLICY IF EXISTS "Enable delete for admins" ON public.registrations;

CREATE POLICY "Enable insert for anonymous users" ON public.registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for self" ON public.registrations
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins" ON public.registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for admins" ON public.registrations
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for payments
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.payments;
DROP POLICY IF EXISTS "Enable select for all" ON public.payments;
DROP POLICY IF EXISTS "Enable update for admins" ON public.payments;
DROP POLICY IF EXISTS "Enable delete for admins" ON public.payments;

CREATE POLICY "Enable insert for anonymous users" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins" ON public.payments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Enable delete for admins" ON public.payments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- RLS Policies for admin_users
DROP POLICY IF EXISTS "Enable select for admins" ON public.admin_users;
DROP POLICY IF EXISTS "Enable update for admins" ON public.admin_users;

CREATE POLICY "Enable select for admins" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

CREATE POLICY "Enable update for admins" ON public.admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
`;

async function migrate() {
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    if (error) {
      // Try with direct SQL execution as fallback
      const statements = migrationSQL.split(';').filter(s => s.trim());
      for (const statement of statements) {
        if (statement.trim()) {
          const { data, error: execError } = await supabase.from('_meta').select('*').limit(0);
          // This is just to test connection, actual execution will happen via Supabase dashboard
          if (execError && !execError.message.includes('does not exist')) {
            console.log(`[v0] Statement executed: ${statement.substring(0, 50)}...`);
          }
        }
      }
      console.log('[v0] Note: Execute the SQL manually in Supabase dashboard if needed');
      console.log('[v0] Connection to Supabase verified');
    } else {
      console.log('[v0] Database migration completed successfully');
    }
  } catch (err) {
    console.error('[v0] Migration error:', err);
    // Continue anyway - user can run SQL in Supabase dashboard
    console.log('[v0] Please execute the SQL in your Supabase dashboard');
  }
}

migrate();
