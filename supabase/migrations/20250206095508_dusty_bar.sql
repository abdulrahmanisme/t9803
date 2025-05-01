-- First disable RLS to avoid issues during changes
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Drop existing policies explicitly
DROP POLICY IF EXISTS "allow_public_select" ON profiles;
DROP POLICY IF EXISTS "allow_users_update" ON profiles;
DROP POLICY IF EXISTS "allow_superadmin_all" ON profiles;
DROP POLICY IF EXISTS "profiles_select" ON profiles;
DROP POLICY IF EXISTS "profiles_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin" ON profiles;
DROP POLICY IF EXISTS "profiles_public_read" ON profiles;
DROP POLICY IF EXISTS "profiles_self_update" ON profiles;
DROP POLICY IF EXISTS "profiles_superadmin_all" ON profiles;

-- Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create new, simplified policies
CREATE POLICY "allow_public_select"
  ON profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "allow_users_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_superadmin_all"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    email = 'superadmin@superadmin.com'
  );

-- Create function to safely update admin status
CREATE OR REPLACE FUNCTION update_admin_status(user_id uuid, make_admin boolean)
RETURNS boolean AS $$
BEGIN
  -- Only allow superadmin to update admin status
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND email = 'superadmin@superadmin.com'
  ) THEN
    RETURN false;
  END IF;

  -- Update the user's admin status
  UPDATE profiles
  SET 
    is_admin = make_admin,
    updated_at = now()
  WHERE id = user_id
  AND email != 'superadmin@superadmin.com';  -- Prevent modifying superadmin

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;