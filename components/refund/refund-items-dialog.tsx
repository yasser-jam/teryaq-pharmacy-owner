'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RefundItem {
  id: number;
  productName: string;
  quantity: number;
  refundedQuantity: number;
  stockItemId: number;
  subTotal: number;
  unitPrice: number;
  availableForRefund: number;
}

interface RefundItemsDialogProps {
  items: RefundItem[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  loading?: boolean
}

export function RefundItemsDialog({
  items,
  isOpen,
  onClose,
  onSubmit,
  loading
}: RefundItemsDialogProps) {
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: { quantity: number; reason: string };
  }>({});
  const [globalRefundReason, setGlobalRefundReason] = useState('');

  const handleItemCheck = (
    item: RefundItem,
    isChecked: boolean | 'indeterminate'
  ) => {
    if (isChecked) {
      setSelectedItems((prev) => ({
        ...prev,
        [item.id]: { quantity: item.availableForRefund, reason: '' },
      }));
    } else {
      setSelectedItems((prev) => {
        const newState = { ...prev };
        delete newState[item.id];
        return newState;
      });
    }
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    let newQuantity = Number(value);
    if (isNaN(newQuantity) || newQuantity < 0) {
      newQuantity = 0;
    }
    if (newQuantity > item.availableForRefund) {
      newQuantity = item.availableForRefund;
    }

    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], quantity: newQuantity },
    }));
  };

  const handleReasonChange = (itemId: number, value: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], reason: value },
    }));
  };

  const handleSubmit = () => {
    const formattedSelectedItems = Object.keys(selectedItems).map((itemId) => ({
      itemId: Number(itemId),
      quantity: selectedItems[Number(itemId)].quantity,
      itemRefundReason: selectedItems[Number(itemId)].reason,
    }));

    const data = {
      refundItems: formattedSelectedItems,
      refundReason: globalRefundReason,
    };
    onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Refund Items</DialogTitle>
          <DialogDescription>
            Select items to refund and provide reasons.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[400px] overflow-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border-b pb-2"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`item-${item.id}`}
                  checked={!!selectedItems[item.id]}
                  onCheckedChange={(isChecked) =>
                    handleItemCheck(item, isChecked)
                  }
                />
                <Label htmlFor={`item-${item.id}`} className="flex-1">
                  {item.productName} (Available: {item.availableForRefund})
                </Label>
                {selectedItems[item.id] && (
                  <Input
                    type="number"
                    value={selectedItems[item.id]?.quantity || ""}
                    onChange={(e) =>
                      handleQuantityChange(item.id, String(e))
                    }
                    min="0"
                    max={item.availableForRefund}
                    className="w-24"
                  />
                )}
              </div>
              {selectedItems[item.id] && (
                <Textarea
                  placeholder="Refund reason (optional)"
                  value={selectedItems[item.id]?.reason || ""}
                  onChange={(e) =>
                    handleReasonChange(item.id, e.target.value)
                  }
                  className="w-full"
                />
              )}
            </div>
          ))}

          <div className="grid gap-2">
            <Label htmlFor="global-refund-reason">Refund Reason</Label>
            <Textarea
              id="global-refund-reason"
              placeholder="Add a general refund reason (optional)"
              value={globalRefundReason}
              onChange={(e) => setGlobalRefundReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={Object.keys(selectedItems).length === 0}
            loading={loading}
          >
            Confirm Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
