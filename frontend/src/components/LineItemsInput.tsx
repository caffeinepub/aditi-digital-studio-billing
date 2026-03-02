import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { InvoiceItem } from '../backend';

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface LineItemsInputProps {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export default function LineItemsInput({ items, onChange }: LineItemsInputProps) {
  const addItem = () => {
    onChange([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = items.map((item, i) => {
      if (i !== index) return item;
      return { ...item, [field]: value };
    });
    onChange(updated);
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  return (
    <div className="space-y-3">
      {/* Header row */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-center">Qty</div>
        <div className="col-span-3 text-right">Unit Price (₹)</div>
        <div className="col-span-1 text-right">Total</div>
        <div className="col-span-1" />
      </div>

      {items.map((item, index) => {
        const lineTotal = item.quantity * item.unitPrice;
        return (
          <div
            key={index}
            className="grid grid-cols-12 gap-2 items-center bg-accent/40 rounded-xl p-3 border border-border"
          >
            <div className="col-span-12 sm:col-span-5">
              <Input
                placeholder="Item description"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                className="bg-card border-border text-sm"
              />
            </div>
            <div className="col-span-4 sm:col-span-2">
              <Input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateItem(index, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                className="bg-card border-border text-sm text-center"
              />
            </div>
            <div className="col-span-5 sm:col-span-3">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={item.unitPrice}
                onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                className="bg-card border-border text-sm text-right"
              />
            </div>
            <div className="col-span-2 sm:col-span-1 text-right">
              <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                {formatCurrency(lineTotal)}
              </span>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        onClick={addItem}
        className="w-full border-dashed border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:border-amber-500 gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Line Item
      </Button>
    </div>
  );
}
