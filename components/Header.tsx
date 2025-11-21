import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 flex items-center justify-between bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-to-br from-twRed to-pink-600 p-2 rounded-lg shadow-lg shadow-twRed/20">
          <TrendingUp className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">TWStock<span className="text-slate-400 font-light">AI</span></h1>
        </div>
      </div>
      <div className="hidden md:flex text-sm text-slate-400 gap-4">
        <span>Market Status: <span className="text-twRed font-semibold">Active</span></span>
        <span>Model: <span className="text-indigo-400">Gemini 3 Pro</span></span>
      </div>
    </header>
  );
};

export default Header;