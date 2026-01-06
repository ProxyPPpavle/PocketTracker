
export type CurrencyType = 'RSD' | 'EUR' | 'USD';

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number; // Stored in base currency (RSD)
  category: string;
  description: string;
  date: string; // ISO format
  goalId?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  frequency: 'daily' | 'monthly';
  type: 'earn' | 'spend';
}

export interface User {
  id: string;
  username: string;
  email: string;
  friends: string[]; // Usernames
}
