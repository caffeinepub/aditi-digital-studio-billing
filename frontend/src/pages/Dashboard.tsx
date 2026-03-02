import { Link } from '@tanstack/react-router';
import { FileText, TrendingUp, CheckCircle2, Clock, PlusCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllInvoices } from '../hooks/useQueries';
import InvoiceStatusBadge from '../components/InvoiceStatusBadge';

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(time: bigint) {
  const ms = Number(time / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Dashboard() {
  const { data: invoices, isLoading, isError } = useGetAllInvoices();

  const totalInvoices = invoices?.length ?? 0;
  const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.total, 0) ?? 0;
  const paidCount = invoices?.filter((inv) => inv.paid).length ?? 0;
  const unpaidCount = totalInvoices - paidCount;
  const paidRevenue = invoices?.filter((inv) => inv.paid).reduce((sum, inv) => sum + inv.total, 0) ?? 0;

  const recentInvoices = invoices
    ? [...invoices]
        .sort((a, b) => Number(b.invoiceNumber - a.invoiceNumber))
        .slice(0, 5)
    : [];

  const stats = [
    {
      title: 'Total Invoices',
      value: totalInvoices.toString(),
      icon: FileText,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: 'Paid Invoices',
      value: paidCount.toString(),
      sub: formatCurrency(paidRevenue),
      icon: CheckCircle2,
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
    },
    {
      title: 'Unpaid Invoices',
      value: unpaidCount.toString(),
      icon: Clock,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to Aditi Digital Studio</p>
        </div>
        <Link to="/invoices/create">
          <Button className="bg-amber-gradient text-white shadow-amber hover:opacity-90 gap-2 font-semibold">
            <PlusCircle className="w-4 h-4" />
            New Invoice
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`border ${stat.border} shadow-card hover:shadow-card-hover transition-shadow`}>
              <CardContent className="p-5">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                      {stat.sub && <p className="text-xs text-muted-foreground mt-0.5">{stat.sub} collected</p>}
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Invoices */}
      <Card className="border border-border shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold">Recent Invoices</CardTitle>
          <Link to="/invoices">
            <Button variant="ghost" size="sm" className="text-primary gap-1 hover:text-primary">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Failed to load invoices. Please try again.</p>
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">No invoices yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Create your first invoice to get started</p>
              <Link to="/invoices/create">
                <Button className="mt-4 bg-amber-gradient text-white shadow-amber hover:opacity-90 gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create Invoice
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.invoiceNumber.toString()}
                  to="/invoices/$invoiceNumber"
                  params={{ invoiceNumber: invoice.invoiceNumber.toString() }}
                  className="flex items-center justify-between px-6 py-4 hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        #{invoice.invoiceNumber.toString().padStart(4, '0')}
                      </p>
                      <p className="text-xs text-muted-foreground">{invoice.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="font-semibold text-foreground text-sm">{formatCurrency(invoice.total)}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(invoice.date)}</p>
                    </div>
                    <InvoiceStatusBadge paid={invoice.paid} size="sm" />
                    <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
