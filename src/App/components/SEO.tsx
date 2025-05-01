import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: 'website' | 'article' | 'profile' | 'book';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  keywords?: string[];
  author?: string;
  schema?: Record<string, any>;
  children?: React.ReactNode;
  noindex?: boolean;
}

export function SEO({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterSite = '@admissionsapp',
  keywords = [],
  author = 'Admissions.app - Study Abroad Platform',
  schema,
  noindex = false,
  children
}: SEOProps) {
  // Default values for SEO metadata
  const siteUrl = 'https://admissions.app';
  const defaultImageUrl = '/images/og-default.jpg';
  
  // Generate URL with the site domain if not absolute
  const getAbsoluteUrl = (url?: string) => {
    if (!url) return siteUrl;
    return url.startsWith('http') ? url : `${siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  
  const fullCanonicalUrl = getAbsoluteUrl(canonicalUrl);
  const fullOgUrl = getAbsoluteUrl(ogUrl || canonicalUrl);
  const fullOgImage = getAbsoluteUrl(ogImage || defaultImageUrl);

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* No index directive */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="Admissions.app - Study Abroad Platform" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Apple Mobile Web App Capable */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={title} />
      
      {/* Mobile Viewport */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {/* Additional elements passed as children */}
      {children}
    </Helmet>
  );
} 