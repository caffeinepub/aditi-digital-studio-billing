import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ArrowLeft, Send, User, Phone, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import LineItemsInput, { type LineItem } from '../components/LineItemsInput';
import { useCreateInvoice } from '../hooks/useQueries';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const createInvoice = useCreateInvoice();

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.customerName = 'Customer name is required';
    if (!customerAddress.trim()) newErrors.customerAddress = 'Address is required';
    if (!customerPhone.trim()) newErrors.customerPhone = 'Phone number is required';
    const hasValidItem = items.some((item) => item.description.trim() && item.unitPrice > 0);
    if (!hasValidItem) newErrors.items = 'At least one item with description and price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const backendItems = items
      .filter((item) => item.description.trim())
      .map((item) => ({
        description: item.description,
        quantity: BigInt(item.quantity),
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      }));

    try {
      const invoiceNumber = await createInvoice.mutateAsync({
        customerName: customerName.trim(),
        customerAddress: customerAddress.trim(),
        customerPhone: customerPhone.trim(),
        items: backendItems,
      });
      toast.success(`Invoice #${invoiceNumber.toString().padStart(4, '0')} created successfully!`);
      navigate({ to: `/invoices/${invoiceNumber.toString()}` });
    } catch {
      toast.error('Failed to create invoice. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate({ to: '/invoices' })}
          className="rounded-xl hover:bg-accent"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Create Invoice</h1>
          <p className="text-muted-foreground mt-0.5">Fill in the details to generate a new invoice</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Details */}
        <Card className="border border-border shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Customer Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="customerName" className="text-sm font-medium">
                  Customer Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (errors.customerName) setErrors((prev) => ({ ...prev, customerName: '' }));
                    }}
                    className={`pl-9 ${errors.customerName ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.customerName && (
                  <p className="text-xs text-destructive">{errors.customerName}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="customerPhone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="customerPhone"
                    placeholder="+91 XXXXX XXXXX"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (errors.customerPhone) setErrors((prev) => ({ ...prev, customerPhone: '' }));
                    }}
                    className={`pl-9 ${errors.customerPhone ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.customerPhone && (
                  <p className="text-xs text-destructive">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="customerAddress" className="text-sm font-medium">
                Address <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  id="customerAddress"
                  placeholder="Enter customer address"
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    if (errors.customerAddress) setErrors((prev) => ({ ...prev, customerAddress: '' }));
                  }}
                  rows={2}
                  className={`w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${
                    errors.customerAddress ? 'border-destructive' : 'border-input'
                  }`}
                />
              </div>
              {errors.customerAddress && (
                <p className="text-xs text-destructive">{errors.customerAddress}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card className="border border-border shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Line Items</CardTitle>
          </CardHeader>
          <CardContent>
            <LineItemsInput items={items} onChange={setItems} />
            {errors.items && (
              <p className="text-xs text-destructive mt-2">{errors.items}</p>
            )}
          </CardContent>
        </Card>

        {/* Totals */}
        <Card className="border border-border shadow-card">
          <CardContent className="p-6">
            <div className="max-w-xs ml-auto space-y-3">
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold text-foreground text-base">Total</span>
                <span className="font-bold text-primary text-xl">{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/invoices' })}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={createInvoice.isPending}
            className="bg-amber-gradient text-white shadow-amber hover:opacity-90 gap-2 font-semibold min-w-[140px]"
          >
            {createInvoice.isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Create Invoice
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
