import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Recycle, Bell, Shield, User as UserIcon, LogOut, Radio, Sparkles, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, role, quickSwitchRole, logout } = useAuth();
  const navigate = useNavigate();

  const roleStyles: Record<UserRole, { badge: string; text: string }> = {
    CITIZEN: { badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', text: 'Citizen' },
    COLLECTOR: { badge: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Collector' },
    RECYCLER: { badge: 'bg-blue-50 text-blue-800 border-blue-200', text: 'Recycler' },
    ADMIN: { badge: 'bg-purple-50 text-purple-800 border-purple-200', text: 'Admin' },
    SUPER_ADMIN: { badge: 'bg-rose-50 text-rose-800 border-rose-200', text: 'Super Admin' }
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#DDE7E1] bg-white/95 px-4 backdrop-blur-md md:px-8 shadow-xs">
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005A36] text-white shadow-soft transition-transform group-hover:scale-105">
            <Recycle className="h-6 w-6 text-[#A0E040]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-[#003620] leading-none flex items-center gap-1.5">
              ECOTRACE <span className="text-[#005A36]">360</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]">
                Zero Waste
              </span>
            </div>
            <div className="text-[11px] font-medium text-slate-500">
              Smart Waste Management & EPR Circular Tracker
            </div>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Role Switcher for seamless evaluation */}
        <div className="hidden lg:flex items-center gap-1 bg-[#F4F7F5] p-1 rounded-xl text-xs font-semibold text-slate-600 border border-[#DDE7E1]">
          <span className="px-2 text-slate-400 text-[11px] font-bold">ROLE:</span>
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
              className={`px-3 py-1.5 rounded-lg text-xs transition-all font-bold ${
                role === r
                  ? 'bg-[#005A36] text-white shadow-soft'
                  : 'text-slate-600 hover:bg-[#E8F0EC] hover:text-[#005A36]'
              }`}
            >
              {r === 'SUPER_ADMIN' ? 'SUPER ADMIN' : r}
            </button>
          ))}
        </div>

        {/* Live IoT Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F5E9] border border-[#C8E6C9] text-xs font-bold text-[#005A36]">
          <span className="h-2 w-2 rounded-full bg-[#7CB342] animate-pulse" />
          <span>IoT Mesh Live</span>
        </div>

        {/* Active Role Badge */}
        {role && (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${roleStyles[role].badge}`}>
            {roleStyles[role].text}
          </span>
        )}

        {/* User Profile */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-[#DDE7E1]">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F5E9] text-[#005A36] font-bold border border-[#C8E6C9] text-sm">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">{user.full_name}</div>
              <div className="text-[10px] text-slate-500 leading-tight">
                {user.college_name || user.email}
              </div>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="rounded-xl bg-[#005A36] px-4 py-2 text-xs font-bold text-white hover:bg-[#004728] shadow-soft transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
