import React, { useMemo } from 'react';
import { MarketPortfolioData } from '../types';
import { 
  ALL_COLUMNS, 
  PILLARS, 
  calculateRegionSummaries 
} from '../services/dataService';
import { 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  AlertCircle, 
  Award, 
  CheckCircle2,
  BarChart3,
  Layers,
  Activity,
  ShieldCheck,
  HeartHandshake,
  Cpu,
  Wrench,
  Leaf
} from 'lucide-react';

interface AnalyticsViewProps {
  markets: MarketPortfolioData[];
  onBack: () => void;
  onSelectCountry: (marketId: string) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  markets,
  onBack,
  onSelectCountry
}) => {
  const regionSummaries = useMemo(() => calculateRegionSummaries(markets), [markets]);

  // Pillar icon helper
  const renderPillarIcon = (id: string, size: number = 18) => {
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

  // Global Pillar Penetration stats
  const pillarStats = useMemo(() => {
    return PILLARS.map((p) => {
      const avg = Math.round(
        markets.reduce((acc, m) => acc + (m.pillarScores?.[p.id]?.percentage || 0), 0) / (markets.length || 1)
      );
      const optimalMarkets = markets.filter((m) => (m.pillarScores?.[p.id]?.percentage || 0) >= 75).length;
      return {
        ...p,
        avgPercentage: avg,
        optimalMarkets
      };
    });
  }, [markets]);

  // Product Adoption Rates (Most vs Least adopted products globally)
  const productAdoption = useMemo(() => {
    return ALL_COLUMNS.map((col) => {
      const activeCount = markets.filter((m) => m.values[col.id]).length;
      const rate = Math.round((activeCount / (markets.length || 1)) * 100);
      return {
        id: col.id,
        name: col.subName || col.name,
        range: col.range,
        importance: col.importance,
        pillar: col.pillar,
        group: col.group,
        activeCount,
        rate
      };
    }).sort((a, b) => b.rate - a.rate);
  }, [markets]);

  // Top and Bottom performing markets
  const topMarkets = useMemo(() => {
    return [...markets].sort((a, b) => b.overallCompleteness - a.overallCompleteness).slice(0, 5);
  }, [markets]);

  const gapMarkets = useMemo(() => {
    return [...markets].sort((a, b) => a.overallCompleteness - b.overallCompleteness).slice(0, 5);
  }, [markets]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 border border-slate-200"
          title="Back to Overview"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0033a0]" />
            <h1 className="text-2xl font-black text-[#071b45]">Regional Portfolio Analytics</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Executive benchmarking and adoption analytics across 7 geopolitical regions and 6 strategic pillars.
          </p>
        </div>
      </div>

      {/* 6 Strategic Pillars League */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-[#0033a0]" />
            <h3 className="text-base font-bold text-slate-900">
              Global Adoption Across 6 Strategic Pillars
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Average across {markets.length} markets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {pillarStats.map((pillar) => (
            <div
              key={pillar.id}
              className={`p-4 rounded-2xl border ${pillar.borderColor} ${pillar.badgeBg} flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-8 h-8 rounded-xl ${pillar.color} text-white flex items-center justify-center`}>
                  {renderPillarIcon(pillar.id, 16)}
                </div>
                <span className="text-lg font-black text-slate-900">{pillar.avgPercentage}%</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 truncate">{pillar.name}</h4>
                <span className="text-[10px] text-slate-500 font-semibold block">Sheet: {pillar.sheetName}</span>
              </div>

              <div className="w-full bg-white/80 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${pillar.color}`}
                  style={{ width: `${pillar.avgPercentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Regional Performance Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Globe size={18} className="text-[#0033a0]" />
          <span>Regional Geopolitical Performance</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {regionSummaries.map((reg) => (
            <div 
              key={reg.region}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-black text-[#071b45]">{reg.region}</h4>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600">
                    {reg.marketCount} Markets
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Overall Coverage</span>
                      <span className="font-black text-[#0033a0]">{reg.avgOverallCompleteness}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          reg.avgOverallCompleteness >= 75 ? 'bg-emerald-500' : 'bg-[#0033a0]'
                        }`}
                        style={{ width: `${reg.avgOverallCompleteness}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-slate-500 pt-1 font-semibold">
                    <span>Essentials: <b>{reg.avgEssentialsCompleteness}%</b></span>
                    <span>Expert: <b>{reg.avgExpertCompleteness}%</b></span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500">Action Required:</span>
                {reg.marketsNeedingAction > 0 ? (
                  <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {reg.marketsNeedingAction} of {reg.marketCount} markets
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> 100% On-Track
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Adoption Ranking & Top/Bottom Country League */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Most Adopted Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Highest Adopted Products</h3>
          </div>

          <div className="space-y-3">
            {productAdoption.slice(0, 6).map((prod) => (
              <div key={prod.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span className="truncate pr-2">{prod.name} ({prod.range})</span>
                  <span className="text-emerald-600">{prod.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${prod.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expansion Opportunity Products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Expansion Growth Opportunities</h3>
          </div>

          <div className="space-y-3">
            {productAdoption.slice(-6).reverse().map((prod) => (
              <div key={prod.id} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span className="truncate pr-2">{prod.name} ({prod.range})</span>
                  <span className="text-amber-600">{prod.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${prod.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top & Low Benchmark Markets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Award size={18} className="text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Leading Market Benchmarks</h3>
            </div>
            <div className="space-y-2">
              {topMarkets.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => onSelectCountry(m.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 cursor-pointer transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase">{m.isoCode}</span>
                    <span>{m.country}</span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-black">
                    {m.overallCompleteness}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Priority Focus Countries</h4>
            <div className="space-y-2">
              {gapMarkets.map((m) => (
                <div 
                  key={m.id}
                  onClick={() => onSelectCountry(m.id)}
                  className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 hover:bg-rose-100/60 cursor-pointer transition-colors text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 uppercase">{m.isoCode}</span>
                    <span>{m.country}</span>
                  </div>
                  <span className="text-rose-700 bg-rose-100 px-2 py-0.5 rounded font-black">
                    {m.overallCompleteness}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
