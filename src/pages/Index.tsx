import { useEffect, useState } from "react";
import { BTCPrice } from "@/components/BTCPrice";
import { MarketSentiment } from "@/components/MarketSentiment";
import { DCARecommendation } from "@/components/DCARecommendation";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  // Simulated data - in a real app, this would come from an API
  const btcData = {
    currentPrice: 43250,
    priceChange24h: -2.5,
    priceChange7d: 5.8,
  };

  const sentimentData = {
    fearGreedIndex: 65,
    sentiment: "Greed" as const,
  };

  const dcaRecommendation = {
    shouldDCA: true,
    reason: "Market sentiment is favorable and price has shown stability over the past week.",
  };

  useEffect(() => {
    if (notificationsEnabled) {
      toast({
        title: "Notifications Enabled",
        description: "You will receive daily DCA recommendations.",
      });
    }
  }, [notificationsEnabled, toast]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-mono">BTC DCA Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm">Notifications</span>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BTCPrice {...btcData} />
          <MarketSentiment {...sentimentData} />
          <DCARecommendation {...dcaRecommendation} />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Data updates every 5 minutes. Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Index;