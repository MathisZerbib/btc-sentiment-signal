import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketData {
  price_change_percentage_1h_in_currency: { usd: number };
  price_change_percentage_24h_in_currency: { usd: number };
  price_change_percentage_7d_in_currency: { usd: number };
  price_change_percentage_30d_in_currency: { usd: number };
}

interface BTCData {
  market_data: MarketData;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  description: { en: string };
}

const fetchBTCInsights = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
  );
  return response.data as BTCData;
};

const formatPercentage = (value: number | undefined) => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return value.toFixed(2);
};

export const BTCInsights = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["btcInsights"],
    queryFn: fetchBTCInsights,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

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
                    shadow-[20px_20px_60px_#1a1a1a,-20px_-20px_60px_#262626]
                    hover:shadow-[inset_-12px_-12px_24px_#1a1a1a,inset_12px_12px_24px_#262626]
                    transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-mono text-gray-300">BTC Market Analysis</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeframes.map((tf) => (
            <div key={tf.label} className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
              <div className="text-sm text-gray-400">{tf.label}</div>
              <div className={`text-lg font-mono ${Number(formatPercentage(tf.value)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatPercentage(tf.value)}%
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-mono text-gray-300 mb-2">Market Sentiment</h3>
            <div className="flex justify-between">
              <div className="text-green-400">
                Bulls: {formatPercentage(data?.sentiment_votes_up_percentage)}%
              </div>
              <div className="text-red-400">
                Bears: {formatPercentage(data?.sentiment_votes_down_percentage)}%
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-mono text-gray-300 mb-2">Market Overview</h3>
            <p className="text-sm text-gray-400 line-clamp-4">
              {data?.description?.en || "No market overview available at the moment."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};