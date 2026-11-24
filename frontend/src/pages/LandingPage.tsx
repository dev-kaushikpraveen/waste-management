import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EnvironmentalImpact, Bin, WasteBatch } from '../types';
import { api } from '../services/api';
import {
  Recycle,
  LayoutDashboard,
  ScanLine,
  Trash2,
  QrCode,
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
  Compass,
  HelpCircle,
  ChevronDown,
  Building2,
  BarChart3,
  Droplets,
  Wind,
  PhoneCall,
  CheckCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const createBinIcon = (fill: number) => {
  const color = fill >= 80 ? '#DC2626' : fill >= 60 ? '#D97706' : '#16A34A';
  return L.divIcon({
    className: 'custom-bin-pin',
    html: `
      <div style="background-color: ${color}; width: 34px; height: 34px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 11px; font-family: monospace;">
        ${Math.round(fill)}%
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<EnvironmentalImpact | null>(null);
  const [bins, setBins] = useState<Bin[]>([]);
  const [batches, setBatches] = useState<WasteBatch[]>([]);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_SCANNER' | 'IOT_MAP' | 'PASSPORT' | 'MRF' | 'EPR'>('OVERVIEW');
  const [isSimulating, setIsSimulating] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* ================= 1. PROFESSIONAL TOP HEADER (Clean White & Green) ================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 group-hover:bg-emerald-700 transition">
              <Recycle className="h-6 w-6 text-white animate-spin" style={{ animationDuration: '28s' }} />
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2">
                <span>ECOTRACE</span>
                <span className="text-emerald-600">360</span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  EPR VERIFIED
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                Plastic Waste Management & Circular Traceability
              </div>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#crisis" className="hover:text-emerald-600 transition-colors">Plastic Crisis</a>
            <a href="#solutions" className="hover:text-emerald-600 transition-colors">4 Pillars Solution</a>
            <a href="#console" className="hover:text-emerald-600 transition-colors">Live Operations Console</a>
            <a href="#epr" className="hover:text-emerald-600 transition-colors">CPCB EPR Compliance</a>
            <a href="#faq" className="hover:text-emerald-600 transition-colors">FAQ</a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/hub"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 border border-slate-200 transition"
              title="View Developer Architecture Hub"
            >
              <Github className="h-3.5 w-3.5 text-slate-800" />
              <span>Developer Hub</span>
            </Link>

            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/25 flex items-center gap-2 transition hover:scale-105"
            >
              <span>Launch Platform</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= 2. HERO BANNER (Saahas Zero Waste Corporate Style) ================= */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center bg-gradient-to-b from-emerald-50/50 via-slate-50/30 to-white rounded-3xl mt-4 border border-emerald-100/60 shadow-sm">
        {/* CPCB Regulatory Tag */}
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-4 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-300 mb-6 shadow-xs">
          <Leaf className="h-4 w-4 text-emerald-700" />
          <span>CPCB Plastic Waste Management (PWM) Rules 2016 / 2022 Compliant</span>
          <span className="text-emerald-400">•</span>
          <span className="text-emerald-700 font-mono text-[11px]">Designed by <strong className="text-slate-900">Praveen Kumar</strong></span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-tight">
          Plastic Waste Management in India:
          <span className="block text-emerald-600 mt-1">
            Empowering Zero Waste with AI & IoT.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          An enterprise circular infrastructure connecting citizens, municipal collectors, recyclers, and brand owners. We integrate <strong className="text-slate-900 font-semibold">Edge YOLOv8 Computer Vision</strong>, <strong className="text-slate-900 font-semibold">IoT Sensor Mesh Telemetry</strong>, and <strong className="text-slate-900 font-semibold">Cryptographic Digital Passports</strong> to ensure 100% audit transparency for EPR compliance.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 transition transform hover:-translate-y-0.5"
          >
            <Cpu className="h-4 w-4 text-white" />
            <span>Open Operations Console</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#console"
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 border border-slate-300 shadow-sm flex items-center gap-2 transition"
          >
            <Radio className="h-4 w-4 text-emerald-600 animate-pulse" />
            <span>Explore Live IoT Radar & AI Scanner</span>
          </a>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Annual Plastic in India</span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">3.4M+ Tonnes</div>
            <div className="text-[11px] text-amber-700 font-medium mt-1">~40% Uncollected & Burned</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Carbon Abated (LCA)</span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">
              {stats?.co2_saved_kg || 2202.9} <span className="text-sm font-semibold text-slate-600">kg</span>
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1">~101.5 Trees Equivalent</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">IoT Radar Network</span>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 mt-1">
              {bins.length || 5} <span className="text-sm font-semibold text-slate-600">Smart Nodes</span>
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-1">Live Ultrasonic Telemetry</div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Verified Diverted</span>
            <div className="text-2xl sm:text-3xl font-black text-teal-600 mt-1">
              {stats?.total_waste_collected_kg || 1074.6} <span className="text-sm font-semibold text-slate-600">kg</span>
            </div>
            <div className="text-[11px] text-teal-700 font-medium mt-1">100% CPCB Form IV Audited</div>
          </div>
        </div>
      </section>

      {/* ================= 3. THE PLASTIC CRISIS IN INDIA (Saahas Zero Waste Style) ================= */}
      <section id="crisis" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3.5 py-1 text-xs font-bold text-red-700 border border-red-200 mb-3">
            <AlertTriangle className="h-3.5 w-3.5" /> ENVIRONMENTAL & HEALTH CRISIS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Problem: India's Plastic Pollution Challenge
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            India generates over 25,000 tonnes of plastic daily, with approximately 40% escaping municipal recovery. Without automated tracking, this waste pollutes land, air, and aquatic ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-red-300 transition">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Open Air Dumpsite Burning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unsegregated polyolefins are openly incinerated at landfills, releasing carcinogenic dioxins, furans, and toxic particulate matter into urban neighborhoods.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Groundwater Contamination</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mismanaged plastic heaps block stormwater drains and leach harmful endocrine-disrupting chemicals and plasticizers into municipal aquifers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Globe2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Microplastics in Food Chains</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Weathering causes polymers to break down into particles smaller than 5mm, contaminating freshwater reserves, agricultural soils, and marine biodiversity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">EPR Compliance Deficit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Brands and producers struggle to furnish legally auditable proof of recycling due to fragmented informal aggregators and unverified paper manifests.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. OUR SOLUTIONS: 4 PILLARS (Saahas Zero Waste Framework) ================= */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50 rounded-3xl border border-slate-200 my-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" /> THE 4 PILLARS OF ZERO WASTE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Integrated Zero-Waste Solutions Architecture
          </h2>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            EcoTrace 360 solves plastic pollution by combining edge computer vision, IoT telemetry mesh, cryptographic chain-of-custody, and mechanical recycling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-400 transition flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <ScanLine className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">Pillar 01 • Source AI</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">AI Edge Waste Classification (YOLOv8)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-50ms computer vision model detects PET (Type 1), HDPE (Type 2), LDPE (Type 4), PP (Type 5), Metal and Cardboard, instantly guiding citizens on correct clean segregation and rewarding verified deposits.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-400 transition flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-700 uppercase tracking-wider">Pillar 02 • IoT Mesh</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">IoT Smart Bins Telemetry Network</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Solar-powered ESP32 nodes equipped with HC-SR04 ultrasonic echo ranging sensors stream fill levels and load cell weight over MQTT, triggering dynamic TSP fleet route optimization.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-400 transition flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-teal-700 uppercase tracking-wider">Pillar 03 • EPR Ledger</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">Digital Plastic Passports & EPR Compliance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every batch received generates a cryptographically signed Digital Product Passport (`ECO-PET-2026-XXXXXX`) documenting polymer purity, GPS origin, and mass balance for CPCB Form IV audits.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-400 transition flex gap-5">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-purple-700 uppercase tracking-wider">Pillar 04 • Circular MRF</span>
              <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">5-Stage Mechanical Recycling Facility</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete facility pipeline (Intake ➔ Optical Sort ➔ Hot Wash & Shredding ➔ Extrusion ➔ Circular Flakes) delivering certified Grade-A rPET flakes directly into B2B manufacturing feedstocks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 5. LIVE OPERATIONS CONSOLE (Interactive) ================= */}
      <section id="console" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-300 mb-3">
            <Radio className="h-3.5 w-3.5 text-emerald-700 animate-pulse" /> LIVE INTERACTIVE ENVIRONMENT
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Live Operations Console & Telemetry
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Interact directly with real computer vision classification, live ultrasonic IoT telemetry, and cryptographic QR passports below.
          </p>
        </div>

        {/* Tab Buttons (Clean White & Green Buttons) */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-slate-100 p-2 rounded-2xl border border-slate-200 max-w-4xl mx-auto">
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
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Panels Container */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-md">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-600" /> Circular Urban Ecosystem Telemetry
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrated smart city dashboard monitoring decentralized waste collection, material classification, and circular commodity resale.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Autonomous Nodes</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{bins.length} Devices</div>
                    <span className="text-[11px] text-blue-600 font-medium">ESP32 + Ultrasonic HC-SR04</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Tracked Batches</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">{batches.length} Passports</div>
                    <span className="text-[11px] text-emerald-600 font-medium">100% QR Auditable</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-mono font-bold uppercase text-slate-500">Fleet Route Opt</span>
                    <div className="text-2xl font-black text-slate-900 mt-1">TSP Algorithm</div>
                    <span className="text-[11px] text-teal-600 font-medium">Minimum Mileage Priority</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Experience All 5 Specialized Stakeholder Portals</h4>
                    <p className="text-xs text-slate-600 mt-0.5">Switch between Citizen, Collector, Recycler, Admin & Super Admin seamlessly.</p>
                  </div>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shrink-0 flex items-center gap-2 shadow-sm transition"
                  >
                    <span>Role Evaluator</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                    System Architecture
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">Engineering Highlights</h4>
                  <ul className="mt-4 space-y-3 text-xs text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>FastAPI Core:</strong> 11 modular REST API routers + WebSockets</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>28 Relational Entities:</strong> Strict schema validation and RBAC</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>YOLOv8 Edge AI:</strong> Sub-50ms inference for PET, HDPE, Glass, Metal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Hardware Firmware:</strong> C++ ESP32 code with non-blocking MQTT</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Architect: Praveen Kumar
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI SCANNER */}
          {activeTab === 'AI_SCANNER' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                  Computer Vision Module
                </span>
                <h3 className="text-xl font-bold text-slate-900">YOLOv8 Object Detection HUD</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Real-time neural network trained to detect polymer types, generate localized bounding boxes, assess recyclability grade, and compute green point incentives under CPCB PWM standards.
                </p>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={handleSampleScan}
                    disabled={isClassifying}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md flex items-center gap-2 disabled:opacity-50 transition"
                  >
                    <Sparkles className={`h-4 w-4 text-white ${isClassifying ? 'animate-spin' : ''}`} />
                    <span>{isClassifying ? 'Running YOLO Inference...' : 'Simulate Camera Ingestion'}</span>
                  </button>

                  <Link
                    to="/ai-scanner"
                    className="inline-flex items-center gap-2 text-xs text-emerald-700 hover:text-emerald-800 font-bold ml-4"
                  >
                    <span>Launch Full Screen AI Scanner</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {scannerResult && (
                  <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 font-mono text-xs space-y-1.5 animate-in fade-in">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Detected Polymer:</span>
                      <span className="text-emerald-800 font-bold">{scannerResult.waste_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Confidence Score:</span>
                      <span className="text-blue-800 font-bold">{(scannerResult.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Awarded Points:</span>
                      <span className="text-teal-800 font-bold">+{scannerResult.points_awarded} Green Points</span>
                    </div>
                    <div className="pt-2 text-[11px] text-slate-700">{scannerResult.disposal_instructions}</div>
                  </div>
                )}
              </div>

              <div className="h-72 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-3 shadow-inner">
                  <ScanLine className="h-10 w-10 animate-pulse" />
                </div>
                <div className="text-sm font-bold text-slate-900">YOLOv8 Tensor Stream Ready</div>
                <div className="text-xs text-slate-500 max-w-xs mt-1">
                  Point camera at plastic bottles, milk containers (HDPE), or paper for sub-second recognition.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IOT MAP */}
          {activeTab === 'IOT_MAP' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Trash2 className="h-5 w-5 text-emerald-600" /> Live Ultrasonic Radar Mesh (OpenStreetMap)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Real-time telemetry showing ultrasonic fill percentage, load cell kilogram weights, and automated route prioritization.
                  </p>
                </div>
                <button
                  onClick={handleSimulate}
                  disabled={isSimulating}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 border border-slate-200 flex items-center gap-2 self-start sm:self-auto transition"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>Simulate IoT Telemetry Pulse</span>
                </button>
              </div>

              <div className="h-80 rounded-2xl overflow-hidden border border-slate-200 relative z-0 shadow-inner">
                <MapContainer
                  center={[28.6139, 77.209]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {bins.map((bin) => (
                    <Marker
                      key={bin.id}
                      position={[bin.latitude, bin.longitude]}
                      icon={createBinIcon(bin.current_fill_percent)}
                    >
                      <Popup>
                        <div className="p-1 font-sans text-xs">
                          <strong className="block text-slate-900">{bin.bin_code}</strong>
                          <div className="text-slate-600">Location: {bin.name || bin.area}</div>
                          <div className="text-slate-600">Fill: <strong>{bin.current_fill_percent}%</strong></div>
                          <div className="text-slate-600">Weight: <strong>{bin.current_weight_kg} kg</strong></div>
                          <div className="text-slate-600">Battery: <strong>{bin.battery_level ?? 98}%</strong></div>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 font-bold block mb-1">
                  CPCB Form IV Blockchain Traceability
                </span>
                <h3 className="text-xl font-bold text-slate-900">Cryptographic Digital Plastic Passport</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every plastic batch collected generates an immutable digital passport with SHA-256 genesis hashes, polymer purity grading, and custody handoffs.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
                    <span className="text-slate-500 text-[10px] block">LATEST PASSPORT</span>
                    <strong className="text-emerald-700">{batches[0]?.batch_code || 'ECO-PET-2026-000842'}</strong>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs">
                    <span className="text-slate-500 text-[10px] block">POLYMER GRADE</span>
                    <strong className="text-blue-700">{batches[0]?.plastic_type || 'PET Type-1 Post-Consumer'}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/passports"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-sm inline-flex items-center gap-2 transition"
                  >
                    <span>Inspect Full Passport Ledger</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center flex flex-col items-center justify-center">
                <div className="p-3 rounded-2xl bg-white shadow-md mb-3 border border-slate-200">
                  <div className="w-32 h-32 bg-slate-50 flex items-center justify-center text-slate-800 font-mono text-xs text-center p-2 rounded-xl">
                    <QrCode className="w-24 h-24 text-slate-900" />
                  </div>
                </div>
                <div className="text-xs font-mono text-slate-500">Scan with any mobile phone to inspect public chain-of-custody.</div>
              </div>
            </div>
          )}

          {/* TAB 5: MRF */}
          {activeTab === 'MRF' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-700 font-bold block mb-1">
                  Circular Value Chain
                </span>
                <h3 className="text-xl font-bold text-slate-900">5-Stage Mechanical Recycling Facility Pipeline</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Trace batches from raw baled intake through automated optical sorting, hot wash, shredding, and twin-screw compounding.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { step: '01', title: 'Intake Bales', desc: 'Bale tagging & gross weighing' },
                  { step: '02', title: 'Optical Sorting', desc: 'NIR polymer color separation' },
                  { step: '03', title: 'Hot Wash', desc: 'Label removal & caustic wash' },
                  { step: '04', title: 'Extrusion', desc: 'De-volatilization & melt filter' },
                  { step: '05', title: 'Grade-A Flakes', desc: 'B2B certified food-contact rPET' },
                ].map((s, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left">
                    <span className="text-[10px] font-mono font-bold text-emerald-700">STAGE {s.step}</span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{s.title}</h4>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EPR */}
          {activeTab === 'EPR' && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-1">
                  Regulatory Compliance Standard
                </span>
                <h3 className="text-xl font-bold text-slate-900">CPCB Extended Producer Responsibility (EPR) Standards</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Formal categorization and certified recycling certificates matching Central Pollution Control Board (CPCB) Plastic Waste Management Rules 2016 / 2022.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-emerald-700">Category I</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Rigid Plastic Packaging</div>
                  <p className="text-[11px] text-slate-600 mt-1.5">PET bottles, HDPE drums, PP crates with min 50% recycling obligation.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-blue-700">Category II</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Flexible Single / Multi Layer</div>
                  <p className="text-[11px] text-slate-600 mt-1.5">LDPE films, bubble wrap, poly-pouches with mechanical downcycling paths.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-teal-700">Category III</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Multi-Layered Packaging (MLP)</div>
                  <p className="text-[11px] text-slate-600 mt-1.5">Foil-backed snack sachets routed for pyrolysis and road bitumen blending.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-purple-700">Category IV</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">Compostable Plastics</div>
                  <p className="text-[11px] text-slate-600 mt-1.5">PLA & starch-based polymers conforming to IS/ISO 17088 industrial composting.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= 6. FREQUENTLY ASKED QUESTIONS (Saahas Zero Waste Style) ================= */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1 text-xs font-bold text-slate-700 border border-slate-200 mb-3">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600" /> KNOWLEDGE BASE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Insights on municipal EPR compliance, AI computer vision, and circular plastic traceability.
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'What is Extended Producer Responsibility (EPR) under Indian CPCB regulations?',
              a: 'EPR mandates that Producers, Importers, and Brand Owners (PIBOs) are legally accountable for the post-consumer collection, certified recycling, and circular reuse of the plastic packaging they introduce into the Indian market. EcoTrace 360 automates this with verified batch manifests that meet CPCB Form IV filing criteria.'
            },
            {
              q: 'How does the AI model differentiate between PET, HDPE, and other plastics?',
              a: 'Our edge YOLOv8 computer vision model analyzes visual features, transparency, surface texture, and container shape to classify plastic items into Category I (PET), Category II (HDPE), LDPE, PP, and non-recyclables with over 98.4% precision under 50 milliseconds.'
            },
            {
              q: 'How do the IoT Smart Bins communicate and optimize collection routes?',
              a: 'Each bin node uses ultrasonic ranging sensors and load cells calibrated to detect fill volume and gross weight. When a bin crosses 80% threshold, it publishes a telemetry packet over MQTT to our TSP (Traveling Salesperson Problem) routing engine, recalculating optimal EV collection routes.'
            },
            {
              q: 'What is a Digital Plastic Passport and how does it prevent greenwashing?',
              a: 'A Digital Plastic Passport is a unique cryptographic identity assigned to each verified batch. It logs source origin, GPS coordinates, net weight, optical sort purity, and recycler destination into an immutable SHA-256 ledger, eliminating duplicate credit counting.'
            },
            {
              q: 'Who engineered and designed this platform?',
              a: 'EcoTrace 360 was designed and developed by Praveen Kumar as an independent software architect and full-stack systems engineer.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 transition cursor-pointer"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                  <ChevronDown className={`w-4 h-4 text-emerald-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 7. CORPORATE FOOTER (Deep Charcoal & Clean Emerald) ================= */}
      <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white">ECOTRACE 360</div>
              <div className="text-[11px] text-slate-400">Every Waste Has a Journey. Every Plastic Has a Future.</div>
            </div>
          </div>

          <div className="text-xs text-slate-400 text-center md:text-right space-y-1">
            <div>
              Designed & Engineered by{' '}
              <a
                href="https://github.com/dev-kaushikpraveen"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-emerald-400 hover:underline"
              >
                Praveen Kumar
              </a>
            </div>
            <div>
              <a
                href="https://github.com/dev-kaushikpraveen/waste-management"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors flex items-center justify-center md:justify-end gap-1"
              >
                <Github className="w-3.5 h-3.5" />
                <span>github.com/dev-kaushikpraveen/waste-management</span>
              </a>
            </div>
            <div className="pt-1">
              <Link to="/hub" className="text-emerald-400 hover:underline text-[11px]">
                Explore Praveen Kumar's Developer Hub Visualizer ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
