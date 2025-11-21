import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area
} from 'recharts';
import { ChartDataPoint } from '../types';

interface KDChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-300 font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const KDChart: React.FC<KDChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-cardBg rounded-2xl p-6 border border-slate-700 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-5 bg-indigo-500 rounded-full"></span>
        Price & KD Technicals (14D)
      </h3>
      
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          {/* Right Axis for Price */}
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />
          {/* Left Axis for KD (0-100) */}
          <YAxis 
            yAxisId="left" 
            stroke="#94a3b8" 
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Price Line */}
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="price"
            name="Price"
            stroke="#818cf8"
            fillOpacity={1}
            fill="url(#colorPrice)"
            strokeWidth={2}
          />
          
          {/* K Line - Usually Fast Line */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="k" 
            name="K (Fast)" 
            stroke="#fbbf24" // Amber
            strokeWidth={2} 
            dot={false} 
          />
          
          {/* D Line - Usually Slow Line */}
          <Line 
            yAxisId="left" 
            type="monotone" 
            dataKey="d" 
            name="D (Slow)" 
            stroke="#ef4444" // Red
            strokeWidth={2} 
            dot={false} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KDChart;