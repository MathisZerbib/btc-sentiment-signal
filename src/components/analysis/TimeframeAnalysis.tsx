import { Skeleton } from "@/components/ui/skeleton";

interface TimeframeProps {
  timeframes: {
    label: string;
    value: number | undefined;
  }[];
}

export const TimeframeAnalysis = ({ timeframes }: TimeframeProps) => {
  const formatPercentage = (value: number | undefined) => {
    if (typeof value !== 'number' || isNaN(value)) return '0.00';
    return value.toFixed(2);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {timeframes.map((tf) => (
        <div key={tf.label} className="bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
          <div className="text-sm text-gray-400">{tf.label}</div>
          <div className={`text-lg font-mono ${Number(formatPercentage(tf.value)) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercentage(tf.value)}%
          </div>
        </div>
      ))}
    </div>
  );
};