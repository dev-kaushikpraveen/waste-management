import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { Camera, Upload, CheckCircle2, Sparkles, Award, Cpu, ShieldCheck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIWasteScanner: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setClassificationResult(null);
        setIsSubmitted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const runClassification = async () => {
    setIsScanning(true);
    try {
      const result = await api.classifyWaste(imagePreview || undefined);
      setClassificationResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDepositWaste = () => {
    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 mb-2">
          <Cpu className="h-3.5 w-3.5 text-cyan-300" /> YOLOv8 NEURAL CLASSIFIER
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white">
          AI Computer Vision Polymer Scanner
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Real-time object detection identifying PET, HDPE, Cardboard, Glass & Metal with automated CPCB Extended Producer Responsibility guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload & Preview Area */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>1. Image Ingestion HUD</span>
              <span className="text-[11px] text-slate-500 font-normal">Supports JPEG, PNG, WebP</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-white/[0.12] hover:border-indigo-500 transition-colors flex flex-col items-center justify-center cursor-pointer bg-dark-950/80 overflow-hidden group"
            >
              {imagePreview ? (
                <div className="relative w-full h-full">
                  <img src={imagePreview} alt="Waste to scan" className="w-full h-full object-cover" />
                  {/* Bounding box overlay if classified */}
                  {classificationResult?.bounding_boxes?.map((b: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: `${b.x * 100}%`,
                        top: `${b.y * 100}%`,
                        width: `${b.width * 100}%`,
                        height: `${b.height * 100}%`
                      }}
                      className="border-2 border-cyan-400 bg-cyan-500/20 rounded pointer-events-none shadow-glow-cyan"
                    >
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded absolute -top-5 left-0 whitespace-nowrap shadow-md">
                        {b.label} ({Math.round(b.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-400 p-6 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-white">Click to upload or capture photo</span>
                  <span className="text-xs text-slate-500 mt-1">High-resolution frame feeds give optimal polymer accuracy</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl btn-secondary-glass text-xs flex items-center justify-center gap-1.5"
              >
                <Upload className="h-4 w-4" /> Choose File
              </button>
              <button
                type="button"
                onClick={runClassification}
                disabled={isScanning}
                className="flex-1 py-2 px-3 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 text-cyan-200 ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Analyzing Features...' : 'Run Neural Vision'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-slate-500 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Trained on 45,000+ annotated urban & industrial recyclable images</span>
          </div>
        </div>

        {/* AI Inference & Segregation Result */}
        <div className="glass-panel p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider mb-3">
              2. Classification Output & Prescription
            </div>

            {classificationResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-dark-900 border border-indigo-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-indigo-300">Detected Polymer / Category</span>
                      <h3 className="text-xl font-black text-white">{classificationResult.detected_material}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Confidence</span>
                      <div className="text-xl font-black text-cyan-400">
                        {Math.round(classificationResult.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-slate-400">Prescribed Dustbin:</span>
                    <span className="font-bold text-cyan-300">{classificationResult.recommended_bin}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-slate-400">Recyclability Rating:</span>
                    <span className="font-bold text-emerald-400">{classificationResult.recyclability_grade}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-slate-400">Green Incentive:</span>
                    <span className="font-black text-purple-300">+{classificationResult.reward_points} Points</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-slate-400">CPCB Guidance:</span>
                    <span className="font-medium text-slate-300 text-right">{classificationResult.disposal_instructions}</span>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-1" />
                    <div className="text-sm font-bold text-white">Deposit Verified!</div>
                    <div className="text-xs text-slate-400 mt-1">
                      +{classificationResult.reward_points} Green Points credited to your wallet.
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDepositWaste}
                    className="w-full py-3 rounded-xl btn-primary-gradient text-xs font-bold shadow-glow-purple flex items-center justify-center gap-2"
                  >
                    <Award className="h-4 w-4 text-cyan-200" /> Confirm Deposit & Claim Points
                  </button>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-500 p-6 bg-dark-950/60 rounded-2xl border border-dashed border-white/[0.08]">
                <Cpu className="h-10 w-10 text-indigo-500/30 mb-2" />
                <span className="text-sm font-bold text-slate-300">Awaiting Waste Image</span>
                <span className="text-xs text-slate-500 mt-1 max-w-xs">
                  Upload an image on the left and run neural classification to inspect polymer identification and recycling guidance.
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 text-[11px] font-mono text-slate-500 text-center">
            Complies with India PWM Rules 2016 (Amended 2022).
          </div>
        </div>
      </div>
    </div>
  );
};
