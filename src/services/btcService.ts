import axios from "axios";

export interface MarketData {
  price_change_percentage_1h_in_currency: { usd: number };
  price_change_percentage_24h_in_currency: { usd: number };
  price_change_percentage_7d_in_currency: { usd: number };
  price_change_percentage_30d_in_currency: { usd: number };
  current_price: { usd: number };
  high_24h: { usd: number };
  low_24h: { usd: number };
}

export interface BTCData {
  market_data: MarketData;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
}

export const fetchBTCData = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
  );
  const marketData = response.data.market_data;
  return {
    currentPrice: marketData.current_price.usd || 0,
    priceChange24h: marketData.price_change_percentage_24h_in_currency.usd || 0,
    priceChange7d: marketData.price_change_percentage_7d_in_currency.usd || 0,
  };
};

export const fetchBTCInsights = async () => {
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
  );
  return response.data as BTCData;
};
