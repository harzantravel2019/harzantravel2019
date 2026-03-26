import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Client } from "@/lib/db";

interface Props {
  client?: Client;
  onSubmit: (data: { name: string; phone: string; email: string; address: string; notes: string }) => void;
  onCancel: () => void;
}

export default function ClientForm({ client, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(client?.name || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [email, setEmail] = useState(client?.email || "");
  const [address, setAddress] = useState(client?.address || "");
  const [notes, setNotes] = useState(client?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim(), address: address.trim(), notes: notes.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name *</Label>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder="Client name" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Phone</Label>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number" />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" type="email" />
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" />
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes about this client..." rows={3} />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit">{client ? "Update" : "Add"} Client</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
