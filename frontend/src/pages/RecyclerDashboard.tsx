import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { WasteBatch, BatchStatus } from '../types';
import { Factory, CheckCircle2, AlertOctagon, ArrowRight, Scale, ShieldCheck, Activity } from 'lucide-react';

export const RecyclerDashboard: React.FC = () => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const fetchBatches = () => {
    api.getBatches().then((data) => {
      setBatches(data);
      if (data.length > 0 && !selectedBatch) setSelectedBatch(data[0]);
    }).catch(() => {});
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const stages: { status: BatchStatus; label: string; desc: string }[] = [
    { status: 'RECEIVED', label: '1. Received & Weighed', desc: 'Material weighed at facility weighbridge' },
    { status: 'SORTED', label: '2. Optical Sorting', desc: 'Contaminant removal & polymer separation' },
    { status: 'PROCESSING', label: '3. Hot Wash & Shredding', desc: 'Cleaned and shredded into 8mm flakes' },
    { status: 'PROCESSED', label: '4. Pellet Extrusion', desc: 'Extruded into certified Grade-A rPET pellets' },
    { status: 'RECYCLED', label: '5. Circular Complete', desc: 'Dispatched to packaging manufacturer' },
  ];

  const handleStageTransition = async (nextStatus: BatchStatus) => {
    if (!selectedBatch) return;
    setIsUpdating(true);
    try {
      await api.updateBatchStatus(selectedBatch.id, {
        status: nextStatus,
        notes: `Recycling stage advanced to ${nextStatus} at EcoPolymer Facility.`,
        location: 'EcoPolymer Processing Plant Bay 3',
        recorded_weight_kg: selectedBatch.initial_weight_kg * 0.95
      });
      fetchBatches();
      setSelectedBatch((prev) => prev ? { ...prev, status: nextStatus } : null);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
            <Factory className="h-3.5 w-3.5 text-cyan-300" /> MATERIAL RECOVERY FACILITY
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">
            MRF Recycling Operations & Mass Balance
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Certified recycling facility workflow: Incoming verification, 5-stage transformation, and mass balance reconciliation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-900 text-indigo-300 text-xs font-mono font-bold border border-white/[0.08]">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> ISO 14001 CPCB MRF #ECO-REC-09
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incoming Batches List */}
        <div className="glass-panel p-6">
          <h2 className="text-base font-bold text-white mb-3">Incoming Material Batches</h2>
          <div className="space-y-3">
            {batches.map((b) => (
              <div
                key={b.id}
                onClick={() => setSelectedBatch(b)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedBatch?.id === b.id
                    ? 'border-indigo-500 bg-indigo-950/40 shadow-glow-purple text-white'
                    : 'border-white/[0.06] bg-dark-900/60 hover:bg-dark-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-indigo-300 font-mono">{b.batch_code}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    {b.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex justify-between">
                  <span>{b.plastic_type}</span>
                  <span className="font-bold text-white">{b.initial_weight_kg} kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5-Stage Processing Workflow */}
        <div className="lg:col-span-2 glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                  Active Batch Processing
                </span>
                <h3 className="text-lg font-black text-white font-mono">
                  {selectedBatch?.batch_code || 'Select Batch'}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-500 font-semibold block">Input Certified Weight</span>
                <span className="text-xl font-black text-cyan-300">{selectedBatch?.initial_weight_kg || 0} kg</span>
              </div>
            </div>

            {/* Stages Stepper */}
            <div className="space-y-3 mt-4">
              {stages.map((st) => {
                const isCurrent = selectedBatch?.status === st.status;
                return (
                  <div
                    key={st.status}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'border-indigo-500/50 bg-indigo-950/40 shadow-glow-purple'
                        : 'border-white/[0.06] bg-dark-900/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{st.label}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500 text-white font-bold">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{st.desc}</div>
                    </div>

                    <button
                      onClick={() => handleStageTransition(st.status)}
                      disabled={isUpdating || isCurrent}
                      className="px-4 py-2 rounded-xl btn-primary-gradient text-xs font-bold disabled:opacity-30"
                    >
                      Advance Stage
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Mass balance: 95% net polymer yield • 5% inert reject</span>
            <span className="font-bold text-indigo-400">CPCB EPR Form IV Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
};
