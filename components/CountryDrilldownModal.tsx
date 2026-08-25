import React, { useState, useMemo } from 'react';
import { 
  MarketPortfolioData, 
  ColumnDefinition, 
  PillarId
} from '../types';
import { 
  PILLARS, 
  ALL_COLUMNS,
  isPillarActionNeeded
} from '../services/dataService';
import { StatusBadge } from './StatusBadge';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Layers, 
  Wrench, 
  HeartHandshake, 
  ShieldCheck, 
  Activity,
  Cpu,
  Leaf,
  Info,
  FileText
} from 'lucide-react';

interface CountryDrilldownModalProps {
  market: MarketPortfolioData;
  onClose: () => void;
  onToggleProduct: (marketId: string, columnId: string, currentValue: boolean) => void;
  onOpenComparison?: (marketId: string) => void;
  onExportPdf?: (marketId: string) => void;
}

export const CountryDrilldownModal: React.FC<CountryDrilldownModalProps> = ({
  market,
  onClose,
  onToggleProduct,
  onOpenComparison,
  onExportPdf
}) => {
  // Selected pillar filter tab (null = view all 6 pillars in sequence)
  const [activePillarTab, setActivePillarTab] = useState<PillarId | 'ALL'>('ALL');

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

  // Find missing must-haves grouped by pillar
  const pillarAlerts = useMemo(() => {
    const alerts: { pillarName: string; missing: string[]; score: number; color: string }[] = [];
    
    PILLARS.forEach((p) => {
      const pCols = ALL_COLUMNS.filter((c) => c.pillar === p.id);
      const mustHaves = pCols.filter((c) => c.importance === 'Must-have');
      const missingMustHaves = mustHaves
        .filter((c) => market.values[c.id] !== true)
        .map((c) => c.subName || c.name);
      const score = market.pillarScores?.[p.id]?.percentage ?? 0;

      if (missingMustHaves.length > 0 || score < 70) {
        alerts.push({
          pillarName: p.shortName,
          missing: missingMustHaves,
          score,
          color: p.accentHex
        });
      }
    });

    return alerts;
  }, [market]);

  const visiblePillars = useMemo(() => {
    if (activePillarTab === 'ALL') {
      return PILLARS;
    }
    return PILLARS.filter((p) => p.id === activePillarTab);
  }, [activePillarTab]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#071b45]/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-50 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-white px-6 py-4.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-4">
            <img 
              src={`https://flagcdn.com/w80/${market.isoCode}.png`} 
              alt={market.country} 
              className="w-12 h-8 object-cover rounded-lg shadow-xs border border-slate-200"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                  {market.region}
                </span>
                <span className="text-xs font-mono text-slate-400">ISO: {market.isoCode.toUpperCase()}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#071b45] mt-0.5">
                {market.country} &mdash; 6 Strategic Pillars Portfolio
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Metrics */}
            <div className="flex items-center gap-3 bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Portfolio</span>
                <span className="text-base font-black text-[#0033a0]">{market.overallCompleteness}% Active</span>
              </div>
            </div>

            {onExportPdf && (
              <button
                onClick={() => onExportPdf(market.id)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#0033a0] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-all shadow-2xs cursor-pointer"
                title="Export executive 1-page PDF for this country"
              >
                <FileText size={14} /> One-Pager PDF
              </button>
            )}

            {onOpenComparison && (
              <button
                onClick={() => onOpenComparison(market.id)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                <ArrowUpRight size={14} /> Compare Market
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Pillar Action Diagnostic Banner (Grouped strictly by Pillar) */}
        {pillarAlerts.length > 0 && (
          <div className="bg-amber-50/90 border-b border-amber-200 px-6 py-2.5 flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle size={17} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-black text-amber-950">Strategic Pillar Commercial Action Gaps Detected:</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pillarAlerts.map((a, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white border border-amber-300 text-amber-950 shadow-2xs"
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }} />
                    <strong>{a.pillarName}:</strong>
                    {a.missing.length > 0 ? (
                      <span>Missing ({a.missing.join(', ')})</span>
                    ) : (
                      <span>Low Coverage ({a.score}%)</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6 Strategic Pillars Quick Bar */}
        <div className="bg-white px-6 py-3 border-b border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Filter by Strategic Pillar:
            </span>
            <span className="text-xs text-slate-400 italic">
              Click any Yes/No badge below to toggle commercial availability in {market.country}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            <button
              onClick={() => setActivePillarTab('ALL')}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                activePillarTab === 'ALL'
                  ? 'bg-[#071b45] text-white border-[#071b45] shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="text-xs font-black block">All 6 Pillars</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {market.overallCompleteness}% Total
              </span>
            </button>

            {PILLARS.map((p) => {
              const isSelected = activePillarTab === p.id;
              const score = market.pillarScores?.[p.id]?.percentage || 0;
              const active = market.pillarScores?.[p.id]?.active || 0;
              const total = market.pillarScores?.[p.id]?.total || 0;
              
              return (
                <button
                  key={p.id}
                  onClick={() => setActivePillarTab(p.id)}
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
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                      {score}%
                    </span>
                  </div>
                  <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {active}/{total} products
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable Content Body - Grouped strictly by Pillar */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {visiblePillars.map((pillar) => {
            const pillarColumns = ALL_COLUMNS.filter((c) => c.pillar === pillar.id);
            const activeCount = pillarColumns.filter((c) => market.values[c.id] === true).length;
            const completeness = Math.round((activeCount / pillarColumns.length) * 100);
            const needsAction = isPillarActionNeeded(market, pillar.id, 'ALL');

            return (
              <div 
                key={pillar.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Pillar Header Banner */}
                <div 
                  className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3"
                  style={{ backgroundColor: `${pillar.accentHex}12` }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: pillar.accentHex }}
                    >
                      {renderPillarIcon(pillar.id, 18)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900">
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

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-600 mr-2">
                        {activeCount} / {pillarColumns.length} Products Active
                      </span>
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg text-white shadow-2xs"
                        style={{ backgroundColor: pillar.accentHex }}
                      >
                        {completeness}%
                      </span>
                    </div>

                    {needsAction ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                        Action Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        On Track
                      </span>
                    )}
                  </div>
                </div>

                {/* Pillar Products Table */}
                <div className="divide-y divide-slate-100">
                  {pillarColumns.map((col) => {
                    const isActive = market.values[col.id] === true;
                    return (
                      <div 
                        key={col.id}
                        className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="pr-4 space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {col.subName || col.name}
                            </span>

                            {/* Range Tag (Essential vs Expert indicator) */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                              col.range === 'Essentials'
                                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                : 'bg-indigo-50 text-[#071b45] border border-indigo-200'
                            }`}>
                              {col.range === 'Essentials' ? 'Essential Range' : 'Expert Range'}
                            </span>

                            {/* Must-Have Tag */}
                            {col.importance === 'Must-have' && (
                              <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                Must-Have
                              </span>
                            )}

                            {/* SubCategory */}
                            {col.subCategory && (
                              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {col.subCategory}
                              </span>
                            )}
                          </div>

                          {col.description && (
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {col.description}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 pl-3">
                          <StatusBadge
                            value={isActive}
                            onClick={() => onToggleProduct(market.id, col.id, isActive)}
                            interactive
                            size="md"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
