import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeframeAnalysis } from "./analysis/TimeframeAnalysis";
import { TrendAnalysis } from "./analysis/TrendAnalysis";
import { PriceLevels } from "./analysis/PriceLevels";
import { MarketOverview } from "./MarketOverview";
import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { fetchBTCInsights } from "@/services/btcService";
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import axios from "axios";

interface MarketData {
  price_change_percentage_1h_in_currency: { usd: number };
  price_change_percentage_24h_in_currency: { usd: number };
  price_change_percentage_7d_in_currency: { usd: number };
  price_change_percentage_30d_in_currency: { usd: number };
  current_price: { usd: number };
  high_24h: { usd: number };
  low_24h: { usd: number };
}

interface BTCData {
  market_data: MarketData;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

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

  const { btcPrice } = useBinanceWebSocket(); // Use the WebSocket hook
  const [marketOverview, setMarketOverview] = useState<string>("");
  const [fearGreedIndex, setFearGreedIndex] = useState<number>(0);
  const [dcaRecommendation, setDcaRecommendation] = useState<{ shouldDCA: boolean; reason: string }>({
    shouldDCA: false,
    reason: "Insufficient data",
  });

  // Fetch Fear & Greed Index data from the API
  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const response = await axios.get("https://api.alternative.me/fng/?limit=1");
        const indexData = response.data.data[0];
        const indexValue = parseInt(indexData.value, 10);
        setFearGreedIndex(indexValue);

        // Generate DCA recommendation based on the Fear & Greed Index
        generateDCARecommendation(indexValue);
      } catch (error) {
        console.error("Failed to fetch Fear & Greed Index:", error);
        setDcaRecommendation({
          shouldDCA: false,
          reason: "Failed to fetch market sentiment data.",
        });
      }
    };

    fetchFearGreedIndex();
    const interval = setInterval(fetchFearGreedIndex, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  // Function to generate DCA recommendation based on Fear & Greed Index
  const generateDCARecommendation = (indexValue: number) => {
    let shouldDCA = false;
    let reason = "";

    if (indexValue <= 25) {
      shouldDCA = true;
      reason = "It's a good time to buy more BTC as the market sentiment is fearful.";
    } else if (indexValue <= 45) {
      shouldDCA = true;
      reason = "It's a good time to buy more BTC as the market sentiment is slightly fearful.";
    } else if (indexValue <= 55) {
      shouldDCA = false;
      reason = "The market sentiment is neutral. Stick to your regular DCA strategy.";
    } else if (indexValue <= 75) {
      shouldDCA = false;
      reason = "Consider holding or reducing your BTC purchases as the market sentiment is greedy.";
    } else {
      shouldDCA = false;
      reason = "Consider holding or reducing your BTC purchases as the market sentiment is extremely greedy.";
    }

    setDcaRecommendation({ shouldDCA, reason });
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
  ];

  return (
    <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 border-none relative overflow-hidden
                    ">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-mono text-gray-300">Advanced BTC Analysis</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <TimeframeAnalysis timeframes={timeframes} />

        <TrendAnalysis
          change24h={data?.market_data.price_change_percentage_24h_in_currency.usd || 0}
          volume24h={0} // Placeholder for volume data
        />

        <PriceLevels
          currentPrice={btcPrice || data?.market_data.current_price.usd || 0} // Use WebSocket price or fallback to API
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
          <h3 className="text-lg font-mono text-gray-300 mb-8">Latest Market Updates & Events</h3>
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