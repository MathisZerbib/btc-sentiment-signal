interface PriceLevelsProps {
  currentPrice: number;
  high24h: number;
  low24h: number;
}

export const PriceLevels = ({ currentPrice, high24h, low24h }: PriceLevelsProps) => {
  const calculateSupportsAndResistance = (currentPrice: number, high24h: number, low24h: number) => {
    const range = high24h - low24h;
    return {
      strongResistance: +(high24h + (range * 0.1)).toFixed(2),
      resistance: +high24h.toFixed(2),
      support: +low24h.toFixed(2),
      strongSupport: +(low24h - (range * 0.1)).toFixed(2)
    };
  };

  const levels = calculateSupportsAndResistance(currentPrice, high24h, low24h);

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
      <h3 className="text-lg font-mono text-gray-300 mb-2">Key Price Levels</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-400">Strong Resistance</span>
          <span className="text-red-400 font-mono">${levels.strongResistance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Resistance</span>
          <span className="text-red-300 font-mono">${levels.resistance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Current Price</span>
          <span className="text-blue-400 font-mono">${currentPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Support</span>
          <span className="text-green-300 font-mono">${levels.support.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Strong Support</span>
          <span className="text-green-400 font-mono">${levels.strongSupport.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};