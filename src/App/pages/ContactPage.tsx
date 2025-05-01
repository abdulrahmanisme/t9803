import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Globe, Facebook, Instagram, Twitter, Linkedin, X, MessageSquare } from 'lucide-react';
import { SEO } from '../components/SEO';
import Cal, { getCalApi } from "@calcom/embed-react";

export function ContactPage() {
  const [showBooking, setShowBooking] = useState(false);
  const [calLoaded, setCalLoaded] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    inquiryType: '',
    subject: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEO 
        title="Contact Us | Admissions.app"
        description="Get in touch with our team for any questions about overseas education"
        canonicalUrl="/contact"
      />

      {/* Header section */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Contact Us</h1>
        <p className="text-gray-600 max-w-3xl text-sm sm:text-base">
          Have questions about studying abroad or need assistance with our platform? We're here to help!
          Reach out to our team using the contact form below or through our contact information.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
        {/* Contact Form Section */}
        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">Send Us a Message</div>
            <div className="text-sm text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</div>
          </div>

          <div className="p-4 sm:p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <label htmlFor="inquiryType" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Inquiry Type
                  </label>
                  <select
                    id="inquiryType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({...formData, inquiryType: e.target.value})}
                    required
                  >
                    <option value="">Select inquiry type</option>
                    <option value="general">General Inquiry</option>
                    <option value="consultant">Consultant Related</option>
                    <option value="course">Course Information</option>
                    <option value="scholarship">Scholarship Information</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="Enter subject"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  rows={6}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-white hover:bg-primary/90 h-10 px-4 py-2 w-full"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Book a Call Section in a separate div */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-lg p-8 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 rounded-full opacity-20 -translate-x-12 translate-y-12"></div>
            
            <div className="relative text-center">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Whether you're a student seeking a visa consultant or an advisor looking to join our platform, we're here to help.
              </p>
              <button
                onClick={() => setShowBooking(true)}
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
              >
                <MessageSquare className="h-5 w-5" />
                <span>Book a Call</span>
              </button>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="md:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">Contact Information</div>
              <div className="text-sm text-muted-foreground">Reach out to us directly using the information below.</div>
            </div>

            <div className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Office Address</h3>
                  <a 
                    href="https://g.co/kgs/iCzLMJT"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 text-sm hover:text-blue-600 transition-colors group"
                  >
                    <p className="group-hover:text-blue-600">
                      Admissions.app, Code For India<br />
                      3rd Floor, Serene Heights,<br />
                      Humayunnagar, Masab Tank,<br />
                      Hyderabad 500028
                    </p>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a 
                    href="tel:+916304666504"
                    className="text-gray-600 text-sm hover:text-blue-600 transition-colors group inline-flex items-center gap-1"
                  >
                    <span className="group-hover:text-blue-600">+91 6304 666 504</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a 
                    href="mailto:connect@admissions.app?subject=Inquiry about Admissions.app"
                    className="text-gray-600 text-sm hover:text-blue-600 transition-colors group inline-flex items-center gap-1"
                  >
                    <span className="group-hover:text-blue-600">connect@admissions.app</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Business Hours</h3>
                  <p className="text-gray-600 text-sm">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-gray-600 text-sm">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-gray-600 text-sm">Sunday: Closed</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium">Social Media</h3>
                  <div className="flex gap-4 mt-2">
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-600">
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col space-y-1.5 p-4 sm:p-6">
              <div className="text-xl sm:text-2xl font-semibold leading-none tracking-tight">Frequently Asked Questions</div>
            </div>
            <div className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How do I verify a consultant?</h3>
                <p className="text-gray-600">All consultants on our platform are verified by our team. Look for the "Verified" badge on their profile.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">How can I track my application?</h3>
                <p className="text-gray-600">You can track your applications through our Application Tracker feature after logging in.</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Is the service free for students?</h3>
                <p className="text-gray-600">Yes, basic services are free for students. Premium features may require a subscription.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Find Us</h2>
        <div className="bg-white rounded-xl overflow-hidden h-[300px] sm:h-[400px] shadow-sm border border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3807.3575773447823!2d78.44903799999999!3d17.396272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb97b14f08a901%3A0x9e3b3704c21efe4b!2sSerene%20Heights%2C%20Humayun%20Nagar%2C%20Masab%20Tank%2C%20Hyderabad%2C%20Telangana%20500028!5e0!3m2!1sen!2sin!4v1709655547039!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Admissions.app Office at Serene Heights"
            className="w-full h-full"
          />
        </div>
        <div className="mt-2 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
          <span>Serene Heights, Humayun Nagar, Masab Tank, Hyderabad, Telangana 500028</span>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl h-[80vh] sm:h-[90vh] rounded-xl overflow-hidden flex flex-col shadow-xl">
            <div className="flex-shrink-0 border-b border-gray-100 flex items-center justify-between p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Schedule a Meeting</h3>
              <button
                onClick={() => {
                  setShowBooking(false);
                  setCalLoaded(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close booking modal"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-500" />
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
    </div>
  );
}
