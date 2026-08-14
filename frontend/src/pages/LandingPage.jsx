import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar';
import { PublicFooter } from '../components/PublicFooter';
import { HeroVisualCard, FeatureCard } from '../components/LandingVisuals';
import { 
  Eye, 
  Activity, 
  ShieldAlert, 
  Bot, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  CheckCircle2,
  Gauge,
  Car
} from 'lucide-react';

export const LandingPage = () => {
  const metrics = [
    { label: "YOLOv8 Detection mAP", value: "93.8%", color: "text-cyan-400" },
    { label: "Multi-Object Tracking MOTA", value: "88.6%", color: "text-emerald-400" },
    { label: "GPU Inference Speed", value: "64.2 FPS", color: "text-amber-400" },
    { label: "Accident Scoring Accuracy", value: "88.2%", color: "text-rose-400" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      <PublicNavbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-6 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>ACADEMIC MAJOR PROJECT PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              AI-Powered <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">Traffic Monitoring</span> & Road Accident Detection
            </h1>

            <p className="text-slate-300 text-base leading-relaxed">
              A comprehensive computer vision and deep learning system processing CCTV surveillance footage to track vehicle velocity, detect traffic violations, score potential collision accidents in real time, and answer queries via a GenAI RAG Traffic Assistant.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold text-sm flex items-center space-x-2 transition shadow-xl shadow-cyan-500/25"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="px-6 py-3.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white rounded-xl font-semibold text-sm transition"
              >
                <span>Architecture & Metrics</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Visual Demonstration */}
          <div className="lg:col-span-6">
            <HeroVisualCard />
          </div>
        </div>
      </section>

      {/* METRICS TICKER BAR */}
      <section className="border-y border-slate-800 bg-slate-900/60 py-8 px-6 glass-panel">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className={`text-3xl font-extrabold font-mono ${m.color}`}>{m.value}</h3>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">{m.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ROAD ACCIDENT VISION FEATURE SECTION */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Advanced Computer Vision & Incident Pipelines
          </h2>
          <p className="text-sm text-slate-400">
            Engineered with deep learning algorithms to monitor highway flow, detect severe violations, evaluate accident risks, and generate natural language insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={Eye}
            title="YOLOv8 & ByteTrack Vision"
            description="Multi-class vehicle object detection (Car, Bike, Bus, Truck) combined with ByteTrack persistent ID tracking across camera frames."
            badge="VISION ENGINE"
          />
          <FeatureCard
            icon={ShieldAlert}
            title="Potential Accident Collision Engine"
            description="Multi-signal temporal collision scoring evaluating vehicle velocity delta, trajectory deviation, and bounding box overlap."
            badge="ACCIDENT SCORING"
          />
          <FeatureCard
            icon={AlertTriangle}
            title="Traffic Violation Suite"
            description="Automated violation detection for Helmet presence, Wrong-Way vector driving, Red-Light line crossing, and Illegal Parking."
            badge="VIOLATIONS"
          />
          <FeatureCard
            icon={Car}
            title="License Plate Recognition OCR"
            description="Vehicle crop region detection paired with optical character recognition (OCR) and alphanumeric regex validation."
            badge="OCR SERVICE"
          />
          <FeatureCard
            icon={Bot}
            title="GenAI & RAG Traffic Assistant"
            description="Ask natural language questions about traffic incidents. Powered by Sentence Transformers embeddings and grounded LLM answers."
            badge="GENAI / RAG"
          />
          <FeatureCard
            icon={Gauge}
            title="Speed & Traffic Density Analytics"
            description="Pixel displacement speed calculation (km/h) with camera calibration and hourly traffic volume trend charts."
            badge="ANALYTICS"
          />
        </div>
      </section>

      {/* ROAD SAFETY & VISION BANNER */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full">
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white">
              Ready to Explore Live Traffic Monitoring & Accident Detection?
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              Launch the live operator dashboard to simulate CCTV streams, inspect violation evidence frames, view traffic analytics, and ask the GenAI assistant questions.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-sm flex items-center space-x-2 transition shadow-xl shadow-cyan-500/25 whitespace-nowrap"
          >
            <span>Open Operator Portal</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
