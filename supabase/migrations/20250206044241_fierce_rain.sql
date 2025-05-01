-- First, remove the superadmin flag from all users
UPDATE profiles 
SET is_super_admin = false;

-- Delete all users except admin@admin.com and superadmin@superadmin.com
DELETE FROM auth.users 
WHERE email NOT IN ('admin@admin.com', 'superadmin@superadmin.com');

-- Set superadmin access for superadmin@superadmin.com
UPDATE profiles 
SET is_super_admin = true 
WHERE email = 'superadmin@superadmin.com';

-- Make sure both users are approved
UPDATE profiles 
SET updated_at = NOW()
WHERE email IN ('admin@admin.com', 'superadmin@superadmin.com');