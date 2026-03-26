export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  clientId: string;
  type: 'debt' | 'payment';
  amount: number;
  description: string;
  date: string;
  invoiceId?: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  transactionIds: string[];
  totalAmount: number;
  date: string;
  status: 'paid' | 'unpaid' | 'partial';
}

const CLIENTS_KEY = 'harzan_clients';
const TRANSACTIONS_KEY = 'harzan_transactions';
const INVOICES_KEY = 'harzan_invoices';

function load<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Clients
export function getClients(): Client[] { return load(CLIENTS_KEY); }
export function saveClients(clients: Client[]) { save(CLIENTS_KEY, clients); }

export function addClient(client: Omit<Client, 'id' | 'createdAt'>): Client {
  const clients = getClients();
  const newClient: Client = { ...client, id: generateId(), createdAt: new Date().toISOString() };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
}

export function updateClient(id: string, data: Partial<Client>) {
  const clients = getClients().map(c => c.id === id ? { ...c, ...data } : c);
  saveClients(clients);
}

export function deleteClient(id: string) {
  saveClients(getClients().filter(c => c.id !== id));
  // Also remove related transactions and invoices
  save(TRANSACTIONS_KEY, getTransactions().filter(t => t.clientId !== id));
  save(INVOICES_KEY, getInvoices().filter(i => i.clientId !== id));
}

// Transactions
export function getTransactions(): Transaction[] { return load(TRANSACTIONS_KEY); }
export function saveTransactions(txns: Transaction[]) { save(TRANSACTIONS_KEY, txns); }

export function addTransaction(txn: Omit<Transaction, 'id'>): Transaction {
  const txns = getTransactions();
  const newTxn: Transaction = { ...txn, id: generateId() };
  txns.push(newTxn);
  saveTransactions(txns);
  return newTxn;
}

export function deleteTransaction(id: string) {
  saveTransactions(getTransactions().filter(t => t.id !== id));
}

export function getClientBalance(clientId: string): number {
  return getTransactions()
    .filter(t => t.clientId === clientId)
    .reduce((sum, t) => t.type === 'debt' ? sum + t.amount : sum - t.amount, 0);
}

// Invoices
export function getInvoices(): Invoice[] { return load(INVOICES_KEY); }
export function saveInvoices(invoices: Invoice[]) { save(INVOICES_KEY, invoices); }

export function createInvoice(clientId: string, transactionIds: string[], totalAmount: number): Invoice {
  const invoices = getInvoices();
  const invoice: Invoice = {
    id: 'INV-' + Date.now().toString().slice(-6),
    clientId,
    transactionIds,
    totalAmount,
    date: new Date().toISOString(),
    status: totalAmount <= 0 ? 'paid' : 'unpaid',
  };
  invoices.push(invoice);
  saveInvoices(invoices);
  return invoice;
}
