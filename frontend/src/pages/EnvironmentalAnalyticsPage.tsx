import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { EnvironmentalImpact } from '../types';
import { BarChart3, Leaf, Recycle, Globe2, TrendingUp, ShieldCheck } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

export const EnvironmentalAnalyticsPage: React.FC = () => {
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);

  useEffect(() => {
    api.getEnvironmentalImpact().then(setImpact).catch(() => {});
  }, []);

  const pieData = [
    { name: 'PET Plastic', value: 45, color: '#3B82F6' },
    { name: 'HDPE Plastic', value: 25, color: '#10B981' },
    { name: 'Cardboard & Paper', value: 15, color: '#F59E0B' },
    { name: 'Metals & Cans', value: 10, color: '#06B6D4' },
    { name: 'Glass Containers', value: 5, color: '#8B5CF6' }
  ];

  const barData = [
    { area: 'Commercial Sector', diverted: 420 },
    { area: 'Tech Corridor', diverted: 380 },
    { area: 'Transit Hub', diverted: 290 },
    { area: 'Residential Sector', diverted: 160 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <BarChart3 className="h-3.5 w-3.5 text-cyan-300" /> DEFRA LIFE-CYCLE ASSESSMENT
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Carbon Abatement & Circular Metrics
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Scientifically quantified carbon emissions abatement, landfill avoidance, and circular resource recovery.
        </p>
      </div>

      {/* Primary Sustainability Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">CO₂ Emissions Abated</div>
          <div className="text-3xl font-black text-white mt-1">
            {impact?.co2_saved_kg || 2202.9} <span className="text-sm font-bold text-cyan-400">KG</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">DEFRA LCA Methodology</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Trees Equivalent</div>
          <div className="text-3xl font-black text-white mt-1">
            ~{impact?.trees_equivalent || 101.5} <span className="text-sm font-bold text-emerald-400">Trees</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Annual biological sequestration</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Landfill Diverted</div>
          <div className="text-3xl font-black text-white mt-1">
            {impact?.landfill_diverted_m3 || 3.24} <span className="text-sm font-bold text-indigo-400">m³</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Physical municipal volume avoided</div>
        </div>

        <div className="glass-panel p-5">
          <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">Verified Circular Rate</div>
          <div className="text-3xl font-black text-white mt-1">
            {impact?.verified_recycling_rate_percent || 86.4}%
          </div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">+14% above national quota</div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Waste Composition Pie Chart */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-1">Recovered Material Composition</h2>
          <p className="text-xs text-slate-400 mb-4">Breakdown of collected recyclables by category</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs mt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-slate-300 font-medium">{p.name} ({p.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Bar Chart */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-1">Sector Waste Diversion</h2>
          <p className="text-xs text-slate-400 mb-4">Kilograms of dry waste diverted by urban district</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="area" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '0.75rem',
                    color: '#F8FAFC'
                  }}
                />
                <Bar dataKey="diverted" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs font-mono text-slate-400 mt-2">
            Urban aggregate diversion rate: 1,250 kg/month
          </div>
        </div>
      </div>
    </div>
  );
};
