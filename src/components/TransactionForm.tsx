import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onSubmit: (data: { type: 'debt' | 'payment'; amount: number; description: string; date: string }) => void;
  onCancel: () => void;
}

export default function TransactionForm({ onSubmit, onCancel }: Props) {
  const [type, setType] = useState<'debt' | 'payment'>('debt');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0 || !description.trim()) return;
    onSubmit({ type, amount: numAmount, description: description.trim(), date });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Type</Label>
        <div className="flex gap-2 mt-1">
          <Button type="button" size="sm" variant={type === 'debt' ? 'default' : 'outline'} onClick={() => setType('debt')}>
            Debt
          </Button>
          <Button type="button" size="sm" variant={type === 'payment' ? 'default' : 'outline'} onClick={() => setType('payment')}>
            Payment
          </Button>
        </div>
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
        <Button type="submit">Add Transaction</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
