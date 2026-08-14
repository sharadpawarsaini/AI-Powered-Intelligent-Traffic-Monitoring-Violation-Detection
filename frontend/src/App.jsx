import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';

import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { Cameras } from './pages/Cameras';
import { Events } from './pages/Events';
import { Violations } from './pages/Violations';
import { Accidents } from './pages/Accidents';
import { Analytics } from './pages/Analytics';
import { AIAssistant } from './pages/AIAssistant';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const ProtectedRoute = ({ children, title }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-xs">Authenticating...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={title} />
        <main className="flex-1 overflow-y-auto ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & About Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Management App Pages */}
          <Route path="/dashboard" element={<ProtectedRoute title="Executive Dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="/live-monitoring" element={<ProtectedRoute title="Live CCTV Surveillance Feed"><LiveMonitoring /></ProtectedRoute>} />
          <Route path="/cameras" element={<ProtectedRoute title="Camera Network Directory"><Cameras /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute title="Traffic Events Database"><Events /></ProtectedRoute>} />
          <Route path="/violations" element={<ProtectedRoute title="Traffic Violations Directory"><Violations /></ProtectedRoute>} />
          <Route path="/accidents" element={<ProtectedRoute title="Potential Accident Incidents"><Accidents /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute title="Deep Traffic Analytics"><Analytics /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute title="GenAI Traffic Assistant"><AIAssistant /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute title="Daily Reports & Export"><Reports /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute title="Model Inference Settings"><Settings /></ProtectedRoute>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
