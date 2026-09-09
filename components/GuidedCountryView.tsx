import React, { useState, useEffect } from 'react';
import { MarketPortfolioData, PillarId, ParsedProduct } from '../types';
import { PILLARS } from '../services/dataService';
import { ArrowLeft, AlertCircle, CheckCircle2, Info } from 'lucide-react';
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

                const actionNeededMessages = selectedMarket.actionNeeded[pillar.id] || [];
                const validActionMessages = actionNeededMessages.filter(msg => msg && msg.toLowerCase() !== 'no' && msg.toLowerCase() !== 'none' && msg !== '-');
                const hasAction = validActionMessages.length > 0;

                return (
                  <button 
                    key={pillar.id}
                    onClick={() => setSelectedPillarId(pillar.id)}
                    className="flex flex-col text-left bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-[#0033a0]/40 hover:-translate-y-1 transition-all overflow-visible group h-full relative"
                  >
                    <div className={`p-4 xl:p-5 border-b border-slate-100 flex flex-col gap-2 ${pillar.badgeBg} transition-colors group-hover:bg-opacity-80 shrink-0 rounded-t-3xl`}>
                      <div className="flex justify-between items-start w-full gap-2">
                        <div className="inline-flex items-center gap-3">
                          <h3 className="text-2xl md:text-3xl font-bold text-[#071b45]">{pillar.name}</h3>
                          {hasAction && (
                            <div className="relative group/tooltip flex items-center">
                              <Info 
                                size={16} 
                                className="text-amber-500 cursor-help" 
                              />
                              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-[#1E293B] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md shadow-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 pointer-events-none text-center">
                                Action Needed
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#1E293B]" />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 xl:p-5 flex-1 flex flex-col justify-between gap-4">
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
                        <h3 className={`text-2xl font-black ${pillar.badgeText}`}>{pillar.name}</h3>
                        <p className={`text-sm mt-1 opacity-80 ${pillar.badgeText} max-w-xl`}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
                        </p>
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
                          <div className="flex-1 min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 print-avoid-break flex flex-col">
                            <div className="flex justify-between items-center border-b-2 border-slate-200/60 pb-3 mb-5">
                              <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-wide">
                                Essential Range
                              </h4>
                              {selectedMarket.rangeCompleteness?.[pillar.id]?.essential && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  selectedMarket.rangeCompleteness[pillar.id].essential === 'Complete' ? 'bg-emerald-100/50 text-emerald-800' :
                                  selectedMarket.rangeCompleteness[pillar.id].essential === 'Partial' ? 'bg-amber-100/60 text-[#B45309]' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {selectedMarket.rangeCompleteness[pillar.id].essential}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              {renderProductGrid(essentials)}
                            </div>
                            <div className="mt-5 pt-5 border-t border-slate-200/60">
                              {(() => {
                                const action = selectedMarket.rangeActionNeeded?.[pillar.id]?.essential;
                                const hasAction = action && action.toLowerCase() !== 'no' && action.toLowerCase() !== 'none' && action !== '-';
                                if (hasAction) {
                                  const text = action.toLowerCase() === 'yes' ? 'Action Needed' : action;
                                  return (
                                    <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                      <div>
                                        <h5 className="text-sm font-bold text-slate-900 mb-0.5">Action Needed</h5>
                                        <p className="text-xs text-slate-600">{text}</p>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="bg-white/50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                                    <CheckCircle2 className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                      <h5 className="text-sm font-bold text-slate-600 mb-0.5">No Action Needed</h5>
                                      <p className="text-xs text-slate-500">Requirements are fulfilled for this range.</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}

                        {experts.length > 0 && (
                          <div className="flex-1 min-w-0 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 print-avoid-break flex flex-col">
                            <div className="flex justify-between items-center border-b-2 border-slate-200/60 pb-3 mb-5">
                              <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-wide">
                                Expert Range
                              </h4>
                              {selectedMarket.rangeCompleteness?.[pillar.id]?.expert && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  selectedMarket.rangeCompleteness[pillar.id].expert === 'Complete' ? 'bg-emerald-100/50 text-emerald-800' :
                                  selectedMarket.rangeCompleteness[pillar.id].expert === 'Partial' ? 'bg-amber-100/60 text-[#B45309]' :
                                  'bg-slate-100 text-slate-600'
                                }`}>
                                  {selectedMarket.rangeCompleteness[pillar.id].expert}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              {renderProductGrid(experts)}
                            </div>
                            <div className="mt-5 pt-5 border-t border-slate-200/60">
                              {(() => {
                                const action = selectedMarket.rangeActionNeeded?.[pillar.id]?.expert;
                                const hasAction = action && action.toLowerCase() !== 'no' && action.toLowerCase() !== 'none' && action !== '-';
                                if (hasAction) {
                                  const text = action.toLowerCase() === 'yes' ? 'Action Needed' : action;
                                  return (
                                    <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm flex items-start gap-3">
                                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                      <div>
                                        <h5 className="text-sm font-bold text-slate-900 mb-0.5">Action Needed</h5>
                                        <p className="text-xs text-slate-600">{text}</p>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="bg-white/50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                                    <CheckCircle2 className="text-slate-400 shrink-0 mt-0.5" size={18} />
                                    <div>
                                      <h5 className="text-sm font-bold text-slate-600 mb-0.5">No Action Needed</h5>
                                      <p className="text-xs text-slate-500">Requirements are fulfilled for this range.</p>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
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
