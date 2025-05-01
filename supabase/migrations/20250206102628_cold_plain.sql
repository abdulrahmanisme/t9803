-- First disable RLS to avoid issues during changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies explicitly
DROP POLICY IF EXISTS "allow_read" ON profiles;
DROP POLICY IF EXISTS "allow_update_own" ON profiles;
DROP POLICY IF EXISTS "allow_superadmin" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, simplified policies
CREATE POLICY "allow_read"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "allow_update_own"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_superadmin"
  ON profiles
  FOR ALL
  TO authenticated
  USING (auth.email() = 'superadmin@superadmin.com');

-- Create function to manage admin status
CREATE OR REPLACE FUNCTION manage_admin_status(target_user_id uuid, make_admin boolean)
RETURNS boolean AS $$
BEGIN
  -- Only allow superadmin to manage admin status
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND email = 'superadmin@superadmin.com'
  ) THEN
    RETURN false;
  END IF;

  -- Don't allow modifying superadmin
  IF EXISTS (
    SELECT 1 FROM profiles
    WHERE id = target_user_id
    AND email = 'superadmin@superadmin.com'
  ) THEN
    RETURN false;
  END IF;

  -- Update admin status
  UPDATE profiles
  SET 
    is_admin = make_admin,
    updated_at = now()
  WHERE id = target_user_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_auth_uid ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin);

-- Reset admin flags to ensure clean state
UPDATE profiles 
SET is_admin = false 
WHERE email NOT IN ('superadmin@superadmin.com', 'admin@admin.com');

-- Set correct privileges for admin accounts
UPDATE profiles 
SET 
  is_admin = true,
  is_super_admin = false
WHERE email = 'admin@admin.com';

UPDATE profiles 
SET 
  is_admin = true,
  is_super_admin = true
WHERE email = 'superadmin@superadmin.com';