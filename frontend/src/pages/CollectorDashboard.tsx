import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Truck, Navigation, CheckCircle2, MapPin, Scale, ArrowRight, Radio, Compass, ShieldCheck } from 'lucide-react';

export const CollectorDashboard: React.FC = () => {
  const [routePlan, setRoutePlan] = useState<any>(null);
  const [completedStops, setCompletedStops] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getOptimizedRoute()
      .then(setRoutePlan)
      .finally(() => setLoading(false));
  }, []);

  const markCollected = (stopId: number) => {
    setCompletedStops((prev) => [...prev, stopId]);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <Truck className="h-3.5 w-3.5 text-[#7CB342]" /> Fleet Operations Dispatch
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
            Collection Operations & TSP Fleet Routing
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Distance-based collection route calculated by TSP algorithm prioritizing overflowing smart bins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-[#005A36] text-xs font-bold border border-[#DDE7E1] shadow-soft">
            <ShieldCheck className="h-4 w-4 text-[#7CB342]" /> DL-01-EV-4421 Active
          </span>
        </div>
      </div>

      {/* Route Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="saahas-card p-5">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Total Route Distance</span>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {routePlan?.total_distance_km || 4.2} <span className="text-sm font-bold text-[#005A36]">KM</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Optimized via TSP heuristic</span>
        </div>

        <div className="saahas-card p-5">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Estimated Trip Duration</span>
          <div className="text-3xl font-black text-[#003620] mt-1">
            {routePlan?.estimated_duration_mins || 35} <span className="text-sm font-bold text-[#005A36]">MINS</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Electric vehicle speed profile</span>
        </div>

        <div className="saahas-card p-5">
          <span className="text-[11px] text-slate-400 uppercase font-bold">Stops Serviced</span>
          <div className="text-3xl font-black text-[#005A36] mt-1">
            {completedStops.length} / {routePlan?.stops_count || 5}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">
            {completedStops.length === (routePlan?.stops_count || 5) ? 'All stops completed!' : 'Stops in queue'}
          </span>
        </div>
      </div>

      {/* Stop Sequence List */}
      <div className="saahas-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-[#003620] flex items-center gap-2">
            <Compass className="h-5 w-5 text-[#005A36]" /> Optimal Collection Sequence
          </h2>
          <span className="text-xs text-slate-500 font-medium">Sorted by distance & urgency</span>
        </div>

        <div className="space-y-3">
          {routePlan?.ordered_stops?.map((stop: any, idx: number) => {
            const isDone = completedStops.includes(stop.id);
            return (
              <div
                key={stop.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-[#F9FAF9] border-[#E0EAE3] opacity-60'
                    : 'bg-white border-[#DDE7E1] shadow-soft hover:border-[#005A36]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                      isDone
                        ? 'bg-[#005A36] text-white'
                        : 'bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                  </div>
                  <div>
                    <div className="text-xs md:text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span>{stop.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">({stop.bin_code})</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-[#005A36]" /> {stop.address}
                      <span>• Leg: {stop.leg_distance_km} km</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right text-xs">
                    <span
                      className={`font-black ${
                        stop.current_fill_percent >= 80 ? 'text-red-600' : 'text-[#005A36]'
                      }`}
                    >
                      {stop.current_fill_percent}% Fill
                    </span>
                    <div className="text-[11px] text-slate-400">{stop.current_weight_kg} kg weight</div>
                  </div>

                  {!isDone && (
                    <button
                      onClick={() => markCollected(stop.id)}
                      className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105"
                    >
                      Verify & Collect
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
