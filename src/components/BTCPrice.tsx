import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

const formatPercentage = (value: number): string => {
  if (typeof value !== 'number' || isNaN(value)) return '0.00';
  return Math.abs(value).toFixed(2);
};

export const BTCPrice = () => {
  const [price, setPrice] = useState<number>(0);
  const [change24h, setChange24h] = useState<number>(0);
  const [change7d, setChange7d] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.c));
      setChange24h(parseFloat(data.P));
      // For simplicity, we are not calculating the 7d change here. You might need to fetch historical data for that.
      setIsLoading(false);
    };

    return () => {
      ws.close();
    };
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-gray-300">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const auraClass = change24h >= 5 ? "from-green-500/10 to-green-500/10" : change24h <= -5 ? "from-red-500/10 to-red-500/10" : "from-purple-500/10 to-blue-500/10";

  return (
    <Card className={`w-full bg-gradient-to-br from-gray-900 to-gray-800 border-none relative overflow-hidden
                    shadow-[20px_20px_60px_#1a1a1a,-20px_-20px_60px_#262626]
                    hover:shadow-[inset_-12px_-12px_24px_#1a1a1a,inset_12px_12px_24px_#262626]
                    transition-all duration-300`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${auraClass} pointer-events-none`} />
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-mono text-gray-300">Bitcoin Price</CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          <div className="text-5xl font-mono text-white font-bold tracking-tight">
            ${price.toLocaleString()}
          </div>
          <div className="flex gap-4 justify-center">
            <div className={`flex items-center ${change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change24h >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-mono">{formatPercentage(change24h)}% (24h)</span>
            </div>
            <div className={`flex items-center ${change7d >= 0 ? "text-green-400" : "text-red-400"}`}>
              {change7d >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              <span className="font-mono">{formatPercentage(change7d)}% (7d)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};