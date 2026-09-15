import React, { useState, useEffect } from 'react';
import { MarketPortfolioData, PillarId, ParsedProduct } from '../types';
import { PILLARS } from '../services/dataService';
import { ArrowLeft, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { CountrySelector } from './CountrySelector';
import { NotesDrawer } from './NotesDrawer';
import { RangeActionFooter } from './RangeActionFooter';
import { computeRangeAssessments } from '../services/assessmentEngine';

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

const StaticBentoBox = ({ title, products, renderCard }: { title: string, products: ParsedProduct[], renderCard: (p: ParsedProduct) => JSX.Element }) => {
  if (products.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit flex flex-col">
      <div className="w-full p-3.5 pb-2 bg-white text-left">
        <h5 className="text-xs font-semibold text-[#071b45]">
          {title}
        </h5>
      </div>
      <div className="p-3.5 pt-1">
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5">
          {products.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

const CollapsibleRange = ({ 
  title, 
  completenessLabel, 
  completenessStyle, 
  hasActionNeeded,
  actionCount = 0,
  actionNeededNode, 
  children 
}: { 
  title: string;
  completenessLabel?: string;
  completenessStyle?: string;
  hasActionNeeded?: boolean;
  actionCount?: number;
  actionNeededNode: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl print-avoid-break flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center bg-transparent hover:bg-[#F1F5F9] transition-colors w-full p-5 text-left border-b-2 rounded-t-2xl ${isOpen ? 'border-slate-200/60' : 'border-transparent rounded-b-2xl'}`}
      >
        <div className="flex items-center gap-4">
          <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-wide">
            {title}
          </h4>
          <div className="flex items-center gap-2">
            {completenessLabel && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${completenessStyle}`}>
                {completenessLabel}
              </span>
            )}
            {!isOpen && hasActionNeeded && (
              <div 
                className="relative group/tooltip flex items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <AlertCircle size={16} className="text-amber-500 cursor-help" />
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max bg-[#1E293B] text-white text-[11px] font-medium px-2.5 py-1.5 rounded-md shadow-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity z-50 pointer-events-none text-center">
                  {actionCount > 0 ? (actionCount === 1 ? '1 Assessment Needed' : `${actionCount} Assessments Needed`) : 'Action Needed'}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#1E293B]" />
                </div>
              </div>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 flex flex-col h-full">
          <div className="flex-1">
            {children}
          </div>
          <div className="mt-5 pt-5 border-t border-slate-200/60">
            {actionNeededNode}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GuidedCountryView: React.FC<GuidedCountryViewProps> = ({
  markets,
  products,
  selectedMarketId,
  setSelectedMarketId,
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId | null>(null);
  const [notesDrawerState, setNotesDrawerState] = useState<{
    isOpen: boolean;
    rangeId: string;
    pillarId: string;
    pillarName: string;
    rangeName: string;
  } | null>(null);
  const [notesUpdateCounter, setNotesUpdateCounter] = useState(0);

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

                const essentials = pillarProducts.filter(p => p.isEssential);
                const experts = pillarProducts.filter(p => p.isExpert || !p.isEssential);
                const essActions = computeRangeAssessments(essentials, selectedMarket.values);
                const expActions = computeRangeAssessments(experts, selectedMarket.values);
                const totalActionsCount = essActions.length + expActions.length;
                const hasAction = totalActionsCount > 0;

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
                                {totalActionsCount === 1 ? '1 Assessment Needed' : `${totalActionsCount} Assessments Needed`}
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
                      <div className="flex flex-col mt-0.5">
                        <span className={`${titleStyle} text-[13px] font-medium leading-tight`}>{match[1]}</span>
                        <span className="text-[11px] font-normal text-slate-500 leading-tight">{match[2]}</span>
                      </div>
                    );
                  }
                  return <span className={`${titleStyle} mt-0.5 block text-[13px] font-medium leading-tight`}>{name}</span>;
                };

                const renderProductCard = (product: ParsedProduct) => {
                  const rawValue = selectedMarket.values[product.id] || '';
                  const state = getProductState(rawValue);
                  
                  let cardStyle = 'bg-neutral-50/70 border-neutral-200/60 opacity-60';
                  let nameStyle = 'text-neutral-400';
                  let labelStyle = 'text-neutral-400';
                  let statusBadge: { text: string, style: string } | null = null;

                  if (state === 'active') {
                    cardStyle = 'bg-emerald-50/50 border-emerald-200 shadow-sm';
                    nameStyle = 'text-emerald-900';
                    labelStyle = 'text-emerald-700/70';
                  } else if (state === 'alternative') {
                    cardStyle = 'bg-[#FEFCE8] border-[#FDE047] shadow-sm';
                    nameStyle = 'text-amber-900';
                    labelStyle = 'text-amber-700/70';
                    statusBadge = { text: rawValue, style: 'bg-[#FEF08A] text-[#854D0E]' };
                  } else if (state === 'not_available') {
                    // Uses the same neutral base style as 'inactive'
                    statusBadge = { text: 'Currently not available', style: 'bg-neutral-200/70 text-neutral-600 border border-neutral-300/40 tracking-wide' };
                  }

                  return (
                    <div
                      key={product.id}
                      className={`px-3 py-2 min-h-[48px] rounded-xl border transition-colors flex flex-col justify-between print-avoid-break ${cardStyle}`}
                    >
                      <div>
                        {product.label && (
                          <div className="w-full mb-0.5">
                            <span className={`text-[8px] font-bold uppercase tracking-wider leading-none block w-full ${labelStyle}`}>
                              {product.label}
                            </span>
                          </div>
                        )}
                        {renderProductName(product.name, nameStyle)}
                      </div>
                      
                      {statusBadge && (
                         <div className="flex flex-wrap items-center gap-1.5 justify-end mt-2 w-full">
                           <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded ${statusBadge.style}`}>
                             {statusBadge.text}
                           </span>
                         </div>
                      )}
                    </div>
                  );
                };

                const isHD = pillar.id === 'hd' || pillar.id === 'hvhdf';

                const renderProductGrid = (productList: ParsedProduct[]) => {
                  if (isHD) {
                    const mustHave = productList.filter(p => p.requirement === 'Must-have portfolio');
                    const niceToHave = productList.filter(p => p.requirement === 'Nice-to-have portfolio');
                    const unassigned = productList.filter(p => !p.requirement);

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                        {mustHave.length > 0 && (
                          <StaticBentoBox title="Must-have portfolio" products={mustHave} renderCard={renderProductCard} />
                        )}
                        {niceToHave.length > 0 && (
                          <StaticBentoBox title="Nice-to-have portfolio" products={niceToHave} renderCard={renderProductCard} />
                        )}
                        {unassigned.length > 0 && (
                          <div className="col-span-full">
                            <StaticBentoBox title="Other portfolio" products={unassigned} renderCard={renderProductCard} />
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                        {productList.map(renderProductCard)}
                      </div>
                    );
                  }
                };

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
                      <div className="flex flex-col gap-8">
                        {essentials.length > 0 && (() => {
                          const essActions = computeRangeAssessments(essentials, selectedMarket.values);
                          const storageKey = `notes_${selectedMarket.id}_${pillar.id}_essential`;
                          const savedNotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
                          const notesCount = savedNotes.length;

                          return (
                            <CollapsibleRange
                              title="Essential Range"
                              completenessLabel={selectedMarket.rangeCompleteness?.[pillar.id]?.essential}
                              completenessStyle={
                                selectedMarket.rangeCompleteness?.[pillar.id]?.essential === 'Complete' ? 'bg-emerald-100/50 text-emerald-800' :
                                selectedMarket.rangeCompleteness?.[pillar.id]?.essential === 'Partial' ? 'bg-amber-100/60 text-[#B45309]' :
                                'bg-slate-100 text-slate-600'
                              }
                              hasActionNeeded={essActions.length > 0}
                              actionCount={essActions.length}
                              actionNeededNode={
                                <RangeActionFooter
                                  actionList={essActions}
                                  notesCount={notesCount}
                                  onOpenNotes={() => {
                                    setNotesDrawerState({
                                      isOpen: true,
                                      rangeId: 'essential',
                                      pillarId: pillar.id,
                                      pillarName: pillar.name,
                                      rangeName: 'Essential Range',
                                    });
                                  }}
                                />
                              }
                            >
                              {renderProductGrid(essentials)}
                            </CollapsibleRange>
                          );
                        })()}

                        {experts.length > 0 && (() => {
                          const expActions = computeRangeAssessments(experts, selectedMarket.values);
                          const storageKey = `notes_${selectedMarket.id}_${pillar.id}_expert`;
                          const savedNotes = JSON.parse(localStorage.getItem(storageKey) || '[]');
                          const notesCount = savedNotes.length;

                          return (
                            <CollapsibleRange
                              title="Expert Range"
                              completenessLabel={selectedMarket.rangeCompleteness?.[pillar.id]?.expert}
                              completenessStyle={
                                selectedMarket.rangeCompleteness?.[pillar.id]?.expert === 'Complete' ? 'bg-emerald-100/50 text-emerald-800' :
                                selectedMarket.rangeCompleteness?.[pillar.id]?.expert === 'Partial' ? 'bg-amber-100/60 text-[#B45309]' :
                                'bg-slate-100 text-slate-600'
                              }
                              hasActionNeeded={expActions.length > 0}
                              actionCount={expActions.length}
                              actionNeededNode={
                                <RangeActionFooter
                                  actionList={expActions}
                                  notesCount={notesCount}
                                  onOpenNotes={() => {
                                    setNotesDrawerState({
                                      isOpen: true,
                                      rangeId: 'expert',
                                      pillarId: pillar.id,
                                      pillarName: pillar.name,
                                      rangeName: 'Expert Range',
                                    });
                                  }}
                                />
                              }
                            >
                              {renderProductGrid(experts)}
                            </CollapsibleRange>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {notesDrawerState && selectedMarket && (
        <NotesDrawer
          isOpen={notesDrawerState.isOpen}
          onClose={() => setNotesDrawerState(null)}
          storageKey={`notes_${selectedMarket.id}_${notesDrawerState.pillarId}_${notesDrawerState.rangeId}`}
          pillarName={notesDrawerState.pillarName}
          rangeName={notesDrawerState.rangeName}
          countryName={selectedMarket.country}
          onNotesChange={() => setNotesUpdateCounter(c => c + 1)}
        />
      )}
    </div>
  );
};
