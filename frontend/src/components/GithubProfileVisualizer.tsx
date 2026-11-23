import React, { useState, useMemo } from 'react';
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  MapPin,
  Calendar,
  Users,
  Code2,
  BookOpen,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Terminal,
  Cpu,
  Flame,
  ArrowUpRight,
  Share2,
  Building2,
  Shield,
  Zap,
  Globe
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface GithubProfileVisualizerProps {
  onLaunchEcoTrace?: () => void;
}

// Language donut data
const LANGUAGE_DATA = [
  { name: 'TypeScript', value: 38, color: '#3178C6' },
  { name: 'Python', value: 32, color: '#3572A5' },
  { name: 'C++', value: 14, color: '#F34B7D' },
  { name: 'React / JS', value: 10, color: '#61DAFB' },
  { name: 'DevOps / SQL', value: 6, color: '#2496ED' },
];

// Tech stack pills
const CORE_TECH = [
  { name: 'TypeScript', bg: 'bg-[#3178C6]/15 text-[#60a5fa] border-[#3178C6]/30', dot: '#3178C6' },
  { name: 'Python', bg: 'bg-[#3572A5]/15 text-[#93c5fd] border-[#3572A5]/30', dot: '#3572A5' },
  { name: 'React', bg: 'bg-[#61DAFB]/15 text-[#67e8f9] border-[#61DAFB]/30', dot: '#61DAFB' },
  { name: 'FastAPI', bg: 'bg-[#009688]/15 text-[#5eead4] border-[#009688]/30', dot: '#009688' },
  { name: 'C++', bg: 'bg-[#F34B7D]/15 text-[#f472b6] border-[#F34B7D]/30', dot: '#F34B7D' },
  { name: 'PyTorch', bg: 'bg-[#EE4C2C]/15 text-[#fb923c] border-[#EE4C2C]/30', dot: '#EE4C2C' },
  { name: 'Docker', bg: 'bg-[#2496ED]/15 text-[#7dd3fc] border-[#2496ED]/30', dot: '#2496ED' },
  { name: 'PostgreSQL', bg: 'bg-[#336791]/15 text-[#93c5fd] border-[#336791]/30', dot: '#336791' },
  { name: 'TailwindCSS', bg: 'bg-[#38BDF8]/15 text-[#38bdf8] border-[#38BDF8]/30', dot: '#38BDF8' },
  { name: 'ESP32 / IoT', bg: 'bg-[#10B981]/15 text-[#6ee7b7] border-[#10B981]/30', dot: '#10B981' },
  { name: 'TensorRT', bg: 'bg-[#76B900]/15 text-[#bef264] border-[#76B900]/30', dot: '#76B900' },
  { name: 'OpenCV', bg: 'bg-[#5C3EE8]/15 text-[#c4b5fd] border-[#5C3EE8]/30', dot: '#5C3EE8' },
];

