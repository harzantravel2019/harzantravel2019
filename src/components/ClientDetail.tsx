import { useState } from "react";
import { Plus, FileText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "@/components/TransactionForm";
import InvoiceView from "@/components/InvoiceView";
import { Client, getTransactions, addTransaction, deleteTransaction, getClientBalance, createInvoice, getInvoices, Invoice } from "@/lib/store";

interface Props {
  client: Client;
  onUpdate: () => void;
}

export default function ClientDetail({ client, onUpdate }: Props) {
  const [txns, setTxns] = useState(getTransactions().filter(t => t.clientId === client.id));
  const [showTxnForm, setShowTxnForm] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const balance = getClientBalance(client.id);

  const refreshTxns = () => {
    setTxns(getTransactions().filter(t => t.clientId === client.id));
    onUpdate();
  };

  const handleAddTxn = (data: { type: 'debt' | 'payment'; amount: number; description: string; date: string }) => {
    addTransaction({ ...data, clientId: client.id });
    refreshTxns();
    setShowTxnForm(false);
  };

  const handleDeleteTxn = (id: string) => {
    if (confirm('Delete this transaction?')) {
      deleteTransaction(id);
      refreshTxns();
    }
  };

  const handleGenerateInvoice = () => {
    const debtTxns = txns.filter(t => t.type === 'debt');
    if (debtTxns.length === 0) return;
    const invoice = createInvoice(client.id, debtTxns.map(t => t.id), balance);
    setViewInvoice(invoice);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="text-muted-foreground">Phone:</span> {client.phone || '—'}</div>
        <div><span className="text-muted-foreground">Email:</span> {client.email || '—'}</div>
        <div className="col-span-2"><span className="text-muted-foreground">Address:</span> {client.address || '—'}</div>
      </div>

      <div className={`rounded-lg p-3 text-center font-semibold ${balance > 0 ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
        Balance: ${Math.abs(balance).toLocaleString()} {balance > 0 ? '(owed)' : balance < 0 ? '(credit)' : '(settled)'}
      </div>

      <div className="flex gap-2">
        <Button size="sm" onClick={() => setShowTxnForm(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Transaction
        </Button>
        <Button size="sm" variant="outline" onClick={handleGenerateInvoice}>
          <FileText className="h-4 w-4 mr-1" /> Generate Invoice
        </Button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Description</th>
              <th className="text-left px-4 py-2 font-medium text-muted-foreground">Type</th>
              <th className="text-right px-4 py-2 font-medium text-muted-foreground">Amount</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {txns.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">No transactions.</td></tr>
            ) : txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => (
              <tr key={t.id}>
                <td className="px-4 py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{t.description}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.type === 'debt' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'}`}>
                    {t.type}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-medium">${t.amount.toLocaleString()}</td>
                <td className="px-2 py-2">
                  <Button size="icon" variant="ghost" onClick={() => handleDeleteTxn(t.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={showTxnForm} onOpenChange={setShowTxnForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Transaction</DialogTitle></DialogHeader>
          <TransactionForm onSubmit={handleAddTxn} onCancel={() => setShowTxnForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewInvoice} onOpenChange={() => setViewInvoice(null)}>
        <DialogContent className="max-w-lg">
          {viewInvoice && <InvoiceView invoice={viewInvoice} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
