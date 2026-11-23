import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, EnvironmentalImpact, Bin, WasteBatch } from '../types';
import { api } from '../services/api';
import {
  Recycle,
  ScanLine,
  Trash2,
  QrCode,
  Award,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Cpu,
  Globe2,
  Users,
  Radio,
  FileCheck2,
  Factory,
  Truck,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Flame,
  Scale,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Trees,
  Check
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createBinIcon = (fill: number) => {
  const color = fill >= 80 ? '#D32F2F' : fill >= 60 ? '#F57C00' : '#005A36';
  return L.divIcon({
    className: 'custom-bin-pin',
    html: `
      <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px;">
        ${Math.round(fill)}%
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export const LandingPage: React.FC = () => {
  const { quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<EnvironmentalImpact | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_SCANNER' | 'IOT_MAP' | 'PASSPORT' | 'MRF' | 'EPR'>('OVERVIEW');
  const [isSimulating, setIsSimulating] = useState(false);

  // AI Scanner state inside landing page
  const [scannerResult, setScannerResult] = useState<any>(null);
  const [isClassifying, setIsClassifying] = useState(false);

  const fetchData = () => {
    api.getEnvironmentalImpact().then(setStats).catch(() => {});
    api.getBins().then(setBins).catch(() => {});
    api.getBatches().then(setBatches).catch(() => {});
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      await api.simulateIoTStep();
      fetchData();
    } finally {
      setIsSimulating(false);
    }
  };

  const handleTestAi = async () => {
    setIsClassifying(true);
    try {
      const res = await api.classifyWaste();
      setScannerResult(res);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#1A2E26]">
      {/* Top Banner Notice (Inspired by Saahas Zero Waste) */}
      <div className="bg-[#E8F5E9] border-b border-[#C8E6C9] px-4 py-2 text-xs font-semibold text-[#005A36] flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-bold text-white bg-[#005A36] px-2.5 py-0.5 rounded-full">
            <Radio className="h-3 w-3 text-[#A0E040] animate-pulse" /> INDIA EPR & PWM 2026 LIVE
          </span>
          <span className="hidden md:inline text-slate-600">
            National Plastic Generated: <strong className="text-[#005A36]">3.4M Tonnes/Year</strong>
          </span>
          <span className="hidden lg:inline text-slate-600">
            EcoTrace Diverted: <strong className="text-[#005A36]">{stats?.total_waste_collected_kg || 1459} kg</strong>
          </span>
          <span className="hidden md:inline text-slate-600">
            CO₂ Abated: <strong className="text-[#005A36]">{stats?.co2_saved_kg || 2202.9} kg</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-bold">CPCB VERIFIED COMPLIANCE:</span>
          <span className="text-[11px] font-bold text-white px-2.5 py-0.5 rounded-full bg-[#005A36] shadow-xs">
            86.4% ACHIEVED
          </span>
        </div>
      </div>

      {/* Hero Header Section (Saahas Zero Waste Style) */}
      <section className="bg-white border-b border-[#DDE7E1] px-6 py-14 lg:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F5E9] px-3.5 py-1.5 text-xs font-bold text-[#005A36] border border-[#C8E6C9]">
              <Leaf className="h-4 w-4 text-[#7CB342]" /> Circular Economy & Plastic Waste Management
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-[#003620] leading-tight">
              Plastic Waste <span className="text-[#005A36]">Management</span> & EPR Traceability
            </h1>

            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
              Majority of the plastic waste ends up in landfills, rivers, and oceans, causing long-term environmental degradation and threatening ecosystems. Nearly <strong>40% of plastic waste in India</strong> comes from single-use plastics, contributing significantly to pollution. 
              <strong> EcoTrace 360</strong> integrates Edge AI waste classification, IoT smart bins, and QR Digital Plastic Passports to achieve 100% circular traceability.
            </p>

            {/* Key National Statistics (Saahas Style Cards) */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                <div className="text-xl md:text-2xl font-black text-[#005A36]">3.4M</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">Tonnes Plastic / Year</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                <div className="text-xl md:text-2xl font-black text-[#D32F2F]">40%</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">Single-Use Packaging</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                <div className="text-xl md:text-2xl font-black text-[#005A36]">86.4%</div>
                <div className="text-[11px] text-slate-600 font-medium mt-0.5">Certified Recovery Rate</div>
              </div>
            </div>

            {/* Quick Demo Role Launcher */}
            <div className="pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Launch Portal by User Role:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { quickSwitchRole('CITIZEN'); navigate('/dashboard'); }}
                  className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all"
                >
                  Citizen Portal
                </button>
                <button
                  onClick={() => { quickSwitchRole('COLLECTOR'); navigate('/collector'); }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F4F7F5] text-slate-700 font-bold text-xs border border-[#DDE7E1] transition-all"
                >
                  Collector Fleet
                </button>
                <button
                  onClick={() => { quickSwitchRole('RECYCLER'); navigate('/recycler'); }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F4F7F5] text-slate-700 font-bold text-xs border border-[#DDE7E1] transition-all"
                >
                  MRF Recycler
                </button>
                <button
                  onClick={() => { quickSwitchRole('ADMIN'); navigate('/admin'); }}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#F4F7F5] text-slate-700 font-bold text-xs border border-[#DDE7E1] transition-all"
                >
                  Admin Center
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80"
                alt="Material Recovery Facility Sorting"
                className="w-full h-80 object-cover"
              />
              <div className="p-5 bg-white space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#005A36]">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#7CB342]" /> Saahas Zero Waste Inspired MRF
                  </span>
                  <span>100% Traceable</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Automated material recovery ensuring post-consumer plastic is channeled into certified circular remanufacturing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Created by Plastic Waste: Impact on Health and Environment (Saahas Zero Waste Section) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-[#003620] tracking-tight">
            <span>Impact of Plastic Waste Pollution</span> on Health and Environment
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Unregulated dumping and improper incineration create severe risks for human biology and urban biodiversity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Human Health Risk */}
          <div className="saahas-card p-8 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center mb-5 border border-rose-100">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-[#003620]">Human Health Risk</h3>
              <p className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed">
                Plastics leach hazardous chemicals like <strong>bisphenol A (BPA)</strong> and <strong>phthalates</strong>, which are linked to severe health concerns, including hormone disruption, developmental issues, and toxic accumulation in food chains.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> Microplastics found in drinking water and seafood.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> Toxic carcinogenic dioxin emissions from open burning.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> Endocrine disruption affecting fertility and metabolic health.
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#005A36]">
              Mitigation: Automated Edge AI Source Segregation
            </div>
          </div>

          {/* Environmental Consequences */}
          <div className="saahas-card p-8 flex flex-col justify-between">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-[#005A36] flex items-center justify-center mb-5 border border-emerald-100">
                <Trees className="h-6 w-6 text-[#005A36]" />
              </div>
              <h3 className="text-xl font-bold text-[#003620]">Environmental Consequences</h3>
              <p className="mt-3 text-xs md:text-sm text-slate-600 leading-relaxed">
                Single-use plastics clog urban stormwater drainage networks, resulting in urban flash floods, marine wildlife entanglement, and irreversible soil fertility depletion across agricultural peripheries.
              </p>
              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> 8+ Million tonnes of plastic enter oceans every year.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> Landfills generate high methane and leachate contamination.
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#005A36]" /> 450+ years required for standard PET polymer decomposition.
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-[#005A36]">
              Mitigation: Smart Bins with IoT Ultrasonic Telemetry
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Unified Operations Deck (All 12 Modules & Project Ideas) */}
      <section className="bg-white border-y border-[#DDE7E1] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#003620] tracking-tight">
                Our High-Tech <span>Circular Operations Deck</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Live interactive modules uniting citizens, smart dustbins, logistics, and certified recyclers.
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] overflow-x-auto text-xs font-bold">
              {[
                { id: 'OVERVIEW', label: 'EPR Circular Flow' },
                { id: 'AI_SCANNER', label: 'AI Waste Vision' },
                { id: 'IOT_MAP', label: 'IoT Smart Bins Map' },
                { id: 'PASSPORT', label: 'Digital Passports' },
                { id: 'MRF', label: 'MRF Facility' },
                { id: 'EPR', label: 'Regulations & EPR' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#005A36] text-white shadow-soft font-bold'
                      : 'text-slate-600 hover:text-[#005A36] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab 1: OVERVIEW & Closed Loop Diagram */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Live Metric Counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="saahas-card p-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Total Waste Diverted</span>
                  <div className="text-2xl md:text-3xl font-black text-[#003620] mt-1">
                    {stats?.total_waste_collected_kg || 1459} <span className="text-sm font-bold text-[#005A36]">kg</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">100% CPCB verified</div>
                </div>

                <div className="saahas-card p-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">CO₂ Emissions Abated</span>
                  <div className="text-2xl md:text-3xl font-black text-[#005A36] mt-1">
                    {stats?.co2_saved_kg || 2202.9} <span className="text-sm font-bold text-slate-500">kg</span>
                  </div>
                  <div className="text-[11px] text-[#005A36] font-semibold mt-1">~101.5 Trees Equivalent</div>
                </div>

                <div className="saahas-card p-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Landfill Space Saved</span>
                  <div className="text-2xl md:text-3xl font-black text-[#003620] mt-1">
                    {stats?.landfill_diverted_m3 || 3.24} <span className="text-sm font-bold text-[#005A36]">m³</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Uncompacted volume saved</div>
                </div>

                <div className="saahas-card p-5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">EPR Recovery Rate</span>
                  <div className="text-2xl md:text-3xl font-black text-[#005A36] mt-1">
                    86.4%
                  </div>
                  <div className="text-[11px] text-[#7CB342] font-bold mt-1">+14% above national quota</div>
                </div>
              </div>

              {/* Saahas Style 5-Stage Process Flow */}
              <div className="saahas-card p-8">
                <h3 className="text-lg font-black text-[#003620] mb-2 flex items-center gap-2">
                  <Recycle className="h-5 w-5 text-[#005A36]" />
                  The Saahas-Inspired Closed-Loop Plastic Recovery Journey
                </h3>
                <p className="text-xs text-slate-500 mb-6 max-w-3xl">
                  Tracing post-consumer plastic from Point-of-Generation (Citizens) $\rightarrow$ Smart Segregation $\rightarrow$ Mechanized Fleet Collection $\rightarrow$ MRF Processing $\rightarrow$ Certified Recycled Feedstock.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#005A36] uppercase">Stage 01</span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">Source Segregation</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Citizens scan waste with YOLOv8 vision AI to classify PET, HDPE, or MLP before bin drop.
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] text-[#005A36] font-bold flex items-center gap-1">
                      +20 Green Points <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#005A36] uppercase">Stage 02</span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">IoT Smart Bins</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        ESP32 sensors measure ultrasonic distance and load cell weights, publishing live MQTT telemetry.
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] text-[#005A36] font-bold flex items-center gap-1">
                      Live Telemetry <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#005A36] uppercase">Stage 03</span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">TSP Route Dispatch</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Electric collection vehicles follow distance-optimized routes visiting bins with $\ge 70\%$ fill.
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] text-[#005A36] font-bold flex items-center gap-1">
                      35% Fuel Saved <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#005A36] uppercase">Stage 04</span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">MRF Transformation</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Optical sorting, hot washing, shredding into 8mm flakes, and extrusion into Grade-A rPET pellets.
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] text-[#005A36] font-bold flex items-center gap-1">
                      95% Recovery <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#005A36] uppercase">Stage 05</span>
                      <h4 className="font-bold text-slate-900 mt-1 text-sm">Digital Passport</h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                        Every batch receives a public QR code (`ECO-PET-2026-XXXXXX`) for verified consumer transparency.
                      </p>
                    </div>
                    <div className="mt-3 text-[10px] text-[#005A36] font-bold flex items-center gap-1">
                      Public Certificate <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: AI WASTE SCANNER */}
          {activeTab === 'AI_SCANNER' && (
            <div className="saahas-card p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-[#003620] flex items-center gap-2">
                    <ScanLine className="h-5 w-5 text-[#005A36]" /> YOLOv8 Computer Vision Waste Classifier
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instant edge classification identifying polymer categories with bounding boxes and CPCB recyclability guidance.
                  </p>
                </div>
                <button
                  onClick={handleTestAi}
                  disabled={isClassifying}
                  className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all"
                >
                  {isClassifying ? 'Analyzing Model Stream...' : 'Run Live Inference'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 shadow-soft bg-slate-100 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=700&auto=format&fit=crop&q=80"
                    alt="PET Bottle classification"
                    className="w-full h-full object-cover"
                  />
                  {/* Bounding Box Overlay */}
                  <div className="absolute left-[25%] top-[15%] w-[50%] h-[70%] border-2 border-[#005A36] bg-[#005A36]/10 rounded pointer-events-none">
                    <span className="bg-[#005A36] text-white text-[10px] font-bold px-2 py-0.5 rounded absolute -top-4 left-0 shadow-xs">
                      PET Bottle (94.2% Confidence)
                    </span>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-4 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9]">
                    <span className="text-[10px] font-bold text-[#005A36] uppercase">Predicted Category</span>
                    <div className="text-xl font-black text-[#003620] mt-1">PET Plastic (Category I Rigid)</div>
                    <div className="text-xs text-slate-600 mt-1">
                      Confidence Score: <strong className="text-[#005A36]">94.2%</strong> • Recyclability: <strong className="text-[#005A36]">100%</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] space-y-1">
                    <div className="font-bold text-[#003620]">Disposal & Recycling Instructions:</div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Empty contents, compress container to conserve bin capacity, and deposit in Green Smart Dustbin #01.
                      Qualifies for 20 Green Points credited to user rewards wallet.
                    </p>
                  </div>

                  <Link
                    to="/ai-scanner"
                    className="w-full py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-soft transition-colors"
                  >
                    Open Fullscreen AI Camera Scanner <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: IOT SMART BINS MAP */}
          {activeTab === 'IOT_MAP' && (
            <div className="saahas-card p-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-[#003620] flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-[#005A36]" /> IoT Smart Dustbins Campus Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ESP32 ultrasonic distance and load cell weight readings transmitted in real-time.
                  </p>
                </div>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-all flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Streaming...' : 'Simulate IoT Telemetry Step'}
                </button>
              </div>

              <div className="h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-soft relative">
                <MapContainer
                  center={[28.5458, 77.1926]}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="w-full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {bins.map((bin) => (
                    <Marker
                      key={bin.id}
                      position={[bin.latitude, bin.longitude]}
                      icon={createBinIcon(bin.current_fill_percent)}
                    >
                      <Popup>
                        <div className="p-1 text-xs">
                          <div className="font-bold text-slate-900">{bin.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{bin.bin_code}</div>
                          <div className="mt-1 font-bold text-[#005A36]">
                            Fill: {Math.round(bin.current_fill_percent)}% | Weight: {bin.current_weight_kg} kg
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {/* Tab 4: DIGITAL PLASTIC PASSPORT */}
          {activeTab === 'PASSPORT' && (
            <div className="saahas-card p-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#003620] flex items-center gap-2">
                  <QrCode className="h-5 w-5 text-[#005A36]" /> Digital Plastic Passport Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unique QR-coded batch tracking logging immutable audit events from collection through recycled pellets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {batches.map((b) => (
                  <div key={b.id} className="p-6 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1] flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#005A36] uppercase tracking-wider">
                          Digital Passport ID
                        </span>
                        <h4 className="text-lg font-mono font-black text-slate-900 mt-0.5">{b.batch_code}</h4>
                        <div className="text-xs text-slate-600 mt-1">
                          Polymer: <strong className="text-[#005A36]">{b.plastic_type}</strong> • Weight:{' '}
                          <strong className="text-slate-900">{b.initial_weight_kg} kg</strong>
                        </div>
                      </div>
                      {b.qr_code_url && (
                        <img src={b.qr_code_url} alt="Passport QR" className="w-20 h-20 rounded-xl border border-[#DDE7E1] shadow-xs" />
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Status: <strong className="text-[#005A36]">{b.status}</strong></span>
                      <Link
                        to={`/track/${b.batch_code}`}
                        target="_blank"
                        className="text-[#005A36] font-bold hover:underline flex items-center gap-1"
                      >
                        Verify Ledger <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: MRF PROCESSING FACILITY */}
          {activeTab === 'MRF' && (
            <div className="saahas-card p-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#003620] flex items-center gap-2">
                  <Factory className="h-5 w-5 text-[#005A36]" /> Material Recovery Facility (MRF) Operations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Automated mechanical recycling converting collected campus plastic into certified industrial-grade rPET flakes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[10px] text-[#005A36] font-bold">Stage 1 & 2</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">Weighbridge & Optical Sorting</div>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    Infrared spectrophotometry separates clear PET from colored HDPE and removes label contaminants.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[10px] text-[#005A36] font-bold">Stage 3 & 4</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">Hot Washing & Granulation</div>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    Caustic high-temp wash eliminates glue residues, shredding into uniform 8mm clean flakes.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[10px] text-[#005A36] font-bold">Stage 5</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">Pelletizing Extruder</div>
                  <p className="text-slate-500 mt-2 leading-relaxed text-[11px]">
                    Vacuum degassed extrusion produces Grade-A food-grade rPET granules certified for bottle-to-bottle circularity.
                  </p>
                </div>
              </div>

              <Link
                to="/recycler"
                className="mt-4 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#005A36] hover:bg-[#004728] text-white font-bold text-xs shadow-soft transition-colors"
              >
                Enter Recycler Processing Portal <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Tab 6: REGULATIONS & EPR (Saahas Zero Waste Style) */}
          {activeTab === 'EPR' && (
            <div className="saahas-card p-8 space-y-4">
              <div>
                <h3 className="text-lg font-black text-[#003620] flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-[#005A36]" /> India Plastic Waste Management Rules & EPR
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Regulatory framework established by the Ministry of Environment, Forest and Climate Change (MoEFCC) and CPCB.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[#005A36] font-bold text-sm block">Category I: Rigid Plastics</span>
                  <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                    PET beverage bottles, HDPE shampoo containers, rigid drums. 100% recycling targets with mandatory 30% recycled content by 2026.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[#005A36] font-bold text-sm block">Category II: Flexible Plastics</span>
                  <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                    Single-layer or multi-layer flexible films, carry bags, plastic sheets. Recycled into industrial piping, composite tiles, or road bitumen.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F4F7F5] border border-[#DDE7E1]">
                  <span className="text-[#005A36] font-bold text-sm block">Category III: Multi-Layered (MLP)</span>
                  <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                    Snack pouches, tetra-packs. High calorific value channeled into cement co-processing or chemical pyrolysis.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
