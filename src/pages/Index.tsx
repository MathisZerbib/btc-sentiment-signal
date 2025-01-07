import { useEffect, useState } from "react";
import { BTCPrice } from "@/components/BTCPrice";
import { MarketSentiment } from "@/components/MarketSentiment";
import { DCARecommendation } from "@/components/DCARecommendation";
import { BTCInsights } from "@/components/BTCInsights";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { PriceAlertModal } from "@/components/PriceAlertModal";
import { useBinanceWebSocket } from "@/hooks/useBinanceWebSocket";
import axios from "axios";
import { playSound } from "@/utils/playSound"; // Import the playSound function

const Index = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState<number[]>([]);
  const [previousBtcPrice, setPreviousBtcPrice] = useState<number | null>(null);
  const [fearGreedIndex, setFearGreedIndex] = useState<number>(0);
  const [sentiment, setSentiment] = useState<"Extreme Fear" | "Fear" | "Neutral" | "Greed" | "Extreme Greed">("Neutral");
  const { btcPrice } = useBinanceWebSocket();
  const { toast } = useToast();

  // State for DCA recommendation
  const [shouldDCA, setShouldDCA] = useState<boolean>(false);
  const [dcaReason, setDcaReason] = useState<string>("");

  // Load preferences and alerts from local storage on mount
  useEffect(() => {
    const savedNotificationsEnabled = localStorage.getItem("notificationsEnabled");
    if (savedNotificationsEnabled) {
      setNotificationsEnabled(JSON.parse(savedNotificationsEnabled));
    }

    const savedAlerts = localStorage.getItem("priceAlerts");
    if (savedAlerts) {
      setPriceAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save preferences and alerts to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    localStorage.setItem("priceAlerts", JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  // Fetch Fear & Greed Index data from the API
  useEffect(() => {
    const fetchFearGreedIndex = async () => {
      try {
        const response = await axios.get("https://api.alternative.me/fng/?limit=1");
        const indexData = response.data.data[0];
        const indexValue = parseInt(indexData.value, 10);
        setFearGreedIndex(indexValue);

        // Determine sentiment based on the index value
        if (indexValue <= 25) {
          setSentiment("Extreme Fear");
        } else if (indexValue <= 45) {
          setSentiment("Fear");
        } else if (indexValue <= 55) {
          setSentiment("Neutral");
        } else if (indexValue <= 75) {
          setSentiment("Greed");
        } else {
          setSentiment("Extreme Greed");
        }

        // Generate DCA recommendation based on sentiment
        generateDCARecommendation(indexValue);
      } catch (error) {
        console.error("Failed to fetch Fear & Greed Index:", error);
      }
    };

    fetchFearGreedIndex();
    const interval = setInterval(fetchFearGreedIndex, 60000); // Fetch every minute
    return () => clearInterval(interval);
  }, []);

  // Function to generate DCA recommendation
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

    setShouldDCA(shouldDCA);
    setDcaReason(reason);
  };

  // Track previous BTC price
  useEffect(() => {
    if (btcPrice !== null) {
      setPreviousBtcPrice((prev) => {
        if (prev === null || prev !== btcPrice) {
          return btcPrice;
        }
        return prev;
      });
    }
  }, [btcPrice]);

  // Handle enabling/disabling notifications
  useEffect(() => {
    if (notificationsEnabled) {
      toast({
        title: "Notifications Enabled",
        description: "You will receive daily DCA recommendations and price alerts.",
        duration: 5000, // Auto-close after 5 seconds
      });

      // Schedule daily DCA notifications
      scheduleDCANotifications();
    }
  }, [notificationsEnabled, toast]);

  // Function to schedule daily DCA notifications
  const scheduleDCANotifications = () => {
    // Calculate the time until the next 9:00 AM
    const now = new Date();
    const nextNotificationTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      9, // 9:00 AM
      0,
      0,
      0
    );

    if (now > nextNotificationTime) {
      nextNotificationTime.setDate(nextNotificationTime.getDate() + 1); // Schedule for the next day
    }

    const timeUntilNotification = nextNotificationTime.getTime() - now.getTime();

    // Set a timeout to trigger the notification
    setTimeout(() => {
      if (notificationsEnabled) {
        toast({
          title: "DCA Recommendation",
          description: dcaReason,
          duration: 10000, // Auto-close after 10 seconds
        });

        // Schedule the next notification
        scheduleDCANotifications();
      }
    }, timeUntilNotification);
  };

  // Check for price alerts
  useEffect(() => {
    if (!notificationsEnabled || priceAlerts.length === 0 || previousBtcPrice === null || btcPrice === null) return;

    console.log("Checking price alerts...");
    console.log("Previous BTC Price:", previousBtcPrice);
    console.log("Current BTC Price:", btcPrice);
    console.log("Price Alerts:", priceAlerts);

    priceAlerts.forEach((alertPrice) => {
      const isCrossingUp = previousBtcPrice < alertPrice && btcPrice >= alertPrice;
      const isCrossingDown = previousBtcPrice > alertPrice && btcPrice <= alertPrice;

      if (isCrossingUp || isCrossingDown) {
        const direction = isCrossingUp ? "up" : "down";
        toast({
          title: "Price Alert",
          description: `BTC price has crossed $${alertPrice} while going ${direction}.`,
          duration: 5000, // Auto-close after 5 seconds
        });
        // Play direction-specific sound
        playSound('public/sounds/'+direction+'.mp3');
        // Remove the triggered alert
        setPriceAlerts((prevAlerts) => prevAlerts.filter((price) => price !== alertPrice));
      }
    });
  }, [btcPrice, previousBtcPrice, priceAlerts, notificationsEnabled, toast]);

  // Add a new price alert
  const handleAddAlert = (alertPrice: number) => {
    // Enable notifications if they are not already enabled
    if (!notificationsEnabled) {
      setNotificationsEnabled(true);
    }

    setPriceAlerts((prevAlerts) => [...prevAlerts, alertPrice]);
    toast({
      title: "Alert Added",
      description: `You will be notified when BTC reaches $${alertPrice}.`,
      duration: 5000, // Auto-close after 5 seconds
    });
  };

  // Edit an existing price alert
  const handleEditAlert = (index: number, newPrice: number) => {
    setPriceAlerts((prevAlerts) => {
      const updatedAlerts = [...prevAlerts];
      updatedAlerts[index] = newPrice;
      return updatedAlerts;
    });
    toast({
      title: "Alert Updated",
      description: `Price alert has been updated to $${newPrice}.`,
      duration: 5000, // Auto-close after 5 seconds
    });
  };

  // Delete a price alert
  const handleDeleteAlert = (index: number) => {
    setPriceAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
    toast({
      title: "Alert Deleted",
      description: "The price alert has been removed.",
      duration: 5000, // Auto-close after 5 seconds
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-mono bg-clip-text text-white bg-transparent">
            BTC DCA Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Notifications</span>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={setNotificationsEnabled}
            />
            <PriceAlertModal
              btcPrice={btcPrice}
              notificationsEnabled={notificationsEnabled}
              onAddAlert={handleAddAlert}
              onEditAlert={handleEditAlert}
              onDeleteAlert={handleDeleteAlert}
              priceAlerts={priceAlerts}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BTCPrice btcPrice={btcPrice} />
          <MarketSentiment fearGreedIndex={fearGreedIndex} sentiment={sentiment} />
          <DCARecommendation shouldDCA={shouldDCA} reason={dcaReason} />
        </div>

        <div className="w-full">
          <BTCInsights />
        </div>

        <div className="text-center text-sm text-gray-500">
          Data updates every minute. Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default Index;