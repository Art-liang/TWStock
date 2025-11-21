import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import HealthScore from './components/HealthScore';
import KDChart from './components/KDChart';
import AnalysisCard from './components/AnalysisCard';
import FundamentalsGrid from './components/FundamentalsGrid';
import FavoritesBar from './components/FavoritesBar';
import FinancialHealthCharts from './components/FinancialHealthCharts';
import { analyzeStock } from './services/geminiService';
import { StockAnalysis, KDSignal, FavoriteStock } from './types';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Star } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StockAnalysis | null>(null);
  
  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<FavoriteStock[]>(() => {
    try {
      const saved = localStorage.getItem('twstock-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites from localStorage", e);
      return [];
    }
  });

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('twstock-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleSearch = async (ticker: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeStock(ticker);
      setData(result);
    } catch (err: any) {
      setError(err.message || "分析失敗，請稍後再試。");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    if (!data) return;
    
    const exists = favorites.find(f => f.symbol === data.symbol);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.symbol !== data.symbol));
    } else {
      setFavorites(prev => [...prev, { symbol: data.symbol, name: data.name }]);
    }
  };

  const removeFavorite = (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.filter(f => f.symbol !== symbol));
  };

  const isFavorite = data ? favorites.some(f => f.symbol === data.symbol) : false;

  // Taiwan Market Colors: Red is UP, Green is DOWN
  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-twRed';
    if (change < 0) return 'text-twGreen';
    return 'text-slate-400';
  };

  const renderKDBadge = (signal: KDSignal) => {
    switch (signal) {
      case KDSignal.GOLDEN_CROSS:
        return (
          <div className="flex items-center gap-2 bg-twRed/10 text-twRed px-4 py-2 rounded-lg border border-twRed/20 animate-pulse">
            <ArrowUpCircle className="w-5 h-5" />
            <span className="font-bold">KD 黃金交叉 (買進訊號)</span>
          </div>
        );
      case KDSignal.DEATH_CROSS:
        return (
          <div className="flex items-center gap-2 bg-twGreen/10 text-twGreen px-4 py-2 rounded-lg border border-twGreen/20">
            <ArrowDownCircle className="w-5 h-5" />
            <span className="font-bold">KD 死亡交叉 (賣出訊號)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 bg-slate-700/50 text-slate-400 px-4 py-2 rounded-lg border border-slate-600">
            <MinusCircle className="w-5 h-5" />
            <span className="font-medium">KD 無明顯交叉</span>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-darkBg pb-20">
      <Header />
      
      <main className="container mx-auto px-4 pt-6">
        <StockSearch onSearch={handleSearch} isLoading={isLoading} />

        <FavoritesBar 
          favorites={favorites} 
          onSelect={handleSearch} 
          onRemove={removeFavorite}
          isLoading={isLoading}
        />

        {error && (
            <div className="max-w-xl mx-auto p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-200 text-center mb-8">
                {error}
            </div>
        )}

        {data && !isLoading && (
          <div className="space-y-6 fade-in-up">
            {/* Top Info Bar */}
            <div className="bg-cardBg rounded-2xl p-6 border border-slate-700 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    {data.name} 
                    <span className="text-xl text-slate-500 font-medium">({data.symbol})</span>
                  </h2>
                  <button 
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-all border ${isFavorite ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-white hover:border-slate-500'}`}
                    title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
                  >
                    <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-baseline gap-4 mt-2">
                  <span className={`text-4xl font-mono font-bold ${getChangeColor(data.changePercentage)}`}>
                    {data.currentPrice}
                  </span>
                  <span className={`text-lg font-medium ${getChangeColor(data.changePercentage)}`}>
                    {data.changePercentage > 0 ? '▲' : data.changePercentage < 0 ? '▼' : ''} {Math.abs(data.changePercentage)}%
                  </span>
                </div>
              </div>
              
              {renderKDBadge(data.kdSignal)}
            </div>

            {/* Fundamental Metrics Grid */}
            <FundamentalsGrid data={data.fundamentals} valuation={data.valuationStatus} />

            {/* New: Financial Health & Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <FinancialHealthCharts 
                        revenueHistory={data.revenueHistory} 
                        epsHistory={data.epsHistory}
                        summary={data.financialSummary}
                    />
                </div>
            </div>

            {/* Technical Charts & Health Score Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto">
              <div className="lg:col-span-2">
                <KDChart data={data.chartData} />
              </div>
              <div className="lg:col-span-1">
                <HealthScore score={data.healthScore} potential={data.potential} />
              </div>
            </div>

            {/* Detailed Analysis */}
            <AnalysisCard data={data} />
          </div>
        )}
      </main>
      
      <style>{`
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default App;