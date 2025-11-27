export type VisaPurpose = 'remote' | 'retirement' | 'longstay' | 'study' | 'family' | 'premium';
export type BudgetLevel = 'low' | 'medium' | 'high';
export type DurationFit = 'short' | 'medium' | 'long';

export interface VisaProfile {
  code: string;
  title: string;
  badge: string;
  description: string;
  cost: string;
  time: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Very Easy';
  type: 'main' | 'alternative' | 'premium' | 'additional';
  baseScore: number;
  // Business-aligned fields
  isPayToStay: boolean;
  baseLocation: 'inside' | 'outside' | 'both';
  canConvertFromInside: boolean;
  requiresBorderRunForConversion: boolean;
  isTouristVisa?: boolean;
  isExcluded?: boolean;
  hardRequirements: {
    minAge?: number;
    maxAge?: number;
    minSavingsTHB?: number;
    minIncomeUSD?: number;
    requiresThaiSpouse?: boolean;
    requiresThaiChild?: boolean;
    notes?: string[];
  };
  fit: {
    purposes: VisaPurpose[];
    secondaryPurposes?: VisaPurpose[];
    duration: DurationFit[];
    budget: BudgetLevel;
    creativeAngles?: string[];
  };
  defaultReasons?: string[];
  defaultTradeoffs?: string[];
}

