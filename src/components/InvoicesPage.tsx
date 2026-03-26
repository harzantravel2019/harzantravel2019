import { useState, useEffect } from "react";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceView from "@/components/InvoiceView";
import { useAuth } from "@/hooks/useAuth";
import { fetchClients, fetchTransactions, fetchInvoices, createInvoiceDb, Client, Transaction, Invoice } from "@/lib/db";
import { toast } from "sonner";

export default function InvoicesPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [selectedClient, setSelectedClient] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const [c, t, i] = await Promise.all([fetchClients(), fetchTransactions(), fetchInvoices()]);
      setClients(c); setTransactions(t); setInvoices(i);
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const getBalance = (clientId: string) => {
    return transactions
      .filter(t => t.client_id === clientId)
      .reduce((sum, t) => t.type === "debt" ? sum + t.amount : sum - t.amount, 0);
  };

  const handleGenerate = async () => {
    if (!user || !selectedClient) return;
    const balance = getBalance(selectedClient);
    try {
      await createInvoiceDb(user.id, selectedClient, balance);
      await load();
      setSelectedClient("");
      toast.success("Invoice generated!");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Invoices</h2>
        <p className="text-sm text-muted-foreground mt-1">Generate and view client invoices</p>
      </div>

      <div className="bg-card rounded-xl stat-shadow border border-border/60 p-5">
        <h3 className="font-medium text-sm mb-3">Generate New Invoice</h3>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
              <SelectContent>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={!selectedClient} className="brand-gradient border-0">
            <FileText className="h-4 w-4 mr-1.5" /> Generate
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl stat-shadow border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Invoice ID</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">No invoices yet.</td></tr>
            ) : invoices.map(inv => {
              const client = clients.find(c => c.id === inv.client_id);
              return (
                <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs">{inv.id.slice(0, 8)}</td>
                  <td className="px-5 py-3.5 font-medium">{client?.name || "Unknown"}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5 text-right font-semibold">${inv.total_amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      inv.status === "paid" ? "bg-success/8 text-success" : "bg-destructive/8 text-destructive"
                    }`}>{inv.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setViewInvoice(inv)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="max-w-lg">
          {viewInvoice && <InvoiceView invoice={viewInvoice} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
