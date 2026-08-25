import React, { useState, useMemo } from 'react';
import { MarketPortfolioData, PillarId } from '../types';
import { PILLARS, ALL_COLUMNS } from '../services/dataService';
import { StatusBadge } from './StatusBadge';
import { 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight, 
  ArrowUpDown,
  Sparkles,
  Globe2,
  Package,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Wrench,
  Leaf
} from 'lucide-react';

interface DashboardViewProps {
  markets: MarketPortfolioData[];
  onSelectCountry: (marketId: string) => void;
  onOpenComparison: (marketId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  markets,
  onSelectCountry,
  onOpenComparison
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'country' | 'region' | 'product'>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'ACTION_NEEDED' | 'ON_TRACK'>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [readinessFilter, setReadinessFilter] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const [sortBy, setSortBy] = useState<'overall' | 'essentials' | 'expert' | 'country' | 'gaps'>('overall');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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

  // Unique regions
  const regions = useMemo(() => {
    const set = new Set(markets.map((m) => m.region));
    return ['ALL', ...Array.from(set)];
  }, [markets]);

  // Filtered & Sorted
  const filteredMarkets = useMemo(() => {
    return markets
      .filter((m) => {
        // Search
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase().trim();
          if (searchCategory === 'country') {
            if (!m.country.toLowerCase().includes(q) && !m.isoCode.toLowerCase().includes(q)) return false;
          } else if (searchCategory === 'region') {
            if (!m.region.toLowerCase().includes(q)) return false;
          } else if (searchCategory === 'product') {
            const matchingCols = ALL_COLUMNS.filter(c => 
              c.name.toLowerCase().includes(q) || 
              (c.subName && c.subName.toLowerCase().includes(q))
            );
            if (!matchingCols.some(c => m.values[c.id] === true)) return false;
          } else {
            const countryMatch = m.country.toLowerCase().includes(q) || m.isoCode.toLowerCase().includes(q);
            const regionMatch = m.region.toLowerCase().includes(q);
            const productMatch = ALL_COLUMNS.some(c => 
              (c.name.toLowerCase().includes(q) || (c.subName && c.subName.toLowerCase().includes(q))) && 
              m.values[c.id] === true
            );
            if (!countryMatch && !regionMatch && !productMatch) return false;
          }
        }

        // Region
        if (selectedRegion !== 'ALL' && m.region !== selectedRegion) {
          return false;
        }

        // Action needed
        if (actionFilter === 'ACTION_NEEDED' && !m.overallActionNeeded) {
          return false;
        }
        if (actionFilter === 'ON_TRACK' && m.overallActionNeeded) {
          return false;
        }

        // Pillar focus
        if (selectedPillar !== 'ALL') {
          const score = m.pillarScores?.[selectedPillar as PillarId]?.percentage || 0;
          if (score < 45) return false;
        }

        // Readiness score
        if (readinessFilter === 'HIGH' && m.overallCompleteness < 75) return false;
        if (readinessFilter === 'MED' && (m.overallCompleteness < 50 || m.overallCompleteness >= 75)) return false;
        if (readinessFilter === 'LOW' && m.overallCompleteness >= 50) return false;

        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'overall') diff = b.overallCompleteness - a.overallCompleteness;
        else if (sortBy === 'essentials') diff = b.essentials.completeness - a.essentials.completeness;
        else if (sortBy === 'expert') diff = b.expert.completeness - a.expert.completeness;
        else if (sortBy === 'country') diff = a.country.localeCompare(b.country);
        else if (sortBy === 'gaps') {
          const gapsA = a.essentials.missingMustHaves.length + a.expert.missingMustHaves.length;
          const gapsB = b.essentials.missingMustHaves.length + b.expert.missingMustHaves.length;
          diff = gapsB - gapsA;
        }

        return sortOrder === 'desc' ? diff : -diff;
      });
  }, [markets, searchTerm, searchCategory, selectedRegion, actionFilter, selectedPillar, readinessFilter, sortBy, sortOrder]);

  const actionNeededCount = markets.filter((m) => m.overallActionNeeded).length;
  const onTrackCount = markets.length - actionNeededCount;

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0033a0]" />
            <h1 className="text-2xl font-black text-[#071b45]">
              Commercialization 2.0
            </h1>
            <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#0033a0] border border-blue-200">
              Country Portfolio
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
            Select a market to analyze portfolio coverage across Essential & Expert ranges and the 6 strategic pillars.
          </p>
          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[11px] font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Note: All data is fictitious for demonstration purposes only</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Total Markets: <strong>{markets.length}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            On Track: <strong>{onTrackCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            Action Needed: <strong>{actionNeededCount}</strong>
          </span>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search row */}
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Category Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0 text-xs font-bold">
            <button
              onClick={() => setSearchCategory('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                searchCategory === 'all' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSearchCategory('country')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                searchCategory === 'country' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600'
              }`}
            >
              Country
            </button>
            <button
              onClick={() => setSearchCategory('region')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                searchCategory === 'region' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600'
              }`}
            >
              Region
            </button>
            <button
              onClick={() => setSearchCategory('product')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                searchCategory === 'product' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600'
              }`}
            >
              Product
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder={
                searchCategory === 'country' ? 'Search country by name or ISO code...' :
                searchCategory === 'region' ? 'Search by region...' :
                searchCategory === 'product' ? 'Search markets with specific product (e.g. TDMS, 4008A)...' :
                'Search by Country, Region, or Product...'
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0033a0]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filters & Sorters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Pills */}
            <button
              onClick={() => setActionFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all border ${
                actionFilter === 'ALL' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActionFilter('ACTION_NEEDED')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all border ${
                actionFilter === 'ACTION_NEEDED' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <AlertTriangle size={13} />
              Action Needed ({actionNeededCount})
            </button>
            <button
              onClick={() => setActionFilter('ON_TRACK')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all border ${
                actionFilter === 'ON_TRACK' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <CheckCircle2 size={13} />
              On Track ({onTrackCount})
            </button>

            {/* Region select */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              {regions.filter(r => r !== 'ALL').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Pillar select */}
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="ALL">All 6 Pillars</option>
              {PILLARS.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="overall">Total Completeness</option>
              <option value="essentials">Essential Range Completeness</option>
              <option value="expert">Expert Range Completeness</option>
              <option value="gaps">Most Critical Gaps</option>
              <option value="country">Country Name (A-Z)</option>
            </select>

            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown size={14} />
            </button>
          </div>

        </div>

      </div>

      {/* Grid of Cards */}
      {filteredMarkets.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-800">No markets found matching these filters</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try clearing the search query or selecting a different region/pillar filter.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('ALL');
              setSelectedPillar('ALL');
              setActionFilter('ALL');
              setReadinessFilter('ALL');
            }}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#0033a0] text-xs font-bold rounded-xl transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMarkets.map((m) => {
            const missingCount = m.essentials.missingMustHaves.length + m.expert.missingMustHaves.length;

            return (
              <div
                key={m.id}
                onClick={() => onSelectCountry(m.id)}
                className="bg-white rounded-2xl border border-slate-200 hover:border-[#0033a0]/40 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-700 uppercase">
                        {m.isoCode}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0033a0] transition-colors line-clamp-1">
                          {m.country}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          {m.region}
                        </span>
                      </div>
                    </div>

                    <StatusBadge
                      value={!m.overallActionNeeded}
                      trueLabel="On Track"
                      falseLabel="Action Req."
                      size="sm"
                    />
                  </div>

                  {/* Completeness Bar */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-600">Total Portfolio Completeness</span>
                      <span className="font-black text-slate-900 text-sm">{m.overallCompleteness}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          m.overallCompleteness >= 75 ? 'bg-emerald-500' : m.overallCompleteness >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${m.overallCompleteness}%` }}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-slate-500">
                      <div>Essential Range: <strong className="text-slate-800">{m.essentials.completeness}%</strong></div>
                      <div>Expert Range: <strong className="text-slate-800">{m.expert.completeness}%</strong></div>
                    </div>
                  </div>

                  {/* 6 Strategic Pillars breakdown with color code and written % */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      6 Strategic Pillars Breakdown
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {PILLARS.map((p) => {
                        const score = m.pillarScores?.[p.id]?.percentage || 0;
                        const shortCode = p.id === 'hd' ? 'HD' : p.id === 'hvhdf' ? 'HvHDF' : p.id === 'personalization' ? 'Pers.' : p.id === 'digital' ? 'Digital' : p.id === 'services' ? 'Services' : 'Sust.';
                        return (
                          <div
                            key={p.id}
                            title={`${p.name}: ${score}%`}
                            className="flex flex-col justify-between p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1 min-w-0">
                                <span 
                                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs" 
                                  style={{ backgroundColor: p.accentHex }} 
                                />
                                <span className="text-[9px] font-black text-slate-600 truncate uppercase">
                                  {shortCode}
                                </span>
                              </div>
                              <span className="text-[10px] font-black text-slate-900 shrink-0">
                                {score}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-1 rounded-full overflow-hidden mt-1">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${score}%`, 
                                  backgroundColor: p.accentHex 
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Missing Must Haves Warning */}
                  {m.overallActionNeeded && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                      <AlertTriangle size={13} className="shrink-0 text-amber-600" />
                      <span className="truncate">
                        {missingCount} Must-Have gaps pending
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenComparison(m.id);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Compare
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCountry(m.id);
                    }}
                    className="text-[11px] font-bold text-[#0033a0] group-hover:text-[#071b45] flex items-center gap-1 transition-colors"
                  >
                    <span>View Portfolio Profile</span>
                    <ArrowUpRight size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
