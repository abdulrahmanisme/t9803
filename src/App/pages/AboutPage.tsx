import React from 'react';
import { Users, BookOpen, Target, Award, Globe, Heart, Shield, Rocket } from 'lucide-react';
import { SEO } from '../components/SEO';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

export function AboutPage() {
  // Schema for the about page
  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Admissions.app',
    description: 'Learn about Admissions.app and our mission to connect students with the best college admissions consultants.',
    publisher: {
      '@type': 'Organization',
      name: 'Admissions.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://admissions.app/logo.png'
      }
    },
    mainEntity: {
      '@type': 'WebPage',
      '@id': 'https://admissions.app/about'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO 
        title="About Us | Admissions.app"
        description="Learn about Admissions.app and our mission to connect students with the best college admissions consultants for their unique needs and goals."
        canonicalUrl="/about"
        ogType="website"
        keywords={['about admissions.app', 'college admissions platform', 'education consultant directory']}
        schema={aboutPageSchema}
      />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Empowering Your Study Abroad Journey
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your trusted partner in the college admissions journey, connecting ambitious students with expert consultants.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Section */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform -mt-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 translate-y-12"></div>
            <div className="relative">
              <h2 className="text-3xl font-bold mb-6 text-center text-primary">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                We believe that every student deserves access to quality college consulting. Our mission is to democratize the college admissions process by making expert guidance accessible to students from all backgrounds. Through our platform, we're breaking down barriers and empowering students to reach their full potential.
              </p>
            </div>
          </div>

          {/* About Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <p className="text-lg text-gray-700 leading-relaxed">
              At Admissions.app, we believe every student deserves expert guidance to achieve their academic dreams. Based in Hyderabad, India, our platform connects students with verified college consultants worldwide, specializing in overseas education, student visas, and university admissions. From engineering to MBA programs, our advisors help you navigate applications, secure scholarships, and prepare for top universities in the USA, UK, Canada, Australia, and beyond.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Expert Consultants"
            description="Access to a network of verified college consultants with proven track records of success."
          />
          <FeatureCard
            icon={<BookOpen className="h-8 w-8" />}
            title="Application Guidance"
            description="Personalized support for crafting compelling essays and building strong applications."
          />
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="Strategic Planning"
            description="Expert advice on college selection and application strategy tailored to your goals."
          />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Successful Applications</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">50+</div>
            <div className="text-gray-600">Expert Consultants</div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 translate-y-12"></div>
            
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-1 bg-primary rounded-full"></div>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
                Founded to simplify the complex world of college admissions, Admissions.app combines technology and expertise to make your journey stress-free. Whether you're a high school student in Hyderabad or an international applicant, our platform empowers you to find the best college consultants for your needs. Join thousands of students who've trusted us to turn their study abroad dreams into reality. Explore our platform today!
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Excellence</h3>
              <p className="text-gray-600 leading-relaxed">
                We maintain the highest standards of quality in our consulting services and platform features.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Accessibility</h3>
              <p className="text-gray-600 leading-relaxed">
                Making quality college consulting available to students regardless of their background.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Transparency</h3>
              <p className="text-gray-600 leading-relaxed">
                Providing clear, honest information and maintaining an open review system.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-semibold mb-4 text-primary">Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                Continuously improving our platform to better serve students and consultants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 