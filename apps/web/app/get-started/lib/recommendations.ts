import { VisaProfile, visaProfiles, BudgetLevel, DurationFit, VisaPurpose } from './visaProfiles';
import { isVisaEligible, deriveProfile, shouldExcludeVisa, type DerivedProfile } from './eligibilityUtils';
import { SCORING_WEIGHTS, PURPOSE_LABELS, purposeFallback, getBudgetBand } from './constants';

export interface EligibilityState {
  age: string;
  purpose: VisaPurpose | '';
  nationality: string;
  incomeType: string;
  savings: string;
  location: string;
  duration: string;
  fields: string[];
  // For users in Thailand seeking long-term visas (6+ months)
  currentVisaExpiration?: string; // '<1month' | '1-2months' | '>2months'
  currentVisaType?: string; // Current visa they hold
}

export interface VisaRecommendation {
  code: string;
  title: string;
  badge: string;
  desc: string;
  cost: string;
  time: string;
  difficulty: string;
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  type: 'main' | 'alternative' | 'premium' | 'additional';
  reasons: string[];
  tradeoffs?: string[];
}

export function generateRecommendations(state: EligibilityState): VisaRecommendation[] {
  const derived = deriveProfile(state);
  if (!derived) return [];

  const inferredPurpose: VisaPurpose = derivePurpose(state, derived);

  const scored = visaProfiles
    .filter((profile) => {
      // Exclude tourist visas and explicitly excluded visas
      if (shouldExcludeVisa(profile)) return false;
      // Check hard eligibility requirements
      return isVisaEligible(profile, derived);
    })
    .map((profile) => {
      const score = computeScore(profile, state, derived, inferredPurpose);
      const { reasons, tradeoffs } = buildReasoning(profile, state, derived, inferredPurpose);

      return {
        code: profile.code,
        title: profile.title,
        badge: profile.badge,
        desc: profile.description,
        cost: profile.cost,
        time: profile.time,
        difficulty: profile.difficulty,
        score,
        confidence: deriveConfidence(score),
        type: profile.type,
        reasons,
        tradeoffs,
      };
    })
    .sort((a, b) => b.score - a.score);

  return scored;
}

function derivePurpose(state: EligibilityState, derived: DerivedProfile): VisaPurpose {
  if (state.purpose) return state.purpose;
  if (derived.approximateAge >= 50 && derived.savingsValue >= 800_000) return 'retirement';
  return purposeFallback;
}

function computeScore(
  profile: VisaProfile,
  state: EligibilityState,
  derived: DerivedProfile,
  inferredPurpose: VisaPurpose,
): number {
  let score = profile.baseScore;

  // 1. Warm prospect boost (highest priority - business signal)
  if (derived.location === 'inside' && profile.isPayToStay) {
    score += SCORING_WEIGHTS.warmProspectBoost;
  }

  // 2. Budget-based pay-to-stay prioritization
  const budgetBand = getBudgetBand(derived.savingsValue);
  if (profile.isPayToStay) {
    if (budgetBand === 'high' && (profile.code === 'LTR_WFT' || profile.code === 'PRIV')) {
      score += SCORING_WEIGHTS.budgetBonusHigh;
    } else if (budgetBand === 'medium' && (profile.code === 'DTV' || profile.code === 'PRIV')) {
      score += SCORING_WEIGHTS.budgetBonusMedium;
    } else if (budgetBand === 'low' && profile.code === 'ED_LANG') {
      score += SCORING_WEIGHTS.budgetBonusLowED;
    }
  }

  // 3. Retirement-specific logic (simplified)
  const meetsClassicRetirement = derived.approximateAge >= 50 && derived.savingsValue >= 800_000;
  if (meetsClassicRetirement) {
    const isRetirementVisa = profile.code === 'RET_OA' || profile.code === 'RET_OX';
    if (state.purpose === 'retirement' && isRetirementVisa) {
      score += 0.5; // Strong boost for explicit retirement selection
    } else if (state.purpose === 'retirement' && !isRetirementVisa) {
      score -= 0.3; // Penalty for non-retirement visas when retirement is explicit
    } else if (isRetirementVisa) {
      score += 0.3; // Moderate boost for retirement visas even if purpose is different
    }
  }

  // 4. Standard fit scores (using weights from config)
  score += SCORING_WEIGHTS.purposeFit * purposeScore(profile, inferredPurpose);
  score += SCORING_WEIGHTS.budgetFit * budgetScore(profile, derived.budgetLevel);
  score += SCORING_WEIGHTS.durationFit * durationScore(profile, derived.durationFit);
  score += SCORING_WEIGHTS.locationFit * locationScore(profile, derived.location);
  score += SCORING_WEIGHTS.creativeFit * creativeScore(profile, state, derived);
  score += SCORING_WEIGHTS.frictionFit * frictionScore(profile);

  return Math.max(0.1, Math.min(1, Number(score.toFixed(3))));
}

