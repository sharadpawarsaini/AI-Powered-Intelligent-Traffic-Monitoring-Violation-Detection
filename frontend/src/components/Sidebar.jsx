import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Video, 
  Camera, 
  AlertTriangle, 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  Bot, 
  FileText, 
  Settings, 
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Monitoring', path: '/live-monitoring', icon: Video },
    { label: 'Cameras', path: '/cameras', icon: Camera },
    { label: 'Violations Log', path: '/violations', icon: AlertTriangle },
    { label: 'Accidents Log', path: '/accidents', icon: ShieldAlert },
    { label: 'Traffic Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'AI Assistant (RAG)', path: '/ai-assistant', icon: Bot },
    { label: 'Daily Reports', path: '/reports', icon: FileText },
    { label: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-20 glass-panel">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-wide leading-tight">TRAFFIC AI</h1>
          <p className="text-xs text-cyan-400 font-mono">INTELLIGENCE V2.4</p>
        </div>
      </div>

      {/* Role Badge */}
      <div className="px-5 py-3 border-b border-slate-800/60 bg-slate-950/40">
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>ROLE:</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/50">
            {user?.role || 'OPERATOR'}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 font-mono flex items-center justify-between">
        <span>STATUS: ONLINE</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
      </div>
    </aside>
  );
};
