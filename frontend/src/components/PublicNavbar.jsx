import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Activity, ShieldCheck, ArrowRight, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const PublicNavbar = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-wide leading-tight">TRAFFIC AI</h1>
            <p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Intelligent Surveillance System</p>
          </div>
        </Link>

        {/* Center Nav Items */}
        <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold text-slate-300">
          <NavLink to="/" className={({ isActive }) => isActive ? "text-cyan-400 font-bold" : "hover:text-cyan-400 transition"}>
            HOME
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-cyan-400 font-bold" : "hover:text-cyan-400 transition"}>
            ABOUT PROJECT
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-cyan-400 font-bold" : "hover:text-cyan-400 transition"}>
            LIVE DASHBOARD
          </NavLink>
        </nav>

        {/* Action Button */}
        <div className="flex items-center space-x-4">
          {user ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 bg-slate-900 border border-slate-700 hover:border-cyan-500 text-cyan-400 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-2 transition"
            >
              <User className="w-4 h-4" />
              <span>Operator Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
