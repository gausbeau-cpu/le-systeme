export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  defaultRateToUsd: number; // 1 unit in USD
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  { code: 'USD', name: 'Dollar Américain', symbol: '$', flag: '🇺🇸', defaultRateToUsd: 1 },
  { code: 'XOF', name: 'Franc CFA (BCEAO)', symbol: 'FCFA', flag: '🇧🇫', defaultRateToUsd: 1 / 606 }, // ~0.00165
  { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', defaultRateToUsd: 1.08 },
  { code: 'GBP', name: 'Livre Sterling', symbol: '£', flag: '🇬🇧', defaultRateToUsd: 1.28 },
  { code: 'CAD', name: 'Dollar Canadien', symbol: 'CA$', flag: '🇨🇦', defaultRateToUsd: 0.74 },
];

/**
 * Converts any amount to USD based on the specified currency and optional live rates dictionary.
 */
export function convertToUSD(
  amount: number,
  currencyCode: string,
  customRates?: Record<string, number>
): number {
  if (isNaN(amount) || amount <= 0) return 0;
  if (currencyCode === 'USD') return Number(amount.toFixed(2));

  if (customRates && customRates[currencyCode]) {
    return Number((amount * customRates[currencyCode]).toFixed(2));
  }

  const found = SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode);
  if (found) {
    return Number((amount * found.defaultRateToUsd).toFixed(2));
  }

  // Fallback for XOF
  if (currencyCode === 'XOF') {
    return Number((amount * (1 / 606)).toFixed(2));
  }

  return Number(amount.toFixed(2));
}

/**
 * Fetch live rates from a configured API endpoint if provided
 */
export async function fetchLiveRatesFromApi(apiUrl: string): Promise<Record<string, number> | null> {
  if (!apiUrl) return null;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) return null;
    const data = await res.json();
    // Assuming format { rates: { XOF: 606, EUR: 0.92, ... } } or direct mapping
    return data.rates || data;
  } catch (err) {
    console.warn("Could not fetch live currency rates from API:", err);
    return null;
  }
}
