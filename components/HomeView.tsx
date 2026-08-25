import React, { useState, useMemo } from 'react';
import { 
  MarketPortfolioData, 
  PillarId, 
  ViewMode 
} from '../types';
import { 
  PILLARS, 
  ALL_COLUMNS 
} from '../services/dataService';
import { FmcIcon } from './FmcLogo';
import { 
  Search, 
  Globe2, 
  Package, 
  ArrowRight, 
  Layers, 
  Activity, 
  ShieldCheck, 
  HeartHandshake, 
  Cpu, 
  Wrench, 
  Leaf,
  ChevronRight,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HomeViewProps {
  markets: MarketPortfolioData[];
  onNavigate: (view: ViewMode) => void;
  onSelectCountry: (marketId: string) => void;
  onOpenComparison: (marketId: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  markets,
  onNavigate,
  onSelectCountry,
  onOpenComparison
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'country' | 'region' | 'product'>('all');

  // Pillar icon helper
  const renderPillarIcon = (id: PillarId, size: number = 14) => {
    switch (id) {
      case 'hd': return <Activity size={size} />;
      case 'hvhdf': return <ShieldCheck size={size} />;
      case 'personalization': return <HeartHandshake size={size} />;
      case 'digital': return <Cpu size={size} />;
      case 'services': return <Wrench size={size} />;
      case 'sustainability': return <Leaf size={size} />;
      default: return <Layers size={size} />;
    }
  };

  // Search Results
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) {
      return {
        matchedCountries: [],
        matchedProducts: []
      };
    }

    // Matching countries
    let matchedCountries: MarketPortfolioData[] = [];
    if (searchCategory === 'country' || searchCategory === 'all') {
      matchedCountries = markets.filter(
        (m) => m.country.toLowerCase().includes(q) || m.isoCode.toLowerCase().includes(q)
      );
    } else if (searchCategory === 'region') {
      matchedCountries = markets.filter((m) => m.region.toLowerCase().includes(q));
    }

    // If search category is 'product' or 'all', also find countries that have the product active
    if (searchCategory === 'product') {
      const matchingProductCols = ALL_COLUMNS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.subName && c.subName.toLowerCase().includes(q)) ||
          (c.group && c.group.toLowerCase().includes(q))
      );
      if (matchingProductCols.length > 0) {
        matchedCountries = markets.filter((m) =>
          matchingProductCols.some((col) => m.values[col.id] === true)
        );
      }
    }

    // Matching products list for rich results
    const matchedProducts = ALL_COLUMNS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.subName && c.subName.toLowerCase().includes(q)) ||
        (c.group && c.group.toLowerCase().includes(q)) ||
        c.range.toLowerCase().includes(q) ||
        c.pillar.toLowerCase().includes(q)
    ).slice(0, 8);

    return {
      matchedCountries,
      matchedProducts
    };
  }, [searchQuery, searchCategory, markets]);

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-[calc(80vh-80px)]">
      
      {/* Brand & Heading */}
      <div className="text-center space-y-3 mb-8">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-blue-50 border border-blue-200 rounded-3xl p-3 shadow-xs">
          <FmcIcon className="w-full h-full text-[#0033a0]" />
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-black text-[#071b45] tracking-tight">
          Commercialization 2.0
        </h1>
        
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-lg mx-auto">
          Select a market to analyze portfolio coverage across Essential & Expert ranges and the 6 strategic pillars.
        </p>

        {/* Demo Data Disclaimer Note */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50/80 border border-amber-200/80 text-amber-800 rounded-full text-xs font-semibold shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span>Note: All data is fictitious for demonstration purposes only</span>
        </div>
      </div>

      {/* Main Universal Search Box */}
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/50 p-2 sm:p-3 space-y-2.5 transition-all focus-within:border-[#0033a0] focus-within:ring-4 focus-within:ring-[#0033a0]/10">
        
        {/* Category Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl text-xs font-bold text-slate-600">
          <button
            onClick={() => setSearchCategory('all')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              searchCategory === 'all'
                ? 'bg-white text-[#0033a0] shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSearchCategory('country')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              searchCategory === 'country'
                ? 'bg-white text-[#0033a0] shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Country
          </button>
          <button
            onClick={() => setSearchCategory('region')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              searchCategory === 'region'
                ? 'bg-white text-[#0033a0] shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Region
          </button>
          <button
            onClick={() => setSearchCategory('product')}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              searchCategory === 'product'
                ? 'bg-white text-[#0033a0] shadow-xs'
                : 'hover:text-slate-900'
            }`}
          >
            Product
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center px-3 py-1">
          <Search className="text-slate-400 shrink-0 mr-3" size={22} />
          <input
            type="text"
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              searchCategory === 'country'
                ? 'Search country name or ISO (e.g. Germany, Brazil, JP)...'
                : searchCategory === 'region'
                ? 'Search region (e.g. EMEA WEST, LATAM, APAC)...'
                : searchCategory === 'product'
                ? 'Search product (e.g. 4008A, TDMS, Bibag, Saubern, Needles)...'
                : 'Search any country, region, or product across 6 pillars...'
            }
            className="w-full text-base font-semibold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-100 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Searches (When query is empty) */}
      {!hasSearch && (
        <div className="mt-8 space-y-5 text-center w-full max-w-xl animate-in fade-in duration-300">
          
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="font-bold text-slate-400">Quick searches:</span>
            {['Germany', 'Brazil', 'APAC', 'TDMS', '4008A Evo', 'Bibag', 'EMEA WEST', 'DIASAFEplus'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all hover:scale-105"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200/80 flex justify-center">
            <button
              onClick={() => onNavigate('cards')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0033a0] hover:bg-[#071b45] text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Explore All Country Portfolios</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Search Results Display */}
      {hasSearch && (
        <div className="w-full max-w-2xl mt-4 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Matched Countries Section */}
          {searchResults.matchedCountries.length > 0 && (
            <div>
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Globe2 size={14} className="text-[#0033a0]" />
                  Matching Markets ({searchResults.matchedCountries.length})
                </span>
                <span className="text-xs text-slate-400 font-medium">Click to view portfolio</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
                {searchResults.matchedCountries.map((market) => (
                  <div
                    key={market.id}
                    onClick={() => onSelectCountry(market.id)}
                    className="px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/50 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center uppercase border border-slate-200">
                        {market.isoCode}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0033a0] transition-colors">
                          {market.country}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">
                          {market.region}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-black text-slate-800 block">
                          {market.overallCompleteness}%
                        </span>
                        <span className={`text-[10px] font-bold ${
                          market.overallActionNeeded ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {market.overallActionNeeded ? 'Action Needed' : 'On Track'}
                        </span>
                      </div>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-[#0033a0] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Products Section */}
          {searchResults.matchedProducts.length > 0 && (
            <div className="border-t border-slate-200">
              <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Package size={14} className="text-[#0033a0]" />
                  Matching Products & Ranges ({searchResults.matchedProducts.length})
                </span>
              </div>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto custom-scrollbar">
                {searchResults.matchedProducts.map((prod) => {
                  const activeMarketsCount = markets.filter((m) => m.values[prod.id] === true).length;
                  const pillarObj = PILLARS.find((p) => p.id === prod.pillar);

                  return (
                    <div
                      key={prod.id}
                      onClick={() => {
                        setSearchQuery(prod.name);
                        setSearchCategory('product');
                      }}
                      className="px-5 py-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          {renderPillarIcon(prod.pillar, 14)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {prod.subName || prod.name}
                            </span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-[#0033a0]">
                              {prod.range} Range
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            Pillar: {pillarObj?.shortName || prod.pillar.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-700 block">
                          {activeMarketsCount} / {markets.length} Markets
                        </span>
                        <span className="text-[10px] text-slate-400">Available</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* No results */}
          {searchResults.matchedCountries.length === 0 && searchResults.matchedProducts.length === 0 && (
            <div className="p-8 text-center space-y-2">
              <Search size={28} className="text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No results found</h4>
              <p className="text-xs text-slate-400">
                Try searching for a different country, region (e.g. LATAM), or product (e.g. TDMS).
              </p>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">
              Showing search results for &ldquo;{searchQuery}&rdquo;
            </span>
            <button
              onClick={() => onNavigate('cards')}
              className="font-bold text-[#0033a0] hover:text-[#071b45] flex items-center gap-1"
            >
              <span>View All Country Cards</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
