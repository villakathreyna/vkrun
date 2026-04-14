'use client';

import { useState } from 'react';

const SQL_SCRIPT = `-- Create registrations table
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

-- RLS Policies for registrations
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_payments_registration_id ON public.payments(registration_id);
CREATE INDEX IF NOT EXISTS idx_payments_verification_status ON public.payments(verification_status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users(email);`;

export default function SetupDB() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-primary">Database Setup Required</h1>
        
        <div className="bg-card border border-border rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Step 1: Go to Supabase</h2>
          <ol className="list-decimal list-inside space-y-2 mb-6">
            <li>
              Visit{' '}
              <a
                href="https://app.supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline hover:text-secondary"
              >
                app.supabase.com
              </a>
            </li>
            <li>Sign in with your account</li>
            <li>Select your project</li>
            <li>Go to the SQL Editor section</li>
          </ol>

          <h2 className="text-2xl font-bold mb-4">Step 2: Copy and Run the SQL</h2>
          <p className="mb-4 text-muted-foreground">
            Click the button below to copy the SQL script, then paste it in the Supabase SQL Editor and run it.
          </p>

          <button
            onClick={copyToClipboard}
            className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity mb-4 font-semibold"
          >
            {copied ? '✓ Copied to Clipboard!' : 'Copy SQL Script'}
          </button>

          <div className="bg-muted p-4 rounded border border-border overflow-x-auto mb-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">{SQL_SCRIPT}</pre>
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">Step 3: Verify Completion</h2>
          <p className="mb-6">After running the SQL, your database will have these tables:</p>
          <ul className="list-disc list-inside space-y-2 mb-6">
            <li>
              <code className="bg-muted px-2 py-1 rounded">registrations</code> - Stores participant registrations
            </li>
            <li>
              <code className="bg-muted px-2 py-1 rounded">payments</code> - Stores payment proof submissions
            </li>
            <li>
              <code className="bg-muted px-2 py-1 rounded">admin_users</code> - Stores admin account info
            </li>
          </ul>

          <p className="text-sm text-muted-foreground mb-6">
            Once complete, you&apos;ll be able to register participants and manage payments!
          </p>

          <a
            href="/"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
