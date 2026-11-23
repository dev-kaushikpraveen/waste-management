import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import { AlertTriangle, MapPin, Camera, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [category, setCategory] = useState<string>('Illegal dumping');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Sector 4 Commercial Rear Perimeter');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchComplaints = () => {
    api.getComplaints().then(setComplaints).catch(() => {});
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createComplaint({
        category,
        description,
        address,
        latitude: 28.5460,
        longitude: 77.1930
      });
      setSuccessMsg('Incident registered! Dispatched to municipal sanitation priority queue.');
      setDescription('');
      fetchComplaints();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300 border border-amber-500/30 mb-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> SANITATION INCIDENT WATCH
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Report Illegal Dumping & Damaged Bins
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Maintain urban cleanliness by reporting unattended waste piles, illegal burning, or overflowing smart dustbins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-4">Report an Incident</h2>

          {successMsg && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2.5 px-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                <option value="Illegal dumping">Illegal Dumping Pile</option>
                <option value="Overflowing bins">Overflowing Smart Dustbin</option>
                <option value="Damaged smart bin">Damaged Sensor / Hardware</option>
                <option value="Burning waste">Hazardous Waste Combustion</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Location Details</label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe waste volume, hazards, or landmarks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Registering...' : 'Submit Incident Grievance'}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="lg:col-span-2 glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-4">Active Incident Queue</h2>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center text-slate-500 py-10 font-mono text-xs">
                No active complaints reported. All urban sectors verified clean!
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-dark-900/60 border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{c.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'RESOLVED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{c.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2 font-mono">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-indigo-400" /> {c.address}
                      </span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
