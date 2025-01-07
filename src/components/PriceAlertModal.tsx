import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

interface PriceAlertModalProps {
  btcPrice: number;
  notificationsEnabled: boolean;
  onAddAlert: (alertPrice: number) => void;
  onEditAlert: (index: number, newPrice: number) => void;
  onDeleteAlert: (index: number) => void;
  priceAlerts: number[];
}

export const PriceAlertModal = ({
  btcPrice,
  notificationsEnabled,
  onAddAlert,
  onEditAlert,
  onDeleteAlert,
  priceAlerts,
}: PriceAlertModalProps) => {
  const [newAlertPrice, setNewAlertPrice] = useState<number | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const { toast } = useToast();

  const handleAddAlert = () => {
    if (newAlertPrice !== null) {
      onAddAlert(newAlertPrice);
      setNewAlertPrice(null);
      setVisible(false);
    }
  };

  const handleEditAlert = (index: number) => {
    setEditingIndex(index);
    setEditingPrice(priceAlerts[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && editingPrice !== null) {
      onEditAlert(editingIndex, editingPrice);
      setEditingIndex(null);
      setEditingPrice(null);
      toast({
        title: "Alert Updated",
        description: `Price alert has been updated to $${editingPrice}.`,
        duration: 5000, // Auto-close after 5 seconds
      });
    }
  };

  const handleDeleteAlert = (index: number) => {
    onDeleteAlert(index);
    toast({
      title: "Alert Deleted",
      description: "The price alert has been removed.",
      duration: 5000, // Auto-close after 5 seconds
    });
  };

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogTrigger asChild>
        <Button variant="outline">Set Price Alert</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            Enter the BTC price at which you want to be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="number"
            placeholder="Enter price"
            value={newAlertPrice || ""}
            onChange={(e) => setNewAlertPrice(parseFloat(e.target.value))}
          />
          <Button onClick={handleAddAlert} disabled={!newAlertPrice}>
            Add Alert
          </Button>
          {/* Display Active Alerts */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400">Active Alerts</h3>
            {priceAlerts.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {priceAlerts.map((alertPrice, index) => (
                  <li key={index} className="flex items-center justify-between">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={editingPrice || ""}
                          onChange={(e) => setEditingPrice(parseFloat(e.target.value))}
                          className="w-24"
                        />
                        <Button onClick={handleSaveEdit} size="sm">
                          Save
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-300">${alertPrice}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAlert(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No active alerts.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};