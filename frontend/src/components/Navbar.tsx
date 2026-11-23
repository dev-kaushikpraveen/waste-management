import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { 
  Recycle, 
  Radio, 
  Sparkles, 
  LogOut, 
  Github, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, role, quickSwitchRole, logout } = useAuth();
  const navigate = useNavigate();

  const roleStyles: Record<UserRole, { badge: string; text: string }> = {
    CITIZEN: { badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.25)]', text: 'Citizen Producer' },
    COLLECTOR: { badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]', text: 'Fleet Collector' },
    RECYCLER: { badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.25)]', text: 'MRF Recycler' },
    ADMIN: { badge: 'bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.25)]', text: 'City Admin' },
    SUPER_ADMIN: { badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.25)]', text: 'Super Admin' }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-dark-950/80 px-4 backdrop-blur-2xl md:px-8">
      {/* Brand Logo & Developer Credential */}
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-glow-purple transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.7)]">
            <Recycle className="h-5 w-5 text-cyan-200 transition-transform duration-500 group-hover:rotate-180" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="text-base font-black tracking-tight text-white flex items-center gap-2">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">ECOTRACE</span>
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">360</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
              <span>Autonomous Circular Protocol</span>
              <span className="text-slate-600">•</span>
              <span className="text-indigo-400/90 font-medium">by Praveen Kumar</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Role Switcher & Telemetry Hub */}
      <div className="flex items-center gap-3">
        {/* Quick Role Switcher */}
        <div className="hidden xl:flex items-center gap-1 bg-dark-900/90 p-1 rounded-xl text-xs font-semibold border border-white/[0.08] backdrop-blur-xl">
          <span className="px-2 text-slate-500 text-[10px] font-mono uppercase tracking-wider">Perspective:</span>
          {(['CITIZEN', 'COLLECTOR', 'RECYCLER', 'ADMIN', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => {
                quickSwitchRole(r);
                if (r === 'CITIZEN') navigate('/dashboard');
                else if (r === 'COLLECTOR') navigate('/collector');
                else if (r === 'RECYCLER') navigate('/recycler');
                else navigate('/admin');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all font-semibold ${
                role === r
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              {r === 'SUPER_ADMIN' ? 'SUPER ADMIN' : r}
            </button>
          ))}
        </div>

        {/* Live IoT Node Pulse */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono font-semibold text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <span>IoT Mesh Active</span>
        </div>

        {/* Developer GitHub Profile Link */}
        <a
          href="https://github.com/dev-kaushikpraveen"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.08] transition-all hover:scale-105"
        >
          <Github className="h-3.5 w-3.5 text-purple-400" />
          <span>Praveen Kumar</span>
          <ExternalLink className="h-3 w-3 text-slate-500" />
        </a>

        {/* Active Role Badge */}
        {role && (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border backdrop-blur-md ${roleStyles[role].badge}`}>
            {roleStyles[role].text}
          </span>
        )}

        {/* User Identity */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-white/[0.08]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-glow-purple">
              {user.full_name?.charAt(0) || 'P'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-white leading-tight">{user.full_name}</div>
              <div className="text-[10px] font-mono text-slate-400 leading-tight">
                {user.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn-primary-gradient px-4 py-2 text-xs font-bold shadow-glow-blue"
          >
            Launch Console
          </Link>
        )}
      </div>
    </header>
  );
};
