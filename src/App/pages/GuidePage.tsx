import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, Share2, Bookmark, Calendar } from 'lucide-react';
import { getGuideBySlug } from '../../lib/api';
import { Guide } from '../../lib/types';
import { toast } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGuide() {
      if (!slug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const guideData = await getGuideBySlug(slug);
        
        if (!guideData) {
          setError('Guide not found');
          return;
        }
        
        setGuide(guideData);
      } catch (err) {
        console.error('Error loading guide:', err);
        setError('Failed to load guide. Please try again later.');
        toast.error('Failed to load guide. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadGuide();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="text-red-500 text-6xl mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Guide Not Found</h1>
        <p className="text-gray-600 mb-8">
          The guide you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/knowledge-hub"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Knowledge Hub
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/knowledge-hub')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Knowledge Hub
          </button>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Link 
            to={`/knowledge-hub?category=${guide.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            {guide.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{guide.title}</h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8">
          <div className="flex items-center mr-6 mb-2">
            <Clock className="h-4 w-4 mr-1" />
            <span>{guide.read_time} min read</span>
          </div>
          <div className="flex items-center mr-6 mb-2">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(guide.updated_at || guide.created_at)}</span>
          </div>
          {guide.author_name && (
            <div className="flex items-center mb-2">
              {guide.author_image ? (
                <img 
                  src={guide.author_image} 
                  alt={guide.author_name} 
                  className="h-5 w-5 rounded-full mr-2"
                />
              ) : (
                <div className="h-5 w-5 rounded-full bg-gray-200 mr-2"></div>
              )}
              <span>By {guide.author_name}</span>
            </div>
          )}
        </div>

        {/* Featured image */}
        {guide.image_url && (
          <div className="mb-8">
            <img
              src={guide.image_url}
              alt={guide.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none prose-primary mb-12">
          <ReactMarkdown>{guide.content}</ReactMarkdown>
        </div>

        {/* Action buttons */}
        <div className="flex border-t pt-6">
          <button className="mr-4 flex items-center text-gray-500 hover:text-gray-900">
            <Share2 className="h-5 w-5 mr-2" />
            Share
          </button>
          <button className="flex items-center text-gray-500 hover:text-gray-900">
            <Bookmark className="h-5 w-5 mr-2" />
            Save
          </button>
        </div>
      </div>

      {/* Related guides section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">More Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/agencies" className="group block">
              <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary">
                  Find a Consultant
                </h3>
                <p className="text-gray-600">
                  Get personalized guidance from verified education consultants.
                </p>
              </div>
            </Link>
            <Link to="/course-finder" className="group block">
              <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary">
                  Course Finder
                </h3>
                <p className="text-gray-600">
                  Explore programs and universities that match your preferences.
                </p>
              </div>
            </Link>
            <Link to="/application-tracker" className="group block">
              <div className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary">
                  Application Tracker
                </h3>
                <p className="text-gray-600">
                  Keep track of your university applications in one place.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 