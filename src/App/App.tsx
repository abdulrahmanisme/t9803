import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { HomePage } from './pages/HomePage';
import { ConsultanciesPage } from './pages/ConsultanciesPage';
import { AgencyPage } from './pages/AgencyPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { AuthPage } from './pages/AuthPage';
import { ComparePage } from './pages/ComparePage';
import { ScholarshipsPage } from './pages/ScholarshipsPage';
import { TrackPage } from './pages/TrackPage';
import { ApplicationTrackerPage } from './pages/ApplicationTrackerPage';
import { CourseFinderPage } from './pages/CourseFinderPage';
import { KnowledgeHubPage } from './pages/KnowledgeHubPage';
import { GuidePage } from './pages/GuidePage';

export function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  
  // Create a TrackPageElement that can be reused for both routes
  const TrackPageElement = <TrackPage />;
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          isSuperAdmin={false}
          isAdmin={false}
          showDashboard={showDashboard}
          showProfile={showProfile}
          setShowDashboard={setShowDashboard}
          setShowProfile={setShowProfile}
          setShowAuth={setShowAuth}
        />
        
        {/* Temporary Debug Navigation - Remove after testing */}
        <div className="bg-blue-100 p-4 text-center">
          <p>Direct access to Application Tracker:</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/track" className="text-blue-600 underline">Track Page (/track)</Link>
            <Link to="/application-tracker" className="text-blue-600 underline">Application Tracker (/application-tracker)</Link>
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/agencies" element={<ConsultanciesPage />} />
          <Route path="/agency/:slug" element={<AgencyPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/track" element={TrackPageElement} />
          <Route path="/application-tracker" element={TrackPageElement} />
          <Route path="/course-finder" element={<CourseFinderPage />} />
          <Route path="/knowledge-hub" element={<KnowledgeHubPage />} />
          <Route path="/knowledge-hub/:slug" element={<GuidePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
} 