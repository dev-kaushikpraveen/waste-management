import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, School, Home, Save, CheckCircle2 } from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Aarav Sharma');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [college, setCollege] = useState(user?.college_name || 'IIT Delhi');
  const [hostel, setHostel] = useState(user?.hostel_name || 'Karakoram Hostel');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <User className="h-3.5 w-3.5 text-[#7CB342]" /> Institutional Affiliation
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          User Profile & Institutional Credentials
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Manage your personal information, hostel block, and verified campus credentials.
        </p>
      </div>

      <div className="saahas-card p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#EAEFEA]">
          <div className="h-16 w-16 rounded-2xl bg-[#005A36] text-white text-2xl font-black flex items-center justify-center shadow-soft">
            {fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#003620]">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-[#7CB342]" /> Verified {user?.role || 'Citizen'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email || 'citizen@ecotrace.org'}</p>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#005A36] text-xs font-bold flex items-center gap-2 shadow-soft">
            <CheckCircle2 className="h-4 w-4" /> Profile credentials updated successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || 'citizen@ecotrace.org'}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-slate-100 text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hostel / Campus Block</label>
              <input
                type="text"
                value={hostel}
                onChange={(e) => setHostel(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-[#DDE7E1] bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#005A36]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 flex items-center justify-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Profile Credentials
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
