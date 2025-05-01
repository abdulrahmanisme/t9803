
-- Create the blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date DATE NOT NULL,
  imageUrl TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add RLS policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to read blog posts
CREATE POLICY "Anyone can read blog posts" ON blog_posts
  FOR SELECT USING (true);

-- Only allow super admins to insert, update, delete blog posts
CREATE POLICY "Super admins can insert blog posts" ON blog_posts
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT auth.uid() FROM profiles WHERE is_super_admin = true
    )
  );

CREATE POLICY "Super admins can update blog posts" ON blog_posts
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM profiles WHERE is_super_admin = true
    )
  );

CREATE POLICY "Super admins can delete blog posts" ON blog_posts
  FOR DELETE USING (
    auth.uid() IN (
      SELECT auth.uid() FROM profiles WHERE is_super_admin = true
    )
  );

-- Function to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatically updating the updated_at column
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();

-- Insert sample data
INSERT INTO blog_posts (title, excerpt, content, author, date, imageUrl, category)
VALUES 
  (
    'How to Choose the Right College for Your Future',
    'Deciding which college to attend is one of the most significant decisions you''ll make. Here''s how to navigate the selection process effectively.',
    'When selecting a college, consider these key factors:
    
1. **Academic Programs**: Look for schools with strong programs in your field of interest.
2. **Location**: Consider whether you want to be close to home or experience a new environment.
3. **Size**: Think about whether you prefer a small, intimate campus or a large university with diverse offerings.
4. **Cost and Financial Aid**: Compare tuition, fees, and available scholarships.
5. **Campus Culture**: Visit campuses to get a feel for student life and community.
6. **Career Support**: Research the school''s job placement rates and career services.
7. **Alumni Network**: A strong alumni network can be valuable for your future career.
    
Remember, the "best" college isn''t necessarily the one with the highest ranking, but the one that''s the best fit for your individual needs and goals.',
    'Dr. Sarah Johnson',
    '2025-02-28',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'College Selection'
  ),
  (
    'Financial Aid Opportunities You Might Be Missing',
    'Beyond the standard scholarships and loans, there are many lesser-known financial aid options that could significantly reduce your college costs.',
    'While most students are familiar with federal grants and loans, many overlook these valuable financial aid resources:

1. **Institutional Grants**: Many colleges offer their own grants based on need or merit.
2. **Professional Association Scholarships**: Organizations related to your intended field often offer scholarships.
3. **Employer Tuition Assistance**: Many companies offer education benefits to employees and sometimes their dependents.
4. **State-Specific Programs**: Your state may offer grants or loan forgiveness programs, especially for high-need careers.
5. **Community Foundation Scholarships**: Local foundations often have scholarships with less competition.
6. **Military Benefits**: If you or a parent served in the military, you might be eligible for substantial education benefits.
7. **Income Share Agreements**: Some schools offer ISAs where you pay a percentage of your income after graduation instead of upfront tuition.

Start your search early and don''t be afraid to apply for multiple options. Even smaller scholarships can add up to significant savings.',
    'Michael Rodriguez',
    '2025-02-15',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Financial Aid'
  ),
  (
    'The Growing Importance of Extracurricular Activities in College Applications',
    'Learn why colleges are increasingly looking beyond academic achievements to evaluate prospective students.',
    'Colleges today are looking for well-rounded individuals who will contribute to campus life. Here''s why extracurriculars matter:

1. **Demonstration of Passion**: Deep involvement in activities shows dedication and passion.
2. **Leadership Skills**: Leading clubs or teams demonstrates valuable soft skills.
3. **Time Management**: Balancing academics with other activities shows organizational ability.
4. **Community Engagement**: Volunteer work shows social awareness and responsibility.
5. **Unique Perspective**: Unusual hobbies or activities can help you stand out.

Quality matters more than quantity. Colleges prefer seeing sustained commitment to a few activities rather than superficial involvement in many. Focus on activities that genuinely interest you and where you can make a meaningful contribution or achieve personal growth.',
    'Jennifer Lee',
    '2025-02-05',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Admissions'
  );