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
  Leaf,
  Layers,
  Activity
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role } = useAuth();

  const citizenNav = [
    { to: '/dashboard', label: 'Zero Waste Dashboard', icon: LayoutDashboard },
    { to: '/ai-scanner', label: 'AI Waste Vision Scanner', icon: ScanLine },
    { to: '/smart-bins', label: 'Nearby Smart Bins Map', icon: Trash2 },
    { to: '/passports', label: 'Digital Plastic Passports', icon: QrCode },
    { to: '/pickup-booking', label: 'Book Doorstep Collection', icon: CalendarCheck },
    { to: '/rewards', label: 'Green Rewards & Wallet', icon: Award },
    { to: '/marketplace', label: 'Recycled Feedstock Market', icon: ShoppingBag },
    { to: '/complaints', label: 'Report Dumping / Bin', icon: AlertTriangle },
    { to: '/analytics', label: 'Environmental Impact', icon: BarChart3 },
    { to: '/notifications', label: 'Notifications & Alerts', icon: Bell },
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const collectorNav = [
    { to: '/collector', label: 'Fleet Route Optimization', icon: Truck },
    { to: '/smart-bins', label: 'Smart Bins Map & GPS', icon: MapPin },
    { to: '/passports', label: 'Scan & Certify Batches', icon: QrCode },
    { to: '/analytics', label: 'Municipal Impact Metrics', icon: BarChart3 },
    { to: '/notifications', label: 'Dispatch Alerts', icon: Bell },
    { to: '/profile', label: 'Collector Profile', icon: User },
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
    { to: '/admin', label: 'Command Center', icon: LayoutDashboard },
    { to: '/smart-bins', label: 'IoT Sensor Telemetry', icon: Trash2 },
    { to: '/passports', label: 'Plastic Batches Audit', icon: QrCode },
    { to: '/collector', label: 'Route Dispatch', icon: Truck },
    { to: '/recycler', label: 'MRF Facility Verification', icon: Factory },
    { to: '/marketplace', label: 'Marketplace Compliance', icon: ShoppingBag },
    { to: '/complaints', label: 'Citizen Incident Logs', icon: AlertTriangle },
    { to: '/analytics', label: 'AI Forecasting & ML', icon: BarChart3 },
    { to: '/notifications', label: 'Network Alerts', icon: Bell },
    { to: '/settings', label: 'System & Policy Settings', icon: Settings },
  ];

  let items = citizenNav;
  if (role === 'COLLECTOR') items = collectorNav;
  else if (role === 'RECYCLER') items = recyclerNav;
  else if (role === 'ADMIN' || role === 'SUPER_ADMIN') items = adminNav;

  return (
    <aside className="w-64 shrink-0 border-r border-[#DDE7E1] bg-white min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex shadow-xs">
      <div className="space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>PORTAL CONSOLE</span>
          <Leaf className="h-3.5 w-3.5 text-[#005A36]" />
        </div>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#E8F5E9] text-[#005A36] border border-[#C8E6C9] font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-[#F4F7F5] hover:text-[#005A36]'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0 text-[#005A36]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="rounded-2xl border border-[#C8E6C9] bg-[#F4F7F5] p-4 text-xs shadow-xs">
        <div className="font-bold text-[#003620] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#7CB342] animate-pulse" />
            Smart City Circular Mesh
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#005A36] border border-[#C8E6C9] font-bold">
            99.9%
          </span>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-500 leading-relaxed">
          Mosquitto MQTT active • ESP32 nodes connected • CPCB EPR compliance live.
        </p>
      </div>
    </aside>
  );
};
