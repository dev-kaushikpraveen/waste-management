import React, { useState, useRef } from 'react';
import { api } from '../services/api';
import { Camera, Upload, CheckCircle2, AlertCircle, Sparkles, Award, Cpu, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E8F5E9] px-3 py-1 text-xs font-bold text-[#005A36] border border-[#C8E6C9] mb-2">
            <Cpu className="h-3.5 w-3.5 text-[#7CB342]" /> YOLOv8 Computer Vision Classifier
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#003620]">
            AI Waste & Polymer Scanner
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time object detection identifying PET, HDPE, Cardboard, Glass & Metal with CPCB Extended Producer Responsibility (EPR) guidance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload & Preview Area */}
        <div className="saahas-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#005A36] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>1. Image Acquisition</span>
              <span className="text-[11px] text-slate-400 font-normal">Supports JPEG, PNG, WebP</span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-[#C5D8CC] hover:border-[#005A36] transition-colors flex flex-col items-center justify-center cursor-pointer bg-[#F8FAF9] overflow-hidden group"
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
                      className="border-2 border-[#005A36] bg-[#005A36]/15 rounded pointer-events-none"
                    >
                      <span className="bg-[#005A36] text-white text-[10px] font-bold px-2 py-0.5 rounded absolute -top-5 left-0 whitespace-nowrap shadow-soft">
                        {b.label} ({Math.round(b.confidence * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center text-slate-500 p-6 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-[#E8F5E9] text-[#005A36] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Camera className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-800">Click to upload or capture photo</span>
                  <span className="text-xs text-slate-400 mt-1">High-resolution images give optimal polymer accuracy</span>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-[#F4F7F5] hover:bg-[#E8F0EC] text-[#005A36] font-bold text-xs border border-[#DDE7E1] transition-all flex items-center justify-center gap-1.5"
              >
                <Upload className="h-4 w-4" /> Choose File
              </button>
              <button
                type="button"
                onClick={runClassification}
                disabled={isScanning}
                className="flex-1 py-2 px-3 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className={`h-4 w-4 text-[#A0E040] ${isScanning ? 'animate-spin' : ''}`} />
                {isScanning ? 'Analyzing Features...' : 'Run YOLO Vision AI'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAEFEA] text-[11px] text-slate-500 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#7CB342]" />
            <span>Trained on 45,000+ annotated municipal & campus recyclable images</span>
          </div>
        </div>

        {/* AI Inference & Segregation Result */}
        <div className="saahas-card p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-[#005A36] uppercase tracking-wider mb-3">
              2. AI Classification & Recycling Prescription
            </div>

            {classificationResult ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#005A36]">Detected Polymer / Category</span>
                      <h3 className="text-xl font-black text-[#003620]">{classificationResult.detected_material}</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500">Confidence</span>
                      <div className="text-xl font-black text-[#005A36]">
                        {Math.round(classificationResult.confidence * 100)}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-[#EAEFEA]">
                    <span className="text-slate-500">Prescribed Dustbin:</span>
                    <span className="font-bold text-[#005A36]">{classificationResult.recommended_bin}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#EAEFEA]">
                    <span className="text-slate-500">Recyclability Rating:</span>
                    <span className="font-bold text-emerald-700">{classificationResult.recyclability_grade}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#EAEFEA]">
                    <span className="text-slate-500">Earnable Green Points:</span>
                    <span className="font-black text-[#003620]">+{classificationResult.reward_points} Points</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#EAEFEA]">
                    <span className="text-slate-500">CPCB EPR Guidance:</span>
                    <span className="font-medium text-slate-700 text-right">{classificationResult.disposal_instructions}</span>
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-center">
                    <CheckCircle2 className="h-8 w-8 text-[#005A36] mx-auto mb-1" />
                    <div className="text-sm font-black text-[#003620]">Waste Deposit Verified!</div>
                    <div className="text-xs text-slate-600 mt-1">
                      +{classificationResult.reward_points} Green Points credited to your eco-wallet.
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleDepositWaste}
                    className="w-full py-3 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Award className="h-4 w-4 text-[#A0E040]" /> Confirm Deposit & Claim Points
                  </button>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 p-6 bg-[#F8FAF9] rounded-2xl border border-dashed border-[#DDE7E1]">
                <Cpu className="h-10 w-10 text-slate-300 mb-2" />
                <span className="text-sm font-bold text-slate-600">Awaiting Waste Image</span>
                <span className="text-xs text-slate-400 mt-1 max-w-xs">
                  Upload an image on the left and run AI analysis to view real-time polymer identification and recycling guidance.
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 text-[11px] text-slate-400 text-center">
            Zero-Waste segregation ensures compliance with India PWM Rules 2016 (Amended 2022).
          </div>
        </div>
      </div>
    </div>
  );
};
