import React from 'react';
import { FundamentalData, ValuationStatus } from '../types';
import { DollarSign, Percent, Activity, BarChart3, Scale } from 'lucide-react';

interface FundamentalsGridProps {
  data: FundamentalData;
  valuation: ValuationStatus;
}

const FundamentalsGrid: React.FC<FundamentalsGridProps> = ({ data, valuation }) => {
  
  const getValuationColor = (status: ValuationStatus) => {
    switch (status) {
      case ValuationStatus.UNDERVALUED: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case ValuationStatus.OVERVALUED: return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    }
  };

  const getValuationText = (status: ValuationStatus) => {
    switch (status) {
      case ValuationStatus.UNDERVALUED: return '股價低估 (便宜)';
      case ValuationStatus.OVERVALUED: return '股價高估 (昂貴)';
      default: return '估值合理';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      
      {/* Valuation Status Badge */}
      <div className={`col-span-2 md:col-span-1 rounded-xl p-4 border flex flex-col justify-center items-center gap-1 ${getValuationColor(valuation)}`}>
         <div className="flex items-center gap-2 mb-1">
            <Scale className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">目前估值</span>
         </div>
         <span className="text-lg font-bold">{getValuationText(valuation)}</span>
      </div>

      {/* P/E Ratio */}
      <div className="bg-cardBg border border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
          <DollarSign className="w-3 h-3" /> 本益比 (P/E)
        </div>
        <div className="text-xl font-mono font-medium text-white">
          {data.peRatio ? data.peRatio.toFixed(1) : 'N/A'}
          <span className="text-xs text-slate-500 ml-1">x</span>
        </div>
      </div>

      {/* Yield */}
      <div className="bg-cardBg border border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
          <Percent className="w-3 h-3" /> 殖利率 (Yield)
        </div>
        <div className="text-xl font-mono font-medium text-emerald-400">
          {data.dividendYield ? `${data.dividendYield}%` : 'N/A'}
        </div>
      </div>

      {/* RSI */}
      <div className="bg-cardBg border border-slate-700 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition-colors">
        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
          <Activity className="w-3 h-3" /> RSI 強弱指標
        </div>
        <div className="flex items-baseline gap-2">
            <span className={`text-xl font-mono font-medium ${
                (data.rsi || 0) > 70 ? 'text-rose-400' : (data.rsi || 0) < 30 ? 'text-emerald-400' : 'text-white'
            }`}>
            {data.rsi ?? 'N/A'}
            </span>
            <span className="text-xs text-slate-500">
                {(data.rsi || 0) > 70 ? '過熱' : (data.rsi || 0) < 30 ? '超賣' : '中性'}
            </span>
        </div>
      </div>
    </div>
  );
};

export default FundamentalsGrid;