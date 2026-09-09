import React, { useState, useRef, useEffect } from 'react';
import { MarketPortfolioData } from '../types';
import { ChevronDown, MapPin, Search, CheckCircle2, Globe } from 'lucide-react';

export const getFlagEmoji = (isoCode: string) => {
  if (!isoCode || isoCode.length !== 2 || isoCode === 'xx') return null;
  return isoCode.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397));
};

interface CountrySelectorProps {
  markets: MarketPortfolioData[];
  selectedMarketId: string | null;
  setSelectedMarketId: (id: string | null) => void;
  compact?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  markets,
  selectedMarketId,
  setSelectedMarketId,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const filteredMarkets = markets.filter(m => 
    m.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedMarket = markets.find(m => m.id === selectedMarketId);

  return (
    <div ref={dropdownRef} className={`relative z-[60] transition-all duration-500 w-full ${compact ? 'max-w-[16rem]' : 'max-w-xl mx-auto mb-16'}`}>
      <div className={`bg-white rounded-2xl border border-slate-200 relative transition-all duration-500 ${compact ? 'shadow-sm p-1' : 'shadow-xl p-2'}`}>
        <div 
          className={`flex items-center gap-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all ${compact ? 'px-3 py-1.5' : 'px-4 py-3'}`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {selectedMarket ? (
            getFlagEmoji(selectedMarket.isoCode) ? (
              <span className={compact ? "text-xl" : "text-2xl"}>{getFlagEmoji(selectedMarket.isoCode)}</span>
            ) : (
              <Globe className="text-[#0033a0]" size={compact ? 20 : 24} />
            )
          ) : (
            <MapPin className="text-[#0033a0]" size={24} />
          )}
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-slate-400 uppercase tracking-wider mb-0.5 transition-all truncate ${compact ? 'text-[9px]' : 'text-xs'}`}>
              Primary Market
            </div>
            <div className={`font-black text-slate-900 transition-all truncate ${compact ? 'text-sm' : 'text-lg'}`}>
              {selectedMarket ? selectedMarket.country : 'Select a country...'}
            </div>
          </div>
          <ChevronDown className={`text-slate-400 transition-transform shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} size={compact ? 16 : 24} />
        </div>

        {isDropdownOpen && (
          <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden z-[50] flex flex-col ${compact ? 'shadow-2xl' : 'shadow-lg max-h-[300px]'}`}>
            <div className="p-2.5 border-b border-[#F1F5F9] flex items-center gap-2 bg-white sticky top-0 z-10 shrink-0">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                autoFocus
                placeholder="Search countries..."
                className="flex-1 bg-transparent border-none focus:outline-none text-sm font-medium text-slate-900 placeholder:text-slate-400 min-w-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={`overflow-y-auto scrollbar-thin p-2 flex-1 ${compact ? 'max-h-80' : ''}`}>
              {filteredMarkets.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">No markets found.</div>
              ) : (
                filteredMarkets.map(market => (
                  <button
                    key={market.id}
                    onClick={() => {
                      setSelectedMarketId(market.id);
                      setIsDropdownOpen(false);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors ${
                      selectedMarketId === market.id ? 'bg-blue-50 text-[#0033a0]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full min-w-0">
                      {getFlagEmoji(market.isoCode) ? (
                        <span className="text-2xl">{getFlagEmoji(market.isoCode)}</span>
                      ) : (
                        <Globe className="text-slate-400" size={24} />
                      )}
                      <div className="min-w-0 text-left flex-1">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-[#0033a0]">{market.country}</span>
                        <span className="text-xs text-slate-500 block truncate">{market.region}</span>
                      </div>
                    </div>
                    {selectedMarketId === market.id && <CheckCircle2 size={16} className="text-[#0033a0]" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
