import React from 'react';
import { AlertTriangle, CheckCircle2, Info, TrendingUp, Lightbulb } from 'lucide-react';
import { Source, StockAnalysis } from '../types';

interface AnalysisCardProps {
  data: StockAnalysis;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ data }) => {
  const { summary, keyStrengths, risks, sources, entryPointAdvice } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Summary and Advice */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Investment Advice Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-indigo-500/30 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
             <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2 relative z-10">
                <Lightbulb className="w-6 h-6 text-yellow-400" />
                進場評估與建議
            </h3>
            <div className="prose prose-invert max-w-none text-indigo-50/90 leading-relaxed whitespace-pre-line relative z-10 bg-slate-800/50 p-4 rounded-xl border border-indigo-500/20">
                {entryPointAdvice}
            </div>
        </div>

        {/* Main Analysis Summary */}
        <div className="bg-cardBg rounded-2xl p-6 border border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            綜合分析摘要
          </h3>
          <div className="prose prose-invert max-w-none">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {summary}
              </p>
          </div>
          
          {/* Sources */}
          {sources.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500 font-semibold uppercase mb-2">資料來源</p>
                  <div className="flex flex-wrap gap-2">
                      {sources.map((source, idx) => (
                          <a 
                              key={idx}
                              href={source.uri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-full border border-slate-700 transition-all truncate max-w-[200px]"
                          >
                              {source.title}
                          </a>
                      ))}
                  </div>
              </div>
          )}
        </div>
      </div>

      {/* Right Column: Strengths & Risks */}
      <div className="flex flex-col gap-6">
        {/* Strengths */}
        <div className="bg-cardBg rounded-2xl p-6 border border-emerald-500/20 shadow-xl flex-1 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl"></div>
          <h4 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2 relative z-10">
            <CheckCircle2 className="w-5 h-5" /> 優勢與機會
          </h4>
          <ul className="space-y-4 relative z-10">
            {keyStrengths.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="bg-cardBg rounded-2xl p-6 border border-rose-500/20 shadow-xl flex-1 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/5 rounded-full blur-2xl"></div>
          <h4 className="text-rose-400 font-semibold mb-4 flex items-center gap-2 relative z-10">
            <AlertTriangle className="w-5 h-5" /> 風險與警訊
          </h4>
          <ul className="space-y-4 relative z-10">
            {risks.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCard;