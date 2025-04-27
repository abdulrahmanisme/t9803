/*
  # Add Super Admin System

  1. Changes
    - Add `is_super_admin` column to profiles table
    - Add `status` and `trust_score` columns to agencies table
    - Add policies for super admin access

  2. Security
    - Only super admins can modify trust scores and approve agencies
    - Super admins have full access to all agencies
*/

-- Add super admin flag to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_super_admin boolean DEFAULT false;

-- Add status and trust score to agencies
ALTER TABLE agencies 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS trust_score numeric DEFAULT 0 CHECK (trust_score >= 0 AND trust_score <= 100);

-- Super admin policies
CREATE POLICY "Super admins can view all agencies"
  ON agencies
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  );

CREATE POLICY "Super admins can update all agencies"
  ON agencies
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  );