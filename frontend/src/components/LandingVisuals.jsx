import React from 'react';
import { Activity, ShieldAlert, Cpu, Eye, Zap, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroVisualCard = () => {
  return (
    <div className="relative rounded-2xl overflow-hidden glass-panel border border-slate-700/60 p-6 shadow-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/95">
      {/* Top Simulated Camera Feed Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
          <span className="text-xs font-mono font-bold text-rose-400">LIVE SURVEILLANCE FEED #01</span>
        </div>
        <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800">
          INFERENCE: 64.2 FPS (CUDA)
        </span>
      </div>

      {/* Simulated High-Tech Bounding Box Visual Feed */}
      <div className="relative aspect-video bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80 p-4 flex flex-col justify-between group">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>

        {/* Top Overlay Stats */}
        <div className="relative z-10 flex justify-between items-start">
          <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300">
            <span className="text-cyan-400 font-bold">VEHICLES:</span> 14 ACTIVE | <span className="text-emerald-400 font-bold">DENSITY:</span> MODERATE
          </div>
          <div className="bg-rose-950/90 border border-rose-800 text-rose-300 px-3 py-1 rounded-lg text-[11px] font-mono flex items-center space-x-1.5 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>ACCIDENT PREDICTION: ACTIVE</span>
          </div>
        </div>

        {/* Bounding Box Simulators */}
        <div className="relative z-10 grid grid-cols-2 gap-4 my-auto">
          {/* Simulated Car Box */}
          <div className="border-2 border-cyan-400 bg-cyan-500/10 rounded-lg p-3 relative shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <div className="absolute -top-3 left-2 bg-cyan-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              CAR #27 | 48.2 km/h
            </div>
            <div className="text-[11px] font-mono text-cyan-300 mt-1">
              Conf: 94.8% | Tracking ID: 27
            </div>
          </div>

          {/* Simulated Motorcycle / No-Helmet Box */}
          <div className="border-2 border-amber-400 bg-amber-500/10 rounded-lg p-3 relative shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="absolute -top-3 left-2 bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded font-mono">
              ⚠ NO HELMET | BIKE #31
            </div>
            <div className="text-[11px] font-mono text-amber-300 mt-1">
              Conf: 91.2% | Violation Flagged
            </div>
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-900">
          <span>YOLOv8 + ByteTrack Tracker</span>
          <span className="text-emerald-400">FAISS VECTOR STORE SYNCED</span>
        </div>
      </div>
    </div>
  );
};

export const FeatureCard = ({ icon: Icon, title, description, badge }) => {
  return (
    <div className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all duration-300 group flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="p-3.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
