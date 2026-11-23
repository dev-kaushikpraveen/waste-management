import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Recycle, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('citizen@ecotrace.org');
  const [password, setPassword] = useState('EcoCitizen2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const setDemoRole = (role: UserRole) => {
    const creds: Record<UserRole, { email: string; pwd: string; path: string }> = {
      CITIZEN: { email: 'citizen@ecotrace.org', pwd: 'EcoCitizen2026!', path: '/dashboard' },
      COLLECTOR: { email: 'collector@ecotrace.org', pwd: 'EcoCollector2026!', path: '/collector' },
      RECYCLER: { email: 'recycler@ecotrace.org', pwd: 'EcoRecycler2026!', path: '/recycler' },
      ADMIN: { email: 'admin@ecotrace.org', pwd: 'EcoAdmin2026!', path: '/admin' },
      SUPER_ADMIN: { email: 'superadmin@ecotrace.org', pwd: 'EcoSuperAdmin2026!', path: '/admin' }
    };
    setEmail(creds[role].email);
    setPassword(creds[role].pwd);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5] p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-[#DDE7E1] shadow-card p-8 space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-[#005A36] text-white flex items-center justify-center shadow-soft mb-3">
            <Recycle className="h-8 w-8 text-[#A0E040]" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7CB342]" /> Circular Economy Platform
          </div>
          <h2 className="text-2xl font-black text-[#003620]">ECOTRACE 360</h2>
          <p className="text-xs text-slate-500 mt-1">Smart Waste Management & CPCB EPR Plastic Tracker</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
            {error}
          </div>
        )}

        {/* Demo Fast Login Pills */}
        <div className="bg-[#F8FAF9] p-3.5 rounded-2xl border border-[#E0EAE3]">
          <div className="text-[11px] font-bold text-[#005A36] uppercase tracking-wider mb-2 text-center">
            One-Click Evaluator Role Selection
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoRole('CITIZEN')}
              className="py-2 px-1 rounded-xl bg-white text-[#005A36] border border-[#D0E2D6] hover:bg-[#E8F5E9] text-center text-[11px] font-bold shadow-xs transition-colors"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('COLLECTOR')}
              className="py-2 px-1 rounded-xl bg-white text-amber-800 border border-amber-200 hover:bg-amber-50 text-center text-[11px] font-bold shadow-xs transition-colors"
            >
              Collector
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('RECYCLER')}
              className="py-2 px-1 rounded-xl bg-white text-teal-800 border border-teal-200 hover:bg-teal-50 text-center text-[11px] font-bold shadow-xs transition-colors"
            >
              Recycler
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('ADMIN')}
              className="py-2 px-1 rounded-xl bg-white text-purple-800 border border-purple-200 hover:bg-purple-50 text-center text-[11px] font-bold shadow-xs transition-colors col-span-1"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('SUPER_ADMIN')}
              className="py-2 px-1 rounded-xl bg-white text-emerald-900 border border-emerald-300 hover:bg-emerald-50 text-center text-[11px] font-bold shadow-xs transition-colors col-span-2"
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDE7E1] bg-white text-[#1A2E26] focus:outline-none focus:ring-2 focus:ring-[#005A36] focus:border-[#005A36]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#DDE7E1] bg-white text-[#1A2E26] focus:outline-none focus:ring-2 focus:ring-[#005A36] focus:border-[#005A36]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-[1.01] flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
            <ArrowRight className="h-4 w-4 text-[#A0E040]" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-[#EAEFEA]">
          <Link to="/" className="text-xs text-[#005A36] font-bold hover:underline">
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
