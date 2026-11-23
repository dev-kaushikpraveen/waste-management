import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Recycle, ShieldCheck, CheckCircle2, Clock, MapPin, Scale, ExternalLink, ArrowLeft } from 'lucide-react';

export const PublicTrackingPage: React.FC = () => {
  const { batchCode } = useParams<{ batchCode: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (batchCode) {
      api.trackBatch(batchCode)
        .then(setData)
        .catch(() => setError('Digital Plastic Passport record not found.'))
        .finally(() => setLoading(false));
    }
  }, [batchCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F7F5] text-xs font-sans text-[#005A36]">
        Verifying cryptographic digital passport certificate...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F7F5] p-4 text-center font-sans">
        <div className="text-red-600 text-sm font-bold mb-2">Invalid or Unregistered Batch Code</div>
        <Link to="/" className="text-xs text-[#005A36] font-bold hover:underline">
          Return to EcoTrace 360
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F5] py-12 px-4 flex justify-center text-slate-800 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-3xl border border-[#DDE7E1] shadow-card p-8 space-y-6">
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-[#EAEFEA] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-[#005A36] text-white flex items-center justify-center shadow-soft">
              <Recycle className="h-7 w-7 text-[#A0E040]" />
            </div>
            <div>
              <div className="text-xl font-black text-[#003620] leading-tight">ECOTRACE 360</div>
              <div className="text-xs text-slate-500 font-medium">Public Circular Traceability Ledger</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#005A36] bg-[#E8F5E9] px-3 py-1 rounded-full border border-[#C8E6C9]">
            <ShieldCheck className="h-4 w-4 text-[#7CB342]" /> CPCB VERIFIED
          </span>
        </div>

        {/* Batch Overview Card */}
        <div className="p-6 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] flex justify-between items-center">
          <div>
            <div className="text-[11px] uppercase font-bold text-[#005A36]">Digital Passport Code</div>
            <div className="text-2xl font-black text-[#003620] font-mono">{data.batch_code}</div>
            <div className="text-xs text-slate-600 mt-1">
              Polymer: <span className="font-bold text-[#003620]">{data.plastic_type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] uppercase font-bold text-[#005A36]">Certified Weight</div>
            <div className="text-3xl font-black text-[#003620]">{data.initial_weight_kg} kg</div>
          </div>
        </div>

        {/* Immutable Audit Trail */}
        <div>
          <h2 className="text-xs font-bold text-[#005A36] uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>IMMUTABLE CHAIN-OF-CUSTODY AUDIT TRAIL</span>
            <span className="text-[11px] text-slate-400 font-normal">{data.timeline.length} VERIFIED EVENTS</span>
          </h2>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#C8E6C9]">
            {data.timeline.map((event: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-[#005A36] text-white flex items-center justify-center text-[10px] shadow-soft">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div className="bg-[#F8FAF9] p-4 rounded-2xl border border-[#E0EAE3] text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="text-[#005A36] font-black">{event.status}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-600 mt-1 text-xs leading-relaxed">{event.notes}</div>
                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#005A36]" /> {event.location}
                    </span>
                    {event.recorded_weight_kg && (
                      <span className="flex items-center gap-1 text-slate-800 font-bold">
                        <Scale className="h-3.5 w-3.5 text-[#005A36]" /> {event.recorded_weight_kg} kg
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-[#EAEFEA] flex items-center justify-between">
          <Link to="/" className="text-xs text-[#005A36] font-bold hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </Link>
          <span className="text-[11px] text-slate-400">
            Complies with ISO 14021 Environmental Claims Standard
          </span>
        </div>
      </div>
    </div>
  );
};
