import React, { useState, useEffect } from 'react';
import { MarketPortfolioData } from './types';
import { 
  loadStoredMarketsData, 
  randomizeAllData, 
  updateMarketProductValue
} from './services/dataService';
import { Navbar } from './components/Navbar';
import { GuidedCountryView } from './components/GuidedCountryView';
import { OnePagerPdfModal } from './components/OnePagerPdfModal';

const App: React.FC = () => {
  const [markets, setMarkets] = useState<MarketPortfolioData[]>([]);
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const data = loadStoredMarketsData();
    setMarkets(data);
    setIsLoading(false);
  }, []);

  // Handlers
  const handleToggleProduct = (marketId: string, columnId: string, currentValue: boolean) => {
    const updated = updateMarketProductValue(marketId, columnId, !currentValue, markets);
    setMarkets(updated);
  };

  const handleRandomize = () => {
    const fresh = randomizeAllData();
    setMarkets(fresh);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0033a0]" />
        <p className="mt-4 text-sm font-bold text-slate-600">Cargando FMC Portfolio Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] font-sans text-slate-800 antialiased selection:bg-[#29abe2]/20">
      
      {/* Top Navigation */}
      <Navbar
        markets={markets}
        selectedMarketId={selectedMarketId}
        setSelectedMarketId={setSelectedMarketId}
        onRandomize={handleRandomize}
        onOpenPdfModal={() => setIsPdfModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        <GuidedCountryView
          markets={markets}
          selectedMarketId={selectedMarketId}
          setSelectedMarketId={setSelectedMarketId}
          onToggleProduct={handleToggleProduct}
        />
      </main>

      {/* Global Modals */}
      {isPdfModalOpen && (
        <OnePagerPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          markets={markets}
          initialCountryId={selectedMarketId}
        />
      )}

    </div>
  );
};

export default App;
