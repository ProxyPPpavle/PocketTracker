
import { CurrencyType } from '../types';
import { CURRENCY_RATES } from '../constants';

/**
 * Converts value from RSD to target currency
 */
export const fromBase = (value: number, to: CurrencyType): number => {
  return value / CURRENCY_RATES[to];
};

/**
 * Converts value from source currency to RSD
 */
export const toBase = (value: number, from: CurrencyType): number => {
  return value * CURRENCY_RATES[from];
};

export const formatCurrency = (value: number, currency: CurrencyType): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' ' + currency;
};
