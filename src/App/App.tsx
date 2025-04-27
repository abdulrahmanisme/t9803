import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

export function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
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
          <Route path="/track" element={<TrackPage />} />
        </Routes>
      </div>
    </Router>
  );
} 