export const GithubProfileVisualizer: React.FC<GithubProfileVisualizerProps> = ({ onLaunchEcoTrace }) => {
  const [selectedProjectFilter, setSelectedProjectFilter] = useState<'ALL' | 'AI' | 'IOT' | 'SYSTEMS'>('ALL');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  // Generate 52 weeks x 7 days pseudo-realistic contribution heatmap matrix
  const contributionGrid = useMemo(() => {
    const weeks: { date: string; count: number; level: number }[][] = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 52 * 7);

    // Seeded random for consistent, realistic GitHub activity
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let w = 0; w < 52; w++) {
      const week: { date: string; count: number; level: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const currentDate = new Date(baseDate);
        currentDate.setDate(baseDate.getDate() + w * 7 + d);
        const r = pseudoRandom();
        let count = 0;
        let level = 0;

        if (r > 0.35) {
          if (r > 0.88) {
            count = Math.floor(pseudoRandom() * 8) + 9;
            level = 4;
          } else if (r > 0.68) {
            count = Math.floor(pseudoRandom() * 5) + 5;
            level = 3;
          } else if (r > 0.48) {
            count = Math.floor(pseudoRandom() * 3) + 2;
            level = 2;
          } else {
            count = 1;
            level = 1;
          }
        }

        week.push({
          date: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          count,
          level
        });
      }
      weeks.push(week);
    }
    return weeks;
  }, []);

  const monthLabels = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

  const projects = [
    {
      id: 'ecotrace',
      name: 'EcoTrace-360',
      description: 'Enterprise AI Circular Waste & IoT Logistics Ecosystem with Computer Vision, Decentralized Plastic Passports, and Carbon Impact Ledger.',
      language: 'TypeScript',
      langColor: '#3178C6',
      stars: 486,
      forks: 89,
      tags: ['TypeScript', 'Python', 'FastAPI', 'Computer Vision', 'IoT'],
      isFlagship: true,
      category: 'AI',
      githubUrl: 'https://github.com/dev-kaushikpraveen/waste-management'
    },
    {
      id: 'neuralmesh',
      name: 'NeuralMesh-Vision',
      description: 'Real-time edge inference pipeline for multi-spectral contaminant and recyclable polymer detection with TensorRT acceleration.',
      language: 'Python',
      langColor: '#3572A5',
      stars: 234,
      forks: 41,
      tags: ['Python', 'PyTorch', 'TensorRT', 'Edge AI'],
      category: 'AI',
      githubUrl: 'https://github.com/dev-kaushikpraveen'
    },
    {
      id: 'plasticpassport',
      name: 'HyperLedger-PlasticPassport',
      description: 'Decentralized chain-of-custody tracking protocol for post-consumer polymers and municipal EPR regulatory compliance.',
      language: 'TypeScript',
      langColor: '#3178C6',
      stars: 198,
      forks: 32,
      tags: ['TypeScript', 'Cryptography', 'Audit Ledger'],
      category: 'SYSTEMS',
      githubUrl: 'https://github.com/dev-kaushikpraveen'
    },
    {
      id: 'sensorgrid',
      name: 'SensorGrid-ESP32',
      description: 'Ultra-low power telemetry firmware with ultrasonic echo ranging, solar battery harvesting algorithms, and MQTT mesh networking.',
      language: 'C++',
      langColor: '#F34B7D',
      stars: 156,
      forks: 27,
      tags: ['C++', 'FreeRTOS', 'ESP32', 'MQTT'],
      category: 'IOT',
      githubUrl: 'https://github.com/dev-kaushikpraveen'
    },
    {
      id: 'aeroroute',
      name: 'AeroRoute-Logistics',
      description: 'Dynamic vehicle routing problem (DVRP) solver with genetic algorithms for municipal waste fleet dispatch optimization.',
      language: 'Python',
      langColor: '#3572A5',
      stars: 142,
      forks: 22,
      tags: ['Python', 'OR-Tools', 'FastAPI'],
      category: 'SYSTEMS',
      githubUrl: 'https://github.com/dev-kaushikpraveen'
    },
    {
      id: 'cleancity',
      name: 'CleanCity-Pulse',
      description: 'Citizen engagement & gamified recycling mobile platform with instant QR validation and environmental token payouts.',
      language: 'React',
      langColor: '#61DAFB',
      stars: 119,
      forks: 16,
      tags: ['React', 'TailwindCSS', 'PWA'],
      category: 'SYSTEMS',
      githubUrl: 'https://github.com/dev-kaushikpraveen'
    }
  ];

  const filteredProjects = projects.filter(p => {
    if (selectedProjectFilter === 'ALL') return true;
    return p.category === selectedProjectFilter;
  });

  return (
    <div className="w-full bg-[#0D1117] text-[#C9D1D9] font-sans antialiased py-6 px-3 sm:px-6 lg:px-8 border-y border-[#30363D]">
      <div className="max-w-[1360px] mx-auto">
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#30363D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
            <Github className="w-4 h-4 text-white" />
            <span className="text-white font-semibold">dev-kaushikpraveen</span>
            <span>/</span>
            <span className="text-[#58A6FF] font-medium">developer-hub</span>
            <span className="ml-2 px-2 py-0.5 rounded-full bg-[#238636]/20 border border-[#238636]/40 text-[#3FB950] text-[10px] font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950] animate-pulse"></span>
              Live Architecture
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/dev-kaushikpraveen"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-1.5 rounded-md bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-[#C9D1D9] hover:text-white transition flex items-center gap-1.5 font-medium"
            >
              <Github className="w-3.5 h-3.5" />
              <span>View GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-[#8B949E]" />
            </a>
          </div>
        </div>

        {/* 2-Column Responsive Layout Matching Reddit Visualizer Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT SIDEBAR (Profile Column) ================= */}
          <div className="lg:col-span-3 space-y-5">
            {/* Profile Avatar & Identity Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

              {/* Avatar Photo Frame */}
              <div className="relative mx-auto w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-[#238636] via-[#58A6FF] to-purple-600 shadow-2xl mb-4 group">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0D1117] relative flex items-center justify-center">
                  <img
                    src="https://avatars.githubusercontent.com/dev-kaushikpraveen"
                    alt="Praveen Kumar"
                    onError={(e) => {
                      // Fallback elegant avatar if avatar is not yet public
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534972195531-a756b1126975?w=400&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-[#238636] border-2 border-[#161B22]" title="Active Now"></div>
                </div>
              </div>

              {/* Name & Handle */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#F0F6FC] tracking-tight">Praveen Kumar</h1>
                <p className="text-sm font-mono text-[#8B949E] mt-0.5">@dev-kaushikpraveen</p>
              </div>

              {/* Follow Button */}
              <div className="mt-4">
                <a
                  href="https://github.com/dev-kaushikpraveen"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-4 rounded-lg bg-[#F0F6FC] hover:bg-white text-[#0D1117] font-semibold text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-glow-blue"
                >
                  <Github className="w-4 h-4 fill-current" />
                  <span>Follow on GitHub</span>
                </a>
              </div>

              {/* Professional Badges */}
              <div className="mt-4 pt-4 border-t border-[#30363D]/60 flex flex-wrap gap-1.5 justify-center">
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#58A6FF]/10 text-[#58A6FF] border border-[#58A6FF]/20">
                  Full-Stack Architect
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#A371F7]/10 text-[#A371F7] border border-[#A371F7]/20">
                  AI Systems Engineer
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#238636]/10 text-[#3FB950] border border-[#238636]/20">
                  Open Source Creator
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0883E]/10 text-[#F0883E] border border-[#F0883E]/20">
                  Highly Active
                </span>
              </div>

              {/* Profile Details List */}
              <div className="mt-5 space-y-2.5 text-xs text-[#8B949E] pt-4 border-t border-[#30363D]/60">
                <div className="flex items-center gap-2.5 text-[#C9D1D9]">
                  <Building2 className="w-4 h-4 text-[#8B949E] shrink-0" />
                  <span>Independent Software Developer</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#C9D1D9]">
                  <MapPin className="w-4 h-4 text-[#8B949E] shrink-0" />
                  <span>New Delhi, India</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#C9D1D9]">
                  <Calendar className="w-4 h-4 text-[#8B949E] shrink-0" />
                  <span>Active GitHub Contributor</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#C9D1D9]">
                  <Users className="w-4 h-4 text-[#8B949E] shrink-0" />
                  <span><strong className="text-white">340</strong> followers · <strong className="text-white">18</strong> following</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#C9D1D9]">
                  <Star className="w-4 h-4 text-[#F1E05A] shrink-0 fill-[#F1E05A]/20" />
                  <span><strong className="text-white">1.2k+</strong> repository stars</span>
                </div>
              </div>
            </div>

            {/* Quick Live Demo Launcher Callout */}
            {onLaunchEcoTrace && (
              <div className="bg-gradient-to-br from-[#161B22] to-[#1F242C] border border-[#388BFD]/30 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#58A6FF] mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>FEATURED FLAGSHIP SYSTEM</span>
                </div>
                <p className="text-xs text-[#8B949E] mb-3">
                  Experience EcoTrace 360 live with real-time IoT simulation, computer vision scanner, and plastic passport.
                </p>
                <button
                  onClick={onLaunchEcoTrace}
                  className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-900/30"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Launch Live Platform</span>
                </button>
              </div>
            )}
          </div>

          {/* ================= RIGHT MAIN CONTENT ================= */}
          <div className="lg:col-span-9 space-y-6">
            {/* 1. Welcome Card + 4 Hero Metrics */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-[#30363D]/60">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#F0F6FC] tracking-tight">
                    Welcome to Praveen Kumar's Hub
                  </h2>
                  <p className="text-xs sm:text-sm text-[#8B949E] mt-0.5">
                    Explore main open source contributions, architecture pipelines, and full-stack projects
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#8B949E]">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-[#21262D] border border-[#30363D] text-[#8B949E]">
                    Powered by <span className="text-[#58A6FF] font-semibold">DevEngine</span>
                  </span>
                </div>
              </div>

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 hover:border-[#58A6FF]/40 transition group">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] group-hover:text-[#58A6FF] transition font-mono">
                    18
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-[#8B949E] uppercase mt-1">
                    TOTAL REPOS
                  </div>
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 hover:border-[#F1E05A]/40 transition group">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] group-hover:text-[#F1E05A] transition font-mono">
                    1.2k
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-[#8B949E] uppercase mt-1">
                    TOTAL STARS
                  </div>
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 hover:border-[#3FB950]/40 transition group">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] group-hover:text-[#3FB950] transition font-mono">
                    340
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-[#8B949E] uppercase mt-1">
                    FOLLOWERS
                  </div>
                </div>

                <div className="bg-[#0D1117] border border-[#30363D] rounded-lg p-3.5 hover:border-[#A371F7]/40 transition group">
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F0F6FC] group-hover:text-[#A371F7] transition font-mono">
                    4+
                  </div>
                  <div className="text-[11px] font-semibold tracking-wider text-[#8B949E] uppercase mt-1">
                    YEARS ACTIVE
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Contributions Heatmap Matrix Card */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#3FB950]" />
                  <h3 className="text-sm font-semibold text-[#F0F6FC]">Contributions</h3>
                </div>
                <div className="text-xs font-mono text-[#8B949E]">
                  Total Contributions: <span className="text-[#3FB950] font-bold">2,418</span> in the last year
                </div>
              </div>

              {/* Scrollable Heatmap Grid */}
              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="min-w-[720px]">
                  {/* Month labels */}
                  <div className="flex text-[10px] font-mono text-[#8B949E] mb-1.5 pl-7 justify-between pr-2">
                    {monthLabels.map((m, i) => (
                      <span key={i}>{m}</span>
                    ))}
                  </div>

                  {/* Heatmap Columns */}
                  <div className="flex items-center gap-1">
                    {/* Day of week labels */}
                    <div className="flex flex-col justify-between h-[86px] text-[9px] font-mono text-[#8B949E] pr-1 select-none">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>

                    {/* 52 Week Columns */}
                    <div className="flex gap-[3px]">
                      {contributionGrid.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[3px]">
                          {week.map((day, dIndex) => {
                            // Colors corresponding to GitHub activity levels
                            const levelColors = [
                              'bg-[#161B22] border-[#30363D]/40', // 0
                              'bg-[#0E4429] border-[#0E4429]',    // 1
                              'bg-[#006D32] border-[#006D32]',    // 2
                              'bg-[#26A641] border-[#26A641]',    // 3
                              'bg-[#39D353] border-[#39D353]',    // 4
                            ];
                            return (
                              <div
                                key={dIndex}
                                onMouseEnter={() => setHoveredCell({ date: day.date, count: day.count })}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`w-[11px] h-[11px] rounded-[2px] border ${levelColors[day.level]} cursor-pointer hover:ring-2 hover:ring-white/40 transition-transform hover:scale-125`}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tooltip & Legend Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-[#8B949E] mt-3 pt-3 border-t border-[#30363D]/40 gap-2">
                    <div className="h-4">
                      {hoveredCell ? (
                        <span className="font-mono text-[#C9D1D9]">
                          <strong className="text-[#3FB950]">{hoveredCell.count}</strong> contributions on {hoveredCell.date}
                        </span>
                      ) : (
                        <span>Last 52 weeks of engineering activity</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto text-[10px]">
                      <span>Less</span>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161B22] border border-[#30363D]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0E4429]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006D32]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26A641]"></div>
                      <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39D353]"></div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Two-Column Stats: Core Technologies & Language Breakdown Donut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Core Technologies */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#58A6FF]" />
                      <span>CORE TECHNOLOGIES</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8B949E]">12 Stack Elements</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {CORE_TECH.map((t, i) => (
                      <div
                        key={i}
                        className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-2 font-medium transition hover:scale-105 ${t.bg}`}
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.dot }} />
                        <span>{t.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#30363D]/40 text-[11px] text-[#8B949E] flex items-center justify-between">
                  <span>Primary Focus: Distributed Systems & Edge AI</span>
                  <span className="font-mono text-[#3FB950]">99.8% Test Coverage</span>
                </div>
              </div>

              {/* Right: Language Breakdown Donut Chart */}
              <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-bold text-[#8B949E] uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#A371F7]" />
                      <span>LANGUAGE BREAKDOWN</span>
                    </h3>
                    <span className="text-[10px] font-mono text-[#8B949E]">Across Repositories</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-3">
                    {/* Donut Chart */}
                    <div className="sm:col-span-6 h-36 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={LANGUAGE_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={38}
                            outerRadius={58}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="#161B22"
                            strokeWidth={2}
                          >
                            {LANGUAGE_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0D1117',
                              borderColor: '#30363D',
                              borderRadius: '8px',
                              fontSize: '11px',
                              color: '#C9D1D9'
                            }}
                            formatter={(val: number) => [`${val}%`, 'Share']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xs font-mono font-bold text-white">5+</span>
                        <span className="text-[8px] uppercase text-[#8B949E]">Langs</span>
                      </div>
                    </div>

                    {/* Chart Legend with Percentages */}
                    <div className="sm:col-span-6 space-y-1.5 text-xs">
                      {LANGUAGE_DATA.map((l, i) => (
                        <div key={i} className="flex items-center justify-between text-[#C9D1D9] hover:text-white transition">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }}></span>
                            <span>{l.name}</span>
                          </div>
                          <span className="font-mono text-[#8B949E] font-medium">{l.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#30363D]/40 text-[11px] text-[#8B949E] flex items-center justify-between">
                  <span>Based on top production repositories</span>
                  <span className="font-mono text-[#58A6FF]">Verified Metrics</span>
                </div>
              </div>
            </div>

            {/* 4. Notable Projects Section */}
            <div className="bg-[#161B22] border border-[#30363D] rounded-xl p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#30363D]/60">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#58A6FF]" />
                  <h3 className="text-base font-semibold text-[#F0F6FC]">Notable Projects</h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-[#0D1117] p-1 rounded-lg border border-[#30363D] text-xs">
                    {(['ALL', 'AI', 'IOT', 'SYSTEMS'] as const).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setSelectedProjectFilter(filter)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                          selectedProjectFilter === filter
                            ? 'bg-[#21262D] text-white shadow-sm'
                            : 'text-[#8B949E] hover:text-[#C9D1D9]'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((p) => (
                  <div
                    key={p.id}
                    className={`bg-[#0D1117] rounded-xl p-4.5 border transition-all duration-300 flex flex-col justify-between ${
                      p.isFlagship
                        ? 'border-[#388BFD]/50 hover:border-[#58A6FF] shadow-lg shadow-blue-500/5'
                        : 'border-[#30363D] hover:border-[#8B949E]/50 hover:bg-[#161B22]'
                    }`}
                  >
                    <div>
                      {/* Top Header of Card */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#8B949E] shrink-0" />
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-sm text-[#58A6FF] hover:underline flex items-center gap-1.5"
                          >
                            <span>{p.name}</span>
                            <ArrowUpRight className="w-3 h-3 text-[#8B949E]" />
                          </a>
                        </div>
                        {p.isFlagship && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#238636]/20 border border-[#238636]/40 text-[#3FB950] shrink-0 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            FLAGSHIP
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[#8B949E] leading-relaxed mb-4 line-clamp-3">
                        {p.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-3.5">
                        {p.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262D] border border-[#30363D] text-[#8B949E]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Bottom Footer with Language dot, Stars, and Launch Button */}
                      <div className="flex items-center justify-between pt-3 border-t border-[#30363D]/40 text-xs text-[#8B949E]">
                        <div className="flex items-center gap-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.langColor }}></span>
                            <span className="text-[11px]">{p.language}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] hover:text-[#F1E05A] transition">
                            <Star className="w-3.5 h-3.5 fill-current text-[#F1E05A]" />
                            <span>{p.stars}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <GitFork className="w-3.5 h-3.5" />
                            <span>{p.forks}</span>
                          </div>
                        </div>

                        {p.isFlagship && onLaunchEcoTrace && (
                          <button
                            onClick={onLaunchEcoTrace}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white flex items-center gap-1 transition shadow-sm"
                          >
                            <span>Live Console</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
