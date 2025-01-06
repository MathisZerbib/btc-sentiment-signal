import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

interface BTCPriceProps {
  currentPrice: number;
  priceChange24h: number;
  priceChange7d: number;
}

export const BTCPrice = ({ currentPrice, priceChange24h, priceChange7d }: BTCPriceProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-mono">Bitcoin Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-4xl font-mono">${currentPrice.toLocaleString()}</div>
          <div className="flex gap-4">
            <div className={`flex items-center ${priceChange24h >= 0 ? "text-success" : "text-warning"}`}>
              {priceChange24h >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span className="font-mono">{Math.abs(priceChange24h).toFixed(2)}% (24h)</span>
            </div>
            <div className={`flex items-center ${priceChange7d >= 0 ? "text-success" : "text-warning"}`}>
              {priceChange7d >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span className="font-mono">{Math.abs(priceChange7d).toFixed(2)}% (7d)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};