import React from 'react';
import { MarketPortfolioData } from '../types';
import { CountrySelector } from './CountrySelector';

interface NavbarProps {
  markets: MarketPortfolioData[];
  selectedMarketId: string | null;
  setSelectedMarketId: (id: string | null) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  markets,
  selectedMarketId,
  setSelectedMarketId,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[60]">
      <div className="w-full max-w-[1780px] mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
            <button onClick={() => setSelectedMarketId(null)} className="font-black text-base sm:text-xl text-[#0033a0] leading-none tracking-tight shrink-0 hover:opacity-80 transition-opacity text-left cursor-pointer">
              FME Commercialization 2.0
            </button>
            {selectedMarketId && (
              <>
                <div className="h-6 w-px bg-slate-200 hidden sm:block shrink-0" />
                <div className="flex-1 max-w-[16rem] print-hidden">
                  <CountrySelector 
                    markets={markets}
                    selectedMarketId={selectedMarketId}
                    setSelectedMarketId={setSelectedMarketId}
                    compact={true}
                  />
                </div>
                <div className="hidden print:block font-bold text-slate-800">
                  {markets.find(m => m.id === selectedMarketId)?.country}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
