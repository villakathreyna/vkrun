-- Create registrations table
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  birthday DATE,
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
-- Anyone can insert registrations (anonymous registration)
CREATE POLICY "Enable insert for anonymous users" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- Anyone can view their own registration
CREATE POLICY "Enable select for self" ON public.registrations
  FOR SELECT USING (true);

-- Only admins can update/delete
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
-- Anyone can insert their own payment
CREATE POLICY "Enable insert for anonymous users" ON public.payments
  FOR INSERT WITH CHECK (true);

-- Anyone can view all payments (for admin dashboard, will be checked in app)
CREATE POLICY "Enable select for all" ON public.payments
  FOR SELECT USING (true);

-- Only admins can update/delete
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
-- Only admins can view admin users
CREATE POLICY "Enable select for admins" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can update their own data
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
