import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketOverviewProps {
  onOverviewGenerated: (overview: string) => void;
}

export const MarketOverview = ({ onOverviewGenerated }: MarketOverviewProps) => {
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateOverview = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to generate market overview",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [
            {
              role: "system",
              content:
                "You are a professional crypto analyst focused on Bitcoin. Provide a comprehensive yet concise market overview that includes: 1) Key recent developments in the last 24-48 hours, 2) Significant upcoming events that could impact Bitcoin's price, 3) Important regulatory updates if any. Focus on factual information and potential market impacts.",
            },
            {
              role: "user",
              content:
                "Generate a detailed market overview for Bitcoin that covers recent developments, upcoming events, and their potential impact on price. Include specific dates for upcoming events where applicable.",
            },
          ],
          temperature: 0.2,
          max_tokens: 500,
          search_domain_filter: ["perplexity.ai"],
          search_recency_filter: "day",
        }),
      });

      const data = await response.json();
      const overview = data.choices[0].message.content;
      onOverviewGenerated(overview);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate market overview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="password"
          placeholder="Enter Perplexity API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="flex-1"
        />
        <Button
          onClick={generateOverview}
          disabled={isGenerating}
          className="whitespace-nowrap"
        >
          {isGenerating ? "Generating..." : "Generate Overview"}
        </Button>
      </div>
      {isGenerating && <Skeleton className="h-20 w-full" />}
    </div>
  );
};