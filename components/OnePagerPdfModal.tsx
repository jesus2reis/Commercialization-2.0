import React, { useState, useRef, useMemo } from 'react';
import { MarketPortfolioData, PillarId } from '../types';
import { PILLARS, ALL_COLUMNS, isPillarActionNeeded } from '../services/dataService';
import { FmcIcon } from './FmcLogo';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  Globe2, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Wrench,
  Leaf,
  ChevronDown,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface OnePagerPdfModalProps {
  markets: MarketPortfolioData[];
  initialCountryId?: string | null;
  onClose: () => void;
}

export const OnePagerPdfModal: React.FC<OnePagerPdfModalProps> = ({
  markets,
  initialCountryId = null,
  onClose
}) => {
  // 'GLOBAL' or market.id
  const [selectedScope, setSelectedScope] = useState<string>(initialCountryId || 'GLOBAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  // Selected Country data (if not global)
  const selectedMarket = useMemo(() => {
    if (selectedScope === 'GLOBAL') return null;
    return markets.find((m) => m.id === selectedScope) || null;
  }, [selectedScope, markets]);

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

  // Global KPIs
  const globalStats = useMemo(() => {
    if (markets.length === 0) return { avgCompleteness: 0, onTrackCount: 0, actionCount: 0, pillarAvgs: {} as Record<PillarId, number>, regionStats: [] as any[] };
    
    const avgCompleteness = Math.round(
      markets.reduce((acc, m) => acc + m.overallCompleteness, 0) / markets.length
    );

    const onTrackCount = markets.filter((m) => !m.overallActionNeeded).length;
    const actionCount = markets.length - onTrackCount;

    const pillarAvgs: Record<string, number> = {};
    PILLARS.forEach((p) => {
      const sum = markets.reduce((acc, m) => acc + (m.pillarScores?.[p.id]?.percentage || 0), 0);
      pillarAvgs[p.id] = Math.round(sum / markets.length);
    });

    // Regional grouping
    const regions = Array.from(new Set(markets.map((m) => m.region)));
    const regionStats = regions.map((reg) => {
      const regMarkets = markets.filter((m) => m.region === reg);
      const regAvg = Math.round(
        regMarkets.reduce((acc, m) => acc + m.overallCompleteness, 0) / regMarkets.length
      );
      const regOnTrack = regMarkets.filter((m) => !m.overallActionNeeded).length;
      return {
        region: reg,
        total: regMarkets.length,
        avgCompleteness: regAvg,
        onTrack: regOnTrack,
        actionReq: regMarkets.length - regOnTrack
      };
    }).sort((a, b) => b.avgCompleteness - a.avgCompleteness);

    return {
      avgCompleteness,
      onTrackCount,
      actionCount,
      pillarAvgs,
      regionStats
    };
  }, [markets]);

  // Handle Export PDF via jsPDF & html2canvas
  const handleDownloadPdf = async () => {
    if (!pdfContainerRef.current) return;
    setIsGenerating(true);

    try {
      const element = pdfContainerRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 2, // High resolution (retina)
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Standard A4 Landscape: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = 297;
      const pdfHeight = 210;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      const fileName = selectedScope === 'GLOBAL' 
        ? `FMC_Global_Portfolio_OnePager_${new Date().toISOString().slice(0, 10)}.pdf`
        : `FMC_${selectedMarket?.country.replace(/\s+/g, '_')}_OnePager_${new Date().toISOString().slice(0, 10)}.pdf`;

      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Direct Browser Print (works natively with @media print)
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#071b45]/75 backdrop-blur-xs animate-in fade-in duration-200 print:p-0 print:bg-white print:static print:inset-auto">
      
      {/* Modal Container */}
      <div className="bg-slate-100 w-full max-w-6xl max-h-[96vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200 print:shadow-none print:border-none print:max-h-none print:w-full print:bg-white print:rounded-none">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 print:hidden shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0033a0] text-white flex items-center justify-center shadow-xs">
              <FileText size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#0033a0] border border-blue-200">
                  A4 Executive Format
                </span>
                <span className="text-xs text-slate-400 font-medium">One-Pager Brief</span>
              </div>
              <h2 className="text-xl font-black text-[#071b45] leading-tight">
                Export Executive One-Pager PDF
              </h2>
            </div>
          </div>

          {/* Scope Selector & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Scope Switcher */}
            <div className="relative">
              <select
                value={selectedScope}
                onChange={(e) => setSelectedScope(e.target.value)}
                className="py-2.5 pl-3 pr-8 text-xs font-bold bg-slate-50 border border-slate-300 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0033a0] cursor-pointer appearance-none"
              >
                <option value="GLOBAL">🌐 Global Portfolio (All 7 Regions)</option>
                <optgroup label="Single Country Executive Brief:">
                  {markets.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.country} ({m.region}) - {m.overallCompleteness}%
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-2xs cursor-pointer"
              title="Print directly or save with browser Print Dialog"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-black text-white bg-[#0033a0] hover:bg-[#071b45] active:scale-95 rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download size={15} />
                  <span>Download One-Pager PDF</span>
                </>
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="Close"
            >
              <X size={20} />
            </button>

          </div>

        </div>

        {/* Scrollable Preview Canvas Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center bg-slate-200/80 custom-scrollbar print:p-0 print:bg-white print:overflow-visible">
          
          {/* THE PRECISE A4 LANDSCAPE ONE-PAGER SHEET (297mm x 210mm ratio = 1.414) */}
          <div 
            ref={pdfContainerRef}
            id="one-pager-print-sheet"
            className="bg-white w-[1050px] min-h-[742px] max-h-[742px] p-6 shadow-xl border border-slate-300 rounded-xl flex flex-col justify-between text-slate-900 select-none overflow-hidden print:w-full print:min-h-0 print:max-h-none print:shadow-none print:border-none print:rounded-none print:p-4"
            style={{ boxSizing: 'border-box' }}
          >
            
            {/* ============================================================== */}
            {/* 1. DOCUMENT HEADER (FMC BRANDED) */}
            {/* ============================================================== */}
            <div className="border-b-2 border-[#0033a0] pb-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center">
                  <FmcIcon className="w-full h-full text-[#0033a0]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-lg text-[#071b45] tracking-tight leading-none">
                      COMMERCIALIZATION 2.0
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#0033a0] text-white">
                      6 Strategic Pillars
                    </span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                    {selectedScope === 'GLOBAL' 
                      ? 'Global Executive Strategic Portfolio Overview • Select a market to analyze coverage'
                      : `Market Commercialization Brief: ${selectedMarket?.country.toUpperCase()} (${selectedMarket?.region})`
                    }
                  </p>
                </div>
              </div>

              {/* Date & Metadata */}
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date of Issue</span>
                <span className="text-xs font-black text-slate-700">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <span className="text-[9px] text-amber-700 font-semibold block mt-0.5">Demo Simulation • Fictitious Data</span>
              </div>
            </div>

            {/* ============================================================== */}
            {/* 2. BODY CONTENT (GLOBAL OR COUNTRY SPECIFIC) */}
            {/* ============================================================== */}
            {selectedScope === 'GLOBAL' ? (
              /* ================= GLOBAL ONE-PAGER VIEW ================= */
              <div className="flex-1 flex flex-col justify-between py-3 gap-3 overflow-hidden">
                
                {/* Row A: Global KPIs Summary Bar */}
                <div className="grid grid-cols-4 gap-3 shrink-0">
                  
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Global Portfolio Health</span>
                      <span className="text-xl font-black text-[#0033a0]">{globalStats.avgCompleteness}%</span>
                      <span className="text-[9px] text-slate-500 block">Avg Country Active Rate</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-[#0033a0] flex items-center justify-center font-bold">
                      <Globe2 size={16} />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-slate-400 block">Countries Monitored</span>
                      <span className="text-xl font-black text-[#071b45]">{markets.length}</span>
                      <span className="text-[9px] text-slate-500 block">Across 7 Global Regions</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                      <Layers size={16} />
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-emerald-800 block">Markets On Track</span>
                      <span className="text-xl font-black text-emerald-700">{globalStats.onTrackCount}</span>
                      <span className="text-[9px] text-emerald-600 font-bold block">
                        {Math.round((globalStats.onTrackCount / markets.length) * 100)}% of Portfolio
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>

                  <div className="bg-rose-50/60 p-2.5 rounded-xl border border-rose-200 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase text-rose-800 block">Action Required</span>
                      <span className="text-xl font-black text-rose-700">{globalStats.actionCount}</span>
                      <span className="text-[9px] text-rose-600 font-bold block">Gaps in Must-Haves</span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                      <AlertTriangle size={16} />
                    </div>
                  </div>

                </div>

                {/* Row B: 6 STRATEGIC PILLARS GRID */}
                <div className="space-y-1.5 shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      6 Strategic Pillars Commercial Performance
                    </span>
                    <span className="text-[9px] text-slate-400">Sheet alignment: HD, HvHDF, Pers., Digital, Serv., Sust.</span>
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {PILLARS.map((p) => {
                      const avg = globalStats.pillarAvgs[p.id] || 0;
                      const pCols = ALL_COLUMNS.filter((c) => c.pillar === p.id);
                      const essCount = pCols.filter((c) => c.range === 'Essentials').length;
                      const expCount = pCols.filter((c) => c.range === 'Expert').length;

                      return (
                        <div 
                          key={p.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between"
                          style={{ borderTopColor: p.accentHex, borderTopWidth: 3 }}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div 
                                className="w-5 h-5 rounded-md text-white flex items-center justify-center text-[10px]"
                                style={{ backgroundColor: p.accentHex }}
                              >
                                {renderPillarIcon(p.id, 11)}
                              </div>
                              <span className="text-xs font-black text-slate-900">{avg}%</span>
                            </div>
                            <h4 className="text-[11px] font-black text-slate-900 leading-tight truncate">
                              {p.shortName}
                            </h4>
                            <p className="text-[9px] text-slate-500 line-clamp-1">
                              {p.tagline}
                            </p>
                          </div>

                          <div className="pt-2 mt-1 border-t border-slate-100 text-[9px] flex items-center justify-between text-slate-500 font-bold">
                            <span>{p.productIds.length} Prods</span>
                            <span className="text-slate-400">{essCount} Ess / {expCount} Exp</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row C: Regional Performance & Priority Action Highlights (2 Columns) */}
                <div className="grid grid-cols-12 gap-3 flex-1 overflow-hidden">
                  
                  {/* Left: Regional Performance Table (7 cols) */}
                  <div className="col-span-7 bg-slate-50 rounded-xl border border-slate-200 p-2.5 flex flex-col justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">
                      Regional Portfolio Performance (7 Regions)
                    </span>
                    
                    <div className="overflow-hidden">
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr className="text-slate-500 border-b border-slate-200 font-black">
                            <th className="pb-1">Region</th>
                            <th className="pb-1 text-center">Markets</th>
                            <th className="pb-1 text-center">Avg Coverage</th>
                            <th className="pb-1 text-center">On Track</th>
                            <th className="pb-1 text-right">Action Req.</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/60 font-semibold text-slate-700">
                          {globalStats.regionStats.map((r) => (
                            <tr key={r.region}>
                              <td className="py-1 font-bold text-slate-900">{r.region}</td>
                              <td className="py-1 text-center">{r.total}</td>
                              <td className="py-1 text-center font-bold text-[#0033a0]">{r.avgCompleteness}%</td>
                              <td className="py-1 text-center text-emerald-700">{r.onTrack}</td>
                              <td className="py-1 text-right text-rose-700 font-bold">{r.actionReq}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: Key Strategic Imperatives (5 cols) */}
                  <div className="col-span-5 bg-blue-50/50 rounded-xl border border-blue-200/80 p-2.5 flex flex-col justify-between text-[10px]">
                    <div>
                      <span className="text-[10px] font-black text-[#0033a0] uppercase tracking-wider block mb-1">
                        Executive Strategic Takeaways
                      </span>
                      <ul className="space-y-1.5 text-slate-700 leading-tight">
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#0033a0] font-black mt-0.5">•</span>
                          <span><strong>HD & HvHDF Leadership:</strong> Core therapy lines show steady adoption across top tier markets with 5008X driving high volume.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#0033a0] font-black mt-0.5">•</span>
                          <span><strong>Personalization & Digital Expansion:</strong> Critical gap in emerging territories lacking Patient App and Therapy Analytics integrations.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-[#0033a0] font-black mt-0.5">•</span>
                          <span><strong>Commercial Focus:</strong> Prioritize {globalStats.actionCount} action-required countries to close must-have product commercial gaps.</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-1.5 rounded-lg bg-white border border-blue-200 text-[9px] text-[#071b45] font-bold text-center">
                      Essential Range establishes standard footprint • Expert Range accelerates differentiation
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              /* ================= COUNTRY SPECIFIC ONE-PAGER VIEW ================= */
              <div className="flex-1 flex flex-col justify-between py-3 gap-2.5 overflow-hidden">
                
                {/* Country Header Strip */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://flagcdn.com/w80/${selectedMarket?.isoCode}.png`} 
                      alt={selectedMarket?.country} 
                      className="w-10 h-6.5 object-cover rounded shadow-2xs border border-slate-200" 
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-[#071b45] leading-tight">
                          {selectedMarket?.country}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.2 bg-white border border-slate-200 text-slate-600 rounded">
                          {selectedMarket?.region}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">ISO: {selectedMarket?.isoCode.toUpperCase()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        Overall Portfolio Commercialization: <strong>{selectedMarket?.overallCompleteness}%</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedMarket?.overallActionNeeded ? (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                        Action Required
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                        On Track
                      </span>
                    )}
                  </div>
                </div>

                {/* 6 Strategic Pillars Grid for Country */}
                <div className="grid grid-cols-6 gap-2 shrink-0">
                  {PILLARS.map((p) => {
                    const score = selectedMarket?.pillarScores?.[p.id]?.percentage || 0;
                    const active = selectedMarket?.pillarScores?.[p.id]?.active || 0;
                    const total = selectedMarket?.pillarScores?.[p.id]?.total || 0;
                    const needsAction = selectedMarket ? isPillarActionNeeded(selectedMarket, p.id, 'ALL') : false;

                    return (
                      <div 
                        key={p.id}
                        className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs"
                        style={{ borderTopColor: p.accentHex, borderTopWidth: 3 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black truncate text-slate-900">{p.shortName}</span>
                          <span className="text-xs font-black" style={{ color: p.accentHex }}>{score}%</span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1 font-bold">
                          <span>{active}/{total} Active</span>
                          <span className={needsAction ? 'text-rose-600' : 'text-emerald-600'}>
                            {needsAction ? 'Action' : 'On Track'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 6 Pillars Detailed Product Matrix (Compact 3x2 Grid) */}
                <div className="grid grid-cols-3 gap-2 flex-1 overflow-hidden">
                  {PILLARS.map((p) => {
                    const pCols = ALL_COLUMNS.filter((c) => c.pillar === p.id);

                    return (
                      <div key={p.id} className="bg-slate-50/70 rounded-xl border border-slate-200 p-2 flex flex-col justify-between overflow-hidden">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.accentHex }} />
                            <span className="text-[10px] font-black text-slate-900">{p.name.split(' (')[0]}</span>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400">{pCols.length} Items</span>
                        </div>

                        <div className="space-y-0.5 my-1 overflow-y-auto custom-scrollbar flex-1">
                          {pCols.map((col) => {
                            const isYes = selectedMarket?.values[col.id] === true;
                            return (
                              <div key={col.id} className="flex items-center justify-between py-0.5 text-[9px]">
                                <span className="truncate pr-1 text-slate-700 font-semibold" title={col.name}>
                                  {col.subName || col.name}
                                </span>
                                <span className={`px-1.5 py-0.2 rounded font-black text-[8px] shrink-0 ${
                                  isYes 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : 'bg-rose-100 text-rose-800'
                                }`}>
                                  {isYes ? 'YES' : 'NO'}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="pt-1 border-t border-slate-200 text-[8px] text-slate-400 flex justify-between">
                          <span>Sheet: {p.sheetName}</span>
                          <span>{p.tagline.split('.')[0]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ============================================================== */}
            {/* 3. DOCUMENT FOOTER */}
            {/* ============================================================== */}
            <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-[9px] text-slate-400 shrink-0">
              <span>Commercialization 2.0 • Demo dataset (All data is fictitious for demonstration purposes)</span>
              <span>Confidential • Internal Executive Review Only</span>
              <span>Page 1 of 1</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
