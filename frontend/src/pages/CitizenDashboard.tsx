import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Wallet, EnvironmentalImpact, WasteBatch } from '../types';
import {
  Award,
  Recycle,
  Trash2,
  Leaf,
  ScanLine,
  CalendarCheck,
  QrCode,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Cpu,
  Activity
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const CitizenDashboard: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [batches, setBatches] = useState<WasteBatch[]>([]);

  useEffect(() => {
    api.getWallet().then(setWallet).catch(() => {});
    api.getEnvironmentalImpact().then(setImpact).catch(() => {});
    api.getBatches().then(setBatches).catch(() => {});
  }, []);

  const chartData = [
    { month: 'Jun', waste: 12 },
    { month: 'Jul', waste: 18 },
    { month: 'Aug', waste: 24 },
    { month: 'Sep', waste: 29 },
    { month: 'Oct', waste: 38 },
    { month: 'Nov', waste: 46 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner (Futuristic Glassmorphic Theme) */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" /> CPCB VERIFIED ENTERPRISE ACCOUNT
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Welcome back, {user?.full_name || 'Praveen Kumar'}!
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Sector: <span className="font-bold text-slate-200">Metropolitan Urban District</span> • Zone:{' '}
            <span className="font-bold text-slate-200">Sector 4 Tech Hub</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ai-scanner"
            className="btn-primary-gradient px-4 py-2.5 text-xs font-bold shadow-glow-purple flex items-center gap-2"
          >
            <ScanLine className="h-4 w-4 text-cyan-200" /> AI Waste Scanner
          </Link>
          <Link
            to="/pickup-booking"
            className="btn-secondary-glass px-4 py-2.5 text-xs font-semibold flex items-center gap-2"
          >
            <CalendarCheck className="h-4 w-4 text-indigo-400" /> Book Pickup
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Green Points Wallet</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {wallet?.balance_points || 320} <span className="text-sm font-bold text-amber-400">PTS</span>
          </div>
          <div className="text-[11px] text-amber-300 font-medium mt-1">{wallet?.tier || 'Silver EcoWarrior'}</div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Plastic Recycled</span>
            <div className="h-9 w-9 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
              <Recycle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            46.2 <span className="text-sm font-bold text-cyan-400">KG</span>
          </div>
          <div className="text-[11px] text-cyan-300 font-medium mt-1">Grade-A Sorted rPET</div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">CO₂ Abated (LCA)</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {impact?.co2_saved_kg || 2202.9} <span className="text-sm font-bold text-emerald-400">KG</span>
          </div>
          <div className="text-[11px] text-emerald-300 font-medium mt-1">~101.5 Trees Equivalent</div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verified DPP Batches</span>
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <QrCode className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {batches.length || 2} <span className="text-sm font-bold text-purple-400">PASSPORTS</span>
          </div>
          <div className="text-[11px] text-purple-300 font-medium mt-1">100% Chain-of-Custody</div>
        </div>
      </div>

      {/* Analytics Chart & Smart Bins Radar Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-400" /> Monthly Recycled Feedstock Trajectory
              </h2>
              <p className="text-xs text-slate-400">Cumulative dry waste diverted in kilograms</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              +28% MoM Growth
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="wasteGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC'
                  }}
                />
                <Area type="monotone" dataKey="waste" stroke="#818CF8" strokeWidth={2.5} fillOpacity={1} fill="url(#wasteGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick DPP Status */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase font-bold text-indigo-400">Digital Passport</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Latest DPP Record</h3>
            <p className="text-xs text-slate-400 mt-1">
              Batch ECO-PET-2026-000001 verified at EcoPolymer Processing Hub.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Polymer:</span>
                <span className="font-bold text-slate-200">Polyethylene Terephthalate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mass:</span>
                <span className="font-bold text-cyan-300">125.0 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Form IV:</span>
                <span className="font-bold text-purple-300">#EPR-2026-09</span>
              </div>
            </div>
          </div>

          <Link
            to="/passports"
            className="mt-6 w-full py-2.5 text-xs font-bold btn-primary-gradient flex items-center justify-center gap-2"
          >
            <span>Explore All Passports</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
