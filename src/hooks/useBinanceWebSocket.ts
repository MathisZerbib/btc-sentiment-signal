import { useEffect, useState } from "react";

export const useBinanceWebSocket = () => {
  const [btcPrice, setBtcPrice] = useState<number | null>(null);

  useEffect(() => {
    // Connect to Binance WebSocket for BTC/USDT pair
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p); // Current BTC price
      setBtcPrice(price);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return { btcPrice };
};