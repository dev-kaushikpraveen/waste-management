import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EnvironmentalImpact, Bin, WasteBatch } from '../types';
import {
  Globe2,
  Trash2,
  Truck,
  Factory,
  AlertTriangle,
  QrCode,
  TrendingUp,
  Cpu,
  RefreshCw,
  Users,
  Radio,
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [summary, setSummary] = useState<any>(null);
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [batches, setBatches] = useState<WasteBatch[]>([]);

  useEffect(() => {
    api.getDashboardSummary().then(setSummary).catch(() => {});
    api.getEnvironmentalImpact().then(setImpact).catch(() => {});
    api.getBins().then(setBins).catch(() => {});
    api.getBatches().then(setBatches).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
            <Globe2 className="h-3.5 w-3.5 text-cyan-300" /> CENTRAL CITY COMMAND & CONTROL
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            Smart City Central Command & EPR Center
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Centralized monitoring of IoT telemetry, collection fleet dispatch, and certified recycling compliance.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Active Producers</div>
          <div className="text-3xl font-black text-white mt-1">
            {summary?.citizens_count || 148}
          </div>
          <div className="text-[11px] text-cyan-400 font-bold mt-1">+12 this week</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Active Smart Bins</div>
          <div className="text-3xl font-black text-white mt-1">
            {bins.length || 5} <span className="text-sm font-bold text-indigo-400">NODES</span>
          </div>
          <div className="text-[11px] text-amber-400 font-bold mt-1">
            {bins.filter((b) => b.current_fill_percent >= 75).length} High Priority
          </div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">Tracked Passports</div>
          <div className="text-3xl font-black text-white mt-1">
            {batches.length || 2} <span className="text-sm font-bold text-purple-400">BATCHES</span>
          </div>
          <div className="text-[11px] text-purple-300 font-bold mt-1">100% QR Traceable</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono text-slate-400 font-bold uppercase">CO₂ Abated</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">
            {impact?.co2_saved_kg || 2202.9} <span className="text-sm font-bold text-white">KG</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">~101.5 Trees Equivalent</div>
        </div>
      </div>

      {/* Critical Bins Alert Table */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Real-time Smart Dustbin Priority Alarms
          </h2>
          <span className="text-xs font-mono text-slate-400">Automatic threshold telemetry via MQTT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-indigo-300 font-bold uppercase text-[10px]">
                <th className="pb-3">Bin Code</th>
                <th className="pb-3">Name / Location</th>
                <th className="pb-3">Fill Level</th>
                <th className="pb-3">Weight</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {bins.map((b) => (
                <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-bold text-cyan-300">{b.bin_code}</td>
                  <td className="py-3 font-medium text-white">{b.name}</td>
                  <td className="py-3 font-black text-white">{Math.round(b.current_fill_percent)}%</td>
                  <td className="py-3 text-slate-400">{b.current_weight_kg} kg</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.current_fill_percent >= 80
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : b.current_fill_percent >= 60
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="px-3 py-1.5 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple">
                      Dispatch Truck
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
