import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Scholarship {
  id: string;
  name: string;
  amount: string;
  foundation: string;
  eligibility: string;
  deadline: string;
  chance: 'High Chance' | 'Medium Chance' | 'Low Chance';
  competition: 'High Competition' | 'Medium Competition' | 'Low Competition';
}

export function ScholarshipFinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fetch scholarships on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);

  // Fetch scholarships from Supabase
  const fetchScholarships = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setScholarships(data || []);
    } catch (error: any) {
      console.error('Error fetching scholarships:', error);
      setError('Failed to load scholarships. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Filter scholarships based on search query and category
  const filteredScholarships = scholarships.filter(scholarship => {
    // Search query filter
    const matchesQuery = searchQuery === '' ||
      scholarship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.foundation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All Categories' ||
      scholarship.eligibility.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesQuery && matchesCategory;
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by filteredScholarships
  };

  // Get chance badge color
  const getChanceBadgeColor = (chance: string) => {
    switch(chance) {
      case 'High Chance':
        return 'bg-green-100 text-green-800';
      case 'Medium Chance':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low Chance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get competition text color
  const getCompetitionColor = (competition: string) => {
    switch(competition) {
      case 'High Competition':
        return 'text-red-600';
      case 'Medium Competition':
        return 'text-orange-600';
      case 'Low Competition':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };
  
  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-2">Find Scholarships</h1>
        <p className="text-xl text-center text-gray-600 mb-8">
          Discover scholarships that match your profile and help fund your international education.
        </p>
        
        {/* Search and Filter Area */}
        <div className="max-w-5xl mx-auto mb-12 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search scholarships or organizations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="block w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>STEM</option>
              <option>Business</option>
              <option>Arts & Humanities</option>
              <option>Social Sciences</option>
              <option>Healthcare</option>
            </select>
            
            <button
              type="submit"
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="p-6">
                  <div className="h-7 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="flex justify-between mt-4">
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex space-x-2">
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                      <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error message
            <div className="col-span-full text-center py-12">
              <div className="text-red-500 mb-2">{error}</div>
              <button 
                onClick={fetchScholarships}
                className="text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredScholarships.length === 0 ? (
            // No results found
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No scholarships found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || selectedCategory !== 'All Categories'
                  ? "Try adjusting your search criteria or category selection."
                  : "Check back later for new scholarship opportunities."}
              </p>
              {(searchQuery || selectedCategory !== 'All Categories') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All Categories');
                  }}
                  className="text-primary hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            // Scholarship cards
            filteredScholarships.map(scholarship => (
              <div 
                key={scholarship.id}
                className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border-blue-400"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900">{scholarship.name}</h3>
                  <p className="text-primary font-medium">{scholarship.foundation}</p>
                  
                  <p className="mt-4 text-gray-600 text-sm">{scholarship.eligibility}</p>
                  
                  <div className="mt-4 flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Deadline: {scholarship.deadline}</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChanceBadgeColor(scholarship.chance)}`}>
                      {scholarship.chance}
                    </span>
                    <span className={`text-sm font-medium ${getCompetitionColor(scholarship.competition)}`}>
                      {scholarship.competition}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">{scholarship.amount}</span>
                    <div className="space-x-2">
                      <button className="bg-white border border-gray-300 hover:bg-gray-50 px-3 py-1 rounded-md text-sm font-medium text-gray-700">
                        Save
                      </button>
                      <button className="bg-primary text-white hover:bg-primary/90 px-3 py-1 rounded-md text-sm font-medium">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Copyright Footer */}
        <div className="mt-16 text-center text-gray-500 text-sm">
          © 2025 Admissions.app. All rights reserved.
        </div>
      </div>
    </div>
  );
} 