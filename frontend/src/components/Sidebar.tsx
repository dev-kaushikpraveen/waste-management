import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  ScanLine,
  Trash2,
  QrCode,
  Award,
  Truck,
  Factory,
  BarChart3,
  AlertTriangle,
  ShoppingBag,
  MapPin,
  CalendarCheck,
  User,
  Bell,
  Settings,
  Sparkles,
  Layers,
  Cpu,
  Github
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const citizenNav = [
    { to: '/dashboard', label: 'Circular Dashboard', icon: LayoutDashboard },
    { to: '/ai-scanner', label: 'AI Waste Vision Scanner', icon: ScanLine },
    { to: '/smart-bins', label: 'IoT Smart Bins Radar', icon: Trash2 },
    { to: '/passports', label: 'Digital Plastic Passports', icon: QrCode },
    { to: '/pickup-booking', label: 'Book Autonomous Pickup', icon: CalendarCheck },
    { to: '/rewards', label: 'Green Points & Incentives', icon: Award },
    { to: '/marketplace', label: 'Feedstock Marketplace', icon: ShoppingBag },
    { to: '/complaints', label: 'Sanitation Incidents', icon: AlertTriangle },
    { to: '/analytics', label: 'Carbon Abatement LCA', icon: BarChart3 },
    { to: '/notifications', label: 'Real-Time Feed', icon: Bell },
    { to: '/profile', label: 'Developer Credentials', icon: User },
    { to: '/settings', label: 'Platform Settings', icon: Settings },
  ];

  const collectorNav = [
    { to: '/collector', label: 'Fleet Route Optimization', icon: Truck },
    { to: '/smart-bins', label: 'IoT Smart Bins Telemetry', icon: MapPin },
    { to: '/passports', label: 'Scan & Certify Batches', icon: QrCode },
    { to: '/analytics', label: 'Municipal Recovery Data', icon: BarChart3 },
    { to: '/notifications', label: 'Dispatch Alerts', icon: Bell },
    { to: '/profile', label: 'Operator Profile', icon: User },
  ];

  const recyclerNav = [
    { to: '/recycler', label: 'MRF Processing Facility', icon: Factory },
    { to: '/passports', label: 'Digital Passports Ledger', icon: QrCode },
    { to: '/marketplace', label: 'Feedstock Marketplace', icon: ShoppingBag },
    { to: '/analytics', label: 'Mass Balance & Recovery', icon: BarChart3 },
    { to: '/notifications', label: 'Facility Alerts', icon: Bell },
    { to: '/profile', label: 'Facility Profile', icon: User },
  ];

  const adminNav = [
    { to: '/admin', label: 'Command & Control', icon: LayoutDashboard },
    { to: '/smart-bins', label: 'IoT Mesh Telemetry', icon: Trash2 },
    { to: '/passports', label: 'EPR Passports Audit', icon: QrCode },
    { to: '/collector', label: 'Fleet Optimization', icon: Truck },
    { to: '/recycler', label: 'MRF Verification', icon: Factory },
    { to: '/marketplace', label: 'Marketplace Compliance', icon: ShoppingBag },
    { to: '/complaints', label: 'Incident Grievance Queue', icon: AlertTriangle },
    { to: '/analytics', label: 'Carbon Life-Cycle Models', icon: BarChart3 },
    { to: '/notifications', label: 'System Alarms', icon: Bell },
    { to: '/settings', label: 'System Configuration', icon: Settings },
  ];

  let items = citizenNav;
  if (role === 'COLLECTOR') items = collectorNav;
  else if (role === 'RECYCLER') items = recyclerNav;
  else if (role === 'ADMIN' || role === 'SUPER_ADMIN') items = adminNav;

  return (
    <aside className="w-64 shrink-0 border-r border-white/[0.08] bg-dark-950/60 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex backdrop-blur-2xl">
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>OPERATIONS HUB</span>
          <Cpu className="h-3.5 w-3.5 text-indigo-400" />
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 text-white border border-indigo-500/40 shadow-glow-purple font-semibold'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0 text-indigo-400" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Developer Card Badge */}
      <div className="pt-4 border-t border-white/[0.08]">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-dark-900 to-purple-950/50 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">
              Architect Identity
            </span>
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-xs font-bold text-white">Praveen Kumar</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Software Architect & AI Engineer</div>
          <a
            href="https://github.com/dev-kaushikpraveen"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 flex items-center justify-center gap-1.5 py-1.5 w-full rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Github className="h-3.5 w-3.5 text-purple-400" />
            <span>github.com/dev-kaushikpraveen</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
