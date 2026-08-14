import React, { useEffect, useState } from 'react';
import { analyticsAPI, eventsAPI } from '../services/api';
import { 
  Car, 
  AlertTriangle, 
  ShieldAlert, 
  Gauge, 
  Video, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getSummary(), eventsAPI.getEvents({ limit: 8 })])
      .then(([summaryData, eventsData]) => {
        setSummary(summaryData);
        setRecentEvents(eventsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
        Loading Dashboard Intelligence...
      </div>
    );
  }

  const statCards = [
    { title: "Vehicles Today", value: summary?.vehicles_today || 0, icon: Car, color: "from-cyan-500 to-blue-600", badge: "+14%" },
    { title: "Violations Today", value: summary?.violations_today || 0, icon: AlertTriangle, color: "from-amber-500 to-orange-600", badge: "Active" },
    { title: "Accidents Logged", value: summary?.accidents_today || 0, icon: ShieldAlert, color: "from-rose-500 to-red-600", badge: "Critical" },
    { title: "Average Speed", value: `${summary?.average_speed_kmh || 0} km/h`, icon: Gauge, color: "from-emerald-500 to-teal-600", badge: "Normal" },
  ];

  const PIE_COLORS = ['#38bdf8', '#f59e0b', '#ef4444', '#10b981', '#a855f7'];

  return (
    <div className="p-6 space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-xl flex items-center justify-between border border-slate-800 hover:border-slate-700 transition">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{card.value}</h3>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-400 border border-slate-700">
                  {card.badge}
                </span>
              </div>
              <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Hourly Traffic Chart & Live Stream Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Volume Chart */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>24-Hour Traffic Volume Trend</span>
            </h3>
            <span className="text-xs font-mono text-cyan-400">VEHICLES / HOUR</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary?.traffic_by_hour || []}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="vehicles" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorTraffic)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Video Preview Stream */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Video className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Live CCTV Junction Feed</span>
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-400 border border-rose-800">
              LIVE
            </span>
          </div>
          <div className="flex-1 bg-slate-950 rounded-lg overflow-hidden relative border border-slate-800 flex items-center justify-center">
            <img 
              src="http://localhost:8000/api/detection/stream?source=demo" 
              alt="Live Traffic Stream"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<div class="p-6 text-center text-xs font-mono text-slate-500">Live Camera Feed Offline</div>';
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Logged Incidents Table */}
      <div className="glass-panel p-5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Traffic Events & Alerts</h3>
          <span className="text-xs font-mono text-slate-400">REAL-TIME LOG</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 uppercase font-mono text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Event Type</th>
                <th className="p-3">Location</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400">{evt.timestamp?.replace('T', ' ').substring(0, 19)}</td>
                  <td className="p-3 font-semibold text-white">{evt.event_type}</td>
                  <td className="p-3 text-slate-300">{evt.location}</td>
                  <td className="p-3 font-mono text-cyan-400">#{evt.vehicle_id || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      evt.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      evt.severity === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {evt.severity}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-emerald-400">{(evt.confidence * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
