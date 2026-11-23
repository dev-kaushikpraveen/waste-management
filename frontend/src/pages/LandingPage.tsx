import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole, EnvironmentalImpact, Bin, WasteBatch } from '../types';
import { api } from '../services/api';
import {
  Recycle,
  LayoutDashboard,
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
  Check,
  Github,
  Layers,
  Activity,
  Compass
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createBinIcon = (fill: number) => {
  const color = fill >= 80 ? '#EF4444' : fill >= 60 ? '#F59E0B' : '#10B981';
  return L.divIcon({
    className: 'custom-bin-pin',
    html: `
      <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 15px ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px; font-family: monospace;">
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

  const handleSampleScan = async () => {
    setIsClassifying(true);
    try {
      const res = await api.classifyWaste();
      setScannerResult(res);
    } finally {
      setIsClassifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-mesh text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Floating Glass Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-dark-950/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white shadow-glow-purple">
              <Recycle className="h-6 w-6 text-cyan-200 animate-spin" style={{ animationDuration: '24s' }} />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>ECOTRACE</span>
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">360</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  v2.0 PRO
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Autonomous Circular Waste & AI Traceability
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#mission" className="hover:text-indigo-400 transition-colors">Crisis & Impact</a>
            <a href="#console" className="hover:text-indigo-400 transition-colors">Operations Console</a>
            <a href="#architecture" className="hover:text-indigo-400 transition-colors">AI & IoT Architecture</a>
            <a href="#epr" className="hover:text-indigo-400 transition-colors">CPCB EPR Standards</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/dev-kaushikpraveen/waste-management"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 border border-white/[0.08] transition-all hover:scale-105"
            >
              <Github className="h-4 w-4 text-purple-400" />
              <span>GitHub</span>
            </a>
            <Link
              to="/login"
              className="btn-primary-gradient px-5 py-2.5 text-xs font-bold shadow-glow-blue flex items-center gap-2"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden text-center">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Creator Identity Badge */}
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-950/80 to-purple-950/80 px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.25)] mb-8">
          <Sparkles className="h-4 w-4 text-cyan-300" />
          <span>Designed & Engineered by <strong className="text-white">Praveen Kumar</strong></span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono text-[11px]">Full-Stack Software Architect</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
          <span className="text-gradient-cosmic">Every Waste Has a Journey. </span>
          <br className="hidden sm:inline" />
          <span className="text-gradient-vibrant">Every Plastic Has a Future.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          An enterprise-grade circular infrastructure unifying <strong className="text-slate-200">Edge YOLOv8 Computer Vision</strong>, <strong className="text-slate-200">ESP32 IoT Sensor Mesh</strong>, and <strong className="text-slate-200">Cryptographic Digital Plastic Passports</strong> into an immutable, CPCB EPR-compliant ecosystem.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="btn-primary-gradient px-8 py-3.5 text-sm font-bold shadow-glow-purple flex items-center gap-2.5"
          >
            <Cpu className="h-4 w-4 text-cyan-300" />
            <span>Open Operations Console</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="https://github.com/dev-kaushikpraveen/waste-management"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-glass px-7 py-3.5 text-sm font-semibold flex items-center gap-2"
          >
            <Github className="h-4 w-4 text-purple-400" />
            <span>Inspect Source on GitHub</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </a>
        </div>

        {/* High-Tech Metrics Ribbon */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="glass-panel p-5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Annual Plastic Generated</span>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">3.4M+ Tonnes</div>
            <div className="text-[11px] text-red-400/90 font-medium mt-1">~40% Uncollected Waste</div>
          </div>

          <div className="glass-panel p-5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Carbon Abated (LCA)</span>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1">
              {stats?.co2_saved_kg || 2202.9} <span className="text-sm font-semibold text-slate-300">kg</span>
            </div>
            <div className="text-[11px] text-cyan-300/80 font-medium mt-1">~101.5 Trees Equivalent</div>
          </div>

          <div className="glass-panel p-5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">IoT Radar Network</span>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400 mt-1">
              {bins.length || 5} <span className="text-sm font-semibold text-slate-300">Smart Nodes</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-1">Live MQTT Stream 100%</div>
          </div>

          <div className="glass-panel p-5 text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">Verified Recovery Rate</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
              {stats?.verified_recycling_rate_percent || 86.4}%
            </div>
            <div className="text-[11px] text-purple-300 font-medium mt-1">CPCB PWM Rules Compliant</div>
          </div>
        </div>
      </section>

      {/* Interactive Operations Console Section */}
      <section id="console" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-mono font-bold text-blue-400 border border-blue-500/30 mb-3">
            <Radio className="h-3.5 w-3.5 animate-pulse" /> LIVE INTERACTIVE ENVIRONMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Comprehensive Operations Console
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Interact with real computer vision classification, live ultrasonic IoT telemetry, and cryptographic QR passports directly below.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-dark-900/80 p-2 rounded-2xl border border-white/[0.08] max-w-4xl mx-auto backdrop-blur-xl">
          {[
            { id: 'OVERVIEW', label: 'Platform Hub', icon: LayoutDashboard },
            { id: 'AI_SCANNER', label: 'Edge YOLOv8 AI', icon: ScanLine },
            { id: 'IOT_MAP', label: 'IoT Radar Mesh', icon: Trash2 },
            { id: 'PASSPORT', label: 'Plastic Passports', icon: QrCode },
            { id: 'MRF', label: 'MRF 5-Stage', icon: Factory },
            { id: 'EPR', label: 'CPCB EPR Audit', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-glow-purple'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-200' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="glass-panel p-6 sm:p-8">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-indigo-400" /> Circular Urban Ecosystem Telemetry
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Integrated smart city dashboard monitoring decentralized waste collection, material classification, and circular commodity resale.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Autonomous Nodes</span>
                    <div className="text-2xl font-black text-white mt-1">{bins.length} Devices</div>
                    <span className="text-[11px] text-cyan-400">ESP32 + HC-SR04 + HX711</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Tracked Batches</span>
                    <div className="text-2xl font-black text-white mt-1">{batches.length} Passports</div>
                    <span className="text-[11px] text-indigo-400">100% QR Auditable</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-dark-900/60 border border-white/[0.06]">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Fleet Route Opt</span>
                    <div className="text-2xl font-black text-white mt-1">TSP Algorithm</div>
                    <span className="text-[11px] text-emerald-400">Minimum Mileage Priority</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-purple-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">Experience All 5 Specialized User Roles</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Switch between Citizen, Collector, Recycler, Admin & Super Admin seamlessly.</p>
                  </div>
                  <Link
                    to="/login"
                    className="btn-primary-gradient px-4 py-2 text-xs font-bold shrink-0 flex items-center gap-2"
                  >
                    <span>Role Evaluator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-900/80 border border-white/[0.08] flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                    System Architecture
                  </span>
                  <h4 className="text-sm font-bold text-white">Architectural Highlights</h4>
                  <ul className="mt-4 space-y-3 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>FastAPI Core:</strong> 11 modular REST API routers + WebSockets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>28 Entities:</strong> Normalized relational schema with strict RBAC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>YOLOv8 Edge AI:</strong> Sub-50ms inference for PET, HDPE, Glass, Metal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Hardware Firmware:</strong> C++ ESP32 code with non-blocking MQTT</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] text-[11px] font-mono text-slate-500">
                  Engineered by Praveen Kumar
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI SCANNER */}
          {activeTab === 'AI_SCANNER' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold block mb-1">
                  Computer Vision Module
                </span>
                <h3 className="text-xl font-black text-white">YOLOv8 Object Detection HUD</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Real-time neural network trained to detect polymer types, generate localized bounding boxes, assess recyclability grade, and compute green point incentives under CPCB PWM standards.
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSampleScan}
                    disabled={isClassifying}
                    className="btn-primary-gradient px-5 py-2.5 text-xs font-bold shadow-glow-blue flex items-center gap-2 disabled:opacity-50"
                  >
                    <Sparkles className={`h-4 w-4 text-cyan-300 ${isClassifying ? 'animate-spin' : ''}`} />
                    <span>{isClassifying ? 'Running YOLO Inference...' : 'Simulate Camera Ingestion'}</span>
                  </button>

                  <Link
                    to="/ai-scanner"
                    className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold ml-4"
                  >
                    <span>Open Fullscreen AI Scanner</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-dark-900/90 border border-white/[0.08] font-mono text-xs">
                {scannerResult ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Identified Polymer</span>
                        <span className="text-base font-black text-cyan-300">{scannerResult.detected_material}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Confidence</span>
                        <span className="text-base font-black text-emerald-400">{Math.round(scannerResult.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Prescribed Dustbin:</span>
                      <span className="text-white font-bold">{scannerResult.recommended_bin}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Recyclability Grade:</span>
                      <span className="text-indigo-300 font-bold">{scannerResult.recyclability_grade}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Green Incentive:</span>
                      <span className="text-emerald-400 font-bold">+{scannerResult.reward_points} Points</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-300 text-[11px] mt-2">
                      {scannerResult.disposal_instructions}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <Cpu className="h-10 w-10 text-indigo-500/40 mx-auto mb-2 animate-pulse" />
                    <span>Click "Simulate Camera Ingestion" to run live neural inference</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: IOT MAP */}
          {activeTab === 'IOT_MAP' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Radio className="h-5 w-5 text-cyan-400 animate-pulse" /> Smart Dustbin Telemetry Radar
                  </h3>
                  <p className="text-xs text-slate-400">Ultrasonic distance sensing & strain-gauge load cells across urban sectors.</p>
                </div>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="btn-primary-gradient px-4 py-2 text-xs font-bold flex items-center gap-2 self-start"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Transmitting Packet...' : 'Trigger Telemetry Step'}</span>
                </button>
              </div>

              <div className="h-96 rounded-2xl overflow-hidden border border-white/[0.08] relative">
                <MapContainer center={[28.5458, 77.1926]} zoom={15} scrollWheelZoom={false} className="w-full h-full">
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {bins.map((bin) => (
                    <Marker key={bin.id} position={[bin.latitude, bin.longitude]} icon={createBinIcon(bin.current_fill_percent)}>
                      <Popup>
                        <div className="p-1 text-slate-900 font-sans">
                          <div className="font-bold text-xs">{bin.name}</div>
                          <div className="text-[11px] text-slate-600">{bin.bin_code}</div>
                          <div className="text-xs font-black mt-1">Fill Level: {bin.current_fill_percent}%</div>
                          <div className="text-[11px]">Weight: {bin.current_weight_kg} kg</div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          )}

          {/* TAB 4: PASSPORT */}
          {activeTab === 'PASSPORT' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
                  Circular Traceability
                </span>
                <h3 className="text-xl font-black text-white">Digital Plastic Passports (DPP)</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Every batch of collected plastic receives a cryptographic QR passport that records origin, mass balance, sorting facility, hot-wash processing, and recycled pellet certification.
                </p>
                <div className="mt-4 flex gap-3">
                  <Link
                    to="/passports"
                    className="btn-primary-gradient px-4 py-2 text-xs font-bold flex items-center gap-2"
                  >
                    <span>Inspect Ledger</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="glass-panel-glow p-6 text-center font-mono">
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Sample Certified Passport</div>
                <div className="text-xl font-black text-white mb-2">ECO-PET-2026-000001</div>
                <div className="text-xs text-slate-400">Polymer: Polyethylene Terephthalate (PET)</div>
                <div className="text-xs text-emerald-400 font-bold mt-1">Status: RECYCLED (118.5 kg Grade-A rPET Pellets)</div>
                <div className="mt-4 text-[11px] text-slate-500">CPCB EPR Registration #ECO-REC-09</div>
              </div>
            </div>
          )}

          {/* TAB 5: MRF */}
          {activeTab === 'MRF' && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Factory className="h-5 w-5 text-indigo-400" /> MRF 5-Stage Transformation Pipeline
              </h3>
              <p className="text-xs text-slate-400">
                Material Recovery Facility processing stages ensuring mass balance integrity and preventing fraudulent EPR claims.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {[
                  { step: '01', title: 'Received & Weighed', desc: 'Facility weighbridge verification' },
                  { step: '02', title: 'Optical Sorting', desc: 'NIR polymer separation' },
                  { step: '03', title: 'Hot Wash & Shred', desc: '8mm cleaned flakes' },
                  { step: '04', title: 'Pellet Extrusion', desc: 'Grade-A rPET pellets' },
                  { step: '05', title: 'Circular Complete', desc: 'Dispatched to brand packaging' },
                ].map((s) => (
                  <div key={s.step} className="p-4 rounded-xl bg-dark-900/80 border border-white/[0.08] text-center">
                    <span className="text-[10px] font-mono font-bold text-indigo-400">{s.step}</span>
                    <div className="text-xs font-bold text-white mt-1">{s.title}</div>
                    <div className="text-[10px] text-slate-400 mt-1">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EPR */}
          {activeTab === 'EPR' && (
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> CPCB Extended Producer Responsibility (EPR) Compliance
              </h3>
              <p className="text-xs text-slate-400">
                Directly aligns with Central Pollution Control Board PWM Rules 2016 (Amended 2022) Category I to IV plastics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/[0.08]">
                  <span className="text-xs font-bold text-white block">Form IV Digital Generation</span>
                  <p className="text-[11px] text-slate-400 mt-1">Automated annual environmental audit certificates for brand owners and recyclers.</p>
                </div>
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/[0.08]">
                  <span className="text-xs font-bold text-white block">Traceability Hash Chain</span>
                  <p className="text-[11px] text-slate-400 mt-1">Eliminates double-counting and falsified recycling claims via digital passports.</p>
                </div>
                <div className="p-4 rounded-xl bg-dark-900/60 border border-white/[0.08]">
                  <span className="text-xs font-bold text-white block">DEFRA LCA Methodology</span>
                  <p className="text-[11px] text-slate-400 mt-1">Scientifically certified carbon emission abatement calculation factors.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Developer Profile & Architecture Showcase */}
      <section id="architecture" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-1 text-xs font-mono font-bold text-purple-400 border border-purple-500/30 mb-3">
              <Cpu className="h-3.5 w-3.5" /> ARCHITECTURAL PROFILE
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Engineered by Praveen Kumar
            </h2>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Designed as an autonomous, scalable smart-city infrastructure prototype demonstrating production-ready full-stack architecture, machine learning model integration, embedded IoT firmware, and regulatory circular compliance.
            </p>

            <div className="mt-6 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Github className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-bold text-white">GitHub Profile</div>
                  <a href="https://github.com/dev-kaushikpraveen" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                    github.com/dev-kaushikpraveen
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Code2Icon />
                </div>
                <div>
                  <div className="font-bold text-white">Core Technology Expertise</div>
                  <span className="text-slate-400">React 18 • TypeScript • FastAPI • PyTorch • YOLOv8 • MQTT • ESP32 • Docker</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel-glow p-6 sm:p-8 space-y-4 font-mono text-xs">
            <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Engineering Specs</div>
            <div className="flex justify-between py-2 border-b border-white/[0.08]">
              <span className="text-slate-400">Architecture Pattern:</span>
              <span className="text-white font-bold">Event-Driven Microservices + REST Gateway</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.08]">
              <span className="text-slate-400">Computer Vision:</span>
              <span className="text-cyan-300 font-bold">YOLOv8 Edge Classifier</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.08]">
              <span className="text-slate-400">Route Optimization:</span>
              <span className="text-indigo-300 font-bold">TSP Heuristic Minimizing EV Fleet Km</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/[0.08]">
              <span className="text-slate-400">Hardware Mesh:</span>
              <span className="text-emerald-300 font-bold">ESP32 DevKit + HC-SR04 + HX711</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Compliance Standard:</span>
              <span className="text-purple-300 font-bold">CPCB PWM Rules 2016 / 2022</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-dark-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-sm">
              E
            </div>
            <div>
              <div className="text-sm font-black text-white">ECOTRACE 360</div>
              <div className="text-[11px] text-slate-500">Every Waste Has a Journey. Every Plastic Has a Future.</div>
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center md:text-right">
            <div>Designed & Engineered by <a href="https://github.com/dev-kaushikpraveen" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-400 hover:underline">Praveen Kumar</a></div>
            <div className="mt-1">
              <a href="https://github.com/dev-kaushikpraveen/waste-management" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                github.com/dev-kaushikpraveen/waste-management
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function Code2Icon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}
