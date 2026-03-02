import { Link, useRouterState } from '@tanstack/react-router';
import { LayoutDashboard, FileText, PlusCircle, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/invoices', label: 'Invoices', icon: FileText, exact: true },
  { to: '/invoices/create', label: 'New Invoice', icon: PlusCircle, exact: false },
];

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (to: string, exact: boolean) => {
    if (exact) return currentPath === to;
    return currentPath.startsWith(to);
  };

  return (
    <header className="bg-sidebar border-b border-sidebar-border sticky top-0 z-50 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/generated/aditi-logo.dim_256x256.png"
                alt="Aditi Digital Studio Logo"
                className="w-9 h-9 object-contain"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-amber-400 font-bold text-lg font-display">A</span>';
                  }
                }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-sidebar-foreground font-display font-semibold text-base leading-tight">
                Aditi Digital Studio
              </p>
              <p className="text-sidebar-foreground/50 text-xs leading-tight">
                Virar - 401305, India
              </p>
            </div>
          </Link>

          {/* Mobile number (desktop) */}
          <div className="hidden sm:flex items-center gap-1.5 text-sidebar-foreground/70 text-xs mr-2 md:mr-0">
            <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>7888223449</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon, exact }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive(to, exact)
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-amber'
                    : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-sidebar-border bg-sidebar px-4 py-3 space-y-1">
          {/* Mobile number in mobile menu */}
          <div className="flex items-center gap-2 px-4 py-2 text-sidebar-foreground/60 text-sm">
            <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>7888223449</span>
          </div>
          {navLinks.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive(to, exact)
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
