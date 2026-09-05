import { Currency, CurrencyConfig } from '../types';

export const CURRENCIES: Record<Currency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    rate: 1,
    name: 'Indian Rupee (₹)'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 0.012, // 1 INR = 0.012 USD
    name: 'US Dollar ($)'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.011, // 1 INR = 0.011 EUR
    name: 'Euro (€)'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.0095,
    name: 'British Pound (£)'
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    rate: 0.044,
    name: 'UAE Dirham (AED)'
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    rate: 0.016,
    name: 'Singapore Dollar (S$)'
  }
};

export function formatPrice(inrAmount: number, currency: Currency = 'INR'): string {
  const conf = CURRENCIES[currency] || CURRENCIES.INR;
  const converted = inrAmount * conf.rate;
  
  if (currency === 'INR') {
    return `₹${Math.round(converted).toLocaleString('en-IN')}`;
  } else if (currency === 'AED') {
    return `${conf.symbol} ${converted.toFixed(1)}`;
  } else {
    return `${conf.symbol}${converted.toFixed(2)}`;
  }
}
