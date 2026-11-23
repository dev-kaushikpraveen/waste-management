import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Github, Heart, ShieldCheck, Sparkles } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-cosmic-mesh flex flex-col text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          <Outlet />
          
          {/* Universal Footer Credit */}
          <footer className="mt-16 pt-6 pb-4 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-300">ECOTRACE 360</span>
              <span>•</span>
              <span>Autonomous Circular Waste & AI Traceability Protocol</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Designed & Engineered by <a href="https://github.com/dev-kaushikpraveen" target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-400 hover:underline">Praveen Kumar</a></span>
              <span>•</span>
              <a href="https://github.com/dev-kaushikpraveen/waste-management" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                <Github className="h-3.5 w-3.5" /> Source Code
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};
