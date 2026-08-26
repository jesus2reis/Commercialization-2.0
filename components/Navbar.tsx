import React from 'react';
import { ViewMode } from '../types';
import { FmcIcon } from './FmcLogo';
import { 
  Search,
  LayoutGrid, 
  TableProperties, 
  Grid3X3, 
  Layers, 
  ArrowLeftRight, 
  BarChart3, 
  FileText
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onRandomize?: () => void;
  onOpenPdfModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onOpenPdfModal
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-[1780px] mx-auto px-4 sm:px-6 min-h-[82px] py-3.5 flex items-center justify-between gap-3 sm:gap-6 flex-wrap xl:flex-nowrap">
        
        {/* Brand Logo & Title with Generous Space */}
        <div 
          onClick={() => onViewChange('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <FmcIcon className="w-full h-full text-[#0033a0]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-black text-lg sm:text-xl text-[#071b45] leading-none tracking-tight">
                COMMERCIALIZATION 2.0
              </span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400 mt-1 hidden md:block">
              Select a market to analyze portfolio coverage
            </span>
          </div>
        </div>

        {/* Navigation Switcher - Designed to fit smoothly without horizontal scroll */}
        <nav className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 text-xs sm:text-[13px] font-bold gap-1 shrink-0">
          
          {/* 1. Search (Home) */}
          <button
            onClick={() => onViewChange('home')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'home'
                ? 'bg-white text-[#0033a0] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Search size={15} />
            <span>Search</span>
          </button>

          {/* 2. Country Portfolio */}
          <button
            onClick={() => onViewChange('cards')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'cards'
                ? 'bg-[#0033a0] text-white shadow-xs font-black'
                : 'text-slate-700 hover:text-[#0033a0] hover:bg-slate-200/50 font-black'
            }`}
          >
            <LayoutGrid size={15} />
            <span>Country Portfolio</span>
          </button>

          {/* 3. Strategy Matrix */}
          <button
            onClick={() => onViewChange('matrix')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'matrix'
                ? 'bg-white text-[#0033a0] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <TableProperties size={15} />
            <span>Strategy Matrix</span>
          </button>

          {/* 4. Comparison */}
          <button
            onClick={() => onViewChange('comparison')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'comparison'
                ? 'bg-white text-[#0033a0] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <ArrowLeftRight size={15} />
            <span>Comparison</span>
          </button>

          {/* 5. 6 Strategic Pillars */}
          <button
            onClick={() => onViewChange('pillars')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              currentView === 'pillars'
                ? 'bg-white text-[#0033a0] shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Layers size={15} />
            <span>6 Pillars</span>
          </button>

        </nav>

        {/* Right Export Action: Only "Export PDF" */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPdfModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-[13px] font-black text-white bg-[#0033a0] hover:bg-[#071b45] active:scale-95 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            title="Generate and export executive One-Pager PDF"
          >
            <FileText size={16} />
            <span>Export PDF</span>
          </button>
        </div>

      </div>
    </header>
  );
};
