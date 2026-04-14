-- Migration: Combine registration and payment tables
-- Add payment fields to registrations table
ALTER TABLE registrations
  ADD COLUMN amount_php numeric,
  ADD COLUMN payment_method text,
  ADD COLUMN payment_proof_url text,
  ADD COLUMN verification_status text DEFAULT 'pending';

-- Optional: migrate data from payments table to registrations (manual step)
-- Optional: drop payments table after migration
-- DROP TABLE payments;
