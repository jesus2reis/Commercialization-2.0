import React, { useState, useMemo } from 'react';
import { 
  MarketPortfolioData, 
  PillarId 
} from '../types';
import { PILLARS } from '../services/dataService';
import { 
  ArrowLeft, 
  Search, 
  Layers, 
  Grid3X3, 
  SlidersHorizontal, 
  AlertTriangle, 
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface HeatmapViewProps {
  markets: MarketPortfolioData[];
  onBack: () => void;
  onSelectCountry: (marketId: string) => void;
}

type MetricType = 'overall' | 'essentials' | 'expert' | PillarId;

export const HeatmapView: React.FC<HeatmapViewProps> = ({
  markets,
  onBack,
  onSelectCountry
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('ALL');
  const [activeMetric, setActiveMetric] = useState<MetricType>('overall');
  const [viewMode, setViewMode] = useState<'sectioned' | 'continuous'>('sectioned');
  const [collapsedRegions, setCollapsedRegions] = useState<Record<string, boolean>>({});

  // Unique regions ordered logically
  const regionOrder = [
    'EMEA WEST',
    'DACH',
    'EMEA EAST',
    'LATAM',
    'APAC',
    'China & HK',
    'United States'
  ];

  // Helper to extract score based on activeMetric
  const getMetricScore = (market: MarketPortfolioData, metric: MetricType): number => {
    if (metric === 'overall') return market.overallCompleteness;
    if (metric === 'essentials') return market.essentials.completeness;
    if (metric === 'expert') return market.expert.completeness;
    return market.pillarScores?.[metric as PillarId]?.percentage || 0;
  };

  const getMetricLabel = (metric: MetricType): string => {
    if (metric === 'overall') return 'Total Completeness';
    if (metric === 'essentials') return 'Essential Range';
    if (metric === 'expert') return 'Expert Range';
    const pillar = PILLARS.find((p) => p.id === metric);
    return pillar ? `Pillar: ${pillar.shortName}` : 'Metric';
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600 text-white border-emerald-700 shadow-xs';
    if (score >= 65) return 'bg-emerald-500/90 text-white border-emerald-600';
    if (score >= 50) return 'bg-blue-500 text-white border-blue-600';
    if (score >= 35) return 'bg-amber-400 text-amber-950 border-amber-500';
    return 'bg-rose-500 text-white border-rose-600';
  };

  const getHeatmapTileBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 text-emerald-950';
    if (score >= 65) return 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300 text-emerald-900';
    if (score >= 50) return 'bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-950';
    if (score >= 35) return 'bg-amber-50 border-amber-200 hover:border-amber-300 text-amber-950';
    return 'bg-rose-50 border-rose-200 hover:border-rose-300 text-rose-950';
  };

  const toggleRegionCollapse = (region: string) => {
    setCollapsedRegions((prev) => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  // Group markets by Region
  const marketsByRegion = useMemo(() => {
    const map: Record<string, MarketPortfolioData[]> = {};

    markets.forEach((m) => {
      // Search filter
      if (
        searchTerm &&
        !m.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.region.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !m.isoCode.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return;
      }

      // Region Filter
      if (selectedRegionFilter !== 'ALL' && m.region !== selectedRegionFilter) {
        return;
      }

      if (!map[m.region]) {
        map[m.region] = [];
      }
      map[m.region].push(m);
    });

    // Sort countries inside each region by selected metric (descending)
    Object.keys(map).forEach((r) => {
      map[r].sort((a, b) => getMetricScore(b, activeMetric) - getMetricScore(a, activeMetric));
    });

    return map;
  }, [markets, searchTerm, selectedRegionFilter, activeMetric]);

  // Sorted list of existing regions in data
  const visibleRegions = useMemo(() => {
    const present = Object.keys(marketsByRegion);
    return regionOrder.filter((r) => present.includes(r)).concat(
      present.filter((r) => !regionOrder.includes(r))
    );
  }, [marketsByRegion]);

  // Continuous list (for continuous view)
  const continuousMarkets = useMemo(() => {
    const all: MarketPortfolioData[] = [];
    visibleRegions.forEach((r) => {
      all.push(...marketsByRegion[r]);
    });
    return all.sort((a, b) => getMetricScore(b, activeMetric) - getMetricScore(a, activeMetric));
  }, [marketsByRegion, visibleRegions, activeMetric]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 animate-in fade-in duration-300 space-y-8">
      
      {/* Top Header & Navigation */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 border border-slate-200"
              title="Return to Overview"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0033a0]" />
                <h1 className="text-2xl sm:text-3xl font-black text-[#071b45]">
                  Global Portfolio Heatmap
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0033a0] text-xs font-bold border border-blue-200">
                  Sectioned by Region
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Thermal maturity visualization grouped and organized across geopolitical regions.
              </p>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('sectioned')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'sectioned' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers size={14} />
              <span>By Region (Sectioned)</span>
            </button>
            <button
              onClick={() => setViewMode('continuous')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'continuous' ? 'bg-white text-[#0033a0] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 size={14} />
              <span>Continuous Global Ranking</span>
            </button>
          </div>
        </div>

        {/* Controls: Metric Switcher, Search, Region */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          
          {/* Metric Selector Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal size={13} />
              Color by:
            </span>
            <button
              onClick={() => setActiveMetric('overall')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeMetric === 'overall'
                  ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Total Completeness
            </button>
            <button
              onClick={() => setActiveMetric('essentials')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeMetric === 'essentials'
                  ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Essential Range
            </button>
            <button
              onClick={() => setActiveMetric('expert')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeMetric === 'expert'
                  ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Expert Range
            </button>

            {/* 6 Strategic Pillars options */}
            {PILLARS.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveMetric(p.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  activeMetric === p.id
                    ? `${p.color} text-white border-transparent shadow-2xs`
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p.shortName}
              </button>
            ))}
          </div>

          {/* Search & Region Filter */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Filter by country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              {regionOrder.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500 font-semibold">
            <Info size={14} className="text-slate-400" />
            <span>Active Metric: <strong className="text-slate-800">{getMetricLabel(activeMetric)}</strong></span>
          </div>

          <div className="flex items-center gap-2 font-bold text-[11px]">
            <span className="text-slate-400 mr-1">Scale:</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>&ge; 80% Optimal</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>65-79% High</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>50-64% Moderate</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>35-49% Low</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>&lt; 35% Critical</span>
            </div>
          </div>
        </div>
      </div>

      {/* HEATMAP CONTENT */}
      {viewMode === 'sectioned' ? (
        
        /* SECTIONED BY REGION */
        <div className="space-y-6">
          {visibleRegions.map((regionName) => {
            const countryList = marketsByRegion[regionName] || [];
            if (countryList.length === 0) return null;

            const isCollapsed = collapsedRegions[regionName] || false;
            const regionAvg = Math.round(
              countryList.reduce((acc, m) => acc + getMetricScore(m, activeMetric), 0) / countryList.length
            );
            const regionActionCount = countryList.filter((m) => m.overallActionNeeded).length;

            return (
              <div
                key={regionName}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all"
              >
                {/* Region Section Header */}
                <div
                  onClick={() => toggleRegionCollapse(regionName)}
                  className="px-6 py-4 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200 flex items-center justify-between cursor-pointer transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#0033a0]" />
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-[#071b45]">
                        {regionName}
                      </h2>
                      <span className="text-xs font-semibold text-slate-500">
                        {countryList.length} markets analyzed
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Region Stats */}
                    <div className="hidden sm:flex items-center gap-3 text-xs font-bold">
                      <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 mr-1">Average:</span>
                        <span className="text-slate-900 font-black">{regionAvg}%</span>
                      </div>

                      {regionActionCount > 0 ? (
                        <div className="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200 flex items-center gap-1">
                          <AlertTriangle size={13} />
                          <span>{regionActionCount} with Gaps</span>
                        </div>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 size={13} />
                          <span>100% On-Track</span>
                        </div>
                      )}
                    </div>

                    <div className="text-slate-400 hover:text-slate-700 transition-colors p-1">
                      {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </div>
                  </div>
                </div>

                {/* Country Heat Tiles Grid */}
                {!isCollapsed && (
                  <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {countryList.map((m) => {
                      const score = getMetricScore(m, activeMetric);
                      return (
                        <div
                          key={m.id}
                          onClick={() => onSelectCountry(m.id)}
                          className={`${getHeatmapTileBg(score)} p-4 rounded-xl border shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3 relative`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black uppercase tracking-wider text-slate-600 bg-white/70 px-1.5 py-0.5 rounded border border-slate-200/50">
                                {m.isoCode}
                              </span>

                              <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${getHeatmapColor(score)}`}>
                                {score}%
                              </span>
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0033a0] transition-colors line-clamp-1">
                              {m.country}
                            </h4>
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-slate-200/40 text-[11px] font-semibold text-slate-600">
                            <div className="flex justify-between items-center text-[10px]">
                              <span>Essential: <strong>{m.essentials.completeness}%</strong></span>
                              <span>Expert: <strong>{m.expert.completeness}%</strong></span>
                            </div>

                            {/* Missing must have badge */}
                            {m.overallActionNeeded && (
                              <div className="flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-100/80 px-1.5 py-0.5 rounded">
                                <AlertTriangle size={10} />
                                <span>Must-Have Gaps</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      ) : (

        /* CONTINUOUS RANKING VIEW */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Global Ranking ({continuousMarkets.length} markets) sorted by {getMetricLabel(activeMetric)}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {continuousMarkets.map((m, idx) => {
              const score = getMetricScore(m, activeMetric);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectCountry(m.id)}
                  className={`${getHeatmapTileBg(score)} p-4 rounded-xl border shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-3`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">#{idx + 1}</span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${getHeatmapColor(score)}`}>
                        {score}%
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#0033a0] transition-colors line-clamp-1">
                      {m.country}
                    </h4>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">
                      {m.region}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/40 flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                    <span>Overall: <strong>{m.overallCompleteness}%</strong></span>
                    {m.overallActionNeeded && (
                      <span className="w-2 h-2 rounded-full bg-rose-500" title="Action Required" />
                    )}
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
