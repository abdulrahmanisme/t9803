import React from 'react';
import { Globe, Search, FileText, MessageSquare, School, ArrowRight, ChevronDown } from 'lucide-react';
import { AgencyListings } from './AgencyListings';
import { Link, useNavigate } from 'react-router-dom';
import { useChatbot } from '../../components/Chatbot/ChatbotContext';

export function MainContent() {
  const [showAllAgencies, setShowAllAgencies] = React.useState(false);
  const navigate = useNavigate();
  const { setIsOpen } = useChatbot();
  const [searchFilters, setSearchFilters] = React.useState({
    location: '',
    course: '',
    budget: ''
  });

  const handleSearch = () => {
    // Navigate to consultancies page with search parameters
    navigate('/agencies', { 
      state: { 
        searchQuery: '',
        filters: {
          location: searchFilters.location,
          minRating: 0,
          maxPrice: searchFilters.budget,
          specializations: searchFilters.course ? [searchFilters.course] : [],
          verifiedOnly: false
        }
      }
    });
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <div className="bg-primary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-28 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium mb-6 text-white">
                #1 Platform for International Education
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                Your Journey to{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
                  Study Abroad
                </span>{' '}
                Starts Here
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Explore, compare and apply to international universities with personalized AI assistance at every step of your education journey.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-white text-primary hover:bg-gray-100 px-6 py-3.5 rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl">
                  <span className="flex items-center">
                    <School className="w-5 h-5 mr-2" />
                    Explore Universities
                  </span>
                </button>
                <button className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm hover:from-white/30 hover:to-white/20 border border-white/40 px-6 py-3.5 rounded-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl text-white">
                  <span className="flex items-center">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Get Started
                  </span>
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-white/20 rounded-2xl blur-sm"></div>
                <img 
                  src="/images/graduation.jpg" 
                  alt="Students studying abroad" 
                  className="rounded-xl shadow-xl max-w-full h-auto relative border-2 border-white/30"
                  width="500"
                  height="350"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-bold text-primary">100+ Countries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Find Your Perfect Consultancy Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Consultancy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select 
                id="location" 
                className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
              >
                <option value="">All Locations</option>
                <option value="1">Malakpet</option>
                <option value="2">Masab Tank</option>
                <option value="3">Tolichowki</option>
                <option value="4">Charminar</option>
                <option value="5">Madanapet</option>
              </select>
            </div>
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select 
                id="course" 
                className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={searchFilters.course}
                onChange={(e) => setSearchFilters({...searchFilters, course: e.target.value})}
              >
                <option value="">All Courses</option>
                <option value="cs">Computer Science</option>
                <option value="business">Business</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine</option>
                <option value="arts">Arts & Humanities</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (USD/Year)</label>
              <select 
                id="budget" 
                className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={searchFilters.budget}
                onChange={(e) => setSearchFilters({...searchFilters, budget: e.target.value})}
              >
                <option value="">Any Budget</option>
                <option value="10000">Under $10,000</option>
                <option value="20000">Under $20,000</option>
                <option value="30000">Under $30,000</option>
                <option value="50000">Under $50,000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-none"
                onClick={handleSearch}
              >
                Search Consultancies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Consultancies Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Consultancies</h2>
          <Link 
            to="/agencies" 
            className="text-primary hover:text-primary/90 font-medium flex items-center"
          >
            View all
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </Link>
        </div>
        <AgencyListings searchQuery="" filters={{}} itemsPerPage={3} />
      </div>

      {/* Find Your Perfect University Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-6 lg:-mt-12 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect University</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select id="country" className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                <option value="">All Countries</option>
                <option value="1">United States</option>
                <option value="2">United Kingdom</option>
                <option value="3">Canada</option>
                <option value="4">Australia</option>
                <option value="5">Germany</option>
              </select>
            </div>
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select id="course" className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                <option value="">All Courses</option>
                <option value="cs">Computer Science</option>
                <option value="business">Business</option>
                <option value="engineering">Engineering</option>
                <option value="medicine">Medicine</option>
                <option value="arts">Arts & Humanities</option>
              </select>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget (USD/Year)</label>
              <select id="budget" className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                <option value="">Any Budget</option>
                <option value="10000">Under $10,000</option>
                <option value="20000">Under $20,000</option>
                <option value="30000">Under $30,000</option>
                <option value="50000">Under $50,000</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 border border-transparent rounded-md shadow-sm focus:outline-none">
                Search Universities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Universities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Universities</h2>
          <a href="#" className="text-primary hover:text-primary/90 font-medium flex items-center">
            View all
            <span className="material-icons text-sm ml-1">arrow_forward</span>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* University of Oxford */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="University of Oxford" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
                <span className="material-icons text-yellow-500">grade</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">University of Oxford</h3>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">UK</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="material-icons text-gray-400 text-sm mr-1">location_on</span>
                Oxford
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Starting from</span>
                  <span className="font-semibold">$30,000/year</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Acceptance rate</span>
                  <span className="font-semibold">17.5%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">MBA</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Computer Science</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Engineering</span>
              </div>
              <div className="flex justify-between">
                <button className="text-primary hover:text-primary/90 text-sm font-medium">View Details</button>
                <button className="text-secondary hover:text-secondary/90 text-sm font-medium">Compare</button>
              </div>
            </div>
          </div>

          {/* Stanford University */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1565034946487-077786996e27?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="Stanford University" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
                <span className="material-icons text-yellow-500">grade</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">Stanford University</h3>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">USA</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="material-icons text-gray-400 text-sm mr-1">location_on</span>
                Stanford, California
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Starting from</span>
                  <span className="font-semibold">$53,000/year</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Acceptance rate</span>
                  <span className="font-semibold">4.3%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Computer Science</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Business</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">AI</span>
              </div>
              <div className="flex justify-between">
                <button className="text-primary hover:text-primary/90 text-sm font-medium">View Details</button>
                <button className="text-secondary hover:text-secondary/90 text-sm font-medium">Compare</button>
              </div>
            </div>
          </div>

          {/* University of Toronto */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-40 bg-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1584720175631-b75d36d12c9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                alt="University of Toronto" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-1 shadow">
                <span className="material-icons text-yellow-500">grade</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800">University of Toronto</h3>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Canada</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <span className="material-icons text-gray-400 text-sm mr-1">location_on</span>
                Toronto, Ontario
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Starting from</span>
                  <span className="font-semibold">$30,000/year</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Acceptance rate</span>
                  <span className="font-semibold">40%</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Medicine</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Engineering</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Arts</span>
              </div>
              <div className="flex justify-between">
                <button className="text-primary hover:text-primary/90 text-sm font-medium">View Details</button>
                <button className="text-secondary hover:text-secondary/90 text-sm font-medium">Compare</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Courses Abroad Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Popular Courses Abroad</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover trending courses for international students based on career prospects, admissions, and student reviews.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">computer</span>
              </div>
              <h3 className="font-medium">Computer Science</h3>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">business</span>
              </div>
              <h3 className="font-medium">Business Management</h3>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">engineering</span>
              </div>
              <h3 className="font-medium">Engineering</h3>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">local_hospital</span>
              </div>
              <h3 className="font-medium">Medicine</h3>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">analytics</span>
              </div>
              <h3 className="font-medium">Data Science</h3>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                <span className="material-icons text-primary text-xl">color_lens</span>
              </div>
              <h3 className="font-medium">Arts & Design</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#F0F5FF] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">How Admissions.app Helps You</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide everything you need for your international education journey - from research to application to visa.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary mb-4">
                <span className="material-icons text-3xl">search</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Find Universities</h3>
              <p className="text-gray-600">
                Search and filter universities based on your preferences, budget, and course requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary mb-4">
                <span className="material-icons text-3xl">compare</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Compare Options</h3>
              <p className="text-gray-600">
                Side-by-side comparison of universities, courses, fees, and visa requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary mb-4">
                <span className="material-icons text-3xl">description</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Document Help</h3>
              <p className="text-gray-600">
                Get AI assistance with SOP writing, LORs, and visa documentation requirements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="text-primary mb-4">
                <span className="material-icons text-3xl">chat</span>
              </div>
              <h3 className="text-lg font-bold mb-2">24/7 AI Support</h3>
              <p className="text-gray-600">
                Our AI chatbot answers all your questions about studying abroad, visa processes, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations Section */}
      <div className="bg-gradient-to-r from-gray-50 to-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Popular Destinations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore top countries for international education based on quality, affordability, and opportunities.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1543599538-a6c4f6cc5c05?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Study in United States" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">United States</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Home to world-renowned universities with cutting-edge research facilities.
                </p>
                <a href="#" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  Explore Universities
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Study in United Kingdom" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">United Kingdom</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Traditional excellence with flexible programs and postgraduate work options.
                </p>
                <a href="#" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  Explore Universities
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1566761236451-70eeac3c43f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Study in Canada" 
                      className="w-full h-full object-cover"
                    />
                  </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Canada</h3>
                <p className="text-gray-600 text-sm mb-3">
                  High-quality education with affordable tuition and pathway to PR.
                </p>
                <a href="#" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  Explore Universities
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                </a>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                  alt="Study in Australia" 
                  className="w-full h-full object-cover"
                />
                  </div>
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2">Australia</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Innovative education with great lifestyle and post-study work options.
                </p>
                <a href="#" className="text-primary hover:text-primary/90 text-sm font-medium flex items-center">
                  Explore Universities
                  <span className="material-icons text-sm ml-1">arrow_forward</span>
                    </a>
                  </div>
                </div>
          </div>
        </div>
      </div>

      {/* Student Success Stories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Student Success Stories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from Indian students who achieved their dream of studying abroad with our help.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="Priya Sharma" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold">Priya Sharma</h4>
                <p className="text-sm text-gray-600">Stanford University, USA</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "Admissions.app made the complex process of applying to Stanford so much easier. Their AI chatbot answered all my visa-related questions!"
            </p>
            <div className="flex text-yellow-400">
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="Rahul Patel" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold">Rahul Patel</h4>
                <p className="text-sm text-gray-600">University of Toronto, Canada</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "The scholarship finder helped me secure a 50% tuition waiver! I could never have found this opportunity without Admissions.app."
            </p>
            <div className="flex text-yellow-400">
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star_half</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 rounded-full bg-gray-200 mr-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" 
                  alt="Ananya Gupta" 
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-bold">Ananya Gupta</h4>
                <p className="text-sm text-gray-600">University of Melbourne, Australia</p>
              </div>
            </div>
            <p className="text-gray-700 italic mb-4">
              "The application tracker made it so easy to manage multiple university applications. I'm now pursuing my dream degree in Australia!"
            </p>
            <div className="flex text-yellow-400">
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
              <span className="material-icons">star</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">Ready to start your overseas education journey?</h2>
              <p className="text-primary-100 text-lg">Create a free account and get personalized university recommendations.</p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                <button className="bg-white text-primary hover:bg-gray-100 rounded-lg shadow-lg px-5 py-3 text-base font-medium">
                  Sign Up Free
                </button>
                <button className="mt-3 sm:mt-0 bg-transparent border border-white text-white hover:bg-white hover:bg-opacity-10 rounded-lg px-5 py-3 text-base font-medium">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-3 text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about overseas education
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <button className="flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-200 bg-primary text-white shadow-lg">
              <span className="material-icons text-sm md:text-base mr-2">info</span>
              General
            </button>
            <button className="flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100">
              <span className="material-icons text-sm md:text-base mr-2">travel_explore</span>
              Visa
            </button>
            <button className="flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100">
              <span className="material-icons text-sm md:text-base mr-2">school</span>
              Scholarships
            </button>
            <button className="flex items-center px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-all duration-200 bg-white text-gray-700 hover:bg-gray-100">
              <span className="material-icons text-sm md:text-base mr-2">description</span>
              Application
            </button>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="w-full">
              <div className="border-b">
                <h3 className="flex">
                  <button className="flex flex-1 items-center justify-between transition-all hover:underline px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50">
                    What services does Admissions.app provide?
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </button>
                </h3>
              </div>
              <div className="border-b">
                <h3 className="flex">
                  <button className="flex flex-1 items-center justify-between transition-all hover:underline px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50">
                    Is Admissions.app free to use?
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </button>
                </h3>
              </div>
              <div className="border-b">
                <h3 className="flex">
                  <button className="flex flex-1 items-center justify-between transition-all hover:underline px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50">
                    How accurate is the information on universities and courses?
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                  </button>
                </h3>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-gray-700 mb-4">Didn't find what you're looking for?</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 hover:from-primary hover:to-primary text-white px-6 py-3 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
              >
                <span className="material-icons mr-2">smart_toy</span>
                Ask Our AI Assistant
              </button>
              <button className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-6 py-3 rounded-lg font-medium transition-all shadow-sm hover:shadow">
                <span className="material-icons mr-2">mail</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}