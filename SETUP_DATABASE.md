# Database Setup Instructions

Please execute the following SQL in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the SQL below
5. Click "Run"

```sql
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

-- Registrations RLS Policies
CREATE POLICY "Enable insert for anonymous users" ON public.registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all" ON public.registrations
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins" ON public.registrations
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable delete for admins" ON public.registrations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

-- Payments RLS Policies
CREATE POLICY "Enable insert for all" ON public.payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable select for all" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Enable update for admins" ON public.payments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable delete for admins" ON public.payments
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

-- Admin Users RLS Policies
CREATE POLICY "Enable select for admins" ON public.admin_users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

CREATE POLICY "Enable update for admins" ON public.admin_users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.id = auth.uid())
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);
```

## After Setup

1. Create an admin user in the Authentication section (you can do this via Supabase Auth)
2. Insert the admin user into the admin_users table:

```sql
INSERT INTO public.admin_users (id, email, name, role)
VALUES ('<USER_UUID_FROM_AUTH>', '<email>', '<name>', 'admin')
ON CONFLICT DO NOTHING;
```

Replace `<USER_UUID_FROM_AUTH>` with the actual UUID from your Supabase Users table.
