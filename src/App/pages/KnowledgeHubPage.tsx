import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Calendar, User, FileText, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getGuides, getBlogPosts, getBlogTabs } from '../../lib/api';
import { Guide } from '../../lib/types';
import { toast } from 'react-hot-toast';

// Add BlogPost interface
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
  } | null;
}

export function KnowledgeHubPage() {
  const [activeTab, setActiveTab] = useState('Articles');
  const [activeArticleTab, setActiveArticleTab] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [blogTabs, setBlogTabs] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Load guides
      const guidesData = await getGuides();
      setGuides(guidesData);
      
      // Load blog posts and tabs
      const [blogPostsData, tabsData] = await Promise.all([
        getBlogPosts(),
        getBlogTabs()
      ]);
      
      setBlogPosts(blogPostsData);
      setBlogTabs(tabsData);
      
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Popular topics derived from guide categories
  const popularTopics = Array.from(new Set(guides.map(guide => guide.category)))
    .filter(Boolean)
    .slice(0, 8);

  // Format date for blog posts
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filter guides based on search query
  const filteredGuides = guides.filter(guide => 
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blog posts based on search query
  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter blog posts by tab
  const tabFilteredBlogPosts = activeArticleTab
    ? filteredBlogPosts.filter(post => post.tab_id === activeArticleTab)
    : filteredBlogPosts;

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Searching for "${searchQuery}"`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Knowledge Hub</h1>
        <p className="text-xl text-gray-600 mt-2">
          Explore guides, tips, and resources to navigate your study abroad journey.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <form onSubmit={handleSearch} className="relative max-w-3xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search articles, guides, and resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
          />
          <button 
            type="submit"
            className="absolute inset-y-0 right-0 px-4 text-white bg-primary rounded-r-md hover:bg-primary/90 focus:outline-none"
          >
            Search
          </button>
        </form>
      </div>

      {/* Blog Tabs Navigation */}
      <div className="flex flex-wrap mb-8 gap-2">
        <button
          className={`px-4 py-2 rounded-full font-medium transition-colors ${
            activeArticleTab === null
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => setActiveArticleTab(null)}
        >
          All Articles
        </button>
        {blogTabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              activeArticleTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveArticleTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {loading ? (
          // Loading state
          Array(6).fill(null).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden animate-pulse">
              <div className="bg-gray-200 h-48"></div>
              <div className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : tabFilteredBlogPosts.length > 0 ? (
          tabFilteredBlogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="bg-gray-200 h-48 flex items-center justify-center">
                {post.image_url ? (
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-50 text-primary rounded-full mb-2">
                  {post.blog_tabs?.name || post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 truncate">{post.excerpt}</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link 
                    to={`/blog/post/${post.id}`} 
                    className="inline-flex items-center text-primary font-medium"
                  >
                    Read Article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          // No articles found state
          <div className="col-span-3 text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">
              {activeArticleTab ? 'No articles found in this category' : 'No articles found'}
            </h3>
            <p className="text-gray-600 mt-1">
              {activeArticleTab 
                ? 'Try selecting a different category or viewing all articles' 
                : 'Try adjusting your search terms or check back later for new content'}
            </p>
            {activeArticleTab && (
              <button 
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
                onClick={() => setActiveArticleTab(null)}
              >
                View All Articles
              </button>
            )}
          </div>
        )}
      </div>

      {/* Personalized Guidance Section */}
      <div className="bg-blue-50 rounded-lg p-8 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Need Personalized Guidance?</h2>
          <p className="mt-4 text-gray-700">
            Connect with our verified education consultants who can provide tailored 
            advice for your study abroad journey.
          </p>
          <div className="mt-6">
            <Link 
              to="/agencies" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none"
            >
              Find a Consultant
            </Link>
          </div>
        </div>
        <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
          <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {/* Popular Topics */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Topics</h2>
        <div className="flex flex-wrap gap-3">
          {popularTopics.length > 0 ? (
            popularTopics.map((topic, index) => (
              <Link 
                key={index} 
                to={`/knowledge-hub?category=${topic.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {topic}
              </Link>
            ))
          ) : (
            // Fallback topics if no guides are available
            ['Study in USA', 'Scholarships', 'SOP Writing', 'Visa Interview', 'IELTS Preparation', 'Financial Planning', 'University Selection', 'Application Timeline'].map((topic, index) => (
              <Link 
                key={index} 
                to={`/knowledge-hub?category=${topic.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                {topic}
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 