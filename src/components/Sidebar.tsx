import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText, TrendingDown, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/harzan-logo.gif";

interface SidebarProps {
  active: string;
  onNavigate: (page: string) => void;
}

const navItems = [
{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
{ id: "clients", label: "Clients", icon: Users },
{ id: "debts", label: "Debts", icon: TrendingDown },
{ id: "payments", label: "Payments", icon: CreditCard },
{ id: "invoices", label: "Invoices", icon: FileText }];


export default function AppSidebar({ active, onNavigate }: SidebarProps) {
  const { signOut, user } = useAuth();

  return (
    <aside className="sidebar-gradient min-h-screen w-[260px] flex flex-col py-8 px-5 no-print border-r border-sidebar-border">
      <div className="flex flex-col items-center mb-12 px-3">
        <div className="bg-card/10 rounded-2xl p-3 mb-3 backdrop-blur-sm px-[16px] py-[16px]">
          <img src={logo} alt="Harzan Travel" className="h-16 w-16 object-contain" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-sidebar-foreground/40 mt-1">
          Accounting System
        </span>
      </div>

      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold text-sidebar-foreground/30 px-3 mb-3">Menu</p>

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) =>
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={cn(
            "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
            active === item.id ?
            "brand-gradient text-primary-foreground shadow-md shadow-primary/20" :
            "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
          )}>
          
            <item.icon className="h-[18px] w-[18px]" />
            <span className="flex-1 text-left">{item.label}</span>
            {active === item.id && <ChevronRight className="h-4 w-4 opacity-60" />}
          </button>
        )}
      </nav>

      <div className="px-3 pt-4 border-t border-sidebar-border space-y-3">
        <p className="text-[11px] text-sidebar-foreground/50 truncate">{user?.email}</p>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-sidebar-foreground/50 hover:text-sidebar-foreground text-sm transition-colors w-full">
          
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
        <p className="text-[10px] text-sidebar-foreground/30">© 2026 Harzan Travel</p>
      </div>
    </aside>);

}