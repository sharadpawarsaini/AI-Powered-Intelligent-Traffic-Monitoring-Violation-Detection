import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import { Search, Filter, ShieldAlert, Eye } from 'lucide-react';

export const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  useEffect(() => {
    fetchEvents();
  }, [severityFilter]);

  const fetchEvents = () => {
    setLoading(true);
    eventsAPI.getEvents({ limit: 200, severity: severityFilter || undefined })
      .then(setEvents)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const filtered = events.filter(e => 
    e.event_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Traffic Incidents & Events Database</h2>
          <p className="text-xs text-slate-400 font-mono">Logged Violation Snapshot Evidence & Potential Accident Snapshots</p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search location/type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono">Loading Traffic Events...</div>
      ) : (
        <div className="glass-panel rounded-xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Vehicle ID</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Confidence</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-slate-400">{e.timestamp?.replace('T', ' ').substring(0, 19)}</td>
                    <td className="p-3 font-semibold text-white">{e.event_type}</td>
                    <td className="p-3 text-slate-300">{e.location}</td>
                    <td className="p-3 font-mono text-cyan-400">#{e.vehicle_id || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        e.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                        e.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {e.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{(e.confidence * 100).toFixed(0)}%</td>
                    <td className="p-3 text-slate-400 max-w-xs truncate">{e.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
