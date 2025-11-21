import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { FinancialHistoryItem } from '../types';
import { BarChart3, TrendingUp, FileText } from 'lucide-react';

interface FinancialHealthChartsProps {
  revenueHistory: FinancialHistoryItem[];
  epsHistory: FinancialHistoryItem[];
  summary: string;
}

const CustomTooltip = ({ active, payload, label, suffix = '' }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-white font-mono font-bold">
            {payload[0].value} {suffix}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

const FinancialHealthCharts: React.FC<FinancialHealthChartsProps> = ({ revenueHistory, epsHistory, summary }) => {
  const [activeTab, setActiveTab] = useState<'REVENUE' | 'EPS'>('REVENUE');

  return (
    <div className="w-full bg-cardBg rounded-2xl p-6 border border-slate-700 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          財務健康與成長趨勢
        </h3>
        
        <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab('REVENUE')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'REVENUE' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> 營收動能
          </button>
          <button
            onClick={() => setActiveTab('EPS')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'EPS' 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> 獲利能力 (EPS)
          </button>
        </div>
      </div>

      <div className="h-[250px] w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'REVENUE' ? (
            <BarChart data={revenueHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="period" 
                stroke="#94a3b8" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value/10000}億`} // Adjust based on scale
              />
              <Tooltip content={<CustomTooltip suffix="(千元)" />} />
              <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={epsHistory} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="colorEps" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="period" 
                stroke="#94a3b8" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#94a3b8" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip suffix="元" />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                fillOpacity={1} 
                fill="url(#colorEps)" 
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
        <p className="text-sm text-slate-300 leading-relaxed">
          <span className="text-indigo-400 font-semibold mr-2">財報短評:</span>
          {summary || "尚無詳細財報分析摘要。"}
        </p>
      </div>
    </div>
  );
};

export default FinancialHealthCharts;