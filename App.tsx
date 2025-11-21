import React, { useState } from 'react';
import Header from './components/Header';
import StockSearch from './components/StockSearch';
import HealthScore from './components/HealthScore';
import KDChart from './components/KDChart';
import AnalysisCard from './components/AnalysisCard';
import FundamentalsGrid from './components/FundamentalsGrid';
import { analyzeStock } from './services/geminiService';
import { StockAnalysis, KDSignal } from './types';
import { ArrowUpCircle, ArrowDownCircle, MinusCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<StockAnalysis | null>(null);

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
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                  {data.name} 
                  <span className="text-xl text-slate-500 font-medium">({data.symbol})</span>
                </h2>
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

            {/* Fundamental Metrics Grid (New) */}
            <FundamentalsGrid data={data.fundamentals} valuation={data.valuationStatus} />

            {/* Charts & Metrics Grid */}
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