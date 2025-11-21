export enum Sentiment {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL'
}

export enum KDSignal {
  GOLDEN_CROSS = 'GOLDEN_CROSS', // Buy signal
  DEATH_CROSS = 'DEATH_CROSS', // Sell signal
  NONE = 'NONE'
}

export enum ValuationStatus {
  UNDERVALUED = 'UNDERVALUED', // 低估
  FAIR = 'FAIR', // 合理
  OVERVALUED = 'OVERVALUED' // 高估
}

export interface ChartDataPoint {
  date: string;
  price: number;
  k: number;
  d: number;
}

export interface Source {
  title: string;
  uri: string;
}

export interface FinancialMetric {
  value: number | string;
  label: string;
  status: 'Good' | 'Neutral' | 'Bad';
}

export interface FinancialHistoryItem {
  period: string; // e.g., "Q1", "Jan"
  value: number;
}

export interface FundamentalData {
  peRatio: number | null; // 本益比
  dividendYield: number | null; // 殖利率
  rsi: number | null; // RSI
  volumeStr: string; 
  // New Financial Metrics
  eps: number | null; // 每股盈餘
  roe: number | null; // 股東權益報酬率
  grossMargin: number | null; // 毛利率
  revenueYoY: number | null; // 營收年增率
}

export interface StockAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  changePercentage: number;
  healthScore: number; // 0 - 100
  potential: 'High' | 'Medium' | 'Low';
  sentiment: Sentiment;
  kdSignal: KDSignal;
  valuationStatus: ValuationStatus;
  entryPointAdvice: string;
  fundamentals: FundamentalData;
  // New Financial Charts Data
  revenueHistory: FinancialHistoryItem[]; // Last 5-6 months/quarters
  epsHistory: FinancialHistoryItem[]; // Last 4 quarters
  financialSummary: string; // Specific summary of financial health
  summary: string;
  keyStrengths: string[];
  risks: string[];
  chartData: ChartDataPoint[];
  sources: Source[];
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: StockAnalysis | null;
}

export interface FavoriteStock {
  symbol: string;
  name: string;
}