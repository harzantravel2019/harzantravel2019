import { supabase } from "@/integrations/supabase/client";

export type Client = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  client_id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  user_id: string;
  client_id: string;
  total_amount: number;
  status: string;
  date: string;
  created_at: string;
};

// Clients
export async function fetchClients() {
  const { data, error } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data as Client[];
}

export async function createClient(userId: string, client: { name: string; phone: string; email: string; address: string; notes: string }) {
  const { data, error } = await supabase.from("clients").insert({ ...client, user_id: userId }).select().single();
  if (error) throw error;
  return data as Client;
}

export async function updateClientDb(id: string, updates: Partial<Client>) {
  const { error } = await supabase.from("clients").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteClientDb(id: string) {
  const { error } = await supabase.from("clients").delete().eq("id", id);
  if (error) throw error;
}

// Transactions
export async function fetchTransactions(clientId?: string) {
  let query = supabase.from("transactions").select("*").order("date", { ascending: false });
  if (clientId) query = query.eq("client_id", clientId);
  const { data, error } = await query;
  if (error) throw error;
  return data as Transaction[];
}

export async function createTransaction(userId: string, txn: { client_id: string; type: string; amount: number; description: string; date: string }) {
  const { data, error } = await supabase.from("transactions").insert({ ...txn, user_id: userId }).select().single();
  if (error) throw error;
  return data as Transaction;
}

export async function deleteTransactionDb(id: string) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}

// Invoices
export async function fetchInvoices() {
  const { data, error } = await supabase.from("invoices").select("*").order("date", { ascending: false });
  if (error) throw error;
  return data as Invoice[];
}

export async function createInvoiceDb(userId: string, clientId: string, totalAmount: number) {
  const { data, error } = await supabase.from("invoices").insert({
    user_id: userId,
    client_id: clientId,
    total_amount: totalAmount,
    status: totalAmount <= 0 ? "paid" : "unpaid",
  }).select().single();
  if (error) throw error;
  return data as Invoice;
}
