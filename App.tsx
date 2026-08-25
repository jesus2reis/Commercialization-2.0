import React, { useState, useEffect } from 'react';
import { 
  MarketPortfolioData, 
  ViewMode, 
  PillarId 
} from './types';
import { 
  loadStoredMarketsData, 
  randomizeAllData, 
  resetToInitialData, 
  updateMarketProductValue,
  exportToCsv 
} from './services/dataService';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { MatrixView } from './components/MatrixView';
import { DashboardView } from './components/DashboardView';
import { HeatmapView } from './components/HeatmapView';
import { PillarsView } from './components/PillarsView';
import { ComparisonView } from './components/ComparisonView';
import { AnalyticsView } from './components/AnalyticsView';
import { CountryDrilldownModal } from './components/CountryDrilldownModal';
import { OnePagerPdfModal } from './components/OnePagerPdfModal';

export const App: React.FC = () => {
  const [markets, setMarkets] = useState<MarketPortfolioData[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [comparisonMarketId, setComparisonMarketId] = useState<string | undefined>(undefined);
  const [matrixPillarFilter, setMatrixPillarFilter] = useState<PillarId | null>(null);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [pdfInitialCountryId, setPdfInitialCountryId] = useState<string | null>(null);
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

  const handleReset = () => {
    const reset = resetToInitialData();
    setMarkets(reset);
  };

  const handleSelectCountry = (marketId: string) => {
    setSelectedCountryId(marketId);
  };

  const handleOpenComparison = (marketId: string) => {
    setSelectedCountryId(null);
    setComparisonMarketId(marketId);
    setCurrentView('comparison');
  };

  const handleNavigateToMatrixWithPillar = (pillarId: PillarId) => {
    setMatrixPillarFilter(pillarId);
    setCurrentView('matrix');
  };

  const handleExportCsv = () => {
    const csvContent = exportToCsv(markets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FMC_Portfolio_Strategy_Intelligence_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenPdfModal = (countryId: string | null = null) => {
    setPdfInitialCountryId(countryId);
    setIsPdfModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F6F8]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0033a0]" />
        <p className="mt-4 text-sm font-bold text-slate-600">Cargando FMC Portfolio Intelligence...</p>
      </div>
    );
  }

  const selectedMarket = markets.find((m) => m.id === selectedCountryId);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6F8] font-sans text-slate-800 antialiased selection:bg-[#29abe2]/20">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'matrix') {
            setMatrixPillarFilter('ALL');
          }
          setCurrentView(view);
        }}
        onRandomize={handleRandomize}
        onOpenPdfModal={() => handleOpenPdfModal(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <HomeView
            markets={markets}
            onNavigate={(view) => setCurrentView(view)}
            onSelectCountry={handleSelectCountry}
            onOpenComparison={handleOpenComparison}
          />
        )}

        {/* 2. PRIORITIZED MARKET CARDS */}
        {currentView === 'cards' && (
          <DashboardView
            markets={markets}
            onSelectCountry={handleSelectCountry}
            onOpenComparison={handleOpenComparison}
          />
        )}

        {/* 3. FULL MATRIX VIEW WITH SORTING & FILTERING */}
        {currentView === 'matrix' && (
          <MatrixView
            markets={markets}
            onToggleProduct={handleToggleProduct}
            onSelectCountry={handleSelectCountry}
            onRandomize={handleRandomize}
            onReset={handleReset}
            initialPillarFilter={matrixPillarFilter}
          />
        )}

        {/* 4. HEATMAP (SECTIONED BY REGION) */}
        {currentView === 'heatmap' && (
          <HeatmapView
            markets={markets}
            onBack={() => setCurrentView('home')}
            onSelectCountry={handleSelectCountry}
          />
        )}

        {/* 5. 6 STRATEGIC PILLARS BREAKDOWN */}
        {currentView === 'pillars' && (
          <PillarsView
            markets={markets}
            onSelectCountry={handleSelectCountry}
            onToggleProduct={handleToggleProduct}
            onNavigateToMatrixWithPillar={handleNavigateToMatrixWithPillar}
          />
        )}

        {/* 6. COMPARISON VIEW */}
        {currentView === 'comparison' && (
          <ComparisonView
            markets={markets}
            initialMarketId={comparisonMarketId}
            onBack={() => setCurrentView('cards')}
            onToggleProduct={handleToggleProduct}
          />
        )}

        {/* 7. ANALYTICS VIEW */}
        {currentView === 'analytics' && (
          <AnalyticsView
            markets={markets}
            onBack={() => setCurrentView('home')}
            onSelectCountry={handleSelectCountry}
          />
        )}

      </main>

      {/* Drilldown Modal for Selected Country */}
      {selectedMarket && (
        <CountryDrilldownModal
          market={selectedMarket}
          onClose={() => setSelectedCountryId(null)}
          onToggleProduct={handleToggleProduct}
          onOpenComparison={handleOpenComparison}
          onExportPdf={(countryId) => handleOpenPdfModal(countryId)}
        />
      )}

      {/* Executive One-Pager PDF Modal */}
      {isPdfModalOpen && (
        <OnePagerPdfModal
          markets={markets}
          initialCountryId={pdfInitialCountryId}
          onClose={() => {
            setIsPdfModalOpen(false);
            setPdfInitialCountryId(null);
          }}
        />
      )}

    </div>
  );
};

export default App;
