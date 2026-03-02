import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ArrowLeft, Printer, CheckCircle2, Clock, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetInvoice, useMarkAsPaid, useMarkAsUnpaid } from '../hooks/useQueries';
import InvoicePrintHeader from '../components/InvoicePrintHeader';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function formatDate(time: bigint) {
  const ms = Number(time / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function InvoiceDetail() {
  const { invoiceNumber } = useParams({ from: '/invoices/$invoiceNumber' });
  const navigate = useNavigate();
  const invoiceNum = BigInt(invoiceNumber);

  const { data: invoice, isLoading, isError } = useGetInvoice(invoiceNum);
  const markAsPaid = useMarkAsPaid();
  const markAsUnpaid = useMarkAsUnpaid();

  const handleToggleStatus = async () => {
    if (!invoice) return;
    try {
      if (invoice.paid) {
        await markAsUnpaid.mutateAsync(invoice.invoiceNumber);
        toast.success('Invoice marked as unpaid');
      } else {
        await markAsPaid.mutateAsync(invoice.invoiceNumber);
        toast.success('Invoice marked as paid');
      }
    } catch {
      toast.error('Failed to update invoice status');
    }
  };

  const handleDownloadBill = () => {
    window.print();
  };

  const isToggling = markAsPaid.isPending || markAsUnpaid.isPending;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !invoice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 text-center">
        <p className="text-muted-foreground text-lg">Invoice not found.</p>
        <Link to="/invoices">
          <Button className="mt-4" variant="outline">
            Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  const paidAmount = invoice.paidAmount ?? 0;
  const balanceDue = Math.max(0, invoice.total - paidAmount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: '/invoices' })}
            className="rounded-xl hover:bg-accent"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-foreground">
              Invoice #{invoice.invoiceNumber.toString().padStart(4, '0')}
            </h1>
            <p className="text-muted-foreground text-sm">{formatDate(invoice.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleToggleStatus}
            disabled={isToggling}
            className={`gap-2 font-medium ${
              invoice.paid
                ? 'border-amber-300 text-amber-700 hover:bg-amber-50'
                : 'border-success/40 text-success hover:bg-success/10'
            }`}
          >
            {isToggling ? (
              <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            ) : invoice.paid ? (
              <Clock className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {invoice.paid ? 'Mark as Unpaid' : 'Mark as Paid'}
          </Button>
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="gap-2 font-medium border-border hover:bg-accent"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </Button>
          <Button
            onClick={handleDownloadBill}
            className="bg-amber-gradient text-white hover:opacity-90 gap-2 font-medium shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Bill
          </Button>
        </div>
      </div>

      {/* Invoice Document */}
      <Card className="border border-border shadow-card print-invoice">
        <CardContent className="p-6 sm:p-10">
          {/* Print Header */}
          <InvoicePrintHeader />

          {/* Invoice Meta */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Bill To
              </p>
              <p className="font-semibold text-foreground">{invoice.customerName}</p>
              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                {invoice.customerAddress}
              </p>
              <p className="text-sm text-muted-foreground mt-1">{invoice.customerPhone}</p>
            </div>
            <div className="text-right">
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Invoice Number
                  </p>
                  <p className="font-bold text-foreground text-lg">
                    #{invoice.invoiceNumber.toString().padStart(4, '0')}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-foreground font-medium">{formatDate(invoice.date)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </p>
                  <div className="flex justify-end mt-1">
                    <InvoiceStatusBadge paid={invoice.paid} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="rounded-xl overflow-hidden border border-border mb-6">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-semibold text-muted-foreground w-8">#</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Description</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-center">Qty</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-right">Unit Price</TableHead>
                  <TableHead className="font-semibold text-muted-foreground text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoice.items.map((item, index) => (
                  <TableRow key={index} className="hover:bg-accent/30">
                    <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                    <TableCell className="font-medium text-foreground">{item.description}</TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.quantity.toString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(item.unitPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatCurrency(item.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-3">
              <Separator />
              <div className="flex justify-between">
                <span className="font-bold text-foreground text-base">Total</span>
                <span className="font-bold text-primary text-xl">{formatCurrency(invoice.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-muted-foreground">Paid Amount</span>
                <span className="text-sm font-semibold text-success">{formatCurrency(paidAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                <span className="font-semibold text-amber-800 text-sm">Balance Due</span>
                <span className={`font-bold text-base ${balanceDue > 0 ? 'text-amber-700' : 'text-success'}`}>
                  {formatCurrency(balanceDue)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-10 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              Thank you for your business with Aditi Digital Studio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
