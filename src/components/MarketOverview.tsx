import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";

interface NewsItem {
  title: string;
  url: string;
  published_at: string;
}

interface EventItem {
  title: string;
  description: string;
  start_date: string;
}

interface MarketOverviewProps {
  onOverviewGenerated: (overview: string) => void;
}

export const MarketOverview = ({ onOverviewGenerated }: MarketOverviewProps) => {
  const [formattedOverview, setFormattedOverview] = useState<string>("");

  const { data: news, isLoading: isNewsLoading } = useQuery({
    queryKey: ["bitcoinNews"],
    queryFn: async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/news"
      );
      return response.data.data as NewsItem[];
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ["bitcoinEvents"],
    queryFn: async () => {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/events"
      );
      return response.data.data as EventItem[];
    },
    refetchInterval: 300000,
  });

  useEffect(() => {
    if (news && events) {
      const latestNews = news
        .slice(0, 3)
        .map(item => {
          const date = new Date(item.published_at).toLocaleDateString();
          return `${date}: ${item.title}`;
        })
        .join("\n");

      const upcomingEvents = events
        .filter(event => new Date(event.start_date) >= new Date())
        .slice(0, 3)
        .map(event => {
          const date = new Date(event.start_date).toLocaleDateString();
          return `${date}: ${event.title}`;
        })
        .join("\n");

      const overview = `Latest Bitcoin News:\n${latestNews}\n\nUpcoming Events:\n${upcomingEvents}`;
      setFormattedOverview(overview);
      onOverviewGenerated(overview);
    }
  }, [news, events, onOverviewGenerated]);

  if (isNewsLoading || isEventsLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  return (
    <div className="space-y-4">
      {formattedOverview.split('\n').map((line, index) => (
        <p key={index} className="text-sm text-gray-400">
          {line}
        </p>
      ))}
    </div>
  );
};