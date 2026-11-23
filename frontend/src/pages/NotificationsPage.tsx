import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Truck, Award, Radio } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const alerts = [
    {
      title: 'Green Points Credited',
      desc: '+20 Green Points awarded for 1.2kg verified PET plastic deposit.',
      time: '15 mins ago',
      type: 'reward',
      read: false
    },
    {
      title: 'Smart Bin Overflow Alert (Sector 3)',
      desc: 'Transit Zone Recycler BIN-DEL-03 reached 94% fill capacity. Collector assigned.',
      time: '1 hour ago',
      type: 'alert',
      read: false
    },
    {
      title: 'Pickup Scheduled Confirmed',
      desc: 'Electric truck DL-01-EV-4421 scheduled for Sector 4 Commercial Hub collection (9 AM - 12 PM).',
      time: '3 hours ago',
      type: 'truck',
      read: true
    },
    {
      title: 'Plastic Passport Processing Completed',
      desc: 'Batch ECO-PET-2026-000001 certified: 118.5kg Grade-A rPET pellets produced.',
      time: 'Yesterday',
      type: 'success',
      read: true
    }
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <Radio className="h-3.5 w-3.5 text-cyan-300 animate-pulse" /> REAL-TIME EVENT STREAM
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Notifications & Operational Alerts
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Real-time updates regarding IoT smart bins, pickup collections, reward credits, and recycling milestones.
        </p>
      </div>

      <div className="glass-panel p-6 space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
              !a.read ? 'bg-indigo-950/30 border-indigo-500/30' : 'bg-dark-900/60 border-white/[0.06]'
            }`}
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                a.type === 'reward'
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  : a.type === 'alert'
                  ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                  : a.type === 'truck'
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {a.type === 'reward' && <Award className="h-5 w-5" />}
              {a.type === 'alert' && <AlertTriangle className="h-5 w-5" />}
              {a.type === 'truck' && <Truck className="h-5 w-5" />}
              {a.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{a.title}</span>
                <span className="text-[10px] font-mono text-slate-500">{a.time}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
