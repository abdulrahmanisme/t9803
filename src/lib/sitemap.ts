import { supabase } from './supabase';

/**
 * Generates a dynamic sitemap XML string based on the latest content from the database
 * This would typically be used in a server-side context, such as a Netlify function
 * or a cron job to periodically regenerate the sitemap
 */
export async function generateSitemap(): Promise<string> {
  // Fetch all approved agencies
  const { data: agencies, error: agencyError } = await supabase
    .from('agencies')
    .select('slug, updated_at')
    .eq('status', 'approved');
  
  if (agencyError) {
    console.error('Error fetching agencies:', agencyError);
    throw agencyError;
  }
  
  // Fetch all blog posts
  const { data: blogPosts, error: blogError } = await supabase
    .from('blog_posts')
    .select('id, updated_at');
  
  if (blogError) {
    console.error('Error fetching blog posts:', blogError);
    throw blogError;
  }
  
  // Base URL for the site
  const baseUrl = 'https://admissions.app';
  
  // Start building the sitemap XML content
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  // Add static pages
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: 'about', changefreq: 'monthly', priority: '0.8' },
    { url: 'blog', changefreq: 'weekly', priority: '0.8' },
  ];
  
  for (const page of staticPages) {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/${page.url}</loc>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  }
  
  // Add agency pages
  if (agencies) {
    for (const agency of agencies) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/agency/${agency.slug}</loc>\n`;
      sitemap += '    <changefreq>weekly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      if (agency.updated_at) {
        // Format date as YYYY-MM-DD
        const lastmod = new Date(agency.updated_at).toISOString().split('T')[0];
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      }
      sitemap += '  </url>\n';
    }
  }
  
  // Add blog post pages
  if (blogPosts) {
    for (const post of blogPosts) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/blog/post/${post.id}</loc>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.6</priority>\n';
      if (post.updated_at) {
        // Format date as YYYY-MM-DD
        const lastmod = new Date(post.updated_at).toISOString().split('T')[0];
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      }
      sitemap += '  </url>\n';
    }
  }
  
  // Close the sitemap
  sitemap += '</urlset>';
  
  return sitemap;
}

/**
 * Helper function to format a date to ISO format YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
} 