import React from 'react';
import { reportsAPI } from '../services/api';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export const Reports = () => {
  const handleDownloadCSV = () => {
    window.open(reportsAPI.getCSVReportUrl(), '_blank');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">Daily Traffic Summary Reports</h2>
        <p className="text-xs text-slate-400 font-mono">Export Structured Reports with Violations, Accidents & Analytics Data</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CSV Export Card */}
        <div className="glass-panel p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit border border-cyan-500/30">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Daily Traffic Violations & Accidents CSV Report</h3>
            <p className="text-xs text-slate-400 mt-1">
              Includes full breakdown of all logged traffic events, vehicle IDs, violation types, confidence scores, and camera locations.
            </p>
          </div>

          <button
            onClick={handleDownloadCSV}
            className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-semibold text-xs flex items-center justify-center space-x-2 transition shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
