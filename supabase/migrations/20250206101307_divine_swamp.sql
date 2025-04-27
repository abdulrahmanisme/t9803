-- First disable RLS to avoid issues during changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "allow_public_select" ON profiles;
DROP POLICY IF EXISTS "allow_users_update" ON profiles;
DROP POLICY IF EXISTS "allow_superadmin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_read_policy_v5" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy_v5" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_policy_v5" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, non-recursive policies
CREATE POLICY "profiles_select"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "profiles_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_superadmin"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = id
      AND email = 'superadmin@superadmin.com'
    )
  );

-- Create a secure function for managing admin status
CREATE OR REPLACE FUNCTION manage_admin_status(target_user_id uuid, make_admin boolean)
RETURNS boolean AS $$
BEGIN
  -- Only allow superadmin to manage admin status
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email = 'superadmin@superadmin.com'
  ) THEN
    RETURN false;
  END IF;

  -- Don't allow modifying superadmin
  IF EXISTS (
    SELECT 1 FROM auth.users 
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