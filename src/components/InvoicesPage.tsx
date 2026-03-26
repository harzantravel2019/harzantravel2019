import { useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import InvoiceView from "@/components/InvoiceView";
import { getInvoices, getClients, Invoice } from "@/lib/store";

export default function InvoicesPage() {
  const invoices = getInvoices().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const clients = getClients();
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-2xl font-bold mb-6">Invoices</h2>

      <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Invoice #</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Client</th>
              <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-right px-5 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">No invoices yet. Generate one from a client's detail page.</td></tr>
            ) : invoices.map(inv => {
              const client = clients.find(c => c.id === inv.clientId);
              return (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{inv.id}</td>
                  <td className="px-5 py-3">{client?.name || 'Unknown'}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(inv.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right font-semibold">${inv.totalAmount.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <Button size="icon" variant="ghost" onClick={() => setViewInvoice(inv)}>
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
