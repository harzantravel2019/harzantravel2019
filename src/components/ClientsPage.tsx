import { useState, useEffect } from "react";
import { Plus, Search, Trash2, Edit, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientForm from "@/components/ClientForm";
import { useAuth } from "@/hooks/useAuth";
import { fetchClients, createClient, updateClientDb, deleteClientDb, Client } from "@/lib/db";
import { toast } from "sonner";

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadClients(); }, []);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || "").includes(search) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (data: { name: string; phone: string; email: string; address: string; notes: string }) => {
    if (!user) return;
    try {
      await createClient(user.id, data);
      await loadClients();
      setShowForm(false);
      toast.success("Client added!");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleEdit = async (data: { name: string; phone: string; email: string; address: string; notes: string }) => {
    if (!editClient) return;
    try {
      await updateClientDb(editClient.id, data);
      await loadClients();
      setEditClient(null);
      toast.success("Client updated!");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this client and all their records?")) return;
    try {
      await deleteClientDb(id);
      await loadClients();
      toast.success("Client deleted");
    } catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight">Clients</h2>
          <p className="text-sm text-muted-foreground mt-1">{clients.length} total client{clients.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="brand-gradient border-0 shadow-md shadow-primary/20">
          <Plus className="h-4 w-4 mr-1.5" /> Add Client
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search by name, phone, or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 bg-card border-border/60 h-11" />
      </div>

      <div className="bg-card rounded-xl stat-shadow border border-border/60 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40">
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Phone</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-left px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Notes</th>
              <th className="text-right px-5 py-3.5 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-12 text-center text-muted-foreground">No clients found.</td></tr>
            ) : filtered.map(c => (
              <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5 font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{c.phone || "—"}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">{c.email || "—"}</td>
                <td className="px-5 py-3.5 text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">
                  {c.notes ? (
                    <span className="flex items-center gap-1.5">
                      <StickyNote className="h-3.5 w-3.5 text-accent shrink-0" />
                      {c.notes}
                    </span>
                  ) : "—"}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex justify-end gap-0.5">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setEditClient(c)}>
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => handleDelete(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
          <ClientForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editClient} onOpenChange={() => setEditClient(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          {editClient && <ClientForm client={editClient} onSubmit={handleEdit} onCancel={() => setEditClient(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
