import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SEO } from '../components/SEO';
import { getBlogPostById } from '../../lib/api';
import { Tag } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image_url: string;
  category: string;
  created_at: string;
  tab_id: string | null;
  blog_tabs: {
    name: string;
    slug: string;
  } | null;
}

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      if (!id) return;
      setLoading(true);
      const postData = await getBlogPostById(id);
      if (postData) {
        setPost(postData);
      } else {
        toast.error('Blog post not found');
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
      toast.error('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-xl text-gray-700">Loading...</div>;
  if (!post) return <div className="text-center py-12 text-xl text-gray-700">Post not found.</div>;

  // Generate schema for the blog post
  const blogPostSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url,
    datePublished: post.date,
    dateModified: post.updated_at || post.date,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Admissions.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://admissions.app/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://admissions.app/blog/post/${post.id}`
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <SEO
        title={`${post.title} | Admissions.app Blog`}
        description={post.excerpt}
        canonicalUrl={`/blog/post/${post.id}`}
        ogType="article"
        ogImage={post.image_url}
        keywords={[post.category, 'college admissions', 'education blog']}
        author={post.author}
        schema={blogPostSchema}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          ← Back to All Posts
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-md">
          {post.image_url && (
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg mb-8 shadow-lg"
            />
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {post.blog_tabs?.name && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                <Tag size={14} className="mr-1" />
                {post.blog_tabs.name}
              </span>
            )}
            {post.category && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {post.category}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">{post.title}</h1>
          
          <div className="flex items-center mb-8 text-gray-600">
            <span className="font-semibold mr-2">{post.author}</span>
            <span className="mx-2">•</span>
            <span>{new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</span>
          </div>
          
          {post.excerpt && <p className="text-xl text-gray-600 italic mb-8 border-l-4 border-primary pl-4">{post.excerpt}</p>}
          
          <div className="prose prose-lg max-w-none text-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
