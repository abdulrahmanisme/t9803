import React, { useState } from 'react';
import { MainContent } from '../components/MainContent';
import { SEO } from '../components/SEO';

export function HomePage() {
  // Enhanced Schema for the homepage with more structured data
  const homepageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Admissions.app - Study Abroad Consultants in Hyderabad',
    url: 'https://admissions.app',
    description: 'Connect with verified study abroad consultants in Hyderabad. Expert guidance for USA, UK, Canada & Australia university admissions, visas, and scholarships.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://admissions.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    about: {
      '@type': 'Organization',
      name: 'Admissions.app',
      description: 'Premier study abroad consultancy platform in Hyderabad connecting students with verified education consultants',
      areaServed: [
        {
          '@type': 'City',
          name: 'Hyderabad',
          containedIn: 'India'
        }
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'India',
        addressRegion: 'Telangana',
        addressLocality: 'Hyderabad'
      },
      knowsAbout: [
        'Study Abroad Consulting',
        'University Admissions',
        'Student Visa Services',
        'Scholarship Guidance',
        'International Education',
        'USA University Applications',
        'UK University Admissions',
        'Canada Study Permits',
        'Australia Student Visas'
      ],
      serviceArea: [
        'HITEC City',
        'Banjara Hills',
        'Jubilee Hills',
        'Gachibowli',
        'Madhapur',
        'Ameerpet',
        'Kukatpally'
      ],
      offers: {
        '@type': 'Offer',
        itemOffered: [
          {
            '@type': 'Service',
            name: 'Study Abroad Consultation',
            description: 'Expert guidance for international university admissions'
          },
          {
            '@type': 'Service',
            name: 'Visa Assistance',
            description: 'Professional support for student visa applications'
          },
          {
            '@type': 'Service',
            name: 'Scholarship Guidance',
            description: 'Help with international scholarship applications'
          }
        ]
      }
    }
  };

  return (
    <div>
      <SEO
        title="Admissions.app | Your Trusted Study Abroad Platform in Hyderabad"
        description="Welcome to Hyderabad's premier study abroad platform. Expert guidance for USA, UK, Canada & Australia university admissions, visas, scholarships, and admission essays. 250+ verified consultants ready to help."
        keywords={[
          'study abroad platform',
          'overseas education consultants',
          'international education advisors',
          'university admissions help',
          'student visa assistance',
          'scholarship guidance',
          'admission essay editing',
          'engineering courses abroad',
          'MBA programs abroad',
          'medical studies abroad',
          'USA university admissions',
          'UK university applications',
          'Canada study visa',
          'Australia education',
          'Hyderabad education consultants'
        ]}
        schema={homepageSchema}
        ogType="website"
        ogImage="/images/admissions-app-og.jpg"
        twitterCard="summary_large_image"
        canonicalUrl="https://admissions.app"
      />
      <MainContent />
    </div>
  );
}
