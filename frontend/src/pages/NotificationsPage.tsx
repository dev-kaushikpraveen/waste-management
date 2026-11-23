import React from 'react';
import { Bell, CheckCircle2, AlertTriangle, Truck, Award } from 'lucide-react';

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
      desc: 'Sports Complex Recycler BIN-DEL-03 reached 94% fill capacity. Collector assigned.',
      time: '1 hour ago',
      type: 'alert',
      read: false
    },
    {
      title: 'Pickup Scheduled Confirmed',
      desc: 'Electric truck DL-01-EV-4421 scheduled for Karakoram Hostel collection (9 AM - 12 PM).',
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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <Bell className="h-3.5 w-3.5 text-[#7CB342]" /> Real-time Feeds
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Notifications & Operational Alerts
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Real-time updates regarding IoT smart bins, pickup collections, reward credits, and recycling milestones.
        </p>
      </div>

      <div className="saahas-card p-6 space-y-3">
        {alerts.map((a, i) => (
          <div
            key={i}
            className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
              !a.read ? 'bg-[#E8F5E9]/40 border-[#C8E6C9]' : 'bg-[#F8FAF9] border-[#E0EAE3]'
            }`}
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                a.type === 'reward'
                  ? 'bg-amber-100 text-amber-800'
                  : a.type === 'alert'
                  ? 'bg-red-100 text-red-800'
                  : a.type === 'truck'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-[#E8F5E9] text-[#005A36]'
              }`}
            >
              {a.type === 'reward' && <Award className="h-5 w-5" />}
              {a.type === 'alert' && <AlertTriangle className="h-5 w-5" />}
              {a.type === 'truck' && <Truck className="h-5 w-5" />}
              {a.type === 'success' && <CheckCircle2 className="h-5 w-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{a.title}</span>
                <span className="text-[10px] text-slate-400 font-medium">{a.time}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