export const visaProfiles: VisaProfile[] = [
  {
    code: 'DTV',
    title: 'Destination Thailand Visa (DTV)',
    badge: 'Popular',
    description: '5-year multiple-entry visa for remote workers, freelancers, and digital nomads.',
    cost: '~10,000 THB',
    time: '2-3 weeks',
    difficulty: 'Easy',
    type: 'main',
    baseScore: 0.72,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: true,
    hardRequirements: {
      minSavingsTHB: 500_000,
      notes: ['Requires remote employment proof or enrollment in soft-power activities.', 'Can be converted from inside Thailand with border run.'],
    },
    fit: {
      purposes: ['remote', 'longstay'],
      secondaryPurposes: ['premium'],
      duration: ['medium', 'long'],
      budget: 'medium',
      creativeAngles: ['Lower-cost alternative to LTR for digital nomads'],
    },
    defaultReasons: ['Multiple entries with 180-day stays', 'Friendly to remote workers with verifiable contracts'],
    defaultTradeoffs: ['Needs 500k THB savings proof for past 6 months'],
  },
  {
    code: 'LTR_WFT',
    title: 'Long-Term Resident — Work From Thailand',
    badge: 'Premium Remote',
    description: '10-year visa for high-earning remote professionals working for overseas employers.',
    cost: '~50,000 THB',
    time: '1-2 months',
    difficulty: 'Moderate',
    type: 'alternative',
    baseScore: 0.65,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: true,
    hardRequirements: {
      minIncomeUSD: 80_000,
      minSavingsTHB: 2_000_000,
      notes: ['Can be converted from inside Thailand with border run.'],
    },
    fit: {
      purposes: ['remote', 'premium'],
      duration: ['long'],
      budget: 'high',
      creativeAngles: ['Includes digital work permit for qualifying employers'],
    },
    defaultReasons: ['10-year validity with multiple tracks', 'Digital work permit available'],
    defaultTradeoffs: ['High income and employer revenue proof required'],
  },
  {
    code: 'PRIV',
    title: 'Thailand Privilege (Elite)',
    badge: 'Premium',
    description: '5-20 year membership with concierge services and simplified renewals.',
    cost: 'From ~900k THB',
    time: '1-3 months',
    difficulty: 'Very Easy',
    type: 'premium',
    baseScore: 0.58,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: true,
    hardRequirements: {
      minSavingsTHB: 900_000,
      notes: ['Can be converted from inside Thailand with border run.'],
    },
    fit: {
      purposes: ['premium', 'longstay'],
      secondaryPurposes: ['remote', 'retirement'],
      duration: ['medium', 'long'],
      budget: 'high',
      creativeAngles: ['Skip immigration queues and visa runs'],
    },
    defaultReasons: ['Easiest processing among long-stay visas', 'Airport and concierge perks'],
    defaultTradeoffs: ['High membership fee, no right to work'],
  },
  {
    code: 'ED_LANG',
    title: 'Education Visa (Language Study)',
    badge: 'Study Required',
    description: 'Long-stay education visa. Budget-friendly pay-to-stay option. Conditions vary — use vetted schools.',
    cost: '~30k-80k THB/year',
    time: '2-4 weeks',
    difficulty: 'Easy',
    type: 'main',
    baseScore: 0.7,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: false,
    hardRequirements: {
      minAge: 18,
      notes: ['Can be processed from inside Thailand.'],
    },
    fit: {
      purposes: ['study', 'longstay'],
      secondaryPurposes: ['remote'],
      duration: ['medium', 'long'],
      budget: 'low',
      creativeAngles: ['Popular budget-friendly way to stay in Thailand even if classes are secondary'],
    },
    defaultReasons: ['Low financial proof required', 'Schools handle paperwork and renewals'],
    defaultTradeoffs: ['Must attend classes to maintain status'],
  },
  {
    code: 'RET_OA',
    title: 'Retirement Visa (Non-Immigrant O-A)',
    badge: 'Age 50+',
    description: 'For retirees 50+ with insurance plus 800k THB or pension proof.',
    cost: '~25k-45k THB',
    time: '3-4 weeks',
    difficulty: 'Moderate',
    type: 'main',
    baseScore: 0.55,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: true,
    hardRequirements: {
      minAge: 50,
      minSavingsTHB: 800_000,
      notes: ['Can be converted from inside Thailand with border run.'],
    },
    fit: {
      purposes: ['retirement', 'longstay'],
      duration: ['long'],
      budget: 'medium',
    },
    defaultReasons: ['One-year stay with extensions inside Thailand'],
    defaultTradeoffs: ['Requires Thai health insurance and annual financial proof'],
  },
  {
    code: 'RET_OX',
    title: 'Retirement Visa (O-X 10-year)',
    badge: 'Long-term Retirement',
    description: 'Ten-year retirement track for select nationalities with 3M THB assets.',
    cost: '~30k-50k THB',
    time: '1-2 months',
    difficulty: 'Moderate',
    type: 'alternative',
    baseScore: 0.5,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: true,
    hardRequirements: {
      minAge: 50,
      minSavingsTHB: 3_000_000,
      notes: ['Can be converted from inside Thailand with border run.'],
    },
    fit: {
      purposes: ['retirement', 'premium'],
      duration: ['long'],
      budget: 'high',
    },
    defaultReasons: ['10-year validity for retirees'], 
    defaultTradeoffs: ['Only select nationalities qualify, high asset requirement'],
  },
  {
    code: 'O_MARRIAGE',
    title: 'Non-Immigrant O (Thai Spouse)',
    badge: 'Family',
    description: 'For foreigners legally married to Thai citizens.',
    cost: '~15k-30k THB',
    time: '2-4 weeks',
    difficulty: 'Moderate',
    type: 'main',
    baseScore: 0.6,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: false,
    hardRequirements: {
      requiresThaiSpouse: true,
      notes: ['Can be processed from inside Thailand.'],
    },
    fit: {
      purposes: ['family', 'longstay'],
      duration: ['medium', 'long'],
      budget: 'medium',
    },
    defaultReasons: ['Allows 1-year extensions inside Thailand', 'Works well if your partner is Thai'],
    defaultTradeoffs: ['Requires marriage registration and 400k THB bank balance or 40k/mo income'],
  },
  {
    code: 'O_GUARD',
    title: 'Non-Immigrant O (Guardian)',
    badge: 'Family',
    description: 'For parents or guardians of Thai children / students in Thailand.',
    cost: '~15k-30k THB',
    time: '2-4 weeks',
    difficulty: 'Moderate',
    type: 'alternative',
    baseScore: 0.48,
    isPayToStay: true,
    baseLocation: 'both',
    canConvertFromInside: true,
    requiresBorderRunForConversion: false,
    hardRequirements: {
      requiresThaiChild: true,
      notes: ['Can be processed from inside Thailand.'],
    },
    fit: {
      purposes: ['family', 'longstay'],
      duration: ['medium', 'long'],
      budget: 'medium',
    },
    defaultReasons: ['Lets parents stay with their children studying in Thailand'],
    defaultTradeoffs: ['Needs proof of enrollment and guardianship paperwork'],
  },
  {
    code: 'METV',
    title: 'Multiple Entry Tourist Visa (METV)',
    badge: 'Tourist',
    description: '6-month validity with 60-day stays per entry, renewable in-country.',
    cost: '~5,000 THB',
    time: '1-2 weeks',
    difficulty: 'Easy',
    type: 'additional',
    baseScore: 0.52,
    isPayToStay: false,
    baseLocation: 'outside',
    canConvertFromInside: false,
    requiresBorderRunForConversion: false,
    isTouristVisa: true,
    isExcluded: true,
    hardRequirements: {
      minSavingsTHB: 200_000,
    },
    fit: {
      purposes: ['longstay', 'study'],
      secondaryPurposes: ['remote'],
      duration: ['short', 'medium'],
      budget: 'low',
      creativeAngles: ['Stack with visa-exempt entries for budget travel plans'],
    },
    defaultReasons: ['Great for slow travellers who still need flexibility'],
    defaultTradeoffs: ['Requires occasional border runs to reset stay'],
  },
];

