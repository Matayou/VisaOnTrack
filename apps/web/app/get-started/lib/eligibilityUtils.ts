import { visaProfiles, type VisaProfile, type BudgetLevel, type DurationFit } from './visaProfiles';
import type { EligibilityState } from './recommendations';
import {
  budgetLevelMap,
  durationMap,
  incomeLevelMap,
  incomeEstimateUSD,
} from './constants';

/**
 * Maps age string to approximate numeric age
 */
export function mapAgeToNumber(age: string): number {
  switch (age) {
    case 'Under 50':
      return 35; // Approximate middle of range
    case '50+':
      return 55;
    default:
      return 35;
  }
}

/**
 * Maps savings string to approximate numeric value in THB
 */
export function mapSavingsToNumber(savings: string): number {
  const map: Record<string, number> = {
    '0_500k': 250_000,
    '500k_800k': 650_000,
    '800k_3M': 1_400_000,
    '3M_10M': 6_000_000,
    '10M_plus': 10_000_000,
  };
  return map[savings] ?? 0;
}

/**
 * Maps income type to estimated annual income in USD
 */
export function mapIncomeToUSD(incomeType: string): number {
  const map: Record<string, number> = {
    'Remote/freelance': 60_000,
    'Foreign salary': 90_000,
    'Pension': 60_000,
    'Investments': 90_000,
    'Varies': 25_000,
  };
  return map[incomeType] ?? 60_000;
}

/**
 * Derives user profile from eligibility state
 * Unified profile with all needed fields for scoring and eligibility
 */
export interface DerivedProfile {
  approximateAge: number;
  savingsValue: number;
  incomeUSD: number;
  location: 'inside' | 'outside';
  hasThaiSpouse: boolean;
  hasThaiChild: boolean;
  budgetLevel: BudgetLevel;
  durationFit: DurationFit;
  incomeLevel: 'low' | 'medium' | 'high';
}

export function deriveProfile(state: EligibilityState): DerivedProfile | null {
  if (!state.age || !state.location || !state.savings || !state.incomeType) {
    return null;
  }

  const ageValue = mapAgeToNumber(state.age);
  const budgetLevel = budgetLevelMap[state.savings] ?? 'medium';
  const savingsValue = mapSavingsToNumber(state.savings);
  const durationFit = durationMap[state.duration] ?? 'medium';
  const incomeLevel = incomeLevelMap[state.incomeType] ?? 'medium';
  const location = state.location === 'Inside Thailand' ? 'inside' : 'outside';

  return {
    approximateAge: ageValue,
    savingsValue,
    incomeUSD: incomeEstimateUSD[incomeLevel],
    location,
    hasThaiSpouse: state.fields.includes('Spouse/family in Thailand'),
    hasThaiChild: state.fields.includes('Have dependents'),
    budgetLevel,
    durationFit,
    incomeLevel,
  };
}

/**
 * Checks if a visa should be excluded (tourist visas, explicitly excluded)
 */
export function shouldExcludeVisa(profile: VisaProfile): boolean {
  return profile.isExcluded === true || profile.isTouristVisa === true;
}

/**
 * Checks if a visa profile is eligible for the given user profile
 * Only checks hard blockers - location is a business filter, not a hard blocker for pay-to-stay visas
 */
export function isVisaEligible(profile: VisaProfile, derived: DerivedProfile): boolean {
  // Exclude tourist visas and explicitly excluded visas
  if (shouldExcludeVisa(profile)) {
    return false;
  }

  // Age check (absolute limits)
  if (profile.hardRequirements.minAge && derived.approximateAge < profile.hardRequirements.minAge) {
    return false;
  }
  if (profile.hardRequirements.maxAge && derived.approximateAge > profile.hardRequirements.maxAge) {
    return false;
  }

  // Location check - only filter if visa absolutely cannot be converted (very rare)
  // For pay-to-stay visas, location is handled in scoring, not filtering
  // Only filter if baseLocation is strictly 'inside' and user is outside (or vice versa with no conversion)
  if (profile.baseLocation && profile.baseLocation !== 'both') {
    // Only filter if conversion is not possible
    if (!profile.canConvertFromInside) {
      if (profile.baseLocation === 'inside' && derived.location !== 'inside') {
        return false;
      }
      if (profile.baseLocation === 'outside' && derived.location !== 'outside') {
        return false;
      }
    }
    // If conversion is possible, don't filter - let scoring handle it
  }

  // Savings check (absolute minimum)
  if (profile.hardRequirements.minSavingsTHB && derived.savingsValue < profile.hardRequirements.minSavingsTHB) {
    return false;
  }

  // Income check (absolute minimum)
  if (profile.hardRequirements.minIncomeUSD && derived.incomeUSD < profile.hardRequirements.minIncomeUSD) {
    return false;
  }

  // Family requirements (hard blockers)
  if (profile.hardRequirements.requiresThaiSpouse && !derived.hasThaiSpouse) {
    return false;
  }
  if (profile.hardRequirements.requiresThaiChild && !derived.hasThaiChild) {
    return false;
  }

  return true;
}

/**
 * Counts how many visas are eligible for the given state
 */
export function countEligibleVisas(state: EligibilityState): number {
  const derived = deriveProfile(state);
  if (!derived) return 0;

  return visaProfiles.filter((profile) => isVisaEligible(profile, derived)).length;
}

/**
 * Gets all eligible visas for the given state
 */
export function getEligibleVisas(state: EligibilityState): VisaProfile[] {
  const derived = deriveProfile(state);
  if (!derived) return [];

  return visaProfiles.filter((profile) => isVisaEligible(profile, derived));
}

/**
 * Checks if a purpose option should be disabled based on current age
 */
export function isPurposeDisabled(purposeValue: string, age: string): { disabled: boolean; reason?: string } {
  // Retirement requires 50+
  if (purposeValue === 'retirement' && age !== '50+') {
    return { disabled: true, reason: 'Requires age 50+' };
  }

  // Study requires 18+ (ED_LANG has minAge 18) - Under 50 includes 18+, so no restriction needed
  // But we could add a check if needed in the future

  return { disabled: false };
}

