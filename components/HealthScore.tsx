import React from 'react';

interface HealthScoreProps {
  score: number;
  potential: string;
}

const HealthScore: React.FC<HealthScoreProps> = ({ score, potential }) => {
  // Calculate circumference
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorClass = 'text-yellow-500';
  if (score >= 75) colorClass = 'text-emerald-400';
  if (score < 50) colorClass = 'text-rose-500';

  return (
    <div className="bg-cardBg rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center h-full relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent opacity-20"></div>
      <h3 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">AI Health Score</h3>
      
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="#334155"
            strokeWidth="8"
          />
          {/* Progress Circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`transition-all duration-1000 ease-out ${colorClass}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>{score}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-slate-400 text-xs mb-1">Growth Potential</p>
        <span className={`
          px-3 py-1 rounded-full text-sm font-bold border
          ${potential === 'High' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
            potential === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
            'bg-rose-500/10 text-rose-400 border-rose-500/20'}
        `}>
          {potential}
        </span>
      </div>
    </div>
  );
};

export default HealthScore;