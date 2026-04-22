/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { Dashboard } from './pages/Dashboard';
import { CGPAModule } from './pages/CGPAModule';
import { ProjectModule } from './pages/ProjectModule';
import { ProfilePage } from './pages/ProfilePage';
import { useNexoraStore } from './store/nexoraStore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './services/firebase';
import { doc, getDoc } from 'firebase/firestore';

// Simple PrivateRoute wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const profile = useNexoraStore((state) => state.profile);
  return profile ? <>{children}</> : <Navigate to="/onboarding" />;
};

export default function App() {
  const { profile, setUser, setProfile, setProject, setCurrentSemesterSubjects } = useNexoraStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser({ uid: user.uid, email: user.email, displayName: user.displayName });
        
        // Load data from Firestore if it exists
        try {
          const profileDoc = await getDoc(doc(db, 'users', user.uid, 'profile', 'data'));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as any);
          }
          // Note: In a real app, I'd load subjects and projects here too.
          // For now, I'll rely on local persistence for those to keep it snappy.
        } catch (error) {
          console.error("Error loading profile:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={profile ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/cgpa" element={
          <PrivateRoute>
            <CGPAModule />
          </PrivateRoute>
        } />
        
        <Route path="/project" element={
          <PrivateRoute>
            <ProjectModule />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />

        {/* Scope Radar is integrated into ProjectModule, but adding a shortcut route */}
        <Route path="/scope-radar" element={
          <PrivateRoute>
            <ProjectModule />
          </PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
