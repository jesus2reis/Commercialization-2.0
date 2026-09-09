import React, { useState, useEffect } from 'react';
import { MarketPortfolioData, ParsedProduct } from './types';
import { fetchAndParseData } from './services/dataService';
import { Navbar } from './components/Navbar';
import { GuidedCountryView } from './components/GuidedCountryView';

const App: React.FC = () => {
  const [markets, setMarkets] = useState<MarketPortfolioData[]>([]);
  const [products, setProducts] = useState<ParsedProduct[]>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAndParseData().then(data => {
      setMarkets(data.markets);
      setProducts(data.products);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0033a0]" />
        <p className="mt-4 text-sm font-bold text-slate-600">Loading Portfolio Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] font-sans text-slate-800 antialiased selection:bg-[#29abe2]/20">
      <Navbar
        markets={markets}
        selectedMarketId={selectedMarketId}
        setSelectedMarketId={setSelectedMarketId}
      />
      <main className="flex-1 flex flex-col">
        <GuidedCountryView
          markets={markets}
          products={products}
          selectedMarketId={selectedMarketId}
          setSelectedMarketId={setSelectedMarketId}
        />
      </main>
      <footer className="w-full py-4 sm:py-6 text-center border-t border-slate-200/60 mt-auto print-hidden">
        <p className="text-[11px] font-medium text-[#9CA3AF] uppercase tracking-widest px-4">
          FRESENIUS MEDICAL CARE® • INTERNAL USE ONLY • DEMO PURPOSES
        </p>
      </footer>
    </div>
  );
};

export default App;
