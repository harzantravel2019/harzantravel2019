import { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchClients, fetchTransactions, Client, Transaction, Invoice } from "@/lib/db";
import logo from "@/assets/harzan-logo.gif";

interface Props {
  invoice: Invoice;
}

export default function InvoiceView({ invoice }: Props) {
  const [client, setClient] = useState<Client | null>(null);
  const [txns, setTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    Promise.all([fetchClients(), fetchTransactions(invoice.client_id)]).then(([clients, transactions]) => {
      setClient(clients.find(c => c.id === invoice.client_id) || null);
      setTxns(transactions);
    });
  }, [invoice]);

  const debts = txns.filter(t => t.type === "debt");
  const payments = txns.filter(t => t.type === "payment");
  const totalDebts = debts.reduce((s, t) => s + t.amount, 0);
  const totalPaid = payments.reduce((s, t) => s + t.amount, 0);

  return (
    <div id="invoice-print">
      <div className="text-center mb-6 border-b border-border pb-4">
        <img src={logo} alt="Harzan Travel" className="h-16 mx-auto mb-1" />
        <p className="text-xs text-muted-foreground">Travel Accounting Invoice</p>
      </div>

      <div className="flex justify-between text-sm mb-6">
        <div>
          <p className="font-medium">Bill To:</p>
          <p>{client?.name}</p>
          <p className="text-muted-foreground">{client?.phone}</p>
          <p className="text-muted-foreground">{client?.email}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">Invoice</p>
          <p className="text-muted-foreground font-mono text-xs">{invoice.id.slice(0, 8)}</p>
          <p className="text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
        </div>
      </div>

      {debts.length > 0 && (
        <table className="w-full text-sm mb-4 border border-border rounded">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left px-3 py-2">Description</th>
              <th className="text-left px-3 py-2">Date</th>
              <th className="text-right px-3 py-2">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {debts.map(t => (
              <tr key={t.id}>
                <td className="px-3 py-2">{t.description}</td>
                <td className="px-3 py-2">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-3 py-2 text-right">${t.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="border-t border-border pt-3 space-y-1 text-sm">
        <div className="flex justify-between"><span>Total Debts:</span><span className="font-semibold">${totalDebts.toLocaleString()}</span></div>
        <div className="flex justify-between"><span>Total Paid:</span><span className="font-semibold text-success">${totalPaid.toLocaleString()}</span></div>
        <div className="flex justify-between text-base font-bold border-t border-border pt-2 mt-2">
          <span>Balance Due:</span>
          <span className="text-destructive">${Math.max(0, totalDebts - totalPaid).toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 no-print">
        <Button variant="outline" onClick={() => window.print()} className="w-full">
          <Printer className="h-4 w-4 mr-2" /> Print Invoice
        </Button>
      </div>
    </div>
  );
}
