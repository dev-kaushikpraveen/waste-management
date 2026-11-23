import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Complaint } from '../types';
import { AlertTriangle, MapPin, Camera, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [category, setCategory] = useState<string>('Illegal dumping');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('Hostel 4 Rear Perimeter');
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
      setSuccessMsg('Complaint registered! Assigned to sanitation dispatch.');
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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" /> Campus Cleanliness Watch
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Report Illegal Dumping & Damaged Bins
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Help maintain a clean campus environment by reporting unattended waste piles, burning, or overflowing bins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="saahas-card p-6">
          <h2 className="text-base font-black text-[#003620] mb-4">Report an Issue</h2>

          {successMsg && (
            <div className="mb-4 p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center gap-2 shadow-soft">
              <CheckCircle2 className="h-4 w-4" /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36] font-medium"
              >
                <option value="Illegal dumping">Illegal Dumping Pile</option>
                <option value="Overflowing bins">Overflowing Smart Dustbin</option>
                <option value="Damaged smart bin">Damaged Sensor / Hardware</option>
                <option value="Burning waste">Burning Waste Hazard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Location Details</label>
              <div className="relative">
                <MapPin className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe waste volume, hazards, or landmarks..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105"
            >
              {isSubmitting ? 'Registering...' : 'Submit Grievance'}
            </button>
          </form>
        </div>

        {/* Complaints List */}
        <div className="lg:col-span-2 saahas-card p-6">
          <h2 className="text-base font-black text-[#003620] mb-4">Active Campus Grievances</h2>

          <div className="space-y-3">
            {complaints.length === 0 ? (
              <div className="text-center text-slate-400 py-10">No active complaints reported. Campus is clean!</div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl bg-[#F8FAF9] border border-[#E0EAE3] flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{c.category}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'RESOLVED'
                            ? 'bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{c.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-[#005A36]" /> {c.address}
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
