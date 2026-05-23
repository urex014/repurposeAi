// lib/pricing-config.ts
export type CreditPackage = '5k' | '25k' | '50k' | '80k' | '100k';

export const CREDIT_PACKAGES: Record<CreditPackage, { credits: number; priceNGN: number }> = {
  '5k': { credits: 5000, priceNGN: 5000 },
  '25k': { credits: 25000, priceNGN: 25000 },
  '50k': { credits: 50000, priceNGN: 50000 },
  '80k': { credits: 80000, priceNGN: 80000 },
  '100k': { credits: 100000, priceNGN: 100000 },
};