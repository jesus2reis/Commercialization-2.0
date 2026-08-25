import React, { useState, useMemo, useEffect } from 'react';
import { 
  MarketPortfolioData, 
  PillarId, 
  RangeType 
} from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Layers, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Wrench,
  Leaf,
  ChevronRight,
  Globe2,
  CheckCircle2,
  SlidersHorizontal,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { 
  exportToCsv, 
  PILLARS,
  ALL_COLUMNS,
  ESSENTIALS_COLUMNS, 
  EXPERT_COLUMNS,
  isPillarActionNeeded
} from '../services/dataService';

interface MatrixViewProps {
  markets: MarketPortfolioData[];
  onToggleProduct: (marketId: string, columnId: string, currentValue: boolean) => void;
  onSelectCountry: (marketId: string) => void;
  onRandomize: () => void;
  onReset: () => void;
  initialPillarFilter?: PillarId | null | 'ALL';
}

type SortField = 
  | 'country' 
  | 'region' 
  | 'overall' 
  | 'essentials' 
  | 'expert' 
  | 'essentials_action' 
  | 'expert_action'
  | 'pillar_score'
  | string;

type SortDirection = 'asc' | 'desc';

export const MatrixView: React.FC<MatrixViewProps> = ({
  markets,
  onToggleProduct,
  onSelectCountry,
  onRandomize,
  onReset,
  initialPillarFilter = null
}) => {
  // Strategic Pillar selection (null initially if not provided from a drilldown)
  const [selectedPillar, setSelectedPillar] = useState<PillarId | null>(() => {
    if (initialPillarFilter && initialPillarFilter !== 'ALL') {
      return initialPillarFilter as PillarId;
    }
    return null;
  });

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [visibleRange, setVisibleRange] = useState<'ALL' | 'Essentials' | 'Expert'>('ALL');
  const [actionFilter, setActionFilter] = useState<'ALL' | 'ACTION_NEEDED' | 'ON_TRACK'>('ALL');
  const [productFilterCol, setProductFilterCol] = useState<string>('ALL');
  const [productFilterVal, setProductFilterVal] = useState<'ALL' | 'YES' | 'NO'>('ALL');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('country');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Sync if initialPillarFilter prop changes
  useEffect(() => {
    if (initialPillarFilter && initialPillarFilter !== 'ALL') {
      setSelectedPillar(initialPillarFilter as PillarId);
    }
  }, [initialPillarFilter]);

  // Unique regions
  const regions = useMemo(() => {
    const set = new Set(markets.map((m) => m.region));
    return ['ALL', ...Array.from(set)];
  }, [markets]);

  // Active pillar definition
  const activePillarDef = useMemo(() => {
    if (!selectedPillar) return null;
    return PILLARS.find((p) => p.id === selectedPillar) || null;
  }, [selectedPillar]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      if (['overall', 'essentials', 'expert', 'pillar_score'].includes(field)) {
        setSortDirection('desc');
      } else {
        setSortDirection('asc');
      }
    }
  };

  // Filtered Columns for the currently selected pillar and range
  const visibleEssentialsCols = useMemo(() => {
    if (!selectedPillar || visibleRange === 'Expert') return [];
    return ESSENTIALS_COLUMNS.filter((c) => c.pillar === selectedPillar);
  }, [visibleRange, selectedPillar]);

  const visibleExpertCols = useMemo(() => {
    if (!selectedPillar || visibleRange === 'Essentials') return [];
    return EXPERT_COLUMNS.filter((c) => c.pillar === selectedPillar);
  }, [visibleRange, selectedPillar]);

  // All product columns for the selected pillar
  const pillarAllCols = useMemo(() => {
    if (!selectedPillar) return [];
    return ALL_COLUMNS.filter((c) => c.pillar === selectedPillar);
  }, [selectedPillar]);

  // Filtered & Sorted markets
  const processedMarkets = useMemo(() => {
    const filtered = markets.filter((m) => {
      // 1. Search Query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const matchesCountry = m.country.toLowerCase().includes(q) || m.isoCode.toLowerCase().includes(q);
        const matchesRegion = m.region.toLowerCase().includes(q);
        if (!matchesCountry && !matchesRegion) return false;
      }

      // 2. Region Filter
      if (selectedRegion !== 'ALL' && m.region !== selectedRegion) {
        return false;
      }

      // 3. Action Status Filter (Context-Aware based on active range and selected pillar)
      if (actionFilter !== 'ALL') {
        let isActionRequired = false;

        if (visibleRange === 'Essentials') {
          // If viewing Essentials range
          isActionRequired = m.essentials.actionNeeded;
        } else if (visibleRange === 'Expert') {
          // If viewing Expert range
          isActionRequired = m.expert.actionNeeded;
        } else if (selectedPillar) {
          // If viewing ALL ranges for a specific pillar
          isActionRequired = isPillarActionNeeded(m, selectedPillar, 'ALL');
        } else {
          // Fallback to overall
          isActionRequired = m.overallActionNeeded;
        }

        if (actionFilter === 'ACTION_NEEDED' && !isActionRequired) {
          return false;
        }
        if (actionFilter === 'ON_TRACK' && isActionRequired) {
          return false;
        }
      }

      // 4. Product availability filter
      if (productFilterCol !== 'ALL' && productFilterVal !== 'ALL') {
        const isYes = m.values[productFilterCol] === true;
        if (productFilterVal === 'YES' && !isYes) return false;
        if (productFilterVal === 'NO' && isYes) return false;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'country') {
        comparison = a.country.localeCompare(b.country);
      } else if (sortField === 'region') {
        comparison = a.region.localeCompare(b.region) || a.country.localeCompare(b.country);
      } else if (sortField === 'overall') {
        comparison = a.overallCompleteness - b.overallCompleteness;
      } else if (sortField === 'essentials') {
        comparison = a.essentials.completeness - b.essentials.completeness;
      } else if (sortField === 'expert') {
        comparison = a.expert.completeness - b.expert.completeness;
      } else if (sortField === 'essentials_action') {
        comparison = (a.essentials.actionNeeded ? 1 : 0) - (b.essentials.actionNeeded ? 1 : 0);
      } else if (sortField === 'expert_action') {
        comparison = (a.expert.actionNeeded ? 1 : 0) - (b.expert.actionNeeded ? 1 : 0);
      } else if (selectedPillar && sortField === 'pillar_score') {
        const scoreA = a.pillarScores?.[selectedPillar]?.percentage || 0;
        const scoreB = b.pillarScores?.[selectedPillar]?.percentage || 0;
        comparison = scoreA - scoreB;
      } else {
        const valA = a.values[sortField] === true ? 1 : 0;
        const valB = b.values[sortField] === true ? 1 : 0;
        comparison = valA - valB;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [markets, searchTerm, selectedRegion, actionFilter, visibleRange, productFilterCol, productFilterVal, sortField, sortDirection, selectedPillar]);

  // Handle CSV download
  const handleDownloadCsv = () => {
    const csvContent = exportToCsv(markets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FMC_Portfolio_Matrix_${selectedPillar || 'All'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Selected Pillar average score across visible markets
  const pillarAverageScore = useMemo(() => {
    if (!selectedPillar || processedMarkets.length === 0) return 0;
    const sum = processedMarkets.reduce(
      (acc, m) => acc + (m.pillarScores?.[selectedPillar]?.percentage || 0),
      0
    );
    return Math.round(sum / processedMarkets.length);
  }, [selectedPillar, processedMarkets]);

  const showEssentials = visibleRange === 'ALL' || visibleRange === 'Essentials';
  const showExpert = visibleRange === 'ALL' || visibleRange === 'Expert';

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="text-slate-400 opacity-60 ml-1 inline" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={12} className="text-[#0033a0] ml-1 inline font-black" />
    ) : (
      <ArrowDown size={12} className="text-[#0033a0] ml-1 inline font-black" />
    );
  };

  const renderPillarIcon = (pillarId: PillarId, size = 18) => {
    switch (pillarId) {
      case 'hd': return <Activity size={size} />;
      case 'hvhdf': return <ShieldCheck size={size} />;
      case 'personalization': return <HeartHandshake size={size} />;
      case 'digital': return <Cpu size={size} />;
      case 'services': return <Wrench size={size} />;
      case 'sustainability': return <Leaf size={size} />;
      default: return <Layers size={size} />;
    }
  };

  // Dedicated Action Badge Renderer (Clear and unmistakable)
  const renderActionBadge = (actionNeeded: boolean) => {
    if (actionNeeded) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200/80 shadow-2xs whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
          Action Req.
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
        On Track
      </span>
    );
  };

  // =========================================================================
  // VIEW 1: INTERACTIVE QUERY BUILDER (INITIAL UNSELECTED STATE)
  // =========================================================================
  if (!selectedPillar) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* Interactive Header */}
        <div className="bg-gradient-to-r from-[#071b45] to-[#0033a0] text-white p-8 rounded-3xl shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-sky-200">
            <SlidersHorizontal size={14} />
            <span>Interactive Matrix Explorer</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Configure Strategy Matrix Parameters
          </h2>
          <p className="text-sm text-slate-200 max-w-2xl leading-relaxed">
            Select a Strategic Pillar, target geographic region or country, and commercial ranges to generate a high-precision matrix view.
          </p>
        </div>

        {/* 3 Step Interactive Configuration Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
          
          {/* STEP 1: Select Strategic Pillar (Required) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#0033a0] text-white text-xs font-black flex items-center justify-center shadow-xs">
                  1
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Select Strategic Pillar (Spreadsheet Sheet)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose one of the 6 core pillars to inspect detailed commercial product availability.
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#0033a0] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                Required
              </span>
            </div>

            {/* 6 Pillar Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {PILLARS.map((p) => {
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPillar(p.id)}
                    className="group relative p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all text-left flex flex-col justify-between gap-3 overflow-hidden cursor-pointer"
                    style={{ borderTopColor: p.accentHex, borderTopWidth: 4 }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-2xs transition-transform group-hover:scale-105"
                          style={{ backgroundColor: p.accentHex }}
                        >
                          {renderPillarIcon(p.id, 18)}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-slate-900 leading-tight group-hover:text-[#0033a0] transition-colors">
                            {p.name.split(' (')[0]}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-400">
                            {p.productIds.length} Commercial Products
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-700 transition-colors shrink-0 mt-1" />
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {p.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-end text-[11px]">
                      <span className="font-bold text-[#0033a0] tracking-wider flex items-center gap-1 group-hover:underline">
                        Explore <ChevronRight size={12} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* STEP 2: Geographic Scope & Action Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-200">
                2
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select Geographic Scope & Action Status
                </h3>
                <p className="text-xs text-slate-500">
                  Filter by geopolitical market cluster, search specific countries, or filter by operational action status.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Region Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Geopolitical Region
                </label>
                <div className="relative">
                  <Globe2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0033a0] cursor-pointer"
                  >
                    {regions.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg === 'ALL' ? 'All 7 Regions (Worldwide)' : reg}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Status Initial Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Action / Track Status
                </label>
                <div className="relative">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#0033a0] cursor-pointer"
                  >
                    <option value="ALL">All Statuses (Action & On Track)</option>
                    <option value="ACTION_NEEDED">Action Required Only</option>
                    <option value="ON_TRACK">On Track Only</option>
                  </select>
                </div>
              </div>

              {/* Search Country Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Search Country / ISO
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="e.g. Germany, Japan, Brazil..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0033a0] focus:bg-white transition-all"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* STEP 3: Select Product Ranges */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-200">
                3
              </span>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Select Product Range Scope
                </h3>
                <p className="text-xs text-slate-500">
                  Choose whether to inspect both ranges or isolate Essential vs. Expert items.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setVisibleRange('ALL')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  visibleRange === 'ALL'
                    ? 'bg-[#0033a0]/5 border-[#0033a0] text-[#0033a0] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">All Ranges</span>
                  {visibleRange === 'ALL' && <CheckCircle2 size={16} className="text-[#0033a0]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Full view displaying both Essential and Expert items.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibleRange('Essentials')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  visibleRange === 'Essentials'
                    ? 'bg-[#29abe2]/10 border-[#29abe2] text-[#0b6371] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">Essential Range Only</span>
                  {visibleRange === 'Essentials' && <CheckCircle2 size={16} className="text-[#29abe2]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Core standard machines & high-volume disposables.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setVisibleRange('Expert')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  visibleRange === 'Expert'
                    ? 'bg-[#071b45]/10 border-[#071b45] text-[#071b45] shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black">Expert Range Only</span>
                  {visibleRange === 'Expert' && <CheckCircle2 size={16} className="text-[#071b45]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Advanced therapy, software & digital solutions.
                </p>
              </button>
            </div>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // VIEW 2: ACTIVE SPREADSHEET MATRIX (FOR SELECTED PILLAR)
  // =========================================================================
  return (
    <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-6 py-6 space-y-5 animate-in fade-in duration-300">
      
      {/* Active Selection Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Active Pillar Card */}
        <div 
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between"
          style={{ borderLeftColor: activePillarDef?.accentHex, borderLeftWidth: 5 }}
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Active Strategic Pillar
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {activePillarDef?.name.split(' (')[0]}
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              {pillarAllCols.length} items ({visibleEssentialsCols.length} Ess / {visibleExpertCols.length} Exp)
            </p>
          </div>
          <div 
            className="w-11 h-11 rounded-xl text-white flex items-center justify-center font-bold shadow-xs"
            style={{ backgroundColor: activePillarDef?.accentHex }}
          >
            {activePillarDef && renderPillarIcon(activePillarDef.id, 20)}
          </div>
        </div>

        {/* Visible Markets in Active Filter */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Markets in View
            </span>
            <h3 className="text-lg font-black text-[#071b45] leading-tight">
              {processedMarkets.length} <span className="text-xs font-normal text-slate-400">/ {markets.length} registered</span>
            </h3>
            <p className="text-xs font-semibold text-slate-500">
              Region: {selectedRegion === 'ALL' ? 'All 7 Regions' : selectedRegion} • Status: {actionFilter === 'ALL' ? 'All' : actionFilter === 'ACTION_NEEDED' ? 'Action Req.' : 'On Track'}
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0033a0] flex items-center justify-center font-bold">
            <Globe2 size={20} />
          </div>
        </div>

        {/* Pillar-Specific Average Completeness */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-0.5 flex-1 mr-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {activePillarDef?.shortName} Avg Completeness
            </span>
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              {pillarAverageScore}%
            </h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${pillarAverageScore}%`, 
                  backgroundColor: activePillarDef?.accentHex 
                }} 
              />
            </div>
          </div>
          <button
            onClick={() => setSelectedPillar(null)}
            className="px-3 py-2 text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
            title="Return to query setup builder"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

      </div>

      {/* STRATEGIC PILLAR SELECTOR (6 PILLARS ONLY) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Strategic Pillar / Spreadsheet Sheet:
            </span>
          </div>
          <span className="text-xs font-bold text-slate-500">
            Selected: <strong className="text-slate-800">{activePillarDef?.name}</strong>
          </span>
        </div>

        {/* 6 Pillars Buttons Only */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PILLARS.map((p) => {
            const isSelected = selectedPillar === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'text-white border-transparent shadow-xs scale-[1.02]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
                style={{
                  backgroundColor: isSelected ? p.accentHex : undefined,
                  borderColor: isSelected ? p.accentHex : undefined
                }}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={isSelected ? 'text-white' : 'text-slate-600'}>
                    {renderPillarIcon(p.id, 14)}
                  </span>
                  <span className="truncate">{p.name.split(' (')[0]}</span>
                </div>
                <span className={`text-[10px] font-normal shrink-0 ml-1 ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  ({p.productIds.length})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER & ACTION TOOLBAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Search & Region & Range Switcher & Action Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search country or ISO..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0033a0] focus:bg-white transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Region Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter size={14} className="text-slate-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#0033a0] cursor-pointer"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg}>
                  {reg === 'ALL' ? 'All Regions (7)' : reg}
                </option>
              ))}
            </select>
          </div>

          {/* Range Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setVisibleRange('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                visibleRange === 'ALL'
                  ? 'bg-white text-[#0033a0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Ranges
            </button>
            <button
              onClick={() => setVisibleRange('Essentials')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                visibleRange === 'Essentials'
                  ? 'bg-[#29abe2] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Essential Range
            </button>
            <button
              onClick={() => setVisibleRange('Expert')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                visibleRange === 'Expert'
                  ? 'bg-[#071b45] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expert Range
            </button>
          </div>

          {/* Action Status Filter */}
          <div className="flex items-center gap-1">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value as any)}
              className={`py-2 px-3 text-xs border rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#0033a0] cursor-pointer transition-all ${
                actionFilter === 'ACTION_NEEDED'
                  ? 'bg-rose-50 border-rose-300 text-rose-800'
                  : actionFilter === 'ON_TRACK'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTION_NEEDED">Action Required Only</option>
              <option value="ON_TRACK">On Track Only</option>
            </select>
          </div>

          {/* Product Availability Filter for Active Pillar */}
          {pillarAllCols.length > 0 && (
            <div className="hidden xl:flex items-center gap-1.5 text-xs">
              <select
                value={productFilterCol}
                onChange={(e) => setProductFilterCol(e.target.value)}
                className="py-2 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none max-w-[170px] truncate cursor-pointer"
              >
                <option value="ALL">Filter Product...</option>
                {pillarAllCols.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.subName || col.name} ({col.range})
                  </option>
                ))}
              </select>

              {productFilterCol !== 'ALL' && (
                <select
                  value={productFilterVal}
                  onChange={(e) => setProductFilterVal(e.target.value as any)}
                  className="py-2 px-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 cursor-pointer"
                >
                  <option value="ALL">All</option>
                  <option value="YES">Yes Only</option>
                  <option value="NO">No Only</option>
                </select>
              )}
            </div>
          )}

        </div>

        {/* Right: Data Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRandomize}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-2xs cursor-pointer"
            title="Generate reproducible random Yes/No distribution"
          >
            <RefreshCw size={13} className="text-[#0033a0]" />
            Randomize Yes/No
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            title="Reset to default baseline"
          >
            Reset
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0033a0] hover:bg-[#071b45] rounded-xl transition-all shadow-2xs cursor-pointer"
            title="Download structured CSV file matching original spreadsheet structure"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>

      </div>

      {/* Sorting & Filter Status Notification */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Showing <strong>{processedMarkets.length}</strong> of {markets.length} markets for <strong>{activePillarDef?.name.split(' (')[0]}</strong>.</span>
          <span>Sorted by: <strong className="text-slate-800 uppercase">{sortField}</strong> ({sortDirection === 'asc' ? 'Ascending' : 'Descending'}).</span>
        </div>
        <span className="text-[11px] text-slate-400 italic">
          Click column headers to sort. Click any Yes/No cell to toggle value.
        </span>
      </div>

      {/* THE MASTER SPREADSHEET MATRIX FOR SELECTED PILLAR */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[750px] custom-scrollbar">
          <table className="w-full text-left text-xs border-separate border-spacing-0">
            
            {/* ROW 1: Range Groups */}
            <thead>
              <tr className="text-white text-xs uppercase tracking-wider font-black select-none sticky top-0 z-30">
                <th 
                  colSpan={2} 
                  className="py-3 px-4 sticky left-0 z-40 bg-[#071b45] border-r border-slate-700 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: activePillarDef?.accentHex }} 
                    />
                    <span>{activePillarDef?.name.split(' (')[0]} Matrix</span>
                  </div>
                </th>

                {showEssentials && visibleEssentialsCols.length > 0 && (
                  <th 
                    colSpan={visibleEssentialsCols.length + 2} 
                    className="py-3 px-4 text-center bg-[#0033a0] border-r border-blue-900 shadow-xs"
                  >
                    Essential Range ({visibleEssentialsCols.length} items)
                  </th>
                )}

                {showExpert && visibleExpertCols.length > 0 && (
                  <th 
                    colSpan={visibleExpertCols.length + 2} 
                    className="py-3 px-4 text-center bg-[#071b45] border-r border-slate-800"
                  >
                    Expert Range ({visibleExpertCols.length} items)
                  </th>
                )}

                {/* Selected Pillar Overall Score */}
                <th 
                  colSpan={2}
                  className="py-3 px-4 text-center text-white"
                  style={{ backgroundColor: activePillarDef?.accentHex }}
                >
                  {activePillarDef?.shortName} Summary
                </th>
              </tr>

              {/* ROW 2: Column Names & Sorting Headers */}
              <tr className="bg-slate-100 text-slate-700 font-black text-[11px] uppercase tracking-wider border-b border-slate-300 sticky top-10 z-20 shadow-2xs">
                
                {/* Fixed Columns */}
                <th 
                  onClick={() => handleSort('country')}
                  className="py-3 px-4 sticky left-0 z-30 bg-slate-100 border-r border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors whitespace-nowrap"
                  title="Sort by Country Name"
                >
                  <div className="flex items-center gap-1">
                    <span>Country / Market</span>
                    {renderSortIcon('country')}
                  </div>
                </th>

                <th 
                  onClick={() => handleSort('region')}
                  className="py-3 px-4 sticky left-[160px] z-30 bg-slate-100 border-r border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors whitespace-nowrap"
                  title="Sort by Region"
                >
                  <div className="flex items-center gap-1">
                    <span>Region</span>
                    {renderSortIcon('region')}
                  </div>
                </th>

                {/* Essentials Columns */}
                {showEssentials && visibleEssentialsCols.map((col) => (
                  <th
                    key={col.id}
                    onClick={() => handleSort(col.id)}
                    className="py-3 px-3 text-center border-r border-slate-200 cursor-pointer hover:bg-blue-50 transition-colors min-w-[120px] max-w-[160px]"
                    title={`${col.subName || col.name} (${col.importance}) - Essential Range. Click to sort.`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="truncate">{col.subName || col.name.split(' ')[0]}</span>
                      {renderSortIcon(col.id)}
                    </div>
                  </th>
                ))}

                {showEssentials && visibleEssentialsCols.length > 0 && (
                  <>
                    <th 
                      onClick={() => handleSort('essentials')}
                      className="py-3 px-3 text-center bg-blue-50/80 border-r border-blue-200 text-[#0033a0] cursor-pointer hover:bg-blue-100 min-w-[95px]"
                      title="Sort by Essential Range Completeness"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>% Ess</span>
                        {renderSortIcon('essentials')}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('essentials_action')}
                      className="py-3 px-3 text-center bg-blue-50/80 border-r border-blue-200 text-[#0033a0] cursor-pointer hover:bg-blue-100 min-w-[95px]"
                      title="Sort by Essential Range Action Status"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Action</span>
                        {renderSortIcon('essentials_action')}
                      </div>
                    </th>
                  </>
                )}

                {/* Expert Columns */}
                {showExpert && visibleExpertCols.map((col) => (
                  <th
                    key={col.id}
                    onClick={() => handleSort(col.id)}
                    className="py-3 px-3 text-center border-r border-slate-200 cursor-pointer hover:bg-indigo-50 transition-colors min-w-[120px] max-w-[160px]"
                    title={`${col.subName || col.name} (${col.importance}) - Expert Range. Click to sort.`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="truncate">{col.subName || col.name.split(' ')[0]}</span>
                      {renderSortIcon(col.id)}
                    </div>
                  </th>
                ))}

                {showExpert && visibleExpertCols.length > 0 && (
                  <>
                    <th 
                      onClick={() => handleSort('expert')}
                      className="py-3 px-3 text-center bg-indigo-50/80 border-r border-indigo-200 text-[#071b45] cursor-pointer hover:bg-indigo-100 min-w-[95px]"
                      title="Sort by Expert Range Completeness"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>% Exp</span>
                        {renderSortIcon('expert')}
                      </div>
                    </th>

                    <th 
                      onClick={() => handleSort('expert_action')}
                      className="py-3 px-3 text-center bg-indigo-50/80 border-r border-indigo-200 text-[#071b45] cursor-pointer hover:bg-indigo-100 min-w-[95px]"
                      title="Sort by Expert Range Action Status"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Action</span>
                        {renderSortIcon('expert_action')}
                      </div>
                    </th>
                  </>
                )}

                {/* Pillar Specific Summary Columns */}
                <th 
                  onClick={() => handleSort('pillar_score')}
                  className="py-3 px-3 text-center bg-slate-200 border-r border-slate-300 text-slate-900 cursor-pointer hover:bg-slate-300 min-w-[95px]"
                  title={`Sort by ${activePillarDef?.shortName} Score`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>% Pillar</span>
                    {renderSortIcon('pillar_score')}
                  </div>
                </th>

                <th 
                  className="py-3 px-3 text-center bg-slate-200 text-slate-900 min-w-[95px]"
                  title="Pillar Status (Action Needed vs On Track)"
                >
                  <span>Status</span>
                </th>

              </tr>
            </thead>

            {/* DATA ROWS */}
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
              {processedMarkets.map((market, rowIdx) => {
                const isEven = rowIdx % 2 === 0;
                const rowBg = isEven ? 'bg-white' : 'bg-slate-50/40';
                const pillarScore = market.pillarScores?.[selectedPillar]?.percentage || 0;
                const pillarNeedsAction = isPillarActionNeeded(market, selectedPillar, visibleRange);

                return (
                  <tr 
                    key={market.id}
                    className={`${rowBg} hover:bg-blue-50/50 transition-colors`}
                  >
                    {/* Fixed Country Cell */}
                    <td 
                      onClick={() => onSelectCountry(market.id)}
                      className={`py-2.5 px-4 sticky left-0 z-10 ${rowBg} border-r border-slate-200 font-bold text-slate-900 cursor-pointer hover:text-[#0033a0] whitespace-nowrap shadow-xs`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center uppercase">
                          {market.isoCode}
                        </span>
                        <span className="line-clamp-1">{market.country}</span>
                      </div>
                    </td>

                    {/* Fixed Region Cell */}
                    <td className={`py-2.5 px-4 sticky left-[160px] z-10 ${rowBg} border-r border-slate-200 text-slate-500 font-semibold text-[11px] whitespace-nowrap shadow-xs`}>
                      {market.region}
                    </td>

                    {/* Essentials Product Cells */}
                    {showEssentials && visibleEssentialsCols.map((col) => {
                      const isYes = market.values[col.id] === true;
                      return (
                        <td 
                          key={col.id}
                          onClick={() => onToggleProduct(market.id, col.id, isYes)}
                          className="py-2.5 px-3 text-center border-r border-slate-200/80 cursor-pointer select-none"
                          title={`${col.name}: ${isYes ? 'Yes' : 'No'}. Click to toggle.`}
                        >
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black transition-all ${
                              isYes
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-2xs'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {isYes ? 'Yes' : 'No'}
                          </span>
                        </td>
                      );
                    })}

                    {showEssentials && visibleEssentialsCols.length > 0 && (
                      <>
                        <td className="py-2.5 px-3 text-center border-r border-blue-200/80 bg-blue-50/30 font-black text-slate-900">
                          {market.essentials.completeness}%
                        </td>

                        <td className="py-2.5 px-3 text-center border-r border-blue-200/80 bg-blue-50/30">
                          {renderActionBadge(market.essentials.actionNeeded)}
                        </td>
                      </>
                    )}

                    {/* Expert Product Cells */}
                    {showExpert && visibleExpertCols.map((col) => {
                      const isYes = market.values[col.id] === true;
                      return (
                        <td 
                          key={col.id}
                          onClick={() => onToggleProduct(market.id, col.id, isYes)}
                          className="py-2.5 px-3 text-center border-r border-slate-200/80 cursor-pointer select-none"
                          title={`${col.name}: ${isYes ? 'Yes' : 'No'}. Click to toggle.`}
                        >
                          <span
                            className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-black transition-all ${
                              isYes
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-2xs'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                          >
                            {isYes ? 'Yes' : 'No'}
                          </span>
                        </td>
                      );
                    })}

                    {showExpert && visibleExpertCols.length > 0 && (
                      <>
                        <td className="py-2.5 px-3 text-center border-r border-indigo-200/80 bg-indigo-50/30 font-black text-slate-900">
                          {market.expert.completeness}%
                        </td>

                        <td className="py-2.5 px-3 text-center border-r border-indigo-200/80 bg-indigo-50/30">
                          {renderActionBadge(market.expert.actionNeeded)}
                        </td>
                      </>
                    )}

                    {/* Selected Pillar Overall Summary Cell */}
                    <td className="py-2.5 px-3 text-center border-r border-slate-200 bg-slate-100/60 font-black text-slate-900">
                      <div className="flex items-center justify-center gap-1.5">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: activePillarDef?.accentHex }} 
                        />
                        <span>{pillarScore}%</span>
                      </div>
                    </td>

                    <td className="py-2.5 px-3 text-center bg-slate-100/60">
                      {renderActionBadge(pillarNeedsAction)}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
