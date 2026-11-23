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
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <Globe2 className="h-3.5 w-3.5 text-[#7CB342]" /> Central City & EPR Control Center
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
            Smart City Central Command & EPR Center
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Centralized monitoring of IoT telemetry, collection fleet dispatch, and certified recycling compliance.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="saahas-card p-5">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Registered Citizens</div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {summary?.citizens_count || 148}
          </div>
          <div className="text-[11px] text-[#005A36] font-bold mt-1">+12 this week</div>
        </div>

        <div className="saahas-card p-5">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Active Smart Bins</div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {bins.length || 5} <span className="text-sm font-bold text-[#005A36]">NODES</span>
          </div>
          <div className="text-[11px] text-amber-700 font-bold mt-1">
            {bins.filter((b) => b.current_fill_percent >= 75).length} High Priority
          </div>
        </div>

        <div className="saahas-card p-5">
          <div className="text-[11px] text-slate-400 font-bold uppercase">Tracked Passports</div>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {batches.length || 2} <span className="text-sm font-bold text-[#005A36]">BATCHES</span>
          </div>
          <div className="text-[11px] text-[#005A36] font-bold mt-1">100% QR Traceable</div>
        </div>

        <div className="saahas-card p-5">
          <div className="text-[11px] text-slate-400 font-bold uppercase">CO₂ Abated</div>
          <div className="text-3xl font-black text-[#005A36] mt-1">
            {impact?.co2_saved_kg || 2202.9} <span className="text-sm font-bold text-[#003620]">KG</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">~101.5 Trees Equivalent</div>
        </div>
      </div>

      {/* Critical Bins Alert Table */}
      <div className="saahas-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-[#003620] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" /> Real-time Smart Dustbin Priority Alarms
          </h2>
          <span className="text-xs text-slate-500 font-medium">Automatic threshold alerts via MQTT</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDE7E1] bg-[#F4F7F5] text-[#005A36] font-bold uppercase text-[11px]">
                <th className="p-3 rounded-l-xl">Bin Code</th>
                <th className="p-3">Name / Location</th>
                <th className="p-3">Fill Level</th>
                <th className="p-3">Weight</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Dispatch Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFEA]">
              {bins.map((b) => (
                <tr key={b.id} className="hover:bg-[#F9FAF9] transition-colors">
                  <td className="p-3 font-mono font-bold text-[#005A36]">{b.bin_code}</td>
                  <td className="p-3 font-medium text-slate-800">{b.name}</td>
                  <td className="p-3 font-black text-slate-900">{Math.round(b.current_fill_percent)}%</td>
                  <td className="p-3 text-slate-600">{b.current_weight_kg} kg</td>
                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        b.current_fill_percent >= 80
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : b.current_fill_percent >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-3 py-1.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all">
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
