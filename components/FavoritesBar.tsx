import React from 'react';
import { Star, X, TrendingUp, Loader2 } from 'lucide-react';
import { FavoriteStock } from '../types';

interface FavoritesBarProps {
  favorites: FavoriteStock[];
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string, e: React.MouseEvent) => void;
  isLoading: boolean;
}

const FavoritesBar: React.FC<FavoritesBarProps> = ({ favorites, onSelect, onRemove, isLoading }) => {
  if (favorites.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 px-4 fade-in-up">
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Your Watchlist</span>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {favorites.map((fav) => (
          <div
            key={fav.symbol}
            onClick={() => !isLoading && onSelect(fav.symbol)}
            className={`group relative overflow-hidden bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-2 py-2 flex items-center gap-3 transition-all shadow-lg 
              ${isLoading 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:bg-slate-700 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
              }`}
          >
            <div className="flex flex-col">
              <span className="text-indigo-400 font-mono font-bold text-sm">{fav.symbol}</span>
              <span className="text-slate-300 text-xs font-medium">{fav.name}</span>
            </div>
            
            <div className="h-8 w-[1px] bg-slate-700 mx-1"></div>

            <button
              onClick={(e) => {
                if (!isLoading) onRemove(fav.symbol, e);
              }}
              disabled={isLoading}
              className="p-1.5 rounded-full text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 transition-colors disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              aria-label="Remove from favorites"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesBar;