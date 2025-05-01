import React, { useState, useEffect } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  course_name: string;
  university_name: string;
  location: string;
  tuition_fee: string;
  duration: string;
  degree_type: string;
  description: string;
}

export function CourseFinderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Relevance');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCourses, setTotalCourses] = useState(0);
  
  // Filter states
  const [country, setCountry] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [degreeTypes, setDegreeTypes] = useState<string[]>([]);
  const [tuitionRange, setTuitionRange] = useState(100000);
  const [intakePeriods, setIntakePeriods] = useState<string[]>([]);
  const [isFiltersApplied, setIsFiltersApplied] = useState(false);
  
  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch courses from Supabase
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error, count } = await supabase
        .from('university_courses')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCourses(data || []);
      setTotalCourses(count || 0);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle degree type selection
  const toggleDegreeType = (degreeType: string) => {
    setDegreeTypes(prev => 
      prev.includes(degreeType)
        ? prev.filter(type => type !== degreeType)
        : [...prev, degreeType]
    );
  };

  // Toggle intake period selection
  const toggleIntakePeriod = (period: string) => {
    setIntakePeriods(prev => 
      prev.includes(period)
        ? prev.filter(p => p !== period)
        : [...prev, period]
    );
  };

  // Apply filters
  const applyFilters = () => {
    setIsFiltersApplied(true);
  };

  // Reset filters
  const resetFilters = () => {
    setCountry('');
    setFieldOfStudy('');
    setDegreeTypes([]);
    setTuitionRange(100000);
    setIntakePeriods([]);
    setIsFiltersApplied(false);
  };

  // Filter courses based on search query and filters
  const filteredCourses = courses.filter(course => {
    // Text search (always applied)
    const matchesSearch = 
      searchQuery === '' || 
      course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.university_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Only apply the additional filters if the apply button was clicked
    if (!isFiltersApplied) return true;
    
    // Country filter
    if (country && !course.location.toLowerCase().includes(country.toLowerCase())) {
      return false;
    }
    
    // Field of study filter (basic implementation - would need more structured data for better filtering)
    if (fieldOfStudy && !course.course_name.toLowerCase().includes(fieldOfStudy.toLowerCase())) {
      return false;
    }
    
    // Degree type filter
    if (degreeTypes.length > 0 && !degreeTypes.some(type => 
      course.degree_type.toLowerCase().includes(type.toLowerCase())
    )) {
      return false;
    }
    
    // Tuition fee filter (basic implementation assuming the format has numbers)
    if (tuitionRange < 100000) {
      // Extract numeric part from tuition fee string (this is a simplification)
      const feeMatch = course.tuition_fee.match(/\$?([\d,]+)/);
      if (feeMatch) {
        const fee = parseInt(feeMatch[1].replace(/,/g, ''));
        if (fee > tuitionRange) return false;
      }
    }
    
    // Intake periods (this would require actual data about intake periods)
    // For now, we'll assume all courses match if no intake period is selected
    if (intakePeriods.length > 0) {
      // This is a placeholder. In a real application, you would check if the course's intake periods
      // include any of the selected intake periods
      // return intakePeriods.some(period => course.intakePeriods.includes(period));
    }
    
    return true;
  });

  // Sort filtered courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === 'PriceLowToHigh') {
      // Extract numeric part from tuition fee string (this is a simplification)
      const aFeeMatch = a.tuition_fee.match(/\$?([\d,]+)/);
      const bFeeMatch = b.tuition_fee.match(/\$?([\d,]+)/);
      
      const aFee = aFeeMatch ? parseInt(aFeeMatch[1].replace(/,/g, '')) : 0;
      const bFee = bFeeMatch ? parseInt(bFeeMatch[1].replace(/,/g, '')) : 0;
      
      return aFee - bFee;
    } else if (sortOption === 'PriceHighToLow') {
      // Extract numeric part from tuition fee string (this is a simplification)
      const aFeeMatch = a.tuition_fee.match(/\$?([\d,]+)/);
      const bFeeMatch = b.tuition_fee.match(/\$?([\d,]+)/);
      
      const aFee = aFeeMatch ? parseInt(aFeeMatch[1].replace(/,/g, '')) : 0;
      const bFee = bFeeMatch ? parseInt(bFeeMatch[1].replace(/,/g, '')) : 0;
      
      return bFee - aFee;
    }
    
    // Default sort by relevance (created_at desc, which is handled by the API)
    return 0;
  });

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the filteredCourses variable
  };
  
  return (
    <div className="flex-1 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Finder</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find the perfect international program that matches your academic goals and preferences.
        </p>
        
        {/* Search and Filter Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                {isFiltersApplied && (
                  <button 
                    onClick={resetFilters}
                    className="text-sm text-primary hover:underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
              
              {/* Country Filter */}
              <div className="mb-6">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select 
                  id="country" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select country</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
              
              {/* Field of Study Filter */}
              <div className="mb-6">
                <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                <select 
                  id="field" 
                  className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={fieldOfStudy}
                  onChange={(e) => setFieldOfStudy(e.target.value)}
                >
                  <option value="">Select field</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                </select>
              </div>
              
              {/* Degree Level Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Degree Level</label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      id="bachelor" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={degreeTypes.includes('Bachelor')}
                      onChange={() => toggleDegreeType('Bachelor')}
                    />
                    <label htmlFor="bachelor" className="ml-2 block text-sm text-gray-700">Bachelor's</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="master" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={degreeTypes.includes('Master')}
                      onChange={() => toggleDegreeType('Master')}
                    />
                    <label htmlFor="master" className="ml-2 block text-sm text-gray-700">Master's</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="phd" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={degreeTypes.includes('Doctorate')}
                      onChange={() => toggleDegreeType('Doctorate')}
                    />
                    <label htmlFor="phd" className="ml-2 block text-sm text-gray-700">PhD</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="diploma" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={degreeTypes.includes('Certificate') || degreeTypes.includes('Diploma')}
                      onChange={() => {
                        if (degreeTypes.includes('Certificate') || degreeTypes.includes('Diploma')) {
                          setDegreeTypes(prev => prev.filter(t => t !== 'Certificate' && t !== 'Diploma'));
                        } else {
                          setDegreeTypes(prev => [...prev, 'Certificate', 'Diploma']);
                        }
                      }}
                    />
                    <label htmlFor="diploma" className="ml-2 block text-sm text-gray-700">Diploma/Certificate</label>
                  </div>
                </div>
              </div>
              
              {/* Tuition Range Slider */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuition Fee Range (up to ${(tuitionRange / 1000).toFixed(0)}k/year)
                </label>
                <input 
                  type="range" 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" 
                  min="0" 
                  max="100000" 
                  step="5000"
                  value={tuitionRange}
                  onChange={(e) => setTuitionRange(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$0</span>
                  <span>$50k</span>
                  <span>$100k</span>
                </div>
              </div>
              
              {/* Intake Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Intake</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <input 
                      id="fall" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={intakePeriods.includes('Fall')}
                      onChange={() => toggleIntakePeriod('Fall')}
                    />
                    <label htmlFor="fall" className="ml-2 block text-sm text-gray-700">Fall</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="winter" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={intakePeriods.includes('Winter')}
                      onChange={() => toggleIntakePeriod('Winter')}
                    />
                    <label htmlFor="winter" className="ml-2 block text-sm text-gray-700">Winter</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="spring" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={intakePeriods.includes('Spring')}
                      onChange={() => toggleIntakePeriod('Spring')}
                    />
                    <label htmlFor="spring" className="ml-2 block text-sm text-gray-700">Spring</label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="summer" 
                      type="checkbox" 
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={intakePeriods.includes('Summer')}
                      onChange={() => toggleIntakePeriod('Summer')}
                    />
                    <label htmlFor="summer" className="ml-2 block text-sm text-gray-700">Summer</label>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={applyFilters}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex mb-6">
              <input
                type="text"
                placeholder="Search courses by name, university, or keyword..."
                className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-primary focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-r-lg"
              >
                Search
              </button>
            </form>
            
            {/* Results Info and Sort */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-500">
                {loading 
                  ? 'Loading courses...' 
                  : error 
                    ? 'Error loading courses' 
                    : `Showing ${sortedCourses.length} of ${totalCourses} courses${isFiltersApplied ? ' (filtered)' : ''}`
                }
              </p>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-500 mr-2">Sort by:</label>
                <select
                  id="sort"
                  className="text-sm border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-primary focus:border-primary"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="Relevance">Relevance</option>
                  <option value="PriceLowToHigh">Price: Low to High</option>
                  <option value="PriceHighToLow">Price: High to Low</option>
                  <option value="Rating">Rating</option>
                </select>
              </div>
            </div>
            
            {/* Loading, Error, or Course Cards */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-10 border rounded-md bg-red-50">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={fetchCourses}
                  className="mt-4 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : sortedCourses.length === 0 ? (
              <div className="text-center py-10 border rounded-md bg-slate-50">
                <p className="text-gray-500">
                  {searchQuery || isFiltersApplied
                    ? 'No courses found matching your search criteria. Try adjusting your filters.'
                    : 'No courses available at this time.'}
                </p>
                {isFiltersApplied && (
                  <button 
                    onClick={resetFilters}
                    className="mt-4 text-primary hover:underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedCourses.map(course => (
                  <div key={course.id} className="bg-blue-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4">
                      <div className="md:col-span-1 p-6 flex items-center justify-center">
                        <div className="bg-white rounded-full p-4">
                          <svg className="h-16 w-16 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                            <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="md:col-span-3 p-6">
                        <div className="flex flex-col h-full">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{course.course_name}</h3>
                              <p className="text-primary font-medium">{course.university_name}</p>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">{course.location}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Tuition:</p>
                              <p className="font-medium">{course.tuition_fee}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Duration:</p>
                              <p className="font-medium">{course.duration}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Degree:</p>
                              <p className="font-medium">{course.degree_type}</p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                          
                          <div className="flex justify-between mt-auto">
                            <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg">
                              View Details
                            </button>
                            <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-4 py-2 rounded-lg">
                              Save to Wishlist
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {!loading && !error && sortedCourses.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                  <a href="#" className="inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    &lt;
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-primary bg-primary text-sm font-medium text-white">
                    1
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </a>
                  <a href="#" className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </a>
                  <a href="#" className="inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    &gt;
                  </a>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 