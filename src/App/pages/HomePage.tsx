import React from 'react';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';
import { Search, Award, FileText, Users, Map, Book } from 'lucide-react';

export function HomePage() {
  const stats = [
    { number: '2,500+', label: 'Universities' },
    { number: '15,000+', label: 'Courses' },
    { number: '1,200+', label: 'Scholarships' },
    { number: '50,000+', label: 'Students Helped' },
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8 text-primary" />,
      title: 'Course Finder',
      description: 'Search through thousands of courses worldwide with intuitive filters.',
      link: '/course-finder',
    },
    {
      icon: <Award className="w-8 h-8 text-orange-500" />,
      title: 'Scholarship Finder',
      description: 'Discover scholarships with eligibility indicators and application guidance.',
      link: '/scholarship-finder',
    },
    {
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      title: 'Application Tracker',
      description: 'Track applications with visual timelines and task management.',
      link: '/application-tracker',
    },
    {
      icon: <Users className="w-8 h-8 text-primary" />,
      title: 'Find a Buddy',
      description: 'Connect with others studying at your dream university.',
      link: '#',
    },
    {
      icon: <Map className="w-8 h-8 text-orange-500" />,
      title: 'Consultancy Directory',
      description: 'Find verified education consultants with trust scores.',
      link: '/agencies',
    },
    {
      icon: <Book className="w-8 h-8 text-emerald-500" />,
      title: 'Knowledge Hub',
      description: 'Access microlearning resources to help with applications.',
      link: '/knowledge-hub',
    },
  ];

  const testimonials = [
    {
      initials: 'SA',
      name: 'Sarah A.',
      university: 'Now at University of Toronto',
      quote: "Admissions.app helped me find the perfect program and track all my applications in one place. I wouldn't have gotten into my dream university without it!",
      bgColor: 'bg-primary',
    },
    {
      initials: 'MK',
      name: 'Michael K.',
      university: 'Now at LSE',
      quote: "The scholarship finder feature saved me thousands of dollars! I found funding opportunities I never would have discovered otherwise.",
      bgColor: 'bg-emerald-500',
    },
    {
      initials: 'JL',
      name: 'Jessica L.',
      university: 'Now at TU Munich',
      quote: "Finding a buddy who was already studying at my university made the transition so much easier. We're still friends to this day!",
      bgColor: 'bg-orange-500',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-blue-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Your Journey to <span className="text-primary">Global Education</span> Starts Here
          </h1>
          <p className="text-gray-600 text-xl mb-8">
            Discover courses, track applications, and connect with students worldwide on one powerful platform.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/agencies"
              className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
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
        </div>

        {/* Stats */}
        <div className="max-w-7xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="text-primary text-4xl font-bold">{stat.number}</div>
              <div className="text-gray-600 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">
            Everything You Need for Your Education Journey
          </h2>
          <p className="text-gray-600 text-center mb-16">
            Admissions.app provides all the tools and resources to make your international education journey smooth and successful.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link || '#'} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Begin Your Global Education Journey?
          </h2>
          <p className="text-white/90 text-xl mb-8">
            Join thousands of students who have successfully found their path with Admissions.app
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What Students Say</h2>
          <p className="text-gray-600 text-center mb-16">
            Hear from students who have successfully navigated their education journey with our platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${testimonial.bgColor} text-white rounded-full flex items-center justify-center font-semibold`}>
                    {testimonial.initials}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.university}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-4">© 2025 Admissions.app. All rights reserved.</p>
          <div className="flex justify-center gap-6 text-gray-600">
            <Link to="/terms" className="hover:text-gray-900">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link to="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
