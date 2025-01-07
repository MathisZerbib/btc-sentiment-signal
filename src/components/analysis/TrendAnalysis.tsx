import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface TrendAnalysisProps {
  change1h: number;
  change24h: number;
  change7d: number;
}

export const TrendAnalysis = ({ change1h, change24h, change7d }: TrendAnalysisProps) => {
  const analyzeTrend = (change1h: number, change24h: number, change7d: number) => {
    const shortTerm = change1h > 0;
    const mediumTerm = change24h > 0;
    const longTerm = change7d > 0;
    
    if (shortTerm && mediumTerm && longTerm) {
      return {
        trend: "Strong Uptrend",
        action: "Consider buying with strict stop-loss",
        confidence: "High",
        icon: <TrendingUp className="w-5 h-5 text-green-400" />,
        color: "text-green-400"
      };
    } else if (!shortTerm && !mediumTerm && !longTerm) {
      return {
        trend: "Strong Downtrend",
        action: "Consider waiting for reversal signals",
        confidence: "High",
        icon: <TrendingDown className="w-5 h-5 text-red-400" />,
        color: "text-red-400"
      };
    } else {
      return {
        trend: "Mixed Signals",
        action: "Monitor for clearer direction",
        confidence: "Low",
        icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
        color: "text-yellow-400"
      };
    }
  };

  const analysis = analyzeTrend(change1h, change24h, change7d);

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        {analysis.icon}
        <h3 className="text-lg font-mono text-gray-300">Trend Analysis</h3>
      </div>
      <div className={`text-lg font-mono ${analysis.color} mb-2`}>
        {analysis.trend}
      </div>
      <div className="text-sm text-gray-400">
        Recommendation: {analysis.action}
      </div>
      <div className="text-sm text-gray-400">
        Confidence: {analysis.confidence}
      </div>
    </div>
  );
};