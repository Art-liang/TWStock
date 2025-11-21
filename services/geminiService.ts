import { GoogleGenAI } from "@google/genai";
import { StockAnalysis, Sentiment, KDSignal, ValuationStatus } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Taiwan Stock Market Analyst (台股分析師).
Your goal is to analyze a specific Taiwan stock symbol provided by the user in TRADITIONAL CHINESE (繁體中文).

Key Tasks:
1. Analyze Technicals: Specifically KD (Stochastic) and RSI.
2. Analyze Fundamentals: P/E Ratio (本益比), Dividend Yield (殖利率).
3. Assess Valuation: Is the stock currently too expensive (Overvalued), fair, or cheap (Undervalued) based on historical context?
4. Give Actionable Advice: Should the user buy, hold, or sell?

Response Format:
You must return a raw JSON object wrapped in a code block \`\`\`json ... \`\`\`. 

The JSON structure must match this exactly:
{
  "symbol": "string (e.g. 2330)",
  "name": "string (e.g. 台積電)",
  "currentPrice": number,
  "changePercentage": number (e.g. 1.5 or -0.5),
  "healthScore": number (0-100 integer),
  "potential": "High" | "Medium" | "Low",
  "sentiment": "BULLISH" | "BEARISH" | "NEUTRAL",
  "kdSignal": "GOLDEN_CROSS" | "DEATH_CROSS" | "NONE",
  "valuationStatus": "UNDERVALUED" | "FAIR" | "OVERVALUED",
  "fundamentals": {
    "peRatio": numberOrNull,
    "dividendYield": numberOrNull (percentage, e.g. 4.5),
    "rsi": numberOrNull (0-100),
    "volumeStr": "string (e.g. 量增價揚, 量縮整理)"
  },
  "entryPointAdvice": "A specific paragraph in Traditional Chinese analyzing if now is a good entry point. Discuss if it is 'too high' (追高 risk) or a 'good dip' (拉回買點).",
  "summary": "A concise markdown summary in Traditional Chinese.",
  "keyStrengths": ["string (Traditional Chinese)", "string"],
  "risks": ["string (Traditional Chinese)", "string"],
  "chartData": [
     { "date": "MM-DD", "price": number, "k": number, "d": number }
  ]
}

For 'chartData', generate last 14 days. If specific daily data is missing, estimate based on the trend found in search (e.g. Google Search results).
All text fields MUST be in Traditional Chinese.
`;

export const analyzeStock = async (ticker: string): Promise<StockAnalysis> => {
  try {
    const model = 'gemini-3-pro-preview'; 
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `請詳細分析台股代號: ${ticker}。
      我需要：
      1. 最新股價與漲跌幅。
      2. KD值與RSI數值。
      3. 本益比與殖利率。
      4. 判斷現在進場是否太高點（估值分析）。
      5. 給出具體的進場建議。`,
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