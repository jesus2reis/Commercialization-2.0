import React from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import { MarketPortfolioData } from '../types';
import { CountrySelector } from './CountrySelector';

interface NavbarProps {
  markets: MarketPortfolioData[];
  selectedMarketId: string | null;
  setSelectedMarketId: (id: string | null) => void;
  onRandomize: () => void;
  onOpenPdfModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  markets,
  selectedMarketId,
  setSelectedMarketId,
  onRandomize,
  onOpenPdfModal
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[60]">
      <div className="w-full max-w-[1780px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          
          {/* Title & Selector */}
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <span className="font-black text-base sm:text-xl text-[#0033a0] leading-none tracking-tight shrink-0">
              FME Commercialization 2.0
            </span>

            {/* Render compact CountrySelector only when a market is selected */}
            {selectedMarketId && (
              <>
                <div className="h-6 w-px bg-slate-200 hidden sm:block shrink-0" />
                <div className="flex-1 max-w-[16rem]">
                  <CountrySelector 
                    markets={markets}
                    selectedMarketId={selectedMarketId}
                    setSelectedMarketId={setSelectedMarketId}
                    compact={true}
                  />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 pl-2">
            <button
              onClick={onRandomize}
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Randomize Data"
            >
              <RefreshCw size={14} />
              <span className="hidden sm:inline">Randomize Data</span>
            </button>
            <button
              onClick={onOpenPdfModal}
              className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold bg-[#0033a0] text-white rounded-xl hover:bg-[#071b45] transition-all shadow-sm cursor-pointer"
              title="Export Summary PDF"
            >
              <FileText size={15} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
