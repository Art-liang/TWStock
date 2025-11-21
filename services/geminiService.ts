import { GoogleGenAI } from "@google/genai";
import { StockAnalysis, Sentiment, KDSignal, ValuationStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Taiwan Stock Market Analyst (台股分析師).
Your goal is to analyze a specific Taiwan stock symbol provided by the user in TRADITIONAL CHINESE (繁體中文).

Key Tasks:
1. Analyze Technicals: Price, KD, RSI.
2. Analyze Fundamentals (Financial Report):
   - EPS (Earnings Per Share) for recent quarters.
   - ROE (Return on Equity).
   - Gross Margin (毛利率).
   - Revenue YoY (營收年增率).
3. Generate Chart Data: Estimate or retrieve recent Revenue trends and EPS trends.
4. Assess Valuation & Action: Is it too expensive? Buy/Sell?

Response Format:
You must return a raw JSON object wrapped in a code block \`\`\`json ... \`\`\`. 

The JSON structure must match this exactly:
{
  "symbol": "string (e.g. 2330)",
  "name": "string (e.g. 台積電)",
  "currentPrice": number,
  "changePercentage": number,
  "healthScore": number (0-100 integer),
  "potential": "High" | "Medium" | "Low",
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
  "kdSignal": "GOLDEN_CROSS" | "DEATH_CROSS" | "NONE",
  "valuationStatus": "UNDERVALUED" | "FAIR" | "OVERVALUED",
  "fundamentals": {
    "peRatio": numberOrNull,
    "dividendYield": numberOrNull (percentage, e.g. 4.5),
    "rsi": numberOrNull,
    "volumeStr": "string",
    "eps": numberOrNull (Latest TTM or Quarter),
    "roe": numberOrNull (percentage),
    "grossMargin": numberOrNull (percentage),
    "revenueYoY": numberOrNull (percentage)
  },
  "revenueHistory": [
    { "period": "string (e.g. 1月)", "value": number (revenue amount) },
    { "period": "string (e.g. 2月)", "value": number }
    // ... last 5-6 months
  ],
  "epsHistory": [
    { "period": "string (e.g. Q1)", "value": number },
    { "period": "string (e.g. Q2)", "value": number }
    // ... last 4 quarters
  ],
  "financialSummary": "A specific short paragraph assessing the financial health (profitability, growth) based on the report data.",
  "entryPointAdvice": "Specific entry point analysis.",
  "summary": "General summary.",
  "keyStrengths": ["string", "string"],
  "risks": ["string", "string"],
  "chartData": [
     { "date": "MM-DD", "price": number, "k": number, "d": number }
  ]
}

Use real data from search tools where possible. If exact historical numbers are missing, estimate based on the known trend found in search results.
All text fields MUST be in Traditional Chinese.
`;

export const analyzeStock = async (ticker: string): Promise<StockAnalysis> => {
  try {
    const model = 'gemini-3-pro-preview'; 
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `請詳細分析台股代號: ${ticker}。
      我需要：
      1. 財報分析：EPS、ROE、毛利率、營收年增率。
      2. 財務趨勢數據：近6個月營收趨勢、近4季EPS數據 (用於繪製圖表)。
      3. 技術面：KD、RSI、股價。
      4. 估值判斷與進場建議。
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
        temperature: 0.3, 
      },
    });

    const text = response.text;
    
    // Extract JSON from code block
    const jsonMatch = text?.match(/```json\n([\s\S]*?)\n```/) || text?.match(/```([\s\S]*?)```/);
    
    let analysisData: any = {};
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        analysisData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.error("Failed to parse JSON from Gemini response", e);
        throw new Error("AI 資料格式錯誤，請重試。");
      }
    } else {
       throw new Error("AI 無法產生結構化分析，請稍後重試。");
    }

    // Extract Sources from Grounding
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "資料來源",
        uri: chunk.web?.uri || "#"
      }))
      .filter((s: any) => s.uri !== "#") || [];

    // remove duplicates by uri
    const uniqueSources = Array.from(new Map(sources.map((item:any) => [item.uri, item])).values());

    return {
      ...analysisData,
      sources: uniqueSources,
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};