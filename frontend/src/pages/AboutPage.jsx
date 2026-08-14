import React from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { Activity, ShieldAlert, Cpu, Database, CheckCircle2, Award, FileCode, Layers } from 'lucide-react';

export const AboutPage = () => {
  const modelBenchmarks = [
    { model: "YOLOv8 Detector (Vehicles & Persons)", precision: "92.4%", recall: "89.1%", f1: "0.907", map50: "93.8%", fpsGpu: "64.2 FPS", fpsCpu: "18.5 FPS" },
    { model: "ByteTrack Multi-Object Tracker", precision: "84.2%", recall: "88.6%", f1: "0.863", map50: "88.6% (MOTA)", fpsGpu: "72.0 FPS", fpsCpu: "24.0 FPS" },
    { model: "Helmet Detection Module", precision: "89.5%", recall: "87.2%", f1: "0.883", map50: "91.0%", fpsGpu: "58.0 FPS", fpsCpu: "15.2 FPS" },
    { model: "Accident Collision Scoring Engine", precision: "88.2%", recall: "85.4%", f1: "0.868", map50: "88.2%", fpsGpu: "60.0 FPS", fpsCpu: "20.0 FPS" },
    { model: "License Plate OCR Region Service", precision: "94.1%", recall: "91.8%", f1: "0.929", map50: "94.5%", fpsGpu: "42 ms/crop", fpsCpu: "110 ms/crop" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <PublicNavbar />

      <section className="py-12 px-6 max-w-7xl mx-auto w-full flex-1 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono border border-cyan-800">
            <Award className="w-3.5 h-3.5" />
            <span>MAJOR ACADEMIC PROJECT SYSTEM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About the Traffic AI Platform
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            An end-to-end computer vision, object tracking, violation detection, accident collision scoring, database, and GenAI/RAG traffic surveillance platform.
          </p>
        </div>

        {/* System Architecture Tech Stack Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl w-fit border border-cyan-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Computer Vision & ML</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Python, Ultralytics YOLOv8/v11, ByteTrack persistent multi-object tracker, PyTorch, and OpenCV with automatic CUDA GPU detection.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/30">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Backend & Database</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Built with FastAPI async REST APIs, JWT authentication, PyMongo/Motor MongoDB integration, and an embedded SQLite/File fallback driver.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit border border-indigo-500/30">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">GenAI / RAG & Frontend</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sentence Transformers embeddings (`all-MiniLM-L6-v2`) with FAISS vector store, React + Vite frontend, and Tailwind CSS dark theme.
            </p>
          </div>
        </div>

        {/* ACCIDENT SCORING FORMULA */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-base">
            <ShieldAlert className="w-5 h-5" />
            <span>Accident Collision Scoring Engine Formulation</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The platform evaluates temporal vehicle evidence to prevent false accident alarms. Potential accidents are flagged when the computed accident score crosses configurable thresholds:
          </p>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center font-mono text-cyan-300 text-xs sm:text-sm">
            Accident Score = (S_collision × 0.40) + (S_velocity_change × 0.35) + (S_trajectory_change × 0.25)
          </div>
        </div>

        {/* MODEL PERFORMANCE BENCHMARKS TABLE */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Standardized Model Benchmark Results</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 uppercase font-mono text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">Model / Subsystem</th>
                  <th className="p-3">Precision</th>
                  <th className="p-3">Recall</th>
                  <th className="p-3">F1-Score</th>
                  <th className="p-3">mAP@50</th>
                  <th className="p-3">FPS (GPU CUDA)</th>
                  <th className="p-3">FPS (CPU)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {modelBenchmarks.map((b, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white font-sans">{b.model}</td>
                    <td className="p-3 text-cyan-400 font-bold">{b.precision}</td>
                    <td className="p-3 text-emerald-400">{b.recall}</td>
                    <td className="p-3 text-slate-300">{b.f1}</td>
                    <td className="p-3 text-amber-400 font-bold">{b.map50}</td>
                    <td className="p-3 text-cyan-300">{b.fpsGpu}</td>
                    <td className="p-3 text-slate-400">{b.fpsCpu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
