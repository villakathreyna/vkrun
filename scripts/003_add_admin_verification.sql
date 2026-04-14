-- Add payment fields to registrations table (if not already done)
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS amount_php numeric,
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS payment_proof_url text,
  ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending';

-- Add admin verification tracking fields
ALTER TABLE registrations
  ADD COLUMN IF NOT EXISTS verified_by_admin_id uuid,
  ADD COLUMN IF NOT EXISTS verified_at timestamptz;

-- (Optional) If you want to drop the payments table after migration:
-- DROP TABLE IF EXISTS payments;

-- (Optional) If you want to create a foreign key to an admin_users table:
-- ALTER TABLE registrations
--   ADD CONSTRAINT fk_verified_by_admin FOREIGN KEY (verified_by_admin_id) REFERENCES admin_users(id);
