// import { useState } from "react";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { Trash2, Edit } from "lucide-react";

// interface PriceAlertModalProps {
//   btcPrice: number;
//   notificationsEnabled: boolean;
//   onAddAlert: (alertPrice: number) => void;
//   onEditAlert: (index: number, newPrice: number) => void;
//   onDeleteAlert: (index: number) => void;
//   priceAlerts: number[];
// }

// export const PriceAlertModal = ({
//   btcPrice,
//   notificationsEnabled,
//   onAddAlert,
//   onEditAlert,
//   onDeleteAlert,
//   priceAlerts,
// }: PriceAlertModalProps) => {
//   const [newAlertPrice, setNewAlertPrice] = useState<number | null>(null);
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [editingPrice, setEditingPrice] = useState<number | null>(null);
//   const [visible, setVisible] = useState(false);
//   const { toast } = useToast();

//   const handleAddAlert = () => {
//     if (newAlertPrice !== null) {
//       onAddAlert(newAlertPrice);
//       setNewAlertPrice(null);
//       setVisible(false);
//       toast({
//         title: "Alert Added",
//         description: `You will be notified when BTC reaches $${formatPrice(newAlertPrice)}.`,
//         duration: 5000,
//       });
//     }
//   };

//   const handleEditAlert = (index: number) => {
//     setEditingIndex(index);
//     setEditingPrice(priceAlerts[index]);
//   };

//   const handleSaveEdit = () => {
//     if (editingIndex !== null && editingPrice !== null) {
//       onEditAlert(editingIndex, editingPrice);
//       setEditingIndex(null);
//       setEditingPrice(null);
//       toast({
//         title: "Alert Updated",
//         description: `Price alert has been updated to $${formatPrice(editingPrice)}.`,
//         duration: 5000,
//       });
//     }
//   };

//   const handleDeleteAlert = (index: number) => {
//     onDeleteAlert(index);
//     toast({
//       title: "Alert Deleted",
//       description: "The price alert has been removed.",
//       duration: 5000,
//     });
//   };

//   const formatInputValue = (value: string) => {
//     // Remove non-numeric characters and parse as a number
//     const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
//     return isNaN(numericValue) ? null : numericValue;
//   };

//   const formatPrice = (price: number) => {
//     // Format the price with a dot as the thousand separator and a comma as the decimal separator
//     return price
//       .toLocaleString("de-DE", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//       })
//       .replace(/\./g, "x") // Temporarily replace dots with a placeholder
//       .replace(/,/g, ".") // Replace commas with dots
//       .replace(/x/g, ","); // Replace the placeholder with commas
//   };

//   return (
//     <Dialog open={visible} onOpenChange={setVisible}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="bg-black text-white hover:bg-gray-900">
//           Set Price Alert
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="bg-gray-900 border-gray-800 text-white">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">Set Price Alert</DialogTitle>
//           <DialogDescription className="text-gray-400">
//             Enter the BTC price at which you want to be notified.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4">
//           <div className="flex items-center gap-2">
//             <Input
//               type="text"
//               placeholder="Enter price"
//               value={newAlertPrice !== null ? formatPrice(newAlertPrice) : ""}
//               onChange={(e) => setNewAlertPrice(formatInputValue(e.target.value))}
//               className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
//             />
//             <Button
//               onClick={handleAddAlert}
//               disabled={!newAlertPrice}
//               className="bg-blue-600 hover:bg-blue-700"
//             >
//               Add Alert
//             </Button>
//           </div>
//           {/* Display Active Alerts */}
//           <div className="mt-4">
//             <h3 className="text-sm font-medium text-gray-400">Active Alerts</h3>
//             {priceAlerts.length > 0 ? (
//               <ul className="mt-2 space-y-2">
//                 {priceAlerts.map((alertPrice, index) => (
//                   <li key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
//                     {editingIndex === index ? (
//                       <div className="flex items-center gap-2">
//                         <Input
//                           type="text"
//                           value={editingPrice !== null ? formatPrice(editingPrice) : ""}
//                           onChange={(e) => setEditingPrice(formatInputValue(e.target.value))}
//                           className="w-24 bg-gray-700 border-gray-600 text-white"
//                         />
//                         <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
//                           Save
//                         </Button>
//                       </div>
//                     ) : (
//                       <span className="text-sm text-gray-300">${formatPrice(alertPrice)}</span>
//                     )}
//                     <div className="flex items-center gap-2">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleEditAlert(index)}
//                         className="text-gray-400 hover:bg-gray-700"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => handleDeleteAlert(index)}
//                         className="text-red-500 hover:bg-gray-700"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p className="text-sm text-gray-500">No active alerts.</p>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

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
  const [newAlertPrice, setNewAlertPrice] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleAddAlert = () => {
    const price = parseFloat(newAlertPrice);
    if (!isNaN(price)) {
      onAddAlert(price);
      setNewAlertPrice("");
      setIsModalOpen(false);
      toast({
        title: "Alert Added",
        description: `You will be notified when BTC reaches $${formatPrice(price)}.`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
    }
  };

  const handleEditAlert = (index: number) => {
    setEditingIndex(index);
    setEditingPrice(priceAlerts[index].toString());
  };

  const handleSaveEdit = () => {
    const price = parseFloat(editingPrice);
    if (editingIndex !== null && !isNaN(price)) {
      onEditAlert(editingIndex, price);
      setEditingIndex(null);
      setEditingPrice("");
      toast({
        title: "Alert Updated",
        description: `Price alert has been updated to $${formatPrice(price)}.`,
        duration: 5000,
      });
    } else {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAlert = (index: number) => {
    onDeleteAlert(index);
    toast({
      title: "Alert Deleted",
      description: "The price alert has been removed.",
      duration: 5000,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-black text-white hover:bg-gray-900">
          Set Price Alert
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Set Price Alert</DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the BTC price at which you want to be notified.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Add New Alert */}
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Enter price"
              value={newAlertPrice}
              onChange={(e) => setNewAlertPrice(e.target.value)}
              className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
            />
            <Button
              onClick={handleAddAlert}
              disabled={!newAlertPrice}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Alert
            </Button>
          </div>

          {/* Display Active Alerts */}
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-400">Active Alerts</h3>
            {priceAlerts.length > 0 ? (
              <ul className="mt-2 space-y-2">
                {priceAlerts.map((alertPrice, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-800 rounded-lg">
                    {editingIndex === index ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={editingPrice}
                          onChange={(e) => setEditingPrice(e.target.value)}
                          className="w-24 bg-gray-700 border-gray-600 text-white"
                        />
                        <Button onClick={handleSaveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                          Save
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-300">{formatPrice(alertPrice)}</span>
                    )}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditAlert(index)}
                        className="text-gray-400 hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteAlert(index)}
                        className="text-red-500 hover:bg-gray-700"
                      >
                        <Trash2 className="h-4 w-4" />
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