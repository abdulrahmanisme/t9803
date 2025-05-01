-- First disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "allow_read" ON profiles;
DROP POLICY IF EXISTS "allow_update_own" ON profiles;
DROP POLICY IF EXISTS "allow_superadmin" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, simplified non-recursive policies
CREATE POLICY "public_read"
  ON profiles
  FOR SELECT
  USING (true);

CREATE POLICY "self_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "superadmin_all"
  ON profiles
  FOR ALL
  TO authenticated
  USING (email = 'superadmin@superadmin.com');

-- Create a simplified function to manage admin status
CREATE OR REPLACE FUNCTION manage_admin_status(target_user_id uuid, make_admin boolean)
RETURNS boolean AS $$
DECLARE
  v_caller_email text;
BEGIN
  -- Get caller's email directly from session info
  SELECT email INTO v_caller_email
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Only superadmin can manage admin status
  IF v_caller_email != 'superadmin@superadmin.com' THEN
    RETURN false;
  END IF;

  -- Don't allow modifying superadmin
  IF EXISTS (
    SELECT 1 
    FROM auth.users 
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

-- Ensure proper indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_admin ON profiles(is_admin);

-- Reset and set correct admin privileges
UPDATE profiles 
SET 
  is_admin = false,
  is_super_admin = false
WHERE email NOT IN ('superadmin@superadmin.com', 'admin@admin.com');

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