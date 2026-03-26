import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText } from "lucide-react";
import logo from "@/assets/harzan-logo.gif";

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'invoices', label: 'Invoices', icon: FileText },
];

export default function AppSidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="navy-gradient min-h-screen w-64 flex flex-col py-6 px-4 no-print">
      <div className="flex flex-col items-center mb-10 px-3">
        <img src={logo} alt="Harzan Travel" className="h-20 w-20 object-contain mb-2" />
        <p className="text-xs text-sidebar-foreground/60">Accounting System</p>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              active === item.id
                ? "bg-sidebar-accent text-accent"
                : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-3 text-xs text-sidebar-foreground/40 mt-auto">
        © 2026 Harzan Travel
      </div>
    </aside>
  );
}
