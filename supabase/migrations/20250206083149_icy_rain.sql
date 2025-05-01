/*
  # Fix Admin Schema and Policies

  1. Schema Updates
    - Add admin flags to profiles table
    - Create performance indexes
    - Set up test accounts
  
  2. Security
    - Enable RLS
    - Update policies for proper access control
*/

-- Add missing columns and constraints
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_super_admin boolean DEFAULT false;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles (is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_is_super_admin ON profiles (is_super_admin);

-- Create test accounts safely using a DO block
DO $$
DECLARE
  admin_id uuid;
  super_admin_id uuid;
BEGIN
  -- Create admin@admin.com if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@admin.com') THEN
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_confirmed_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      'admin@admin.com',
      '{"provider":"email"}',
      NOW(),
      NOW(),
      '',
      NOW(),
      FALSE,
      NULL
    ) RETURNING id INTO admin_id;
  END IF;

  -- Create superadmin@superadmin.com if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'superadmin@superadmin.com') THEN
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_confirmed_at,
      is_sso_user,
      deleted_at
    ) VALUES (
      'superadmin@superadmin.com',
      '{"provider":"email"}',
      NOW(),
      NOW(),
      '',
      NOW(),
      FALSE,
      NULL
    ) RETURNING id INTO super_admin_id;
  END IF;

  -- Set admin privileges
  UPDATE profiles 
  SET 
    is_admin = true,
    is_super_admin = (email = 'superadmin@superadmin.com'),
    updated_at = NOW()
  WHERE email IN ('admin@admin.com', 'superadmin@superadmin.com');
END $$;

-- Ensure proper RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;

-- Create new policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    id = auth.uid() OR
    (EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND (is_admin = true OR is_super_admin = true)
    ))
  );

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Super admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND is_super_admin = true
    )
  );