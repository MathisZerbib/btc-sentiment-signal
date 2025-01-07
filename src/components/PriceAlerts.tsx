import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PriceAlertsProps {
  btcPrice: number;
  notificationsEnabled: boolean;
}

export const PriceAlerts = ({ btcPrice, notificationsEnabled }: PriceAlertsProps) => {
  const [priceAlerts, setPriceAlerts] = useState<number[]>([]);
  const [newAlertPrice, setNewAlertPrice] = useState<number | null>(null);
  const { toast } = useToast();

  // Check for price alerts
  useEffect(() => {
    if (!notificationsEnabled || priceAlerts.length === 0) return;

    priceAlerts.forEach((alertPrice) => {
      if (btcPrice >= alertPrice) {
        toast({
          title: "Price Alert",
          description: `BTC price has reached or exceeded $${alertPrice}.`,
        });
        // Remove the triggered alert
        setPriceAlerts((prevAlerts) => prevAlerts.filter((price) => price !== alertPrice));
      }
    });
  }, [btcPrice, priceAlerts, notificationsEnabled, toast]);

  // Add a new price alert
  const handleAddAlert = () => {
    if (newAlertPrice !== null) {
      setPriceAlerts((prevAlerts) => [...prevAlerts, newAlertPrice]);
      setNewAlertPrice(null);
      toast({
        title: "Alert Added",
        description: `You will be notified when BTC reaches $${newAlertPrice}.`,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          type="number"
          placeholder="Set price alert"
          value={newAlertPrice || ""}
          onChange={(e) => setNewAlertPrice(parseFloat(e.target.value))}
          className="w-40"
        />
        <Button onClick={handleAddAlert} disabled={!newAlertPrice}>
          Add Alert
        </Button>
      </div>
      <div className="text-sm text-gray-400">
        Active Alerts: {priceAlerts.join(", ") || "None"}
      </div>
    </div>
  );
};