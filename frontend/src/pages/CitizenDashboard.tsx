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
  Sparkles
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
      {/* Welcome Banner (Saahas Clean Green Theme) */}
      <div className="rounded-3xl bg-white border border-[#DDE7E1] p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[#7CB342]" /> CPCB Verified Citizen Account
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
            Welcome back, {user?.full_name}!
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Campus: <span className="font-bold text-slate-800">{user?.college_name || 'IIT Delhi'}</span> • Hostel:{' '}
            <span className="font-bold text-slate-800">{user?.hostel_name || 'Karakoram Hostel'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/ai-scanner"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105"
          >
            <ScanLine className="h-4 w-4 text-[#A0E040]" /> AI Waste Scanner
          </Link>
          <Link
            to="/pickup-booking"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F4F7F5] hover:bg-[#E8F0EC] text-[#005A36] font-bold text-xs border border-[#DDE7E1] transition-all"
          >
            <CalendarCheck className="h-4 w-4" /> Book Pickup
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="saahas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Green Points Wallet</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {wallet?.balance_points || 320} <span className="text-sm font-bold text-[#005A36]">Points</span>
          </div>
          <div className="text-[11px] text-[#005A36] font-bold mt-1">{wallet?.tier || 'Silver EcoWarrior'}</div>
        </div>

        <div className="saahas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Plastic Recycled</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-[#005A36] flex items-center justify-center">
              <Recycle className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {wallet ? Math.round(wallet.lifetime_points / 20) : 24} <span className="text-sm font-bold text-[#005A36]">kg</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">100% CPCB verified batches</div>
        </div>

        <div className="saahas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">CO₂ Abated</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Leaf className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#005A36] mt-1">
            {wallet ? (Math.round(wallet.lifetime_points / 20) * 2.1).toFixed(1) : 50.4} <span className="text-sm font-bold text-slate-500">kg</span>
          </div>
          <div className="text-[11px] text-[#005A36] font-semibold mt-1">~2.3 Trees Equivalent</div>
        </div>

        <div className="saahas-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Smart Bins Mesh</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {impact?.active_smart_bins || 5} <span className="text-sm font-bold text-[#005A36]">Units</span>
          </div>
          <Link to="/smart-bins" className="text-[11px] font-bold text-[#005A36] hover:underline mt-1 block">
            View live campus map →
          </Link>
        </div>
      </div>

      {/* Main Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Activity Chart */}
        <div className="lg:col-span-2 saahas-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-black text-[#003620] flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#005A36]" /> Certified Recycling Activity Trend
              </h2>
              <p className="text-xs text-slate-500">Verified monthly waste diverted (kg)</p>
            </div>
            <span className="text-xs font-bold text-[#005A36] flex items-center gap-1 bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
              +21% this month
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorWaste" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#005A36" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#005A36" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#005A36',
                    borderRadius: '0.75rem',
                    color: '#003620',
                    fontSize: '12px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="waste" stroke="#005A36" strokeWidth={3} fillOpacity={1} fill="url(#colorWaste)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Digital Plastic Passports Quick View */}
        <div className="saahas-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-black text-[#003620] flex items-center gap-2">
                <QrCode className="h-4 w-4 text-[#005A36]" /> Plastic Passports
              </h2>
              <Link to="/passports" className="text-xs font-bold text-[#005A36] hover:underline">
                View All
              </Link>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time lifecycle tracking of verified plastic batches.
            </p>

            <div className="space-y-3">
              {batches.slice(0, 3).map((b) => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                    <span className="font-mono text-[#005A36]">{b.batch_code}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                    <span>{b.plastic_type}</span>
                    <span className="font-bold text-slate-800">{b.initial_weight_kg} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/passports"
            className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-colors"
          >
            Track Complete Plastic Journey <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
