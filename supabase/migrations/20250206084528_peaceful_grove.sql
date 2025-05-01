-- Add missing columns and constraints if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_admin boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'is_super_admin'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_super_admin boolean DEFAULT false;
  END IF;
END $$;

-- Create indexes for performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_is_admin'
  ) THEN
    CREATE INDEX idx_profiles_is_admin ON profiles (is_admin);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_is_super_admin'
  ) THEN
    CREATE INDEX idx_profiles_is_super_admin ON profiles (is_super_admin);
  END IF;
END $$;

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

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_read_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy" ON profiles;
DROP POLICY IF EXISTS "Public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_read_policy_v3" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy_v3" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy_v3" ON profiles;

-- Create new simplified policies with unique names
CREATE POLICY "profiles_public_read_v4"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "profiles_self_update_v4"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_superadmin_all_v4"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.email() = 'superadmin@superadmin.com'
  );