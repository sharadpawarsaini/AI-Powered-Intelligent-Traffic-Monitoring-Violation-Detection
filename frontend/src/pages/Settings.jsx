import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, CheckCircle2 } from 'lucide-react';

export const Settings = () => {
  const [config, setConfig] = useState({
    confidence_threshold: 0.40,
    iou_threshold: 0.45,
    frame_skip: 2,
    accident_threshold: 0.65,
    helmet_threshold: 0.50,
    speed_calibration: 15.0
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center space-x-3">
        <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Computer Vision & Detection Settings</h2>
          <p className="text-xs text-slate-400 font-mono">Dynamic Model Inference Thresholds & Calibration Parameters</p>
        </div>
      </div>

      {saved && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Model threshold configurations updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl border border-slate-800 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              YOLO Confidence Threshold ({config.confidence_threshold})
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={config.confidence_threshold}
              onChange={(e) => setConfig({ ...config, confidence_threshold: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              IoU Threshold ({config.iou_threshold})
            </label>
            <input
              type="range"
              min="0.1"
              max="0.9"
              step="0.05"
              value={config.iou_threshold}
              onChange={(e) => setConfig({ ...config, iou_threshold: parseFloat(e.target.value) })}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Accident Score Threshold ({config.accident_threshold})
            </label>
            <input
              type="range"
              min="0.3"
              max="0.95"
              step="0.05"
              value={config.accident_threshold}
              onChange={(e) => setConfig({ ...config, accident_threshold: parseFloat(e.target.value) })}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
              Speed Calibration (Pixels / Meter)
            </label>
            <input
              type="number"
              value={config.speed_calibration}
              onChange={(e) => setConfig({ ...config, speed_calibration: parseFloat(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" />
          <span>Save Thresholds</span>
        </button>
      </form>
    </div>
  );
};
