/**
 * Maps eligibility form data to request form fields
 */

export interface EligibilityData {
  age: string;
  purpose: string;
  nationality: string;
  incomeType: string;
  savings: string;
  location: string;
  duration: string;
  selectedCode: string | null;
  fields?: string[];
  // Visa expiration tracking for Thailand-based users
  currentVisaExpiration?: string;
  currentVisaType?: string;
}

/**
 * Maps eligibility age ranges to request form age ranges
 */
export function mapAgeRange(eligibilityAge: string): string {
  const mapping: Record<string, string> = {
    'Under 20': '18-24',
    '20-34': '25-34',
    '35-49': '35-49',
    '50+': '50+',
  };
  return mapping[eligibilityAge] || eligibilityAge;
}

/**
 * Maps eligibility visa codes to request form visa types
 */
export function mapEligibilityCodeToVisaType(code: string): string {
  const mapping: Record<string, string> = {
    DTV: 'DTV',
    LTR_WFT: 'LTR',
    PRIV: 'OTHER', // Privilege/Elite not in standard options, use OTHER
    ED_LANG: 'NON-IMM-ED',
    RET_OA: 'RETIREMENT',
    RET_OX: 'RETIREMENT',
    O_MARRIAGE: 'NON-IMM-O',
    O_GUARD: 'NON-IMM-O',
    METV: 'OTHER', // Tourist visa not in standard options, use OTHER
  };
  return mapping[code] || 'OTHER';
}

/**
 * Maps eligibility location to request form currentLocation
 */
export function mapLocation(eligibilityLocation: string): string {
  const mapping: Record<string, string> = {
    'Inside Thailand': 'INSIDE_THAILAND',
    'Outside Thailand': 'OUTSIDE_THAILAND',
  };
  return mapping[eligibilityLocation] || eligibilityLocation;
}

/**
 * Converts duration preference to timeline
 * Note: Only long-term visas (6+ months) are supported
 */
export function mapDurationToTimeline(duration: string): string {
  const mapping: Record<string, string> = {
    '90_180': '3-6 months',
    '365': 'Around 1 year',
    '365_5y': '1-5 years',
    '1825_plus': '5+ years',
  };
  return mapping[duration] || duration;
}

/**
 * Estimates budget range from savings level
 */
export function estimateBudgetFromSavings(savings: string): { min: number; max: number } {
  const estimates: Record<string, { min: number; max: number }> = {
    '0_500k': { min: 10000, max: 50000 },
    '500k_800k': { min: 30000, max: 100000 },
    '800k_3M': { min: 50000, max: 200000 },
    '3M_10M': { min: 100000, max: 500000 },
    '10M_plus': { min: 200000, max: 1000000 },
  };
  return estimates[savings] || { min: 50000, max: 200000 };
}

/**
 * Converts eligibility data to URL query parameters for request form
 */
export function eligibilityToQueryParams(data: EligibilityData): URLSearchParams {
  const params = new URLSearchParams();
  params.set('eligibility', 'true');
  
  if (data.age) {
    params.set('ageRange', mapAgeRange(data.age));
  }
  if (data.nationality) {
    params.set('nationality', data.nationality);
  }
  if (data.selectedCode) {
    params.set('visaType', mapEligibilityCodeToVisaType(data.selectedCode));
  }
  if (data.location) {
    params.set('currentLocation', mapLocation(data.location));
  }
  if (data.duration) {
    params.set('timeline', mapDurationToTimeline(data.duration));
  }
  if (data.savings) {
    const budget = estimateBudgetFromSavings(data.savings);
    params.set('budgetMin', budget.min.toString());
    params.set('budgetMax', budget.max.toString());
  }
  
  // Visa expiration tracking (for Thailand-based users)
  if (data.currentVisaExpiration) {
    params.set('currentVisaExpiration', data.currentVisaExpiration);
  }
  if (data.currentVisaType) {
    params.set('currentVisaType', data.currentVisaType);
  }
  
  return params;
}

