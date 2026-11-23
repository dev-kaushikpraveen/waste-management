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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
          <QrCode className="h-3.5 w-3.5 text-[#7CB342]" /> Circular Digital Passport
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
          Digital Plastic Passport Ledger
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Each collected plastic batch carries an immutable auditable identity from collection through shredding and recycled pellets.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 text-xs font-semibold">
        {['ALL', 'PET', 'HDPE', 'LDPE', 'PP'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              filterType === t
                ? 'bg-[#005A36] text-white border-[#005A36] shadow-soft'
                : 'bg-white text-slate-600 border-[#DDE7E1] hover:bg-[#F4F7F5]'
            }`}
          >
            {t === 'ALL' ? 'All Polymers' : t}
          </button>
        ))}
      </div>

      {/* Batches Table & Passport Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches Table */}
        <div className="lg:col-span-2 saahas-card p-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#DDE7E1] bg-[#F4F7F5] text-[#005A36] font-bold uppercase tracking-wider text-[11px]">
                <th className="p-3 rounded-l-xl">Batch Code</th>
                <th className="p-3">Plastic Type</th>
                <th className="p-3">Weight (kg)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right rounded-r-xl">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAEFEA]">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBatch(b)}
                  className={`hover:bg-[#F9FAF9] cursor-pointer transition-colors ${
                    selectedBatch?.id === b.id ? 'bg-[#E8F5E9]/50' : ''
                  }`}
                >
                  <td className="p-3 font-mono font-bold text-[#005A36]">{b.batch_code}</td>
                  <td className="p-3 font-medium text-slate-800">{b.plastic_type}</td>
                  <td className="p-3 font-semibold text-slate-900">{b.initial_weight_kg} kg</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9]">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-[#005A36] font-bold text-xs hover:underline flex items-center gap-1 ml-auto">
                      <Eye className="h-3.5 w-3.5" /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Passport Card View */}
        <div className="saahas-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#005A36] uppercase tracking-wider mb-3">
              Official QR Passport Certificate
            </div>

            {selectedBatch ? (
              <div className="space-y-4">
                <div className="flex flex-col items-center p-4 bg-[#F8FAF9] rounded-2xl border border-[#DDE7E1]">
                  <img
                    src={selectedBatch.qr_code_url || undefined}
                    alt="Batch Passport QR"
                    className="w-36 h-36 border-2 border-white shadow-soft rounded-xl bg-white p-2"
                  />
                  <span className="text-[11px] font-mono text-slate-500 mt-2 font-bold">
                    {selectedBatch.batch_code}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-[#EAEFEA]">
                    <span className="text-slate-400">Polymer:</span>
                    <span className="font-bold text-slate-800">{selectedBatch.plastic_type}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAEFEA]">
                    <span className="text-slate-400">Certified Weight:</span>
                    <span className="font-bold text-slate-800">{selectedBatch.initial_weight_kg} kg</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-[#EAEFEA]">
                    <span className="text-slate-400">Current Phase:</span>
                    <span className="font-bold text-[#005A36]">{selectedBatch.status}</span>
                  </div>
                </div>

                <Link
                  to={`/track/${selectedBatch.batch_code}`}
                  className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all flex items-center justify-center gap-1.5"
                >
                  Open Public Verification Ledger <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-10">Select a batch to inspect its QR Passport</div>
            )}
          </div>

          <div className="pt-4 border-t border-[#EAEFEA] text-[11px] text-slate-400 text-center">
            Blockchain-compatible cryptographic hash on each batch status transition.
          </div>
        </div>
      </div>
    </div>
  );
};
