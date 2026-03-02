import { Phone } from 'lucide-react';

export default function InvoicePrintHeader() {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-amber-500/30 mb-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-amber-50 border border-amber-200 flex items-center justify-center flex-shrink-0">
          <img
            src="/assets/generated/aditi-logo.dim_256x256.png"
            alt="Aditi Digital Studio"
            className="w-14 h-14 object-contain"
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<span style="font-size:1.75rem;font-weight:700;color:#b45309;">A</span>';
              }
            }}
          />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Aditi Digital Studio</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Virar - 401305, Maharashtra, India</p>
          <p className="text-muted-foreground text-sm mt-0.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            <span>7888223449</span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="inline-flex items-center gap-2 bg-amber-gradient px-4 py-2 rounded-xl">
          <span className="text-white font-bold text-lg tracking-wide">INVOICE</span>
        </div>
      </div>
    </div>
  );
}
