import React from 'react';
import { Bell, LogOut, User, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = ({ title = "Dashboard Overview" }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-10 glass-panel ml-64">
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
      </div>

      <div className="flex items-center space-x-5">
        {/* Device Mode Badge */}
        <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
          <Cpu className="w-3.5 h-3.5" />
          <span>INFERENCE: CPU / CUDA</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-3 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 font-semibold text-sm">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-white leading-tight">{user?.name || 'Operator'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{user?.email || 'admin@traffic.ai'}</p>
          </div>
          <button 
            onClick={logout} 
            title="Logout"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
