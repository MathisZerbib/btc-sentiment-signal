import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeframeAnalysis } from "./analysis/TimeframeAnalysis";
import { TrendAnalysis } from "./analysis/TrendAnalysis";
import { PriceLevels } from "./analysis/PriceLevels";
import { MarketOverview } from "./MarketOverview";
import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface MarketData {
  price_change_percentage_1h_in_currency: { usd: number };
  price_change_percentage_24h_in_currency: { usd: number };
  price_change_percentage_7d_in_currency: { usd: number };
  price_change_percentage_30d_in_currency: { usd: number };
  price_change_percentage_1y_in_currency: { usd: number };
  current_price: { usd: number };
  high_24h: { usd: number };
  low_24h: { usd: number };
}

interface BTCData {
  market_data: MarketData;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

const fetchBTCInsights = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
  );
  return response.data as BTCData;
};

const formatPercentage = (value: number | undefined) => {
  if (typeof value !== "number" || isNaN(value)) return "0.00";
  return value.toFixed(2);
};

export const BTCInsights = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["btcInsights"],
    queryFn: fetchBTCInsights,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const [marketOverview, setMarketOverview] = useState<string>("");

  const getDCARecommendation = () => {
    if (!data) return { shouldDCA: false, reason: "Insufficient data" };
    
    const bullishSentiment = data.sentiment_votes_up_percentage > 60;
    const recentPriceChange = data.market_data.price_change_percentage_24h_in_currency.usd;
    const weeklyPriceChange = data.market_data.price_change_percentage_7d_in_currency.usd;
    
    if (bullishSentiment && recentPriceChange > -5 && weeklyPriceChange < 10) {
      return {
        shouldDCA: true,
        reason: "Market sentiment is bullish with stable price action, suggesting a good entry point."
      };
    }
    
    return {
      shouldDCA: false,
      reason: "Current market conditions suggest waiting for a better entry point."
    };
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-gray-300">Loading Insights...</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const timeframes = [
    { label: "1H", value: data?.market_data.price_change_percentage_1h_in_currency.usd },
    { label: "24H", value: data?.market_data.price_change_percentage_24h_in_currency.usd },
    { label: "7D", value: data?.market_data.price_change_percentage_7d_in_currency.usd },
    { label: "30D", value: data?.market_data.price_change_percentage_30d_in_currency.usd },
    { label: "1Y", value: data?.market_data.price_change_percentage_1y_in_currency.usd },
  ];

  const dcaRecommendation = getDCARecommendation();

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-none relative overflow-hidden
                    shadow-[20px_20px_60px_#1a1a1a,-20px_-20px_60px_#262626]
                    hover:shadow-[inset_-12px_-12px_24px_#1a1a1a,inset_12px_12px_24px_#262626]
                    transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-mono text-gray-300">Advanced BTC Analysis</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <TimeframeAnalysis timeframes={timeframes} />
        
        <TrendAnalysis 
          change1h={data?.market_data.price_change_percentage_1h_in_currency.usd || 0}
          change24h={data?.market_data.price_change_percentage_24h_in_currency.usd || 0}
          change7d={data?.market_data.price_change_percentage_7d_in_currency.usd || 0}
        />

        <PriceLevels 
          currentPrice={data?.market_data.current_price.usd || 0}
          high24h={data?.market_data.high_24h.usd || 0}
          low24h={data?.market_data.low_24h.usd || 0}
        />
        
        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-mono text-gray-300 mb-4">Market Sentiment & DCA Strategy</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-green-400">
                Bulls: {formatPercentage(data?.sentiment_votes_up_percentage)}%
              </div>
              <div className="text-red-400">
                Bears: {formatPercentage(data?.sentiment_votes_down_percentage)}%
              </div>
            </div>
            <div className="border-t border-gray-700 my-4" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {dcaRecommendation.shouldDCA ? (
                  <ThumbsUp className="w-5 h-5 text-green-400" />
                ) : (
                  <ThumbsDown className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm ${dcaRecommendation.shouldDCA ? 'text-green-400' : 'text-red-400'}`}>
                  DCA {dcaRecommendation.shouldDCA ? 'Recommended' : 'Not Recommended'}
                </span>
              </div>
              <p className="text-sm text-gray-400">{dcaRecommendation.reason}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
          <h3 className="text-lg font-mono text-gray-300 mb-2">Latest Market Updates & Events</h3>
          <MarketOverview onOverviewGenerated={setMarketOverview} />
          {marketOverview && (
            <p className="text-sm text-gray-400 mt-4">
              {marketOverview}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};