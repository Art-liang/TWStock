import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface StockSearchProps {
  onSearch: (ticker: string) => void;
  isLoading: boolean;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSearch, isLoading }) => {
  const [ticker, setTicker] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      onSearch(ticker.trim());
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-8">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-twRed to-indigo-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
        <div className="relative flex items-center bg-slate-800 rounded-xl p-1 shadow-2xl border border-slate-700">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="Enter Stock Symbol (e.g., 2330)"
            className="w-full bg-transparent text-white p-4 outline-none placeholder-slate-500 font-medium text-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !ticker}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing
              </>
            ) : (
              'Analyze'
            )}
          </button>
        </div>
      </form>
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-500">Popular: 2330 TSMC, 2317 Foxconn, 2603 Evergreen</p>
      </div>
    </div>
  );
};

export default StockSearch;