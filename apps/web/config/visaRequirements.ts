export type VisaRequirementId = 'NON-IMM-B' | 'NON-IMM-O' | 'NON-IMM-ED' | 'RETIREMENT' | 'LTR' | 'DTV';

export interface VisaRequirement {
  id: VisaRequirementId;
  label: string;
  badge: string;
  summary: string;
  highlights: string[];
  readiness: Array<{
    key: string;
    label: string;
    description: string;
  }>;
  metadata: {
    lastVerifiedAt: string;
    source: string;
  };
}

export const defaultReadiness = [
  {
    key: 'passport_valid',
    label: 'Passport valid 6+ months',
    description: 'All long-stay entries require at least half a year of validity remaining.',
  },
];

export const visaRequirements: VisaRequirement[] = [
  {
    id: 'NON-IMM-B',
    label: 'Non-Immigrant B (Work)',
    badge: 'Work',
    summary: 'Employer-sponsored visas for overseas hires or in-country conversions.',
    highlights: [
      'Thai employer sponsors the work permit & visa conversion.',
      'Salary minimums vary by nationality (35k–100k THB) with 4 Thai staff per foreigner.',
      'Most companies must show ≥ THB 2M paid-up capital (THB 1M for promoted firms).',
    ],
    readiness: [
      {
        key: 'employer_docs',
        label: 'Employer paperwork collected',
        description: 'Company affidavit, VAT filings, and shareholder lists ready to submit.',
      },
      {
        key: 'work_history',
        label: 'CV & academic certificates certified',
        description: 'Diplomas translated/legalised for labor department review.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'Ministry of Foreign Affairs & Thai Immigration guidance (July 2025).',
    },
  },
  {
    id: 'NON-IMM-O',
    label: 'Non-Immigrant O (Marriage / Guardian)',
    badge: 'Family',
    summary: 'Long-stay permission for spouses of Thai citizens or guardians of minors.',
    highlights: [
      'Marriage cases: THB 400k in Thai bank (seasoned 2 months) or THB 40k monthly income.',
      'Guardian visas: THB 500k per student (60-day seasoning) plus enrollment proof.',
      'Annual extension inside Thailand with home visit and photos of the household.',
    ],
    readiness: [
      {
        key: 'relationship_docs',
        label: 'Marriage / parenting documents translated',
        description: 'Kor Ror certificates or birth records stamped & ready.',
      },
      {
        key: 'financial_requirements',
        label: 'Funds seasoned in Thai bank',
        description: 'Embassy/immigration requires 2+ month seasoning on local deposits.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'Thai MFA & Immigration Bureau family extension handbook (2025).',
    },
  },
  {
    id: 'NON-IMM-ED',
    label: 'Non-Immigrant ED (Education)',
    badge: 'Study',
    summary: 'Full-time study visas for language, university, or cultural programs.',
    highlights: [
      'Requires enrollment letter, tuition receipt, and school registration docs.',
      'Immigration now checks attendance monthly via Ministry of Higher Education.',
      'Applicants show ≥ THB 20k living funds (40k THB if traveling with dependents).',
    ],
    readiness: [
      {
        key: 'course_payment',
        label: 'Tuition paid ≥50%',
        description: 'Receipt or bank slip proving payment before application.',
      },
      {
        key: 'attendance_plan',
        label: 'Attendance commitments set',
        description: 'Understand monthly reporting + 90-day check-ins.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'Ministry of Higher Education directive (June 2025).',
    },
  },
  {
    id: 'RETIREMENT',
    label: 'Retirement (Non-O / O-A / O-X)',
    badge: '50+',
    summary: 'For applicants aged 50+ with funds or pension income.',
    highlights: [
      'Non-O extensions: THB 800k in Thai bank (2 months seasoning) or 65k THB monthly income.',
      'O-A requires overseas police + medical certificates and THB 400k/40k health insurance.',
      'O-X (10-year) demands THB 3M deposit (or THB 1.8M + 1.2M income) plus insurance.',
    ],
    readiness: [
      {
        key: 'thai_bank_balance',
        label: 'Funds seasoned in Thai bank',
        description: 'Move overseas funds early to meet 2–3 month seasoning rules.',
      },
      {
        key: 'insurance_ready',
        label: 'Insurance certificate ready',
        description: '400k/40k THB cover for O-A, 100k USD health cover for O-X.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'Thai Immigration long-stay guidelines (2025 update).',
    },
  },
  {
    id: 'LTR',
    label: 'Long-Term Resident (LTR)',
    badge: 'Premium',
    summary: '10-year visa with four sub-tracks for HNWIs, pensioners, remote pros, and experts.',
    highlights: [
      'Wealthy Global Citizen: USD 500k Thai investment + USD 1M in assets (no income floor).',
      'Work-from-Thailand: USD 80k/year income (40k with STEM master’s/IP) + employer revenue proof.',
      'Highly Skilled: USD 80k/year income (or 40k with STEM master’s) in targeted industries.',
    ],
    readiness: [
      {
        key: 'income_docs',
        label: 'Global income proof prepared',
        description: 'Tax returns & payslips covering the past 2 years.',
      },
      {
        key: 'insurance_or_deposit',
        label: '50k USD insurance or 100k USD deposit',
        description: 'LTR applicants must show one of the accepted medical cover options.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'BOI LTR documentation set (30 Jun 2025).',
    },
  },
  {
    id: 'DTV',
    label: 'Destination Thailand Visa (DTV)',
    badge: 'Remote',
    summary: '5-year multiple-entry visa for digital nomads and Thai soft-power participants.',
    highlights: [
      '500k THB savings proof with 6-month bank statement.',
      'Remote workers show employer contract & salary slips; soft-power tracks show enrollment.',
      'Health insurance ≥ 50k USD recommended (or equivalent medical coverage).',
    ],
    readiness: [
      {
        key: 'remote_contract',
        label: 'Remote employment contract',
        description: 'Employer letter confirming remote work and ongoing salary.',
      },
      {
        key: 'savings_buffer',
        label: 'THB 500k savings statement',
        description: 'Bank statement covering the past 6 months with required balance.',
      },
    ],
    metadata: {
      lastVerifiedAt: '2025-07-01',
      source: 'Thai MFA DTV checklist (June 2025).',
    },
  },
];

export const visaRequirementsMap = visaRequirements.reduce<Record<string, VisaRequirement>>((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
