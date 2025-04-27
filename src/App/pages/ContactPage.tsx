import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageSquare, X, Facebook, Twitter, Instagram, Linkedin, ChevronDown, User, Briefcase } from 'lucide-react';
import Cal, { getCalApi } from "@calcom/embed-react";
import { SEO } from '../components/SEO';
import { Helmet } from 'react-helmet-async';

function ContactCard({ icon, title, content, link }: { icon: React.ReactNode; title: string; content: string; link?: string }) {
  const Container = link ? 'a' : 'div';
  return (
    <Container
      href={link}
      target={link ? "_blank" : undefined}
      rel={link ? "noopener noreferrer" : undefined}
      className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1 ${link ? 'cursor-pointer' : ''}`}
    >
      <div className="text-primary mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{content}</p>
    </Container>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 px-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-gray-600 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

export const ContactPage: React.FC = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    if (showBooking) {
      (async function () {
        try {
          const cal = await getCalApi({ "namespace": "30min" });
          cal("ui", {
            hideEventTypeDetails: false,
            layout: "month_view",
            styles: {
              branding: { brandColor: "#1e40af" }, // blue-800
            }
          });
          setCalLoaded(true);
        } catch (error) {
          console.error('Error loading Cal.com:', error);
        }
      })();
    }
  }, [showBooking]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Schema for the contact page
  const contactPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Us | Admissions.app',
    description: 'Get in touch with Admissions.app for any questions about college admissions, consulting services, or platform features.',
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
      '@id': 'https://admissions.app/contact'
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Admissions.app - Get in Touch with Study Abroad Experts</title>
        <meta name="description" content="Connect with Admissions.app for expert study abroad guidance. Book a consultation, get in touch via email, phone, or visit our office. Follow us on social media for study abroad tips." />
        <meta name="keywords" content="study abroad consultation, international education, university admission, study abroad experts, education consultants, admissions guidance" />
        <meta property="og:title" content="Contact Admissions.app - Study Abroad Experts" />
        <meta property="og:description" content="Get expert guidance for your study abroad journey. Connect with our team of experienced education consultants." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://admissions.app/contact" />
        <link rel="canonical" href="https://admissions.app/contact" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <SEO 
          title="Contact Us | Admissions.app"
          description="Get in touch with Admissions.app for any questions about college admissions, consulting services, or platform features."
          canonicalUrl="/contact"
          ogType="website"
          keywords={['contact admissions.app', 'college admissions help', 'education consultant support']}
          schema={contactPageSchema}
        />
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Contact Admissions.app: Your Study Abroad Partner
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Have questions about finding the best college consultants? Reach out to Admissions.app, Hyderabad's trusted platform for overseas education.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-10 mb-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-x-12 translate-y-12"></div>
              <div className="relative text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-1 bg-primary rounded-full"></div>
                </div>
                <p className="text-xl text-gray-700 leading-relaxed mb-8">
                  Whether you're a student seeking a visa consultant or an advisor looking to join our platform, we're here to help.
                </p>
                <button
                  onClick={() => setShowBooking(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  <span>Book a Call</span>
                </button>
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <ContactCard
                icon={<Phone className="h-8 w-8" />}
                title="Phone"
                content="+91 6304 666 504"
                link="tel:+916304666504"
              />
              <ContactCard
                icon={<Mail className="h-8 w-8" />}
                title="Email"
                content="connect@admissions.app"
                link="mailto:connect@admissions.app"
              />
              <ContactCard
                icon={<MapPin className="h-8 w-8" />}
                title="Office"
                content="Admissions.app, Code For India 3rd Floor, Serene Heights, Humayunnagar, Masab Tank, Hyderabad 500028"
                link="https://goo.gl/maps/mdCqMAUEF8pbYgLC7"
              />
            </div>

            {/* Contact Form Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900">Frequently Asked Questions</h2>
              <div className="space-y-2">
                <FAQItem
                  question="How do I find a study abroad consultant on Admissions.app?"
                  answer="You can browse our verified consultants by visiting the homepage and using our search filters to find the perfect match for your needs."
                />
                <FAQItem
                  question="What makes your college consultants trusted?"
                  answer="All our consultants go through a rigorous verification process, including background checks and verification of their credentials and experience."
                />
                <FAQItem
                  question="Can I get help with USA student visas?"
                  answer="Yes, many of our consultants specialize in USA student visas and can guide you through the entire process, from application to interview preparation."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[90vh] rounded-lg overflow-hidden flex flex-col">
            <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4">
              <h3 className="text-lg font-semibold text-gray-900">Schedule a Meeting</h3>
              <button
                onClick={() => {
                  setShowBooking(false);
                  setCalLoaded(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close booking modal"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {calLoaded && (
                <Cal
                  namespace="30min"
                  calLink="forge/30min"
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "auto"
                  }}
                  config={{
                    layout: "week_view"
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
