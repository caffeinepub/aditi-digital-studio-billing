interface InvoiceStatusBadgeProps {
  paid: boolean;
  size?: 'sm' | 'md';
}

export default function InvoiceStatusBadge({ paid, size = 'md' }: InvoiceStatusBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  if (paid) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-success/15 text-success ${sizeClasses}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
        Paid
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-warning/15 text-warning-foreground ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
      Unpaid
    </span>
  );
}
