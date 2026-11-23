import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Recycle, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, Github } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-cosmic-mesh p-4 font-sans selection:bg-indigo-500/30">
      <div className="w-full max-w-md glass-panel-glow p-8 space-y-6 relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center text-center">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-glow-purple mb-3">
            <Recycle className="h-7 w-7 text-cyan-200" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" /> SECURE CONSOLE ACCESS
          </div>
          <h2 className="text-2xl font-black text-white">ECOTRACE 360</h2>
          <p className="text-xs text-slate-400 mt-1">Autonomous Circular Intelligence • Engineered by Praveen Kumar</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 text-red-300 text-xs font-semibold border border-red-500/40">
            {error}
          </div>
        )}

        {/* Quick Role Selection */}
        <div className="bg-dark-900/80 p-3.5 rounded-2xl border border-white/[0.08]">
          <div className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider mb-2 text-center">
            One-Click Role Selection
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setDemoRole('CITIZEN')}
              className="py-2 px-1 rounded-xl bg-white/[0.04] text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/10 text-center text-[11px] font-bold transition-colors"
            >
              Citizen
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('COLLECTOR')}
              className="py-2 px-1 rounded-xl bg-white/[0.04] text-amber-300 border border-amber-500/30 hover:bg-amber-500/10 text-center text-[11px] font-bold transition-colors"
            >
              Collector
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('RECYCLER')}
              className="py-2 px-1 rounded-xl bg-white/[0.04] text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/10 text-center text-[11px] font-bold transition-colors"
            >
              Recycler
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('ADMIN')}
              className="py-2 px-1 rounded-xl bg-white/[0.04] text-purple-300 border border-purple-500/30 hover:bg-purple-500/10 text-center text-[11px] font-bold transition-colors col-span-1"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setDemoRole('SUPER_ADMIN')}
              className="py-2 px-1 rounded-xl bg-white/[0.04] text-rose-300 border border-rose-500/30 hover:bg-rose-500/10 text-center text-[11px] font-bold transition-colors col-span-2"
            >
              Super Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs glass-input focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2"
          >
            {loading ? 'Authenticating...' : 'Sign In to Operations Console'}
            <ArrowRight className="h-4 w-4 text-cyan-200" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 font-bold hover:underline">
            ← Back to Public Portal
          </Link>
          <a
            href="https://github.com/dev-kaushikpraveen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Github className="h-3.5 w-3.5" /> Praveen Kumar
          </a>
        </div>
      </div>
    </div>
  );
};
