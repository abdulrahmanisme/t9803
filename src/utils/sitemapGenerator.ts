import { supabase } from '../lib/supabase';

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export async function generateSitemap(): Promise<string> {
  const baseUrl = 'https://admissions.app';
  
  // Static pages
  const staticPages: SitemapEntry[] = [
    { loc: '/', changefreq: 'daily', priority: 1.0 },
    { loc: '/about', changefreq: 'monthly', priority: 0.8 },
    { loc: '/blog', changefreq: 'weekly', priority: 0.8 },
    { loc: '/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  // Fetch dynamic content
  const [agencies, blogPosts] = await Promise.all([
    fetchAgencies(),
    fetchBlogPosts()
  ]);

  // Generate sitemap entries for agencies
  const agencyEntries: SitemapEntry[] = agencies.map(agency => ({
    loc: `/agency/${agency.slug}`,
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: agency.updated_at || agency.created_at
  }));

  // Generate sitemap entries for blog posts
  const blogEntries: SitemapEntry[] = blogPosts.map(post => ({
    loc: `/blog/post/${post.id}`,
    changefreq: 'yearly',
    priority: 0.6,
    lastmod: post.updated_at || post.date
  }));

  // Combine all entries
  const allEntries = [...staticPages, ...agencyEntries, ...blogEntries];

  // Generate XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries.map(entry => `
  <url>
    <loc>${baseUrl}${entry.loc}</loc>
    ${entry.lastmod ? `<lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('')}
</urlset>`;

  return xml;
}

async function fetchAgencies() {
  const { data, error } = await supabase
    .from('agencies')
    .select('slug, created_at, updated_at')
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching agencies for sitemap:', error);
    return [];
  }
  
  return data || [];
}

async function fetchBlogPosts() {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, date, updated_at')
    .eq('status', 'published');
  
  if (error) {
    console.error('Error fetching blog posts for sitemap:', error);
    return [];
  }
  
  return data || [];
} 