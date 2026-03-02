import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { PlusCircle, Search, ArrowUpDown, Eye, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetAllInvoices } from '../hooks/useQueries';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';
import type { InvoiceDTO } from '../backend';

type SortField = 'invoiceNumber' | 'date' | 'customerName' | 'total';
type SortDir = 'asc' | 'desc';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(time: bigint) {
  const ms = Number(time / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function InvoiceList() {
  const { data: invoices, isLoading, isError } = useGetAllInvoices();
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('invoiceNumber');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const filtered = (invoices ?? [])
    .filter((inv) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.invoiceNumber.toString().includes(q) ||
        inv.customerPhone.includes(q);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'paid' && inv.paid) ||
        (statusFilter === 'unpaid' && !inv.paid);
      return matchesSearch && matchesStatus;
    })
    .sort((a: InvoiceDTO, b: InvoiceDTO) => {
      let cmp = 0;
      if (sortField === 'invoiceNumber') cmp = Number(a.invoiceNumber - b.invoiceNumber);
      else if (sortField === 'date') cmp = Number(a.date - b.date);
      else if (sortField === 'customerName') cmp = a.customerName.localeCompare(b.customerName);
      else if (sortField === 'total') cmp = a.total - b.total;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors group"
    >
      {label}
      <ArrowUpDown
        className={`w-3.5 h-3.5 transition-colors ${
          sortField === field ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-muted-foreground'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1">
            {invoices ? `${invoices.length} invoice${invoices.length !== 1 ? 's' : ''} total` : 'Loading...'}
          </p>
        </div>
        <Link to="/invoices/create">
          <Button className="bg-amber-gradient text-white shadow-amber hover:opacity-90 gap-2 font-semibold">
            <PlusCircle className="w-4 h-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border border-border shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, invoice #, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'paid', 'unpaid'] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className={
                    statusFilter === s
                      ? 'bg-amber-gradient text-white border-transparent shadow-amber'
                      : 'border-border'
                  }
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border border-border shadow-card overflow-hidden">
        <CardHeader className="pb-0 px-6 pt-5">
          <CardTitle className="text-base font-semibold">All Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-4">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-muted-foreground">
              Failed to load invoices. Please try again.
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">
                {search || statusFilter !== 'all' ? 'No invoices match your filters' : 'No invoices yet'}
              </p>
              {!search && statusFilter === 'all' && (
                <Link to="/invoices/create">
                  <Button className="mt-4 bg-amber-gradient text-white shadow-amber hover:opacity-90 gap-2">
                    <PlusCircle className="w-4 h-4" />
                    Create Invoice
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="font-semibold text-muted-foreground">
                      <SortButton field="invoiceNumber" label="Invoice #" />
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground">
                      <SortButton field="date" label="Date" />
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground">
                      <SortButton field="customerName" label="Customer" />
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground hidden sm:table-cell">
                      Items
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right">
                      <SortButton field="total" label="Total" />
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right hidden md:table-cell">
                      Balance Due
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-muted-foreground text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((invoice) => {
                    const paidAmt = invoice.paidAmount ?? 0;
                    const balance = Math.max(0, invoice.total - paidAmt);
                    return (
                      <TableRow
                        key={invoice.invoiceNumber.toString()}
                        className="hover:bg-accent/40 transition-colors"
                      >
                        <TableCell className="font-semibold text-primary">
                          #{invoice.invoiceNumber.toString().padStart(4, '0')}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(invoice.date)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground text-sm">{invoice.customerName}</p>
                            <p className="text-xs text-muted-foreground">{invoice.customerPhone}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                          {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-foreground">
                          {formatCurrency(invoice.total)}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <span className={`font-semibold text-sm ${balance > 0 ? 'text-amber-600' : 'text-success'}`}>
                            {formatCurrency(balance)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <InvoiceStatusBadge paid={invoice.paid} size="sm" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            to="/invoices/$invoiceNumber"
                            params={{ invoiceNumber: invoice.invoiceNumber.toString() }}
                          >
                            <Button variant="ghost" size="sm" className="gap-1.5 text-primary hover:text-primary hover:bg-primary/10">
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
