import { useEffect, useState } from "react";
import axios from "axios";
import { TrendingUp, TrendingDown, AlertTriangle, BarChart2, Loader } from "lucide-react";

// Interface for TrendAnalysis props
interface TrendAnalysisProps {
  change24h: number;
  volume24h: number;
  movingAverage50?: number; // Optional, as it's not directly available
  movingAverage200?: number; // Optional, as it's not directly available
  rsi?: number; // Optional, as it's not directly available
  supportLevel?: number; // Optional, with a default value
  resistanceLevel?: number; // Optional, with a default value
}

// TrendAnalysis Component
export const TrendAnalysis = ({
  change24h,
  volume24h,
  movingAverage50 = 0, // Default value if undefined
  movingAverage200 = 0, // Default value if undefined
  rsi = 0, // Default value if undefined
  supportLevel = 0, // Default value if undefined
  resistanceLevel = 0, // Default value if undefined
}: TrendAnalysisProps) => {
  const analyzeTrend = () => {
    const isUptrend = change24h > 0;
    const isDowntrend = change24h < 0;

    // Moving Average Analysis (if available)
    const isGoldenCross = movingAverage50 > movingAverage200; // Golden Cross (bullish)
    const isDeathCross = movingAverage50 < movingAverage200; // Death Cross (bearish)

    // RSI Analysis (if available)
    const isOverbought = rsi > 70;
    const isOversold = rsi < 30;

    // Volume Analysis
    const isHighVolume = volume24h > 10000000000; // Example threshold for high volume (10 billion)

    if (isUptrend && isGoldenCross && !isOverbought && isHighVolume) {
      return {
        trend: "🚀 Strong Uptrend",
        action: "✅ Buy with stop-loss below support",
        confidence: "High",
        icon: <TrendingUp className="w-5 h-5 text-green-400" />,
        color: "text-green-400",
        details: [
          "📈 Golden Cross (50 MA > 200 MA).",
          "💰 Volume supports upward momentum.",
          "📊 RSI indicates no overbought conditions.",
        ],
      };
    } else if (isDowntrend && isDeathCross && !isOversold) {
      return {
        trend: "📉 Strong Downtrend",
        action: "🛑 Short or wait for reversal",
        confidence: "High",
        icon: <TrendingDown className="w-5 h-5 text-red-400" />,
        color: "text-red-400",
        details: [
          "📉 Death Cross (50 MA < 200 MA).",
          "💧 Volume confirms downward pressure.",
          "📊 RSI indicates no oversold conditions.",
        ],
      };
    } else if (isOverbought || isOversold) {
      return {
        trend: "⚠️ Mixed Signals",
        action: "🔄 Monitor for confirmation",
        confidence: "Low",
        icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        color: "text-yellow-400",
        details: [
          isOverbought ? "📊 RSI indicates overbought conditions." : "",
          isOversold ? "📊 RSI indicates oversold conditions." : "",
        ],
      };
    } else {
      return {
        trend: "⚖️ Neutral",
        action: "⏳ Wait for confirmation",
        confidence: "Medium",
        icon: <BarChart2 className="w-5 h-5 text-gray-400" />,
        color: "text-gray-400",
        details: ["📊 No strong trend detected across timeframes."],
      };
    }
  };

  const analysis = analyzeTrend();

  return (
    <div className="bg-gray-900/90 p-6 rounded-lg backdrop-blur-sm border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        {analysis.icon}
        <h3 className="text-lg font-semibold text-gray-200">Professional Trend Analysis</h3>
      </div>
      <div className={`text-xl font-semibold ${analysis.color} mb-4`}>
        {analysis.trend}
      </div>
      <div className="text-sm text-gray-300 mb-4">
        <span className="font-medium">Action:</span> {analysis.action}
      </div>
      <div className="text-sm text-gray-300 mb-4">
        <span className="font-medium">Confidence:</span> {analysis.confidence}
      </div>
      {supportLevel > 0 && (
        <div className="text-sm text-gray-300 mb-4">
          <span className="font-medium">Support Level:</span> ${supportLevel.toFixed(2)}
        </div>
      )}
      {resistanceLevel > 0 && (
        <div className="text-sm text-gray-300 mb-4">
          <span className="font-medium">Resistance Level:</span> ${resistanceLevel.toFixed(2)}
        </div>
      )}
      <div className="text-sm text-gray-300">
        <span className="font-medium">Details:</span>
        <ul className="list-disc list-inside mt-2">
          {analysis.details.map((detail, index) => (
            detail && <li key={index} className="mb-1">{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Parent component that fetches data and passes it to TrendAnalysis
export const TrendAnalysisWithAPI = () => {
  const [data, setData] = useState<{
    change24h: number;
    volume24h: number;
    movingAverage50?: number;
    movingAverage200?: number;
    rsi?: number;
    supportLevel?: number;
    resistanceLevel?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the CoinGecko API using Axios
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "bitcoin",
              order: "market_cap_desc",
              per_page: 1,
              page: 1,
              sparkline: false,
            },
          }
        );

        const marketData = response.data[0];

        // Extract relevant data
        const change24h = marketData.price_change_percentage_24h || 0;
        const volume24h = marketData.total_volume || 0;
        const low24h = marketData.low_24h || 0;
        const high24h = marketData.high_24h || 0;

        // Calculate Support and Resistance Levels
        const supportLevel = low24h * 0.95; // 5% below the 24-hour low
        const resistanceLevel = high24h * 1.05; // 5% above the 24-hour high

        // Set the data state
        setData({
          change24h,
          volume24h,
          supportLevel,
          resistanceLevel,
        });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(`Error: ${err.response?.status} - ${err.message}`);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 p-4 rounded-lg text-red-500">
        <AlertTriangle className="w-5 h-5 inline-block mr-2" />
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-gray-800/50 p-4 rounded-lg text-gray-400">
        No data available.
      </div>
    );
  }

  return <TrendAnalysis {...data} />;
};