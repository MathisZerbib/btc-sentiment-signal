import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  title: string;
  url: string;
  published_at: string;
}

interface MarketOverviewProps {
  onOverviewGenerated: (overview: string) => void;
}

export const MarketOverview = ({ onOverviewGenerated }: MarketOverviewProps) => {
  const [formattedNews, setFormattedNews] = useState<string>("");

  const { data: news, isLoading } = useQuery({
    queryKey: ["bitcoinNews"],
    queryFn: async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/news"
      );
      return response.data.data as NewsItem[];
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  useEffect(() => {
    if (news && news.length > 0) {
      const latestNews = news
        .slice(0, 3)
        .map(item => {
          const date = new Date(item.published_at).toLocaleDateString();
          return `${date}: ${item.title}`;
        })
        .join("\n");

      const overview = `Latest Bitcoin Updates:\n${latestNews}`;
      setFormattedNews(overview);
      onOverviewGenerated(overview);
    }
  }, [news, onOverviewGenerated]);

  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div className="space-y-4">
      {formattedNews.split('\n').map((line, index) => (
        <p key={index} className="text-sm text-gray-400">
          {line}
        </p>
      ))}
    </div>
  );
};