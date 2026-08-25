import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MarketPortfolioData, ColumnDefinition, PillarId } from '../types';
import { PILLARS, ALL_COLUMNS } from '../services/dataService';
import { StatusBadge } from './StatusBadge';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Trash2, 
  AlertTriangle, 
  Search, 
  Scale,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Wrench,
  Leaf,
  Layers,
  ChevronRight
} from 'lucide-react';

interface ComparisonViewProps {
  markets: MarketPortfolioData[];
  initialMarketId?: string;
  onBack: () => void;
  onToggleProduct: (marketId: string, columnId: string, currentValue: boolean) => void;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  markets,
  initialMarketId,
  onBack,
  onToggleProduct
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [selectorSearch, setSelectorSearch] = useState('');
  const [activePillarFilter, setActivePillarFilter] = useState<PillarId | 'ALL'>('ALL');
  const selectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMarketId && !selectedIds.includes(initialMarketId)) {
      const initial = [initialMarketId];
      const other = markets.find((m) => m.id !== initialMarketId);
      if (other && initial.length < 2) {
        initial.push(other.id);
      }
      setSelectedIds(initial);
    } else if (selectedIds.length === 0 && markets.length > 0) {
      setSelectedIds(markets.slice(0, 3).map((m) => m.id));
    }
  }, [initialMarketId, markets]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMarket = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((m) => m !== id));
    } else {
      if (selectedIds.length >= 4) return;
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const selectedMarkets = markets.filter((m) => selectedIds.includes(m.id));

  const filteredSelectorMarkets = markets.filter((m) =>
    m.country.toLowerCase().includes(selectorSearch.toLowerCase()) ||
    m.region.toLowerCase().includes(selectorSearch.toLowerCase()) ||
    m.isoCode.toLowerCase().includes(selectorSearch.toLowerCase())
  );

  // Pillar icon helper
  const renderPillarIcon = (id: PillarId, size: number = 18) => {
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

  const visiblePillars = useMemo(() => {
    if (activePillarFilter === 'ALL') {
      return PILLARS;
    }
    return PILLARS.filter((p) => p.id === activePillarFilter);
  }, [activePillarFilter]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-300 space-y-6">
      
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600 cursor-pointer"
            title="Back to Strategy Matrix"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-[#071b45]">Side-by-Side Market Comparison</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Benchmark commercial product commercialization across the 6 Strategic Pillars
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Manage markets dropdown */}
          <div className="relative" ref={selectorRef}>
            <button
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#0033a0] text-white rounded-xl hover:bg-[#071b45] transition-all shadow-xs cursor-pointer"
            >
              <Plus size={15} /> Add another country ({selectedIds.length}/4)
            </button>

            {isSelectorOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-50 p-3 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search country or ISO..."
                      value={selectorSearch}
                      onChange={(e) => setSelectorSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0033a0]"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto custom-scrollbar p-1.5 divide-y divide-slate-100">
                  {filteredSelectorMarkets.map((m) => {
                    const isSelected = selectedIds.includes(m.id);
                    const isDisabled = !isSelected && selectedIds.length >= 4;

                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMarket(m.id)}
                        disabled={isDisabled}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50 text-[#0033a0] font-bold' : isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'bg-[#0033a0] border-[#0033a0] text-white' : 'border-slate-300 bg-white'
                          }`}>
                            {isSelected && <Check size={10} />}
                          </div>
                          <img 
                            src={`https://flagcdn.com/w40/${m.isoCode}.png`} 
                            alt={m.country} 
                            className="w-5 h-3.5 object-cover rounded shadow-2xs" 
                            onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <span>{m.country}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{m.region}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* STRATEGIC PILLARS FILTER BAR */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
            Filter View by Strategic Pillar:
          </span>
          <span className="text-xs font-bold text-slate-500">
            {activePillarFilter === 'ALL' ? 'Showing All 6 Pillars' : `Showing: ${PILLARS.find(p => p.id === activePillarFilter)?.name}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          <button
            onClick={() => setActivePillarFilter('ALL')}
            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
              activePillarFilter === 'ALL'
                ? 'bg-[#071b45] text-white border-[#071b45] shadow-xs'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs font-black block">All 6 Pillars</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Sequential View</span>
          </button>

          {PILLARS.map((p) => {
            const isSelected = activePillarFilter === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillarFilter(p.id)}
                className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'text-white border-transparent shadow-xs scale-[1.02]'
                    : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: isSelected ? p.accentHex : undefined,
                  borderTopColor: p.accentHex,
                  borderTopWidth: 3
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black truncate">{p.shortName}</span>
                  <span className={`text-[10px] font-normal ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    ({p.productIds.length})
                  </span>
                </div>
                <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                  Sheet: {p.sheetName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comparison Grid */}
      {selectedMarkets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          <Scale size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No Markets Selected</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Use the "Manage Markets" button above to select up to 4 countries to benchmark side-by-side.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Top Country Benchmark Cards (Showing 6 Pillars breakdown for each) */}
          <div 
            className="grid gap-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs"
            style={{
              gridTemplateColumns: `minmax(220px, 1.2fr) repeat(${selectedMarkets.length}, minmax(140px, 1fr))`
            }}
          >
            <div className="flex flex-col justify-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Benchmark Summary</span>
              <p className="text-xs text-slate-500 mt-1">Comparing {selectedMarkets.length} global markets across the 6 Strategic Pillars</p>
            </div>

            {selectedMarkets.map((market) => (
              <div key={market.id} className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 relative group flex flex-col items-center text-center">
                <button
                  onClick={() => toggleMarket(market.id)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-white transition-colors cursor-pointer"
                  title="Remove country"
                >
                  <X size={14} />
                </button>

                <img 
                  src={`https://flagcdn.com/w80/${market.isoCode}.png`} 
                  alt={market.country} 
                  className="w-10 h-7 object-cover rounded shadow-xs mb-2 border border-slate-200" 
                  onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                />

                <h3 className="text-sm font-black text-[#071b45] line-clamp-1">{market.country}</h3>
                <span className="text-[10px] font-mono text-slate-400">{market.region}</span>

                {/* 6 Pillars Mini Matrix for this Country */}
                <div className="mt-3 w-full space-y-1 pt-2.5 border-t border-slate-200 text-[10px]">
                  <div className="flex justify-between font-black text-xs text-slate-900 pb-1">
                    <span>Overall:</span>
                    <span className="text-[#0033a0]">{market.overallCompleteness}%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-left pt-1">
                    {PILLARS.map((p) => {
                      const score = market.pillarScores?.[p.id]?.percentage || 0;
                      return (
                        <div key={p.id} className="flex items-center justify-between px-1.5 py-0.5 rounded bg-white border border-slate-200/80">
                          <span className="truncate text-slate-600 font-bold">{p.shortName.split(' ')[0]}</span>
                          <span className="font-black text-slate-800 ml-1">{score}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SECTIONED STRICTLY BY THE 6 STRATEGIC PILLARS */}
          <div className="space-y-6">
            {visiblePillars.map((pillar) => {
              let pillarCols = ALL_COLUMNS.filter((c) => c.pillar === pillar.id);

              if (pillarCols.length === 0) return null;

              return (
                <div 
                  key={pillar.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs"
                >
                  {/* Pillar Section Header */}
                  <div 
                    className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3"
                    style={{ backgroundColor: `${pillar.accentHex}15` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: pillar.accentHex }}
                      >
                        {renderPillarIcon(pillar.id, 16)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-black text-slate-900">
                            {pillar.name}
                          </h3>
                          <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded shadow-2xs">
                            Sheet: {pillar.sheetName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium line-clamp-1">
                          {pillar.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        {pillarCols.length} Commercial Products
                      </span>
                    </div>
                  </div>

                  {/* Product Rows under this Pillar */}
                  <div className="divide-y divide-slate-100">
                    {pillarCols.map((col) => {
                      // Check parity across selected markets
                      const statuses = selectedMarkets.map((m) => m.values[col.id]);
                      const allYes = statuses.length > 0 && statuses.every((s) => s === true);
                      const allNo = statuses.length > 0 && statuses.every((s) => s === false);
                      const hasDisparity = !allYes && !allNo && selectedMarkets.length > 1;

                      return (
                        <div 
                          key={col.id} 
                          className={`grid items-center px-5 py-3 text-xs transition-colors ${
                            hasDisparity ? 'bg-amber-50/25 hover:bg-amber-50/40' : 'hover:bg-slate-50/60'
                          }`}
                          style={{
                            gridTemplateColumns: `minmax(220px, 1.2fr) repeat(${selectedMarkets.length}, minmax(140px, 1fr))`
                          }}
                        >
                          {/* Product Details */}
                          <div className="pr-4 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-slate-900">{col.subName || col.name}</span>

                              {/* Range Badge Tag */}
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                                col.range === 'Essentials'
                                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                  : 'bg-indigo-50 text-[#071b45] border border-indigo-200'
                              }`}>
                                {col.range === 'Essentials' ? 'Essential' : 'Expert'}
                              </span>

                              {/* Must-Have Tag */}
                              {col.importance === 'Must-have' && (
                                <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  Must-Have
                                </span>
                              )}

                              {/* SubCategory */}
                              {col.subCategory && (
                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded">
                                  {col.subCategory}
                                </span>
                              )}
                            </div>

                            {hasDisparity && (
                              <span className="text-[10px] text-amber-700 font-bold block">
                                ⚠️ Market Gap Detected
                              </span>
                            )}
                          </div>

                          {/* Country Statuses */}
                          {selectedMarkets.map((market) => (
                            <div key={market.id} className="flex justify-center">
                              <StatusBadge
                                value={market.values[col.id]}
                                onClick={() => onToggleProduct(market.id, col.id, market.values[col.id])}
                                interactive
                                size="sm"
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
