import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Recycle, ShieldCheck, CheckCircle2, Clock, MapPin, Scale, ExternalLink, ArrowLeft, Github } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center bg-cosmic-mesh text-xs font-mono text-cyan-400">
        Verifying cryptographic digital passport certificate...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cosmic-mesh p-4 text-center font-mono">
        <div className="text-red-400 text-sm font-bold mb-2">Invalid or Unregistered Batch Code</div>
        <Link to="/" className="text-xs text-indigo-400 font-bold hover:underline">
          Return to EcoTrace 360
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cosmic-mesh py-12 px-4 flex justify-center text-slate-100 font-sans selection:bg-indigo-500/30">
      <div className="max-w-2xl w-full glass-panel-glow p-8 space-y-6">
        {/* Certificate Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-glow-purple">
              <Recycle className="h-7 w-7 text-cyan-200" />
            </div>
            <div>
              <div className="text-xl font-black text-white leading-tight">ECOTRACE 360</div>
              <div className="text-xs text-slate-400 font-mono">Public Circular Traceability Ledger</div>
            </div>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30 shadow-glow-cyan">
            <ShieldCheck className="h-4 w-4" /> CPCB VERIFIED
          </span>
        </div>

        {/* Batch Overview Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border border-indigo-500/30 flex justify-between items-center shadow-glass">
          <div>
            <div className="text-[10px] font-mono uppercase font-bold text-indigo-400">Digital Passport Code</div>
            <div className="text-2xl font-black text-white font-mono">{data.batch_code}</div>
            <div className="text-xs text-slate-400 mt-1">
              Polymer: <span className="font-bold text-cyan-300">{data.plastic_type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase font-bold text-indigo-400">Certified Weight</div>
            <div className="text-3xl font-black text-emerald-400">{data.initial_weight_kg} kg</div>
          </div>
        </div>

        {/* Immutable Audit Trail */}
        <div>
          <h2 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>IMMUTABLE CHAIN-OF-CUSTODY AUDIT TRAIL</span>
            <span className="text-[11px] text-slate-500 font-normal">{data.timeline.length} VERIFIED EVENTS</span>
          </h2>

          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-500/30">
            {data.timeline.map((event: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[10px] shadow-glow-blue">
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <div className="bg-dark-900/80 p-4 rounded-xl border border-white/[0.08] text-xs">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span className="text-cyan-300">{event.status}</span>
                    <span className="text-[10px] font-mono text-slate-500 font-normal">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-slate-300 mt-1 text-xs leading-relaxed">{event.notes}</div>
                  <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-indigo-400" /> {event.location}
                    </span>
                    {event.recorded_weight_kg && (
                      <span className="flex items-center gap-1 text-white font-bold">
                        <Scale className="h-3.5 w-3.5 text-emerald-400" /> {event.recorded_weight_kg} kg
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
          <Link to="/" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold hover:underline flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Platform
          </Link>
          <span className="text-[10px] font-mono text-slate-500">
            ISO 14021 Environmental Claims Standard
          </span>
        </div>
      </div>
    </div>
  );
};
