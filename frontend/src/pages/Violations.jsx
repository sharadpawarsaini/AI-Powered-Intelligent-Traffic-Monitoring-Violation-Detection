import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const Violations = () => {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsAPI.getViolations({ limit: 200 })
      .then(setViolations)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Traffic Violations Directory</h2>
        <p className="text-xs text-slate-400 font-mono">No-Helmet, Wrong-Way Vector, Red-Light Line & Illegal Parking Events</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono">Loading Violations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {violations.map((v) => (
            <div key={v.id} className="glass-card p-5 rounded-xl border border-slate-800 space-y-3 hover:border-slate-700 transition">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800/80">
                  {v.violation_type}
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">{(v.confidence * 100).toFixed(0)}% CONF</span>
              </div>

              <div>
                <p className="text-xs text-slate-400 font-mono">VEHICLE ID: <span className="text-cyan-400 font-semibold">#{v.vehicle_id || 'N/A'}</span></p>
                <p className="text-xs text-slate-300 mt-1">{v.camera_location || 'Monitored Camera Junction'}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{v.timestamp?.replace('T', ' ').substring(0, 19)}</span>
                <span className="text-slate-500">EVIDENCE STORED</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
