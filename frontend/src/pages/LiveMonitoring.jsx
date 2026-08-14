import React, { useState } from 'react';
import { Video, ShieldAlert, AlertTriangle, RefreshCw, Play, Square, Settings } from 'lucide-react';

export const LiveMonitoring = () => {
  const [streamSource, setStreamSource] = useState('demo');
  const [isStreaming, setIsStreaming] = useState(true);

  const streamUrl = `http://localhost:8000/api/detection/stream?source=${streamSource}`;

  return (
    <div className="p-6 space-y-6">
      {/* Top Stream Control Bar */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live Video Stream Feed</h3>
            <p className="text-xs text-slate-400 font-mono">Real-Time YOLOv8 Object Detection & ByteTrack ID Tracking</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={streamSource}
            onChange={(e) => setStreamSource(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
          >
            <option value="demo">Demo Traffic Simulation</option>
            <option value="webcam">Local Webcam (ID: 0)</option>
          </select>

          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition ${
              isStreaming
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isStreaming ? (
              <>
                <Square className="w-3.5 h-3.5" />
                <span>Pause Feed</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume Feed</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Stream Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stream Box */}
        <div className="lg:col-span-3 glass-panel p-4 rounded-xl border border-slate-800 flex flex-col">
          <div className="bg-slate-950 rounded-xl overflow-hidden relative aspect-video border border-slate-800 flex items-center justify-center">
            {isStreaming ? (
              <img
                src={streamUrl}
                alt="Real-Time Detection Feed"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="text-center p-8 text-slate-500 font-mono text-xs">
                Stream Paused
              </div>
            )}
          </div>
        </div>

        {/* Live Event Telemetry Panel */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 flex flex-col space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
            Active Detection Status
          </h4>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-mono">OBJECT DETECTOR</span>
              <span className="font-semibold text-cyan-400">YOLOv8 Nano (Pretrained COCO)</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
              <span className="text-slate-400 block font-mono">TRACKER ENGINE</span>
              <span className="font-semibold text-emerald-400">ByteTrack Persistent ID</span>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
              <div className="flex items-center space-x-2 text-amber-400 font-semibold mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Violation Rules Active</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Helmet Detection, Wrong-Way Vector, Red-Light Line, Illegal Parking (10s), Triple Riding.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs">
              <div className="flex items-center space-x-2 text-rose-400 font-semibold mb-1">
                <ShieldAlert className="w-4 h-4" />
                <span>Accident Scoring Engine</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Collision Overlap + Velocity Delta + Trajectory Deviation Threshold = 0.65.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
