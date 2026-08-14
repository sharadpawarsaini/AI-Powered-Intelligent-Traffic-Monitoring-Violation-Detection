import React, { useEffect, useState } from 'react';
import { camerasAPI } from '../services/api';
import { Camera, Plus, CheckCircle, VideoOff, MapPin, Activity } from 'lucide-react';

export const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCam, setNewCam] = useState({ name: '', location: '', stream_url: 'webcam' });

  useEffect(() => {
    fetchCameras();
  }, []);

  const fetchCameras = () => {
    camerasAPI.getCameras()
      .then(setCameras)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await camerasAPI.createCamera({ ...newCam, status: 'ACTIVE' });
      setShowModal(false);
      setNewCam({ name: '', location: '', stream_url: 'webcam' });
      fetchCameras();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">CCTV Cameras Directory</h2>
          <p className="text-xs text-slate-400 font-mono">Monitored Junctions & Expressway Surveillance Network</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-2 transition shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Camera</span>
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono">Loading Camera Network...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cameras.map((cam) => (
            <div key={cam.id} className="glass-card p-5 rounded-xl border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-lg border border-cyan-500/30">
                  <Camera className="w-6 h-6" />
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono flex items-center space-x-1 ${
                  cam.status === 'ACTIVE'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}>
                  {cam.status === 'ACTIVE' ? <CheckCircle className="w-3 h-3 inline mr-1" /> : <VideoOff className="w-3 h-3 inline mr-1" />}
                  <span>{cam.status}</span>
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base">{cam.name}</h3>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{cam.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>FPS: 30</span>
                <span>STREAM: {cam.stream_url}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Camera Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl glass-panel">
            <h3 className="text-base font-bold text-white">Add Monitored CCTV Stream</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Camera Name</label>
                <input
                  type="text"
                  required
                  value={newCam.name}
                  onChange={(e) => setNewCam({ ...newCam, name: e.target.value })}
                  placeholder="Cam 06 - Main Street Junction"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Location Coordinates / Intersection</label>
                <input
                  type="text"
                  required
                  value={newCam.location}
                  onChange={(e) => setNewCam({ ...newCam, location: e.target.value })}
                  placeholder="Main St & 12th Ave"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 text-white text-xs font-semibold rounded-lg hover:bg-cyan-500"
                >
                  Save Camera
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
