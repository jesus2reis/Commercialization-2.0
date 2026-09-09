import React, { useState, useEffect } from 'react';
import { MarketPortfolioData, PillarId, ParsedProduct } from '../types';
import { PILLARS } from '../services/dataService';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CountrySelector } from './CountrySelector';

interface GuidedCountryViewProps {
  markets: MarketPortfolioData[];
  products: ParsedProduct[];
  selectedMarketId: string | null;
  setSelectedMarketId: (id: string | null) => void;
}

const getProductState = (val: string) => {
  const v = val?.trim().toLowerCase() || '';
  if (v === 'no' || v === '') return 'inactive';
  if (v.includes('not available')) return 'not_available';
  if (v === 'yes') return 'active';
  return 'alternative';
};

const cleanBreadcrumbs = (path: string[]) => {
  const blacklist = [
    'portfolio', 'portoflio',
    'essentials range', 'essential range', 'expert range', 
    'must-have portfolio', 'must-have', 
    'nice-to-have portfolio', 'nice-to-have'
  ];
  const cleaned = path.filter(p => p && !blacklist.includes(p.toLowerCase().trim()));
  return cleaned.length > 0 ? cleaned.join(' / ') : null;
};

export const GuidedCountryView: React.FC<GuidedCountryViewProps> = ({
  markets,
  products,
  selectedMarketId,
  setSelectedMarketId,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId | null>(null);

  useEffect(() => {
    setSelectedPillarId(null);
  }, [selectedMarketId]);

  const selectedMarket = markets.find(m => m.id === selectedMarketId);

  return (
    <div className={`w-full mx-auto px-4 animate-in fade-in duration-500 flex flex-col ${!selectedMarket ? 'max-w-5xl pb-12' : !selectedPillarId ? 'max-w-7xl pb-12 pt-6' : 'max-w-7xl pb-12 pt-6'}`}>
      
      {!selectedMarket && (
        <div className="w-full text-center pt-16 md:pt-20">
          <h1 className="text-4xl md:text-5xl font-black text-[#071b45] tracking-tight mb-4">
            FME Commercialization Strategy
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Select a market to analyze portfolio coverage.
          </p>
          <div className="w-full flex justify-center print-hidden">
            <div className="w-full max-w-xl">
              <CountrySelector 
                markets={markets}
                selectedMarketId={selectedMarketId}
                setSelectedMarketId={setSelectedMarketId}
                compact={false}
              />
            </div>
          </div>
        </div>
      )}

      {selectedMarket && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {!selectedPillarId && (
            <div className="bg-gradient-to-r from-[#071b45] to-[#0033a0] p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                  {selectedMarket.region}
                </span>
                <h2 className="text-3xl font-black">{selectedMarket.country} Portfolio Strategy</h2>
                <p className="text-blue-100 mt-2 max-w-lg leading-relaxed">
                  Review current product availability and portfolio coverage across all commercial pillars.
                </p>
              </div>
            </div>
          )}

          {!selectedPillarId ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-300 flex-1 min-h-0">
              {PILLARS.map(pillar => {
                const pillarProducts = products.filter(p => p.pillarId === pillar.id);
                if (pillarProducts.length === 0) return null;

                const availableCount = pillarProducts.filter(p => getProductState(selectedMarket.values[p.id]) === 'active').length;
                const totalCount = pillarProducts.length;
                
                let guidanceTitle = "None";
                let guidanceBg = "bg-slate-100 text-slate-600";
                
                if (availableCount > 0 && availableCount < totalCount) {
                  guidanceTitle = "Partial";
                  guidanceBg = "bg-amber-100/60 text-[#B45309]";
                } else if (availableCount === totalCount && totalCount > 0) {
                  guidanceTitle = "Complete";
                  guidanceBg = "bg-emerald-100/50 text-emerald-800";
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
                          <span className="text-slate-900">{guidanceTitle}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pillar.color}`} style={{ width: totalCount > 0 ? `${(availableCount/totalCount)*100}%` : '0%' }} />
                        </div>
                        <div className="flex justify-between text-[11px] font-semibold pt-1">
                          <span className="text-emerald-600">{availableCount} Active</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setSelectedPillarId(null)}
                className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0033a0] transition-colors print-hidden"
              >
                <ArrowLeft size={16} />
                Back to Pillar Overview
              </button>

              {PILLARS.filter(p => p.id === selectedPillarId).map(pillar => {
                const pillarProducts = products.filter(p => p.pillarId === pillar.id);
                if (pillarProducts.length === 0) return null;

                const essentials = pillarProducts.filter(p => p.isEssential);
                const experts = pillarProducts.filter(p => p.isExpert || !p.isEssential);

                const availableCount = pillarProducts.filter(p => getProductState(selectedMarket.values[p.id]) === 'active').length;
                const totalCount = pillarProducts.length;
                
                let guidanceTitle = "None";
                if (availableCount > 0 && availableCount < totalCount) guidanceTitle = "Partial";
                else if (availableCount === totalCount && totalCount > 0) guidanceTitle = "Complete";

                const actionNeededMessages = selectedMarket.actionNeeded[pillar.id] || [];

                const renderProductName = (name: string, titleStyle: string) => {
                  const match = name.match(/^(.*?)\s*(\(.*?\))\s*$/);
                  if (match) {
                    return (
                      <div className="flex flex-col gap-0.5 mt-1">
                        <span className={`${titleStyle} text-[13px] font-semibold leading-tight`}>{match[1]}</span>
                        <span className="text-[11px] font-normal text-slate-500 leading-tight">{match[2]}</span>
                      </div>
                    );
                  }
                  return <span className={`${titleStyle} mt-1 block text-[13px] font-semibold leading-tight`}>{name}</span>;
                };

                const renderProductGrid = (productList: ParsedProduct[]) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productList.map(product => {
                      const rawValue = selectedMarket.values[product.id] || '';
                      const state = getProductState(rawValue);
                      const breadcrumbs = cleanBreadcrumbs(product.categoryPath);
                      const defaultTagText = product.isMustHave ? 'Must-have' : product.isNiceToHave ? 'Nice-to-have' : 'Standard';
                      
                      let cardStyle = 'bg-slate-50 border-slate-200 opacity-60';
                      let nameStyle = 'text-slate-500';
                      let importanceBadgeStyle = 'bg-slate-200 text-slate-500';
                      let statusBadge: { text: string, style: string } | null = null;

                      if (state === 'active') {
                        cardStyle = 'bg-emerald-50/50 border-emerald-200 shadow-sm';
                        nameStyle = 'text-emerald-900';
                        importanceBadgeStyle = 'bg-emerald-100 text-emerald-800';
                      } else if (state === 'alternative') {
                        cardStyle = 'bg-[#FEFCE8] border-[#FDE047] shadow-sm';
                        nameStyle = 'text-amber-900';
                        importanceBadgeStyle = 'bg-amber-100/50 text-amber-700';
                        statusBadge = { text: rawValue, style: 'bg-[#FEF08A] text-[#854D0E]' };
                      } else if (state === 'not_available') {
                        cardStyle = 'bg-slate-50 border-slate-200';
                        nameStyle = 'text-slate-500';
                        importanceBadgeStyle = 'bg-slate-200 text-slate-500';
                        statusBadge = { text: 'Currently not available', style: 'bg-amber-100 text-amber-800' };
                      }

                      return (
                        <div
                          key={product.id}
                          className={`px-4 py-3 rounded-xl border transition-colors flex flex-col justify-between print-avoid-break ${cardStyle}`}
                        >
                          <div>
                            {breadcrumbs && (
                              <div className="w-full mb-1.5">
                                <span className="text-[8px] font-semibold text-slate-500 leading-tight block w-full">
                                  {breadcrumbs}
                                </span>
                              </div>
                            )}
                            {renderProductName(product.name, nameStyle)}
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-1.5 justify-end mt-3 w-full">
                            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded ${importanceBadgeStyle}`}>
                              {defaultTagText}
                            </span>
                            {statusBadge && (
                              <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded ${statusBadge.style}`}>
                                {statusBadge.text}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );

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
                          <span className={`text-lg font-black ${pillar.badgeText}`}>{guidanceTitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      <div className="flex flex-col xl:flex-row gap-8">
                        {essentials.length > 0 && (
                          <div className="flex-1 min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 print-avoid-break">
                            <h4 className="text-[15px] font-black text-slate-900 border-b-2 border-slate-200/60 pb-3 mb-5 uppercase tracking-wide">
                              Essential Range
                            </h4>
                            {renderProductGrid(essentials)}
                          </div>
                        )}

                        {experts.length > 0 && (
                          <div className="flex-1 min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 print-avoid-break">
                            <h4 className="text-[15px] font-black text-slate-900 border-b-2 border-slate-200/60 pb-3 mb-5 uppercase tracking-wide">
                              Expert Range
                            </h4>
                            {renderProductGrid(experts)}
                          </div>
                        )}
                      </div>

                      {/* Action Needed Block */}
                      {actionNeededMessages.length > 0 ? (
                        <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start mt-12 print-avoid-break">
                          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shrink-0">
                            <AlertCircle size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-amber-900 mb-3">Action Needed</h4>
                            <ul className="space-y-2">
                              {actionNeededMessages.map((msg, i) => (
                                <li key={i} className="text-amber-800 text-sm flex items-start gap-2">
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                  <span className="leading-relaxed">{msg}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center mt-12 print-avoid-break">
                          <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 shrink-0">
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-700">No Action Needed</h4>
                            <p className="text-slate-500 text-sm mt-1">This market is fully aligned for this pillar.</p>
                          </div>
                        </div>
                      )}

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
