import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { fetchClients, fetchTransactions, createTransaction, deleteTransactionDb, Client, Transaction } from "@/lib/db";
import { toast } from "sonner";

export default function PaymentsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const load = async () => {
    try {
      const [c, t] = await Promise.all([fetchClients(), fetchTransactions()]);
      setClients(c);
      setPayments(t.filter(tx => tx.type === "payment"));
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clientId) return;
    try {
      await createTransaction(user.id, { client_id: clientId, type: "payment", amount: parseFloat(amount), description, date });
      await load();
      setShowForm(false);
      setAmount(""); setDescription(""); setClientId("");
      toast.success("Payment recorded!");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this payment record?")) return;
    try { await deleteTransactionDb(id); await load(); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-sm text-muted-foreground mt-1">Record payments received from clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="brand-gradient border-0 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4 mr-1.5" /> Record Payment
        </Button>
      </div>

      <div className="bg-card rounded-xl stat-shadow border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Client</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Description</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No payments recorded.</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 font-medium">{getClientName(p.client_id)}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{p.description}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{new Date(p.date).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-success">
                    <ArrowDownRight className="h-3.5 w-3.5" />${p.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(p.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <Label>Client *</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger><SelectValue placeholder="Select a client" /></SelectTrigger>
                <SelectContent>
                  {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Amount *</Label>
              <Input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required />
            </div>
            <div>
              <Label>Description *</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Cash payment" required />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">Record Payment</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
