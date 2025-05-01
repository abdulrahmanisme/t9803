import React from 'react';
import { Search, Star, Globe2, Lightbulb, Users2, HandshakeIcon } from 'lucide-react';
import { SEO } from '../components/SEO';

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TeamMemberProps {
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
}

interface ImpactStatProps {
  value: string;
  label: string;
}

function ValueCard({ icon, title, description }: ValueCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TeamMember({ name, role, description, imageUrl }: TeamMemberProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full"></div>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-primary mb-2">{role}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function ImpactStat({ value, label }: ImpactStatProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <div className="text-primary text-4xl font-bold mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="About Us | Admissions.app"
        description="Learn about Admissions.app and our mission to connect students with the best education consultants worldwide."
        canonicalUrl="/about"
      />

      {/* About Section */}
      <h1 className="text-4xl font-bold mb-6">About Admissions.app</h1>
      <p className="text-gray-600 mb-12">
        Admissions.app is a comprehensive platform designed to simplify the overseas education journey for students worldwide. Our mission is to connect ambitious students with top-rated education consultants and provide the tools and resources needed for a successful international education experience.
      </p>

      {/* Our Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-gray-600 mb-6">
            At Admissions.app, we believe that quality education should be accessible to everyone, regardless of geographical boundaries. Our platform is built to demystify the overseas education process and empower students to make informed decisions about their academic future.
          </p>
          <p className="text-gray-600 mb-6">
            We strive to create a transparent ecosystem where students can find reliable information, connect with verified consultants, and access resources that make their study abroad journey smoother and more successful.
          </p>
          <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
            Find a Consultant
          </button>
        </div>
        <div className="bg-gray-100 rounded-lg min-h-[400px] flex items-center justify-center">
          <div className="text-gray-400">
            <span className="sr-only">Mission Image Placeholder</span>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="mb-16 bg-blue-50 rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-gray-600 mb-4">
          Admissions.app was founded in 2023 by a team of education enthusiasts who experienced firsthand the challenges of navigating the overseas education process. After facing numerous hurdles with unreliable information, questionable consultants, and a lack of structured guidance, they decided to create a solution that addresses these pain points.
        </p>
        <p className="text-gray-600 mb-4">
          Starting from Hyderabad, India, we've grown to connect students with over 250+ verified international education advisors specializing in USA university admissions, UK university applications, Canada study visas, and Australian education pathways.
        </p>
        <p className="text-gray-600">
          Today, Admissions.app serves thousands of students across India, helping them achieve their dreams of studying at prestigious institutions worldwide. Our platform continues to evolve with new features and resources based on student feedback and changing industry needs.
        </p>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ValueCard
            icon={<Search className="w-8 h-8 text-primary" />}
            title="Transparency"
            description="We believe in complete transparency in the education consulting industry. Our Trust Score system ensures students can make informed decisions."
          />
          <ValueCard
            icon={<Star className="w-8 h-8 text-yellow-400" />}
            title="Quality"
            description="We maintain high standards for consultants on our platform, verifying credentials and monitoring performance to ensure quality service."
          />
          <ValueCard
            icon={<Globe2 className="w-8 h-8 text-green-500" />}
            title="Accessibility"
            description="We're committed to making international education accessible to all students, regardless of their background or location."
          />
          <ValueCard
            icon={<Lightbulb className="w-8 h-8 text-yellow-400" />}
            title="Innovation"
            description="We continuously innovate to provide cutting-edge tools and resources that simplify the study abroad journey."
          />
          <ValueCard
            icon={<Users2 className="w-8 h-8 text-purple-500" />}
            title="Community"
            description="We foster a supportive community where students can connect, share experiences, and help each other navigate their education journey."
          />
          <ValueCard
            icon={<HandshakeIcon className="w-8 h-8 text-orange-400" />}
            title="Integrity"
            description="We operate with the highest level of integrity, ensuring that student interests always come first."
          />
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <TeamMember
            name="Rahul Sharma"
            role="Founder & CEO"
            description="Former international student with 10+ years in education consulting."
          />
          <TeamMember
            name="Priya Patel"
            role="Chief Operations Officer"
            description="Education management expert with experience at top universities."
          />
          <TeamMember
            name="Aditya Singh"
            role="Head of Consultant Relations"
            description="Built networks of education consultants across 15+ countries."
          />
          <TeamMember
            name="Neha Gupta"
            role="Chief Technology Officer"
            description="Tech leader passionate about improving education through innovation."
          />
        </div>
      </section>

      {/* Join Community Section */}
      <section className="bg-primary text-white rounded-lg p-8 mb-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Admissions.app Community</h2>
        <p className="mb-6">
          Whether you're a student dreaming of studying abroad or an education consultant looking to expand your reach, Admissions.app has something for you. Join our growing community today!
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-primary px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Sign Up as a Student
          </button>
          <button className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white/10 transition-colors">
            Join as a Consultant
          </button>
        </div>
      </section>

      {/* Our Impact */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ImpactStat value="10,000+" label="Students Helped" />
          <ImpactStat value="250+" label="Verified Consultants" />
          <ImpactStat value="50+" label="Countries Covered" />
          <ImpactStat value="95%" label="Student Satisfaction" />
        </div>
      </section>
    </div>
  );
} 