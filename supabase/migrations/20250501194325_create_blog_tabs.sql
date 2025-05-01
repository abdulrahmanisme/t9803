-- Create a table for blog tabs
CREATE TABLE IF NOT EXISTS "public"."blog_tabs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "display_order" INTEGER NOT NULL DEFAULT 0,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add RLS policies for blog tabs
ALTER TABLE blog_tabs ENABLE ROW LEVEL SECURITY;

-- Public can view blog tabs
CREATE POLICY "Public can view blog tabs"
ON blog_tabs FOR SELECT
TO public
USING (true);

-- Super admins can manage blog tabs
CREATE POLICY "Super admins can manage blog tabs"
ON blog_tabs FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND is_super_admin = true
  )
);

-- Add a tab_id field to the blog_posts table
ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS tab_id UUID REFERENCES blog_tabs(id) ON DELETE SET NULL;

-- Insert default tabs
INSERT INTO blog_tabs (name, slug, description, display_order) VALUES
('Articles', 'articles', 'General articles about education and college life', 1),
('Guides', 'guides', 'Comprehensive guides for students', 2),
('Resources', 'resources', 'Resources and tools for your academic journey', 3),
('FAQs', 'faqs', 'Frequently asked questions about admissions and education', 4);

-- Update function to update updated_at automatically for blog tabs
CREATE OR REPLACE FUNCTION update_blog_tabs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for automatically updating the updated_at column for blog tabs
CREATE TRIGGER update_blog_tabs_updated_at
BEFORE UPDATE ON blog_tabs
FOR EACH ROW
EXECUTE FUNCTION update_blog_tabs_updated_at(); 