function purposeScore(profile: VisaProfile, purpose: VisaPurpose): number {
  if (profile.fit.purposes.includes(purpose)) return 1;
  if (profile.fit.secondaryPurposes?.includes(purpose)) return 0.6;
  // Heavily penalize non-retirement visas when retirement is the explicit purpose
  if (purpose === 'retirement' && !profile.fit.purposes.includes('retirement') && !profile.fit.secondaryPurposes?.includes('retirement')) {
    return 0.05;
  }
  return 0.2;
}

function budgetScore(profile: VisaProfile, userBudget: BudgetLevel): number {
  if (profile.fit.budget === userBudget) return 1;
  if (profile.fit.budget === 'high' && userBudget === 'medium') return 0.4;
  if (profile.fit.budget === 'medium' && userBudget === 'low') return 0.6;
  return 0.3;
}

function durationScore(profile: VisaProfile, userDuration: DurationFit): number {
  if (profile.fit.duration.includes(userDuration)) return 1;
  if (userDuration === 'long' && profile.fit.duration.includes('medium')) return 0.5;
  if (userDuration === 'medium' && profile.fit.duration.includes('long')) return 0.6;
  return 0.2;
}

function locationScore(profile: VisaProfile, location: 'inside' | 'outside'): number {
  // Use new baseLocation model
  if (profile.baseLocation === 'both') return 1.0;
  
  // Warm prospect scoring for pay-to-stay visas
  if (profile.isPayToStay && location === 'inside' && profile.canConvertFromInside) {
    return SCORING_WEIGHTS.locationInsidePayToStay;
  }
  if (profile.isPayToStay && location === 'outside') {
    return SCORING_WEIGHTS.locationOutsidePayToStay;
  }
  
  // Non-pay-to-stay visas get lower score for inside location
  return SCORING_WEIGHTS.locationInsideNonPayToStay;
}

function creativeScore(profile: VisaProfile, state: EligibilityState, derived: DerivedProfile): number {
  if (!profile.fit.creativeAngles?.length) return 0.2;
  
  // Don't boost creative alternatives when retirement is explicitly selected
  if (state.purpose === 'retirement' && !profile.fit.purposes.includes('retirement') && !profile.fit.secondaryPurposes?.includes('retirement')) {
    return 0.1;
  }
  
  const hasCreativePurpose =
    profile.fit.creativeAngles.length > 0 &&
    profile.fit.secondaryPurposes?.includes((state.purpose || purposeFallback) as VisaPurpose);
  return hasCreativePurpose ? 1 : 0.6;
}

function frictionScore(profile: VisaProfile): number {
  switch (profile.difficulty) {
    case 'Very Easy':
    case 'Easy':
      return 1;
    case 'Moderate':
      return 0.6;
    case 'Challenging':
      return 0.3;
    default:
      return 0.5;
  }
}

function buildReasoning(
  profile: VisaProfile,
  state: EligibilityState,
  derived: DerivedProfile,
  inferredPurpose: VisaPurpose,
): { reasons: string[]; tradeoffs?: string[] } {
  const reasons = new Set<string>(profile.defaultReasons ?? []);
  const tradeoffs = new Set<string>(profile.defaultTradeoffs ?? []);

  const purpose = inferredPurpose;
  if (profile.fit.purposes.includes(purpose)) {
    reasons.add(`Supports your goal of ${PURPOSE_LABELS[purpose]}.`);
  } else if (profile.fit.secondaryPurposes?.includes(purpose)) {
    reasons.add(`Popular alternative for ${PURPOSE_LABELS[purpose]} (even if not the first choice).`);
  }

  // Conversion path messaging
  if (derived.location === 'inside' && profile.canConvertFromInside) {
    if (profile.requiresBorderRunForConversion) {
      tradeoffs.add('Typically requires a short border run. A provider will guide you.');
    } else {
      reasons.add('Can be processed from inside Thailand.');
    }
  }

  // Warm prospect message
  if (derived.location === 'inside' && profile.isPayToStay) {
    reasons.add('Available for conversion from inside Thailand.');
  }

  if (profile.fit.creativeAngles?.length) {
    profile.fit.creativeAngles.forEach((angle) => reasons.add(angle));
  }

  return {
    reasons: Array.from(reasons),
    tradeoffs: tradeoffs.size ? Array.from(tradeoffs) : undefined,
  };
}

function deriveConfidence(score: number): 'High' | 'Medium' | 'Low' {
  if (score >= 0.78) return 'High';
  if (score >= 0.62) return 'Medium';
  return 'Low';
}
