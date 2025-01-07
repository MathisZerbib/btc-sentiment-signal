import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { motion, useAnimation } from "framer-motion"; // Import Framer Motion

// Helper function to format percentages
const formatPercentage = (value: number): string => {
  if (typeof value !== "number" || isNaN(value)) return "0.00";
  return Math.abs(value).toFixed(2);
};

export const BTCPrice = () => {
  const [price, setPrice] = useState<number>(0);
  const [previousPrice, setPreviousPrice] = useState<number>(0); // Track previous price
  const [change24h, setChange24h] = useState<number>(0);
  const [change7d, setChange7d] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastChangeDirection, setLastChangeDirection] = useState<"up" | "down" | null>(null); // Track last change direction

  // Framer Motion animation controls
  const controls = useAnimation();

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newPrice = parseFloat(data.c);
      const roundedNewPrice = Math.round(newPrice); // Round to the nearest dollar
      const roundedPreviousPrice = Math.round(previousPrice); // Round to the nearest dollar

      // Compare rounded prices to detect $1 changes
      if (roundedNewPrice !== roundedPreviousPrice) {
        const direction = roundedNewPrice > roundedPreviousPrice ? "up" : "down";
        setLastChangeDirection(direction);

        // Trigger Framer Motion animation
        controls.start({
          boxShadow: [
            direction === "up"
              ? "0 0 0 0 rgba(72, 187, 120, 0.4)" // Green shadow
              : "0 0 0 0 rgba(239, 68, 68, 0.4)", // Red shadow
            direction === "up"
              ? "0 0 0 10px rgba(72, 187, 120, 0)" // Green shadow
              : "0 0 0 10px rgba(239, 68, 68, 0)", // Red shadow
            direction === "up"
              ? "0 0 0 0 rgba(72, 187, 120, 0)" // Green shadow
              : "0 0 0 0 rgba(239, 68, 68, 0)", // Red shadow
          ],
          transition: { duration: 1, ease: "easeInOut" },
        });
      }

      setPreviousPrice(newPrice); // Update previous price (not rounded)
      setPrice(newPrice); // Update current price (not rounded)
      setChange24h(parseFloat(data.P));
      setIsLoading(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsLoading(false); // Handle errors gracefully
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      setIsLoading(false); // Handle connection closure
    };

    return () => {
      ws.close();
    };
  }, [previousPrice, controls]); // Use `previousPrice` and `controls` as dependencies

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-gray-900 to-gray-800 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]">
        <CardHeader>
          <CardTitle className="text-xl font-mono text-gray-300">Loading...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  // Determine the shadow color based on the last change direction
  const shadowClass =
    lastChangeDirection === "up"
      ? "shadow-[0_0_20px_5px_rgba(72,187,120,0.3)] hover:shadow-[0_0_30px_10px_rgba(72,187,120,0.4)]" // Green shadow
      : lastChangeDirection === "down"
      ? "shadow-[0_0_20px_5px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_10px_rgba(239,68,68,0.4)]" // Red shadow
      : "shadow-[20px_20px_60px_#1a1a1a,-20px_-20px_60px_#262626]"; // Default shadow

  return (
    <motion.div
      animate={controls} // Apply Framer Motion animation
      className="w-full"
    >
      <Card className={`w-full bg-gradient-to-br from-gray-900 to-gray-800 border-none relative overflow-hidden
                      transition-all duration-300 ${shadowClass}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl font-mono text-gray-300">Bitcoin Price</CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="text-5xl font-mono text-white font-bold tracking-tight">
              ${price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
            <div className="flex gap-4 justify-center">
              <PriceChangeIndicator
                value={change24h}
                label="24h"
                className={change24h >= 0 ? "text-green-400" : "text-red-400"}
              />
              <PriceChangeIndicator
                value={change7d}
                label="7d"
                className={change7d >= 0 ? "text-green-400" : "text-red-400"}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Reusable component for price change indicator
const PriceChangeIndicator = ({ value, label, className }: { value: number; label: string; className: string }) => (
  <div className={`flex items-center ${className}`}>
    {value >= 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
    <span className="font-mono">
      {formatPercentage(value)}% ({label})
    </span>
  </div>
);