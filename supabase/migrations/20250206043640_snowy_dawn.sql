-- Update the superadmin user's profile
UPDATE profiles 
SET is_super_admin = true 
WHERE email = 'superadmin@example.com';