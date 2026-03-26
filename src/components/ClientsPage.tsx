import { useState } from "react";
import { Plus, Search, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ClientForm from "@/components/ClientForm";
import ClientDetail from "@/components/ClientDetail";
import { getClients, addClient, updateClient, deleteClient, getClientBalance, Client } from "@/lib/store";

export default function ClientsPage() {
  const [clients, setClients] = useState(getClients());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [viewClient, setViewClient] = useState<Client | null>(null);

  const refresh = () => setClients(getClients());

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: { name: string; phone: string; email: string; address: string }) => {
    addClient(data);
    refresh();
    setShowForm(false);
  };

  const handleEdit = (data: { name: string; phone: string; email: string; address: string }) => {
    if (editClient) {
      updateClient(editClient.id, data);
      refresh();
      setEditClient(null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this client and all their records?')) {
      deleteClient(id);
      refresh();
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Clients</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Client
        </Button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
      </div>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground hidden md:table-cell">Email</th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">Balance</th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No clients found.</td></tr>
            ) : filtered.map(c => {
              const balance = getClientBalance(c.id);
              return (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{c.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{c.phone || '—'}</td>
                  <td className="px-5 py-3 text-muted-foreground hidden md:table-cell">{c.email || '—'}</td>
                  <td className={`px-5 py-3 text-right font-semibold ${balance > 0 ? 'text-destructive' : balance < 0 ? 'text-success' : ''}`}>
                    ${Math.abs(balance).toLocaleString()}{balance > 0 ? ' owed' : balance < 0 ? ' credit' : ''}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewClient(c)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => setEditClient(c)}><Edit className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Client</DialogTitle></DialogHeader>
          <ClientForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={!!editClient} onOpenChange={() => setEditClient(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Client</DialogTitle></DialogHeader>
          {editClient && <ClientForm client={editClient} onSubmit={handleEdit} onCancel={() => setEditClient(null)} />}
        </DialogContent>
      </Dialog>

      {/* View Client Detail Dialog */}
      <Dialog open={!!viewClient} onOpenChange={() => setViewClient(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{viewClient?.name}</DialogTitle></DialogHeader>
          {viewClient && <ClientDetail client={viewClient} onUpdate={refresh} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
