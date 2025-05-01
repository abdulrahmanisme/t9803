-- First disable RLS to avoid issues during changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies explicitly
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

-- Create new, extremely simplified policies without any recursive checks
CREATE POLICY "profiles_select_policy"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "profiles_insert_policy"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_policy"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR auth.email() = 'superadmin@superadmin.com')
  WITH CHECK (auth.uid() = id OR auth.email() = 'superadmin@superadmin.com');

CREATE POLICY "profiles_delete_policy"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.email() = 'superadmin@superadmin.com');

-- Create a more secure function for admin management that doesn't rely on policies
CREATE OR REPLACE FUNCTION manage_admin_status(target_user_id uuid, make_admin boolean)
RETURNS boolean AS $$
DECLARE
  caller_email text;
BEGIN
  -- Get caller's email directly from auth.email()
  caller_email := auth.email();
  
  -- Only superadmin can manage admin status
  IF caller_email != 'superadmin@superadmin.com' THEN
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