/*
  # Admin Management System Update
  
  1. Changes
    - Add is_admin column to profiles
    - Add admin removal tracking
    - Add functions and policies for admin management
    
  2. Security
    - Only super admins can manage admin status
    - All actions are logged for audit purposes
*/

-- Add is_admin column to profiles if it doesn't exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Add admin removal tracking
CREATE TABLE IF NOT EXISTS admin_removal_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users ON DELETE SET NULL,
  admin_email text NOT NULL,
  removed_by uuid REFERENCES auth.users ON DELETE SET NULL,
  reason text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin removal logs
ALTER TABLE admin_removal_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view removal logs
CREATE POLICY "Super admins can view removal logs"
  ON admin_removal_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  );

-- Function to remove admin status
CREATE OR REPLACE FUNCTION remove_admin_status(admin_user_id uuid, reason text DEFAULT NULL)
RETURNS boolean AS $$
DECLARE
  v_admin_email text;
BEGIN
  -- Check if caller is super admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Only super admins can remove admin status';
  END IF;

  -- Get admin email for logging
  SELECT email INTO v_admin_email
  FROM auth.users
  WHERE id = admin_user_id;

  -- Remove admin status
  UPDATE profiles
  SET 
    is_admin = false,
    updated_at = now()
  WHERE id = admin_user_id;

  -- Log the removal
  INSERT INTO admin_removal_logs (
    admin_id,
    admin_email,
    removed_by,
    reason
  ) VALUES (
    admin_user_id,
    v_admin_email,
    auth.uid(),
    reason
  );

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete admin account
CREATE OR REPLACE FUNCTION delete_admin_account(admin_user_id uuid, reason text DEFAULT NULL)
RETURNS boolean AS $$
DECLARE
  v_admin_email text;
BEGIN
  -- Check if caller is super admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = true
  ) THEN
    RAISE EXCEPTION 'Only super admins can delete admin accounts';
  END IF;

  -- Get admin email for logging
  SELECT email INTO v_admin_email
  FROM auth.users
  WHERE id = admin_user_id;

  -- Log the deletion
  INSERT INTO admin_removal_logs (
    admin_id,
    admin_email,
    removed_by,
    reason
  ) VALUES (
    admin_user_id,
    v_admin_email,
    auth.uid(),
    'Account deleted: ' || COALESCE(reason, 'No reason provided')
  );

  -- Delete the user
  -- This will cascade to profiles due to the foreign key relationship
  DELETE FROM auth.users
  WHERE id = admin_user_id;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies to control function execution
CREATE POLICY "Super admins can manage admin status"
  ON profiles
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

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles (is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON profiles (is_super_admin);
CREATE INDEX IF NOT EXISTS idx_admin_removal_logs_admin_id ON admin_removal_logs (admin_id);