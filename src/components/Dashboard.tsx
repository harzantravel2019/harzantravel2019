import { Users, TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getClients, getTransactions } from "@/lib/store";

export default function Dashboard() {
  const clients = getClients();
  const transactions = getTransactions();
  const totalDebts = transactions.filter(t => t.type === 'debt').reduce((s, t) => s + t.amount, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0);
  const outstanding = totalDebts - totalPayments;

  const stats = [
    { label: 'Total Clients', value: clients.length.toString(), icon: Users, gradient: 'brand-gradient', lightBg: 'brand-gradient-light' },
    { label: 'Total Debts', value: `$${totalDebts.toLocaleString()}`, icon: TrendingDown, gradient: 'bg-destructive', lightBg: 'bg-destructive/8' },
    { label: 'Total Payments', value: `$${totalPayments.toLocaleString()}`, icon: TrendingUp, gradient: 'bg-success', lightBg: 'bg-success/8' },
    { label: 'Outstanding', value: `$${outstanding.toLocaleString()}`, icon: DollarSign, gradient: 'bg-accent', lightBg: 'bg-accent/8' },
  ];

  const recentTxns = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground mt-1">Welcome back — here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-5 stat-shadow card-hover border border-border/60">
            <div className="flex items-center justify-between mb-4">
              <div className={`${s.lightBg} rounded-xl p-2.5`}>
                <s.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl stat-shadow border border-border/60">
        <div className="px-6 py-4 border-b border-border/60">
          <h3 className="font-display text-base font-semibold">Recent Transactions</h3>
        </div>
        {recentTxns.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="brand-gradient-light rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm">No transactions yet.</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Add a client and record their first transaction.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {recentTxns.map(t => {
              const client = clients.find(c => c.id === t.clientId);
              return (
                <div key={t.id} className="flex items-center justify-between px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-1.5 ${t.type === 'debt' ? 'bg-destructive/8' : 'bg-success/8'}`}>
                      {t.type === 'debt'
                        ? <ArrowUpRight className="h-4 w-4 text-destructive" />
                        : <ArrowDownRight className="h-4 w-4 text-success" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-sm">{client?.name || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground">{t.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${t.type === 'debt' ? 'text-destructive' : 'text-success'}`}>
                      {t.type === 'debt' ? '+' : '-'}${t.amount.toLocaleString()}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
