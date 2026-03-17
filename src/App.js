import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import ChatWidget from './ChatWidget'; // Import the ChatWidget component
import { auth } from './firebase';
import WaitlistPage from './WaitlistPage';
import LandingPage from './LandingPage';
import DispensaryLogin from './DispensaryLogin';
import DispensaryDashboard from './DispensaryDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Change this to false when ready to launch!
  const PRE_LAUNCH = true;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0f2e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <h2>⚡ Loading Shocker Deals...</h2>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Home Page - Waitlist or Landing Page */}
        <Route 
          path="/" 
          element={PRE_LAUNCH ? <WaitlistPage /> : <LandingPage />} 
        />

        {/* Full app - accessible by direct link */}
        <Route path="/app" element={<LandingPage />} />

        {/* Login Page */}
        <Route
          path="/login"
          element={
            user
              ? <Navigate to="/dashboard" />
              : <DispensaryLogin onLogin={() => setUser(auth.currentUser)} />
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            user
              ? <DispensaryDashboard />
              : <Navigate to="/login" />
          }
        />
      </Routes>
      <ChatWidget /> {/* Render the ChatWidget component */}
    </Router>
  );
}