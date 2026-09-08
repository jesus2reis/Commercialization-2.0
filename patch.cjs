const fs = require('fs');
let code = fs.readFileSync('components/GuidedCountryView.tsx', 'utf8');

// Replace imports and interface
const newTop = `import React, { useState, useEffect } from 'react';
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
    <div className="w-full max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      
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

      {/* Selected Country Details */}`;

// Find where to replace up to
const bottomSplit = `{/* Selected Country Details */}`;
const bottomPart = code.split(bottomSplit)[1];

fs.writeFileSync('components/GuidedCountryView.tsx', newTop + bottomPart);
