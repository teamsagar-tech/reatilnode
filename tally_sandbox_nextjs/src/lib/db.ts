import fs from 'fs';
import path from 'path';

// Define the structure of a transaction item
export interface TransactionItem {
  ItemName: string;
  HSN: string;
  Quantity: number;
  Rate: number;
  Amount: number;
  TaxLedger: string;
  TaxAmount: number;
}

// Define the structure of a transaction
export interface Transaction {
  VoucherType: string;
  Action: string;
  ReferenceID: string;
  PartyLedger: string;
  TotalAmount: number;
  Items: TransactionItem[];
}

export interface SandboxEntry {
  id: string;
  firm_id: string;
  date: string; // YYYY-MM-DD
  transaction: Transaction;
  created_at: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data.json');

// Initialize the data file if it doesn't exist
const initDb = () => {
  if (!fs.existsSync(DATA_FILE_PATH)) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify([], null, 2));
  }
};

export const getEntries = (): SandboxEntry[] => {
  initDb();
  try {
    const data = fs.readFileSync(DATA_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return [];
  }
};

export const saveEntry = (entry: Omit<SandboxEntry, 'id' | 'created_at'>): SandboxEntry => {
  const entries = getEntries();
  const newEntry: SandboxEntry = {
    ...entry,
    id: Math.random().toString(36).substring(2, 9),
    created_at: new Date().toISOString(),
  };
  
  entries.push(newEntry);
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(entries, null, 2));
  return newEntry;
};

export const getEntriesForDayEnd = (firm_id: string, date: string): Transaction[] => {
  const entries = getEntries();
  // Filter by firm_id and date
  const filtered = entries.filter(e => e.firm_id === firm_id && e.date === date);
  // Return just the transaction payloads
  return filtered.map(e => e.transaction);
};
