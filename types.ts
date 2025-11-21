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

export interface FundamentalData {
  peRatio: number | null; // 本益比
  dividendYield: number | null; // 殖利率
  rsi: number | null; // RSI 目前數值
  volumeStr: string; // 成交量描述 (e.g. "爆量", "縮量")
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
  valuationStatus: ValuationStatus; // 新增：估值狀態
  entryPointAdvice: string; // 新增：進場點建議 (Markdown)
  fundamentals: FundamentalData; // 新增：基本面數據
  summary: string; // Markdown text
  keyStrengths: string[];
  risks: string[];
  chartData: ChartDataPoint[]; // Last 14-30 days logic
  sources: Source[];
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: StockAnalysis | null;
}