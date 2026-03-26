import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Invoice, getClients, getTransactions } from "@/lib/store";
import logo from "@/assets/harzan-logo.gif";

interface Props {
  invoice: Invoice;
}

export default function InvoiceView({ invoice }: Props) {
  const client = getClients().find(c => c.id === invoice.clientId);
  const allTxns = getTransactions();
  const txns = allTxns.filter(t => invoice.transactionIds.includes(t.id));
  const payments = allTxns.filter(t => t.clientId === invoice.clientId && t.type === 'payment');

  const totalDebts = txns.reduce((s, t) => s + t.amount, 0);
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
          <p className="font-medium">Invoice #{invoice.id}</p>
          <p className="text-muted-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
        </div>
      </div>

      <table className="w-full text-sm mb-4 border border-border rounded">
        <thead>
          <tr className="bg-muted/50">
            <th className="text-left px-3 py-2">Description</th>
            <th className="text-left px-3 py-2">Date</th>
            <th className="text-right px-3 py-2">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {txns.map(t => (
            <tr key={t.id}>
              <td className="px-3 py-2">{t.description}</td>
              <td className="px-3 py-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="px-3 py-2 text-right">${t.amount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

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
