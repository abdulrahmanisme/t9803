import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrackPage } from './TrackPage';

export function ApplicationTrackerPage() {
  // This component serves as both a redirect and a direct renderer
  // If client-side routing works, it will redirect to /track
  // Otherwise, it directly renders the TrackPage component
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    console.log("ApplicationTrackerPage is rendering at path:", location.pathname);
    
    // If we're not already at /track, redirect there
    if (location.pathname !== '/track') {
      try {
        console.log("Attempting to navigate to /track");
        navigate('/track', { replace: true });
      } catch (error) {
        console.error("Navigation error:", error);
        // If navigation fails, we'll still render the TrackPage component
      }
    }
  }, [navigate, location.pathname]);

  // Always render the TrackPage component directly as well, for fallback
  return <TrackPage />;
} 