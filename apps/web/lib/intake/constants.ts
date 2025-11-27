import type { BudgetLevel, DurationFit, VisaPurpose } from './visaProfiles';

/**
 * Centralized mapping constants and scoring configuration
 */

export const PURPOSE_LABELS: Record<VisaPurpose, string> = {
  remote: 'remote work & income abroad',
  retirement: 'retirement lifestyle',
  longstay: 'long stay in Thailand',
  study: 'study or education',
  family: 'being close to family in Thailand',
  premium: 'premium convenience',
};

export const budgetLevelMap: Record<string, BudgetLevel> = {
  '0_500k': 'low',
  '500k_800k': 'medium',
  '800k_3M': 'medium',
  '3M_10M': 'high',
  '10M_plus': 'high',
};

export const durationMap: Record<string, DurationFit> = {
  '30_60': 'short',
  '90_180': 'medium',
  '365': 'medium',
  '365_5y': 'long',
  '1825_plus': 'long',
};

export const incomeLevelMap: Record<string, 'low' | 'medium' | 'high'> = {
  'Remote/freelance': 'medium',
  'Foreign salary': 'high',
  Pension: 'medium',
  Investments: 'high',
  Varies: 'low',
};

export const incomeEstimateUSD: Record<'low' | 'medium' | 'high', number> = {
  low: 25_000,
  medium: 60_000,
  high: 90_000,
};

export const purposeFallback: VisaPurpose = 'longstay';

/**
 * Scoring weights configuration
 */
export const SCORING_WEIGHTS = {
  warmProspectBoost: 0.4,
  locationInsidePayToStay: 1.0,
  locationOutsidePayToStay: 0.7,
  locationInsideNonPayToStay: 0.3,
  budgetBonusHigh: 0.25,
  budgetBonusMedium: 0.2,
  budgetBonusLowED: 0.3,
  purposeFit: 0.3,
  budgetFit: 0.2,
  durationFit: 0.15,
  locationFit: 0.1,
  creativeFit: 0.15,
  frictionFit: 0.1,
} as const;

/**
 * Determines budget band based on savings amount
 */
export function getBudgetBand(savings: number): 'low' | 'medium' | 'high' {
  if (savings >= 2_000_000) return 'high';
  if (savings >= 500_000) return 'medium';
  return 'low';
}

