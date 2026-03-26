import { Users, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { getClients, getTransactions, getClientBalance } from "@/lib/store";

export default function Dashboard() {
  const clients = getClients();
  const transactions = getTransactions();
  const totalDebts = transactions.filter(t => t.type === 'debt').reduce((s, t) => s + t.amount, 0);
  const totalPayments = transactions.filter(t => t.type === 'payment').reduce((s, t) => s + t.amount, 0);
  const outstanding = totalDebts - totalPayments;

  const stats = [
    { label: 'Total Clients', value: clients.length, icon: Users, color: 'bg-primary' },
    { label: 'Total Debts', value: `$${totalDebts.toLocaleString()}`, icon: TrendingDown, color: 'bg-destructive' },
    { label: 'Total Payments', value: `$${totalPayments.toLocaleString()}`, icon: TrendingUp, color: 'bg-success' },
    { label: 'Outstanding', value: `$${outstanding.toLocaleString()}`, icon: DollarSign, color: 'bg-accent' },
  ];

  const recentTxns = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-xl p-5 shadow-sm border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`${s.color} rounded-lg p-2`}>
                <s.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border">
        <div className="p-5 border-b border-border">
          <h3 className="font-display text-lg font-semibold">Recent Transactions</h3>
        </div>
        {recentTxns.length === 0 ? (
          <p className="p-5 text-muted-foreground text-sm">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentTxns.map(t => {
              const client = clients.find(c => c.id === t.clientId);
              return (
                <div key={t.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="font-medium text-sm">{client?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground">{t.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${t.type === 'debt' ? 'text-destructive' : 'text-success'}`}>
                      {t.type === 'debt' ? '+' : '-'}${t.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
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
