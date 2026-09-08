import React, { useState, useEffect } from 'react';
import { MarketPortfolioData, PillarId } from '../types';
import { ALL_COLUMNS, PILLARS } from '../services/dataService';
import { AlertCircle, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { CountrySelector } from './CountrySelector';

interface GuidedCountryViewProps {
  markets: MarketPortfolioData[];
  selectedMarketId: string | null;
  setSelectedMarketId: (id: string | null) => void;
  onToggleProduct: (marketId: string, columnId: string, currentValue: boolean) => void;
}

export const GuidedCountryView: React.FC<GuidedCountryViewProps> = ({
  markets,
  selectedMarketId,
  setSelectedMarketId,
  onToggleProduct
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId | null>(null);

  // Reset pillar selection when changing market
  useEffect(() => {
    setSelectedPillarId(null);
  }, [selectedMarketId]);

  const selectedMarket = markets.find(m => m.id === selectedMarketId);

  return (
    <div className={`w-full mx-auto px-4 animate-in fade-in duration-500 flex flex-col ${!selectedMarket ? 'max-w-5xl py-12' : !selectedPillarId ? 'max-w-7xl h-[calc(100vh-4rem)] py-6' : 'max-w-7xl py-6'}`}>
      
      {/* Header & Goal Statement */}
      {!selectedMarket && (
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-3xl md:text-5xl font-black text-[#071b45] tracking-tight">
            Portfolio Optimization
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Select a market to understand its current state, identify portfolio gaps, and discover cross-pillar opportunities for growth.
          </p>
        </div>
      )}

      {/* Country Selection Dropdown (Only show here if NOT selected) */}
      {!selectedMarket && (
        <CountrySelector 
          markets={markets}
          selectedMarketId={selectedMarketId}
          setSelectedMarketId={setSelectedMarketId}
          compact={false}
        />
      )}

      {/* Selected Country Details */}
      {selectedMarket && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="bg-gradient-to-r from-[#071b45] to-[#0033a0] p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                {selectedMarket.region}
              </span>
              <h2 className="text-3xl font-black">{selectedMarket.country} Portfolio Strategy</h2>
              <p className="text-blue-100 mt-2 max-w-lg leading-relaxed">
                Review current registrations, identify strategic gaps, and uncover opportunities for optimization across all commercial pillars.
              </p>
            </div>
          </div>

          {!selectedPillarId ? (
            /* BENTO GRID OVERVIEW */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-300 flex-1 min-h-0">
              {PILLARS.map(pillar => {
                const pillarCols = ALL_COLUMNS.filter(c => c.pillar === pillar.id);
                if (pillarCols.length === 0) return null;

                const availableCols = pillarCols.filter(c => selectedMarket.values[c.id] === true);
                const coverage = Math.round((availableCols.length / pillarCols.length) * 100);

                let guidanceTitle = "Maintain & Leverage";
                let guidanceColor = "text-emerald-700";
                let guidanceBg = "bg-emerald-100/50 text-emerald-800";
                
                if (coverage === 0) {
                  guidanceTitle = "Critical Gap";
                  guidanceColor = "text-rose-700";
                  guidanceBg = "bg-rose-100/50 text-rose-800";
                } else if (coverage < 50) {
                  guidanceTitle = "Opportunity";
                  guidanceColor = "text-amber-700";
                  guidanceBg = "bg-amber-100/50 text-amber-800";
                } else if (coverage < 100) {
                  guidanceTitle = "Optimize";
                  guidanceColor = "text-blue-700";
                  guidanceBg = "bg-blue-100/50 text-blue-800";
                }

                return (
                  <button 
                    key={pillar.id}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className="flex flex-col text-left bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0033a0]/40 hover:-translate-y-1 transition-all overflow-hidden group h-full"
                  >
                    <div className={`p-4 xl:p-5 border-b border-slate-100 flex flex-col gap-2 ${pillar.badgeBg} transition-colors group-hover:bg-opacity-80 shrink-0`}>
                      <div className="flex justify-between items-start w-full gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${pillar.badgeText}`}>
                          Strategic Pillar
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${guidanceBg} shrink-0`}>
                          {guidanceTitle}
                        </span>
                      </div>
                      <h3 className={`text-xl font-black ${pillar.badgeText}`}>{pillar.name}</h3>
                    </div>
                    
                    <div className="p-4 xl:p-5 flex-1 flex flex-col justify-between gap-4">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {pillar.tagline}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-500">Coverage</span>
                          <span className="text-slate-900">{coverage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pillar.color}`} style={{ width: `${coverage}%` }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold pt-1">
                          <span className="text-emerald-600">{availableCols.length} Active</span>
                          <span className="text-rose-500 opacity-80">{pillarCols.length - availableCols.length} Gaps</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* DETAILED PILLAR VIEW */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setSelectedPillarId(null)}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0033a0] transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Pillar Overview
              </button>

              {PILLARS.filter(p => p.id === selectedPillarId).map(pillar => {
                const pillarCols = ALL_COLUMNS.filter(c => c.pillar === pillar.id);
                if (pillarCols.length === 0) return null;

                const availableCols = pillarCols.filter(c => selectedMarket.values[c.id] === true);
                const gapCols = pillarCols.filter(c => selectedMarket.values[c.id] !== true);

                const availableEssentials = availableCols.filter(c => c.range === 'Essentials');
                const availableExpert = availableCols.filter(c => c.range === 'Expert');

                const gapEssentials = gapCols.filter(c => c.range === 'Essentials');
                const gapExpert = gapCols.filter(c => c.range === 'Expert');

                const coverage = Math.round((availableCols.length / pillarCols.length) * 100);

                let guidanceTitle = "Maintain & Leverage";
                let guidanceText = `The ${pillar.name} portfolio is well established. Focus on maximizing current commercialized products.`;
                let guidanceColor = "text-emerald-700";
                let guidanceBg = "bg-emerald-50 border-emerald-200";
                
                if (coverage === 0) {
                  guidanceTitle = "Critical Gap";
                  guidanceText = `No products are currently mapped for ${pillar.name}. Review if this aligns with the market's strategic goals or if phase-in planning is required.`;
                  guidanceColor = "text-rose-700";
                  guidanceBg = "bg-rose-50 border-rose-200";
                } else if (coverage < 50) {
                  guidanceTitle = "Opportunity for Growth";
                  guidanceText = `The ${pillar.name} portfolio has significant gaps. Opportunity to expand the business by reviewing the unregistered products with the relevant team.`;
                  guidanceColor = "text-amber-700";
                  guidanceBg = "bg-amber-50 border-amber-200";
                } else if (coverage < 100) {
                  guidanceTitle = "Portfolio Optimization";
                  guidanceText = `Strong coverage in ${pillar.name}. Evaluate the remaining gaps to see if targeted phase-ins could complete the offering.`;
                  guidanceColor = "text-blue-700";
                  guidanceBg = "bg-blue-50 border-blue-200";
                }

                return (
                  <div key={pillar.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md">
                    <div className={`px-6 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 ${pillar.badgeBg}`}>
                      <div>
                        <span className={`text-[10px] font-black uppercase tracking-wider ${pillar.badgeText}`}>
                          Strategic Pillar Analysis
                        </span>
                        <h3 className={`text-2xl font-black ${pillar.badgeText}`}>{pillar.name}</h3>
                        <p className={`text-sm mt-1 opacity-80 ${pillar.badgeText} max-w-xl`}>{pillar.description}</p>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs font-bold text-slate-500 mb-1">Pillar Coverage</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-white/50 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pillar.color}`} style={{ width: `${coverage}%` }} />
                          </div>
                          <span className={`text-lg font-black ${pillar.badgeText}`}>{coverage}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      {/* Current State */}
                      <div className="space-y-5">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                          <CheckCircle2 size={18} className="text-emerald-500" />
                          Current Portfolio ({availableCols.length})
                        </h4>
                        <div className="space-y-4">
                          {availableCols.length === 0 ? (
                            <span className="text-sm text-slate-400 italic">No products currently available.</span>
                          ) : (
                            <>
                              {availableEssentials.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Essential Range</span>
                                  <div className="flex flex-wrap gap-2.5">
                                    {availableEssentials.map(col => (
                                      <button
                                        key={col.id}
                                        onClick={() => onToggleProduct(selectedMarket.id, col.id, true)}
                                        className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors group flex items-center gap-1.5 shadow-sm"
                                        title="Click to remove from portfolio"
                                      >
                                        {col.subName || col.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {availableExpert.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expert Range</span>
                                  <div className="flex flex-wrap gap-2.5">
                                    {availableExpert.map(col => (
                                      <button
                                        key={col.id}
                                        onClick={() => onToggleProduct(selectedMarket.id, col.id, true)}
                                        className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 transition-colors group flex items-center gap-1.5 shadow-sm"
                                        title="Click to remove from portfolio"
                                      >
                                        {col.subName || col.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Future State / Gaps */}
                      <div className="space-y-5">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                          <AlertCircle size={18} className="text-amber-500" />
                          Gaps & Opportunities ({gapCols.length})
                        </h4>
                        <div className="space-y-4">
                          {gapCols.length === 0 ? (
                            <span className="text-sm text-slate-400 italic">Portfolio is complete.</span>
                          ) : (
                            <>
                              {gapEssentials.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Essential Range</span>
                                  <div className="flex flex-wrap gap-2.5">
                                    {gapEssentials.map(col => (
                                      <button
                                        key={col.id}
                                        onClick={() => onToggleProduct(selectedMarket.id, col.id, false)}
                                        className="px-3.5 py-2 bg-rose-50 border border-dashed border-rose-300 text-rose-700 text-xs font-semibold rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm transition-all flex items-center gap-1.5"
                                        title="Click to add to portfolio"
                                      >
                                        + {col.subName || col.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {gapExpert.length > 0 && (
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expert Range</span>
                                  <div className="flex flex-wrap gap-2.5">
                                    {gapExpert.map(col => (
                                      <button
                                        key={col.id}
                                        onClick={() => onToggleProduct(selectedMarket.id, col.id, false)}
                                        className="px-3.5 py-2 bg-amber-50 border border-dashed border-amber-300 text-amber-700 text-xs font-semibold rounded-xl hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm transition-all flex items-center gap-1.5"
                                        title="Click to add to portfolio"
                                      >
                                        + {col.subName || col.name}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Guidance Block */}
                    <div className={`p-5 mx-8 mb-8 rounded-2xl border ${guidanceBg}`}>
                      <div className="flex items-start gap-4">
                        <ArrowRight size={20} className={`mt-0.5 ${guidanceColor}`} />
                        <div>
                          <h5 className={`text-base font-bold ${guidanceColor} mb-1`}>{guidanceTitle}</h5>
                          <p className={`text-sm ${guidanceColor} opacity-90 leading-relaxed`}>{guidanceText}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
