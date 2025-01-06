import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MarketSentimentProps {
  fearGreedIndex: number;
  sentiment: "Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed";
}

export const MarketSentiment = ({ fearGreedIndex, sentiment }: MarketSentimentProps) => {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "Extreme Fear":
        return "bg-red-500";
      case "Fear":
        return "bg-orange-500";
      case "Neutral":
        return "bg-yellow-500";
      case "Greed":
        return "bg-green-500";
      case "Extreme Greed":
        return "bg-emerald-500";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-mono">Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-4xl font-mono">{fearGreedIndex}</div>
          <Badge className={`${getSentimentColor()} text-white`}>{sentiment}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};