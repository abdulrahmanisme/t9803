import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SEO } from '../components/SEO';

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setPost(data);
      } catch {
        toast.error('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

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
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg my-6">
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
      <div className="bg-gray-50 p-8 rounded-xl shadow-md border border-gray-200">
        {post.image_url && (
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-72 object-cover rounded-lg mb-8 shadow-lg"
          />
        )}
        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-6">{post.title}</h1>
        <p className="text-lg text-gray-600 mb-6">
          By <span className="font-semibold">{post.author}</span> on{' '}
          <span className="font-medium">{new Date(post.date).toLocaleDateString()}</span>
        </p>
        {post.excerpt && <p className="text-gray-600 italic mb-8">{post.excerpt}</p>}
        <div className="prose prose-lg prose-indigo text-gray-800 space-y-6">
          <ReactMarkdown children={post.content} remarkPlugins={[remarkGfm]} />
        </div>
      </div>
    </div>
  );
}
