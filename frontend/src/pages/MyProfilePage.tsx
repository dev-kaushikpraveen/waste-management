import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Phone, Building, MapPin, Save, CheckCircle2, Github, Cpu } from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || 'Praveen Kumar');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [organization, setOrganization] = useState('Metropolitan Urban District');
  const [district, setDistrict] = useState('Sector 4 Tech Hub');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <User className="h-3.5 w-3.5 text-cyan-300" /> DEVELOPER & ARCHITECT CREDENTIALS
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Operator Profile & System Authority
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Manage your verified developer credentials, institutional authority, and role permissions.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-white/[0.08]">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white text-2xl font-black flex items-center justify-center shadow-glow-purple">
            {fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">{fullName}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-cyan-300" /> Verified {user?.role || 'Citizen'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email || 'praveen@ecotrace.org'}</p>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" /> Profile credentials synchronized with database!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-2.5 px-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address (Read-only)</label>
            <input
              type="email"
              disabled
              value={user?.email || 'citizen@ecotrace.org'}
              className="w-full py-2.5 px-3 text-xs glass-input opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full py-2.5 px-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Organization / Authority</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full py-2.5 px-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Urban District / Zone</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2.5 px-3 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2"
            >
              <Save className="h-4 w-4" /> Save Authority Profile
            </button>
          </div>
        </form>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-500">
          <span>Architect: Praveen Kumar</span>
          <a
            href="https://github.com/dev-kaushikpraveen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> dev-kaushikpraveen
          </a>
        </div>
      </div>
    </div>
  );
};
