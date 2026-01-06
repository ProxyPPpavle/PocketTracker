
import { CurrencyType } from './types';

export const CURRENCY_RATES: Record<CurrencyType, number> = {
  RSD: 1,
  USD: 100, // 1 USD = 100 RSD as requested
  EUR: 117, // 1 EUR = 117 RSD as requested
};

export const COLORS = {
  earn: '#10b981',
  spend: '#f43f5e',
  accent: '#8b5cf6',
  background: '#0f172a',
  surface: '#1e293b'
};

export const MOCK_CATEGORIES = {
  earn: ['Salary', 'Freelance', 'Youtube', 'Gift', 'Other'],
  spend: ['Shopping', 'Food', 'Rent', 'Transport', 'Entertainment', 'Subscription', 'Other']
};
