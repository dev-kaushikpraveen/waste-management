import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GithubProfileVisualizer } from '../components/GithubProfileVisualizer';
import { Recycle, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';

export const DeveloperHubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#C9D1D9]">
      {/* Top Banner Navigation */}
      <header className="border-b border-[#30363D] bg-[#161B22]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-semibold text-[#8B949E] hover:text-white transition px-2.5 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to EcoTrace 360</span>
            </Link>
            <div className="h-4 w-[1px] bg-[#30363D] hidden sm:block"></div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#8B949E]">
              <span className="text-white font-bold">Praveen Kumar</span>
              <span>•</span>
              <span>Digital Architecture Identity</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-semibold flex items-center gap-1.5 shadow-md hover:opacity-95 transition"
            >
              <Recycle className="w-3.5 h-3.5" />
              <span>Open Operations Console</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Visualizer */}
      <main className="py-4">
        <GithubProfileVisualizer onLaunchEcoTrace={() => navigate('/login')} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#30363D] py-8 text-center text-xs text-[#8B949E] bg-[#161B22]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Praveen Kumar. Independent Software Architect & Systems Developer.</p>
          <div className="flex items-center gap-4 text-[#8B949E]">
            <a
              href="https://github.com/dev-kaushikpraveen"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/dev-kaushikpraveen/waste-management"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition flex items-center gap-1"
            >
              <span>EcoTrace 360 Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
