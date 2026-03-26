import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { fetchClients, fetchTransactions, createTransaction, deleteTransactionDb, Client, Transaction } from "@/lib/db";
import { toast } from "sonner";

export default function DebtsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [debts, setDebts] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const load = async () => {
    try {
      const [c, t] = await Promise.all([fetchClients(), fetchTransactions()]);
      setClients(c);
      setDebts(t.filter(tx => tx.type === "debt"));
    } catch (e: any) { toast.error(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clientId) return;
    try {
      await createTransaction(user.id, { client_id: clientId, type: "debt", amount: parseFloat(amount), description, date });
      await load();
      setShowForm(false);
      setAmount(""); setDescription(""); setClientId("");
      toast.success("Debt added!");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this debt record?")) return;
    try { await deleteTransactionDb(id); await load(); toast.success("Deleted"); } catch (e: any) { toast.error(e.message); }
  };

  const getClientName = (id: string) => clients.find(c => c.id === id)?.name || "Unknown";

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Debts</h2>
          <p className="text-sm text-muted-foreground mt-1">Track money owed by clients</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="brand-gradient border-0 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4 mr-1.5" /> Add Debt
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
            ) : debts.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No debts recorded.</td></tr>
            ) : debts.map(d => (
              <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 font-medium">{getClientName(d.client_id)}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{d.description}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{new Date(d.date).toLocaleDateString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-flex items-center gap-1 font-semibold text-destructive">
                    <ArrowUpRight className="h-3.5 w-3.5" />${d.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(d.id)}>
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
          <DialogHeader><DialogTitle>Add New Debt</DialogTitle></DialogHeader>
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
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Flight booking to Istanbul" required />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">Add Debt</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
