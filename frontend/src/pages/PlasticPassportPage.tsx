import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { WasteBatch } from '../types';
import { QrCode, ArrowRight, ShieldCheck, CheckCircle2, Clock, Filter, Eye, Printer, Download } from 'lucide-react';

export const PlasticPassportPage: React.FC = () => {
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<WasteBatch | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  useEffect(() => {
    api.getBatches().then((data) => {
      setBatches(data);
      if (data.length > 0) setSelectedBatch(data[0]);
    }).catch(() => {});
  }, []);

  const filtered = filterType === 'ALL' ? batches : batches.filter((b) => b.plastic_type.includes(filterType));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <QrCode className="h-3.5 w-3.5 text-cyan-300" /> CRYPTOGRAPHIC PASSPORT LEDGER
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Digital Plastic Passport Ledger
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Each collected plastic batch carries an immutable auditable identity from collection through shredding and recycled pellets.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 text-xs font-mono font-semibold">
        {['ALL', 'PET', 'HDPE', 'LDPE', 'PP'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === t
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-500 shadow-glow-blue'
                : 'bg-dark-900/60 text-slate-400 border-white/[0.08] hover:text-white'
            }`}
          >
            {t === 'ALL' ? 'All Polymers' : t}
          </button>
        ))}
      </div>

      {/* Batches Table & Passport Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Table */}
        <div className="lg:col-span-2 glass-panel p-6 overflow-x-auto font-mono">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-indigo-300 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3">Batch Code</th>
                <th className="pb-3">Plastic Type</th>
                <th className="pb-3">Weight (kg)</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBatch(b)}
                  className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${
                    selectedBatch?.id === b.id ? 'bg-indigo-950/40 text-cyan-300' : ''
                  }`}
                >
                  <td className="py-3 font-bold text-indigo-300">{b.batch_code}</td>
                  <td className="py-3 font-medium text-slate-300">{b.plastic_type}</td>
                  <td className="py-3 font-semibold text-white">{b.initial_weight_kg} kg</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-cyan-400 font-bold text-xs hover:underline flex items-center gap-1 ml-auto">
                      <Eye className="h-3.5 w-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Passport Card View */}
        <div className="glass-panel p-6 flex flex-col justify-between font-mono">
          <div>
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3">
              Official QR Passport Certificate
            </div>

            {selectedBatch ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-dark-950/80 rounded-2xl border border-white/[0.08]">
                  <img
                    src={`http://localhost:8001${selectedBatch.qr_code_url}`}
                    alt="Batch Passport QR"
                    className="w-36 h-36 border-2 border-indigo-500/40 rounded-xl bg-white p-2 shadow-glow-purple"
                  />
                  <span className="text-[11px] text-indigo-300 mt-2 font-bold">
                    {selectedBatch.batch_code}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-slate-500">Polymer:</span>
                    <span className="font-bold text-slate-200">{selectedBatch.plastic_type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-slate-500">Certified Mass:</span>
                    <span className="font-bold text-cyan-300">{selectedBatch.initial_weight_kg} kg</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                    <span className="text-slate-500">Current Phase:</span>
                    <span className="font-bold text-emerald-400">{selectedBatch.status}</span>
                  </div>
                </div>

                <Link
                  to={`/track/${selectedBatch.batch_code}`}
                  className="w-full py-2.5 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-1.5"
                >
                  Open Public Ledger <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-10 text-xs">Select a batch to inspect its QR Passport</div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.08] text-[10px] text-slate-500 text-center">
            Blockchain-compatible cryptographic hash on each transition.
          </div>
        </div>
      </div>
    </div>
  );
};
