import React, { useState, useMemo } from 'react';
import { 
  MarketPortfolioData, 
  PillarDefinition, 
  PillarId, 
  ColumnDefinition 
} from '../types';
import { 
  PILLARS, 
  ALL_COLUMNS, 
  ESSENTIALS_COLUMNS, 
  EXPERT_COLUMNS 
} from '../services/dataService';
import { StatusBadge } from './StatusBadge';
import { 
  Activity, 
  ShieldCheck, 
  HeartHandshake, 
  Cpu, 
  Wrench, 
  Leaf, 
  Layers, 
  Search, 
  ArrowRight, 
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';

interface PillarsViewProps {
  markets: MarketPortfolioData[];
  onSelectCountry: (marketId: string) => void;
  onToggleProduct: (marketId: string, columnId: string, currentValue: boolean) => void;
  onNavigateToMatrixWithPillar?: (pillarId: PillarId) => void;
}

export const PillarsView: React.FC<PillarsViewProps> = ({
  markets,
  onSelectCountry,
  onToggleProduct,
  onNavigateToMatrixWithPillar
}) => {
  const [selectedPillarId, setSelectedPillarId] = useState<PillarId>('hd');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPTIMAL' | 'MODERATE' | 'GAP'>('ALL');

  const selectedPillar = useMemo(() => {
    return PILLARS.find((p) => p.id === selectedPillarId) || PILLARS[0];
  }, [selectedPillarId]);

  // Products belonging to the selected pillar
  const pillarProducts = useMemo(() => {
    return ALL_COLUMNS.filter((c) => c.pillar === selectedPillarId);
  }, [selectedPillarId]);

  const essentialsPillarProducts = useMemo(() => {
    return ESSENTIALS_COLUMNS.filter((c) => c.pillar === selectedPillarId);
  }, [selectedPillarId]);

  const expertPillarProducts = useMemo(() => {
    return EXPERT_COLUMNS.filter((c) => c.pillar === selectedPillarId);
  }, [selectedPillarId]);

  // Unique regions
  const regions = useMemo(() => {
    const set = new Set(markets.map((m) => m.region));
    return ['ALL', ...Array.from(set)];
  }, [markets]);

  // Pillar icon helper
  const renderPillarIcon = (id: PillarId, size: number = 20) => {
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

  // Global Pillar metrics
  const totalMarkets = markets.length;
  const avgPillarScore = Math.round(
    markets.reduce((acc, m) => acc + (m.pillarScores?.[selectedPillarId]?.percentage || 0), 0) / (totalMarkets || 1)
  );

  const optimalMarkets = markets.filter(
    (m) => (m.pillarScores?.[selectedPillarId]?.percentage || 0) >= 75
  );
  const moderateMarkets = markets.filter(
    (m) => (m.pillarScores?.[selectedPillarId]?.percentage || 0) >= 45 && (m.pillarScores?.[selectedPillarId]?.percentage || 0) < 75
  );
  const gapMarkets = markets.filter(
    (m) => (m.pillarScores?.[selectedPillarId]?.percentage || 0) < 45
  );

  // Regional breakdown for this pillar
  const regionalPillarData = useMemo(() => {
    const map: Record<string, { count: number; sum: number }> = {};
    markets.forEach((m) => {
      if (!map[m.region]) map[m.region] = { count: 0, sum: 0 };
      map[m.region].count++;
      map[m.region].sum += m.pillarScores?.[selectedPillarId]?.percentage || 0;
    });

    return Object.keys(map).map((region) => ({
      region,
      marketCount: map[region].count,
      avgScore: Math.round(map[region].sum / map[region].count)
    })).sort((a, b) => b.avgScore - a.avgScore);
  }, [markets, selectedPillarId]);

  // Filtered country list for this pillar
  const filteredCountryRows = useMemo(() => {
    return markets
      .filter((m) => {
        // Search
        if (
          searchTerm &&
          !m.country.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !m.region.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        // Region
        if (selectedRegion !== 'ALL' && m.region !== selectedRegion) {
          return false;
        }
        // Status
        const score = m.pillarScores?.[selectedPillarId]?.percentage || 0;
        if (statusFilter === 'OPTIMAL' && score < 75) return false;
        if (statusFilter === 'MODERATE' && (score < 45 || score >= 75)) return false;
        if (statusFilter === 'GAP' && score >= 45) return false;

        return true;
      })
      .sort((a, b) => {
        const scoreA = a.pillarScores?.[selectedPillarId]?.percentage || 0;
        const scoreB = b.pillarScores?.[selectedPillarId]?.percentage || 0;
        return scoreB - scoreA;
      });
  }, [markets, selectedPillarId, searchTerm, selectedRegion, statusFilter]);

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0033a0]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#071b45]">
              The 6 Strategic Pillars
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0033a0] text-xs font-bold border border-blue-200">
              The 6 Spreadsheet Sheets
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Strategic segmentation across clinical, technological, and operational value lines.
          </p>
        </div>

        {/* Global summary pills of all 6 pillars */}
        <div className="flex flex-wrap gap-2">
          {PILLARS.map((p) => {
            const avg = Math.round(
              markets.reduce((acc, m) => acc + (m.pillarScores?.[p.id]?.percentage || 0), 0) / (totalMarkets || 1)
            );
            const isSelected = p.id === selectedPillarId;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillarId(p.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-[#0033a0] text-white border-[#0033a0] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {renderPillarIcon(p.id, 15)}
                <span>{p.shortName}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {avg}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Pillar Detailed Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        
        {/* Banner */}
        <div className={`p-6 sm:p-8 ${selectedPillar.badgeBg} border-b ${selectedPillar.borderColor} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl ${selectedPillar.color} text-white flex items-center justify-center shadow-xs`}>
                {renderPillarIcon(selectedPillar.id, 24)}
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Spreadsheet Sheet: {selectedPillar.sheetName}
                </span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                  {selectedPillar.name}
                </h2>
              </div>
            </div>

            <p className="text-sm font-semibold text-slate-700 leading-relaxed">
              {selectedPillar.tagline}
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedPillar.description}
            </p>
          </div>

          {/* Quick Metrics Tile */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Global Adoption</span>
              <span className="text-2xl font-black text-slate-900">{avgPillarScore}%</span>
            </div>
            
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  avgPillarScore >= 70 ? 'bg-emerald-500' : avgPillarScore >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${avgPillarScore}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] font-bold">
              <div className="bg-emerald-50 text-emerald-800 p-1.5 rounded-lg border border-emerald-200">
                <span className="block text-sm font-black">{optimalMarkets.length}</span>
                <span className="text-[9px] uppercase">Optimal</span>
              </div>
              <div className="bg-blue-50 text-blue-800 p-1.5 rounded-lg border border-blue-200">
                <span className="block text-sm font-black">{moderateMarkets.length}</span>
                <span className="text-[9px] uppercase">Moderate</span>
              </div>
              <div className="bg-rose-50 text-rose-800 p-1.5 rounded-lg border border-rose-200">
                <span className="block text-sm font-black">{gapMarkets.length}</span>
                <span className="text-[9px] uppercase">Gaps</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar Products Matrix */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-[#0033a0]" />
              <span>Products Mapped in Sheet "{selectedPillar.sheetName}" ({pillarProducts.length} items)</span>
            </h3>

            {onNavigateToMatrixWithPillar && (
              <button
                onClick={() => onNavigateToMatrixWithPillar(selectedPillar.id)}
                className="text-xs font-bold text-[#0033a0] hover:text-[#071b45] flex items-center gap-1.5"
              >
                <span>Filter Strategy Matrix by {selectedPillar.shortName}</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Essentials Products */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#0033a0] uppercase tracking-wider">
                  Essential Range ({essentialsPillarProducts.length} products)
                </span>
              </div>

              {essentialsPillarProducts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No Essential Range products mapped in this pillar.</p>
              ) : (
                <div className="space-y-2">
                  {essentialsPillarProducts.map((p) => {
                    const activeCount = markets.filter((m) => m.values[p.id] === true).length;
                    const pct = Math.round((activeCount / totalMarkets) * 100);
                    return (
                      <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{p.subName || p.name}</span>
                            {p.importance === 'Must-have' && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                Must-Have
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{p.group} {p.subCategory ? `• ${p.subCategory}` : ''}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-800">{pct}%</span>
                          <span className="block text-[10px] text-slate-400">{activeCount}/{totalMarkets} markets</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Expert Products */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#071b45] uppercase tracking-wider">
                  Expert Range ({expertPillarProducts.length} products)
                </span>
              </div>

              {expertPillarProducts.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No Expert Range products mapped in this pillar.</p>
              ) : (
                <div className="space-y-2">
                  {expertPillarProducts.map((p) => {
                    const activeCount = markets.filter((m) => m.values[p.id] === true).length;
                    const pct = Math.round((activeCount / totalMarkets) * 100);
                    return (
                      <div key={p.id} className="bg-white p-3 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{p.subName || p.name}</span>
                            {p.importance === 'Must-have' && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                Must-Have
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{p.group} {p.subCategory ? `• ${p.subCategory}` : ''}</span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black text-slate-800">{pct}%</span>
                          <span className="block text-[10px] text-slate-400">{activeCount}/{totalMarkets} markets</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Regional Penetration Bar Chart */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Regional Adoption in {selectedPillar.name}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {regionalPillarData.map((reg) => (
                <div key={reg.region} className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1.5 text-center shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-600 truncate block">{reg.region}</span>
                  <div className="text-lg font-black text-[#0033a0]">{reg.avgScore}%</div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0033a0] h-full rounded-full"
                      style={{ width: `${reg.avgScore}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{reg.marketCount} markets</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Country Breakdown for this Pillar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Market Performance in {selectedPillar.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Ranked by coverage in this pillar. Click any row to view full portfolio.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Search country or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Regions</option>
              {regions.filter(r => r !== 'ALL').map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPTIMAL">Leaders (&ge;75%)</option>
              <option value="MODERATE">Moderate (45-74%)</option>
              <option value="GAP">Gaps (&lt;45%)</option>
            </select>
          </div>
        </div>

        {/* Table of countries */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Country</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 text-center">Score in {selectedPillar.shortName}</th>
                <th className="py-3 px-4 text-center">Total Completeness</th>
                <th className="py-3 px-4">Active Products ({selectedPillar.shortName})</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredCountryRows.slice(0, 40).map((m) => {
                const pScore = m.pillarScores?.[selectedPillarId]?.percentage || 0;
                const pActive = m.pillarScores?.[selectedPillarId]?.active || 0;
                const pTotal = m.pillarScores?.[selectedPillarId]?.total || 0;

                return (
                  <tr 
                    key={m.id}
                    onClick={() => onSelectCountry(m.id)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded bg-slate-100 text-slate-600 text-[10px] font-black flex items-center justify-center uppercase">
                        {m.isoCode}
                      </span>
                      <span>{m.country}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-500 font-semibold">
                      {m.region}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full font-black text-xs ${
                          pScore >= 75 ? 'bg-emerald-100 text-emerald-800' : pScore >= 45 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {pScore}%
                        </span>
                        <span className="text-[11px] text-slate-400 font-semibold">({pActive}/{pTotal})</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="font-bold text-slate-700">{m.overallCompleteness}%</span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-xl">
                        {pillarProducts.map((p) => {
                          const isActive = m.values[p.id] === true;
                          return (
                            <button
                              key={p.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleProduct(m.id, p.id, isActive);
                              }}
                              title={`${p.subName || p.name}: ${isActive ? 'Active (Yes)' : 'Inactive (No)'}. Click to toggle.`}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all border ${
                                isActive 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                  : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {p.subName || p.name.split(' ')[0]} {isActive ? '✓' : '✗'}
                            </button>
                          );
                        })}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCountry(m.id);
                        }}
                        className="text-xs font-bold text-[#0033a0] hover:text-[#071b45] inline-flex items-center gap-1"
                      >
                        <span>Profile</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCountryRows.length > 40 && (
          <div className="p-4 bg-slate-50 text-center border-t border-slate-200 text-xs font-semibold text-slate-500">
            Showing top 40 of {filteredCountryRows.length} matching markets.
          </div>
        )}
      </div>

    </div>
  );
};
