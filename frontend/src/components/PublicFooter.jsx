import React from 'react';
import { Activity, GitBranch, ShieldAlert, Cpu } from 'lucide-react';

export const PublicFooter = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-white font-bold text-base">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>TRAFFIC AI SURVEILLANCE</span>
          </div>
          <p className="text-slate-500 text-xs leading-relaxed">
            AI-Powered Intelligent Traffic Monitoring, Violation Detection, Accident Collision Scoring, and GenAI/RAG Platform.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">Core Modules</h4>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li>• YOLOv8 Object Detector</li>
            <li>• ByteTrack Multi-Object Tracker</li>
            <li>• Traffic Violation Rules Engine</li>
            <li>• Potential Accident Scoring Engine</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">AI & Intelligence</h4>
          <ul className="space-y-2 text-slate-400 text-[11px]">
            <li>• License Plate OCR Service</li>
            <li>• GenAI / RAG Traffic Assistant</li>
            <li>• Sentence Transformer Vector Store</li>
            <li>• Dual MongoDB & SQLite Engine</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-3">GitHub Project</h4>
          <a
            href="https://github.com/sharadpawarsaini/AI-Powered-Intelligent-Traffic-Monitoring-Violation-Detection.git"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500 hover:text-white transition"
          >
            <GitBranch className="w-4 h-4" />
            <span>Repository Link</span>
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-6 border-t border-slate-900 flex flex-wrap justify-between items-center text-[11px] font-mono text-slate-600">
        <span>© 2026 AI TRAFFIC PLATFORM. ALL RIGHTS RESERVED.</span>
        <span>MAJOR ACADEMIC PROJECT DEMONSTRATION</span>
      </div>
    </footer>
  );
};
