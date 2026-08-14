import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import { ShieldAlert, Activity } from 'lucide-react';

export const Accidents = () => {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getAccidents({ limit: 200 })
      .then(setAccidents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Potential Accident Incident Log</h2>
        <p className="text-xs text-slate-400 font-mono">Multi-Signal Temporal Collision Scoring & Vehicle Overlap Incidents</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono">Loading Accident Incidents...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {accidents.map((acc) => (
            <div key={acc.id} className="glass-card p-5 rounded-xl border border-rose-900/50 space-y-4 hover:border-rose-700/60 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                  <span>POTENTIAL ACCIDENT</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                  acc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  SEVERITY: {acc.severity}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-300">
                  Vehicles Involved: <span className="font-mono text-cyan-400 font-bold">#{acc.vehicle_ids?.join(', #') || 'N/A'}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Location: {acc.location || 'Expressway Segment'}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>TIMESTAMP: {acc.timestamp?.replace('T', ' ').substring(0, 19)}</span>
                <span className="text-emerald-400 font-bold">{(acc.confidence * 100).toFixed(0)}% SCORE</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
