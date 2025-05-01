import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

      {/* Hero Section */}
  <section className="bg-[#F5F9FF] py-20 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <h1 className="text-5xl font-bold mb-6">
        Your Journey to<br />
        <span className="text-[#2563EB]">Global Education</span> Starts Here
              </h1>
      <p className="text-gray-600 text-xl mb-8">
        Discover courses, track applications, and connect with students worldwide on<br />
        one powerful platform.
      </p>
      <div className="flex justify-center gap-4">
          <Link 
            to="/agencies" 
          className="px-8 py-3 bg-[#2563EB] text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/about"
          className="px-8 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Learn More
          </Link>
      </div>

      <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="text-[#2563EB] text-4xl font-bold">2,500+</div>
          <div className="text-gray-700 mt-2">Universities</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="text-[#2563EB] text-4xl font-bold">15,000+</div>
          <div className="text-gray-700 mt-2">Courses</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="text-[#2563EB] text-4xl font-bold">1,200+</div>
          <div className="text-gray-700 mt-2">Scholarships</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm text-center">
          <div className="text-[#2563EB] text-4xl font-bold">50,000+</div>
          <div className="text-gray-700 mt-2">Students Helped</div>
        </div>
      </div>
    </div>
  </section>

