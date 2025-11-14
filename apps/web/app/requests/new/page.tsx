'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Request } from '@visaontrack/client';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronDown,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Globe,
  Home,
  Loader,
  LogOut,
  Plane,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { logout } from '@/lib/auth';

type DocumentStatus = 'ready' | 'in-progress' | 'need-help';

interface FormState {
  title: string;
  ageRange: string;
  nationality: string;
  currentLocation: string;
  currentVisaExpiry: string;
  currentVisaType: string;
  visaType: string;
  location: string;
  locationDetail: string;
  budgetMin: string;
  budgetMax: string;
  timeline: string;
  additionalNotes: string;
}

type FormField = keyof FormState;

interface FormErrors {
  title?: string;
  ageRange?: string;
  nationality?: string;
  currentLocation?: string;
  currentVisaExpiry?: string;
  currentVisaType?: string;
  visaType?: string;
  location?: string;
  locationDetail?: string;
  timeline?: string;
  additionalNotes?: string;
  budget?: string;
}

const visaTypeOptions = [
  { value: 'NON-IMM-B', label: 'Non-Immigrant B (Business / Work)' },
  { value: 'NON-IMM-O', label: 'Non-Immigrant O (Marriage / Guardian)' },
  { value: 'NON-IMM-ED', label: 'Non-Immigrant ED (Education)' },
  { value: 'LTR', label: 'Long-Term Resident (LTR)' },
  { value: 'DTV', label: 'Digital Nomad (DTV)' },
  { value: 'VOLUNTEER', label: 'Volunteer Visa' },
  { value: 'RETIREMENT', label: 'Retirement Visa' },
  { value: 'OTHER', label: 'Other / Not Sure' },
];

const locationOptions = [
  { value: 'BANGKOK', label: 'Bangkok (BKK)' },
  { value: 'CHIANG_MAI', label: 'Chiang Mai' },
  { value: 'PHUKET', label: 'Phuket' },
  { value: 'PATTAYA', label: 'Pattaya / Chonburi' },
  { value: 'SAMUI', label: 'Koh Samui / Surat Thani' },
  { value: 'HUA_HIN', label: 'Hua Hin / Cha-Am' },
  { value: 'KRABI', label: 'Krabi / Phang Nga' },
  { value: 'ABROAD', label: 'Applying from outside Thailand' },
  { value: 'OTHER', label: 'Somewhere else' },
];

const assistanceNeeds = [
  'Visa strategy & eligibility',
  'Document preparation',
  'Translations & certifications',
  'Appointment booking',
  'Immigration accompaniment',
  'Follow-up after submission',
];

const documentChecklist = [
  { key: 'passport', label: 'Passport (6+ months validity)' },
  { key: 'financial', label: 'Financial statements / proof of income' },
  { key: 'police', label: 'Police clearance' },
  { key: 'medical', label: 'Medical certificate' },
  { key: 'sponsor', label: 'Employment / sponsor letter' },
  { key: 'family', label: 'Marriage / birth certificates' },
];

const nationalityOptions = [
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Albania', label: 'Albania' },
  { value: 'Algeria', label: 'Algeria' },
  { value: 'Andorra', label: 'Andorra' },
  { value: 'Angola', label: 'Angola' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Armenia', label: 'Armenia' },
  { value: 'Australia', label: 'Australia' },
  { value: 'Austria', label: 'Austria' },
  { value: 'Azerbaijan', label: 'Azerbaijan' },
  { value: 'Bahamas', label: 'Bahamas' },
  { value: 'Bahrain', label: 'Bahrain' },
  { value: 'Bangladesh', label: 'Bangladesh' },
  { value: 'Belarus', label: 'Belarus' },
  { value: 'Belgium', label: 'Belgium' },
  { value: 'Belize', label: 'Belize' },
  { value: 'Benin', label: 'Benin' },
  { value: 'Bhutan', label: 'Bhutan' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Bosnia and Herzegovina', label: 'Bosnia and Herzegovina' },
  { value: 'Botswana', label: 'Botswana' },
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Brunei', label: 'Brunei' },
  { value: 'Bulgaria', label: 'Bulgaria' },
  { value: 'Cambodia', label: 'Cambodia' },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'Canada', label: 'Canada' },
  { value: 'Chile', label: 'Chile' },
  { value: 'China', label: 'China' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Croatia', label: 'Croatia' },
  { value: 'Cuba', label: 'Cuba' },
  { value: 'Cyprus', label: 'Cyprus' },
  { value: 'Czech Republic', label: 'Czech Republic' },
  { value: 'Denmark', label: 'Denmark' },
  { value: 'Dominican Republic', label: 'Dominican Republic' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Egypt', label: 'Egypt' },
  { value: 'El Salvador', label: 'El Salvador' },
  { value: 'Estonia', label: 'Estonia' },
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Fiji', label: 'Fiji' },
  { value: 'Finland', label: 'Finland' },
  { value: 'France', label: 'France' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Germany', label: 'Germany' },
  { value: 'Ghana', label: 'Ghana' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'Honduras', label: 'Honduras' },
  { value: 'Hong Kong', label: 'Hong Kong' },
  { value: 'Hungary', label: 'Hungary' },
  { value: 'Iceland', label: 'Iceland' },
  { value: 'India', label: 'India' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Iraq', label: 'Iraq' },
  { value: 'Ireland', label: 'Ireland' },
  { value: 'Israel', label: 'Israel' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Jamaica', label: 'Jamaica' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Kazakhstan', label: 'Kazakhstan' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Kuwait', label: 'Kuwait' },
  { value: 'Kyrgyzstan', label: 'Kyrgyzstan' },
  { value: 'Laos', label: 'Laos' },
  { value: 'Latvia', label: 'Latvia' },
  { value: 'Lebanon', label: 'Lebanon' },
  { value: 'Lithuania', label: 'Lithuania' },
  { value: 'Luxembourg', label: 'Luxembourg' },
  { value: 'Macau', label: 'Macau' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Maldives', label: 'Maldives' },
  { value: 'Malta', label: 'Malta' },
  { value: 'Mauritius', label: 'Mauritius' },
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Moldova', label: 'Moldova' },
  { value: 'Mongolia', label: 'Mongolia' },
  { value: 'Montenegro', label: 'Montenegro' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Myanmar', label: 'Myanmar' },
  { value: 'Namibia', label: 'Namibia' },
  { value: 'Nepal', label: 'Nepal' },
  { value: 'Netherlands', label: 'Netherlands' },
  { value: 'New Zealand', label: 'New Zealand' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'North Macedonia', label: 'North Macedonia' },
  { value: 'Norway', label: 'Norway' },
  { value: 'Oman', label: 'Oman' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Panama', label: 'Panama' },
  { value: 'Paraguay', label: 'Paraguay' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Poland', label: 'Poland' },
  { value: 'Portugal', label: 'Portugal' },
  { value: 'Qatar', label: 'Qatar' },
  { value: 'Romania', label: 'Romania' },
  { value: 'Russia', label: 'Russia' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'Serbia', label: 'Serbia' },
  { value: 'Singapore', label: 'Singapore' },
  { value: 'Slovakia', label: 'Slovakia' },
  { value: 'Slovenia', label: 'Slovenia' },
  { value: 'South Africa', label: 'South Africa' },
  { value: 'South Korea', label: 'South Korea' },
  { value: 'Spain', label: 'Spain' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Sweden', label: 'Sweden' },
  { value: 'Switzerland', label: 'Switzerland' },
  { value: 'Taiwan', label: 'Taiwan' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Tunisia', label: 'Tunisia' },
  { value: 'Turkey', label: 'Turkey' },
  { value: 'Uganda', label: 'Uganda' },
  { value: 'Ukraine', label: 'Ukraine' },
  { value: 'United Arab Emirates', label: 'United Arab Emirates' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'United States', label: 'United States' },
  { value: 'Uruguay', label: 'Uruguay' },
  { value: 'Uzbekistan', label: 'Uzbekistan' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Zambia', label: 'Zambia' },
  { value: 'Zimbabwe', label: 'Zimbabwe' },
  { value: 'Other / Not listed', label: 'Other / Not listed' },
];

const inThailandVisaOptions = [
  { value: 'TOURIST', label: 'Tourist visa (TR)' },
  { value: 'NON-IMM-B', label: 'Non-Immigrant B (Work)' },
  { value: 'NON-IMM-O', label: 'Non-Immigrant O (Marriage/Guardian)' },
  { value: 'NON-IMM-ED', label: 'Non-Immigrant ED (Education)' },
  { value: 'RETIREMENT', label: 'Retirement visa' },
  { value: 'DTV', label: 'Digital nomad (DTV)' },
  { value: 'OTHER', label: 'Other / Not sure' },
];

const ageRangeOptions = [
  { value: '18-49', label: '18 - 49 years' },
  { value: '50+', label: '50+ years' },
];

const residencyOptions = [
  {
    value: 'IN_THAILAND',
    label: 'I am currently in Thailand',
    description: 'Great for extensions or conversions',
    icon: Home,
  },
  {
    value: 'OUTSIDE_THAILAND',
    label: 'I am outside Thailand',
    description: 'Preparing before arriving',
    icon: Plane,
  },
];

const budgetPresets = [
  { label: 'THB 5k - 10k', min: 5000, max: 10000 },
  { label: 'THB 10k - 20k', min: 10000, max: 20000 },
  { label: 'THB 20k - 35k', min: 20000, max: 35000 },
  { label: 'THB 35k+', min: 35000, max: 60000 },
];

const missionVisaOptions: Array<{
  value: string;
  label: string;
  description: string;
  badge?: string;
  details: string[];
}> = [
  {
    value: 'NON-IMM-B',
    label: 'Non-Immigrant B',
    description: 'Employer-sponsored work visa.',
    badge: 'Work',
    details: ['Thai employer + work permit', 'Salary ≥ THB 50k/mo', 'Company capital ≥ THB 2M'],
  },
  {
    value: 'NON-IMM-O',
    label: 'Non-Immigrant O',
    description: 'Marriage or guardian route.',
    badge: 'Family',
    details: ['Married to Thai citizen or dependents', 'THB 400k banked or THB 40k monthly income'],
  },
  {
    value: 'NON-IMM-ED',
    label: 'Non-Immigrant ED',
    description: 'Study or training programs.',
    badge: 'Study',
    details: ['Enrollment & tuition receipt', 'Show ~THB 200k living funds/insurance'],
  },
  {
    value: 'LTR',
    label: 'Long-Term Resident (LTR)',
    description: '10-year visa for high-skill talent.',
    badge: 'Premium',
    details: ['Income ≥ USD 80k/year (40k for eligible STEM)', 'USD 50k insurance or deposit'],
  },
  {
    value: 'RETIREMENT',
    label: 'Retirement visa',
    description: 'Non-Immigrant O/A or O/X.',
    badge: '50+',
    details: ['Age 50+', 'THB 800k in bank or THB 65k/month income', 'Thai health insurance'],
  },
  {
    value: 'DTV',
    label: 'Digital Nomad (DTV)',
    description: 'Remote professionals on flexible stays.',
    badge: 'Remote',
    details: ['Foreign employment contract', 'THB 500k savings proof', 'USD 100k health coverage'],
  },
  {
    value: 'OTHER',
    label: 'Other / Not sure',
    description: 'Need help deciding.',
    details: ['Providers can recommend eligibility path', 'Share current situation to start'],
  },
];

const resolveVisaLabel = (value: string) => {
  const missionMatch = missionVisaOptions.find((option) => option.value === value);
  if (missionMatch) {
    return missionMatch.label;
  }

  const formMatch = visaTypeOptions.find((option) => option.value === value);
  return formMatch ? formMatch.label : '';
};

const createTitleFromVisa = (value: string) => {
  if (!value) {
    return '';
  }

  if (value === 'OTHER') {
    return 'Need help choosing the right Thai visa';
  }

  const label = resolveVisaLabel(value);
  if (!label) {
    return '';
  }

  const shortLabel = label.replace(/\s*\(.*?\)/, '');
  return `${shortLabel} visa support in Thailand`;
};

const featuredLocationOptions = ['BANGKOK', 'CHIANG_MAI', 'PHUKET', 'PATTAYA', 'SAMUI', 'HUA_HIN'];

const createTimelineShortcuts = () => [
  { label: 'Need approval within 2 weeks', value: 'Need approval within 2 weeks' },
  { label: 'Need approval within 1 month', value: 'Need approval within 1 month' },
  { label: 'Need approval within 3 months', value: 'Need approval within 3 months' },
];

const formSteps = [
  {
    id: 'personal',
    title: 'Identity basics',
    subtitle: 'Age range, nationality, and where you are right now.',
  },
  {
    id: 'mission',
    title: 'Mission headline',
    subtitle: 'Give providers the title and optional context.',
  },
  {
    id: 'intent',
    title: 'Preferred location',
    subtitle: 'Where do you prefer to settle or spend most of your time?',
  },
  {
    id: 'budget',
    title: 'Budget & timing',
    subtitle: 'Transparent ranges unlock accurate quotes.',
  },
  {
    id: 'support',
    title: 'Support & documents',
    subtitle: 'Highlight the exact touchpoints you expect help on.',
  },
];

const createInitialFormState = (): FormState => ({
  title: '',
  ageRange: '',
  nationality: '',
  currentLocation: '',
  currentVisaExpiry: '',
  currentVisaType: '',
  visaType: '',
  location: '',
  locationDetail: '',
  budgetMin: '',
  budgetMax: '',
  timeline: '',
  additionalNotes: '',
});

const createInitialDocumentState = (): Record<string, DocumentStatus> =>
  documentChecklist.reduce<Record<string, DocumentStatus>>((acc, doc) => {
    acc[doc.key] = 'in-progress';
    return acc;
  }, {});

const createInitialTouchedState = (): Record<FormField, boolean> =>
  Object.keys(createInitialFormState()).reduce(
    (acc, key) => {
      acc[key as FormField] = false;
      return acc;
    },
    {} as Record<FormField, boolean>,
  );

const computeFormErrors = (state: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!state.title.trim() || state.title.trim().length < 6) {
    errors.title = 'Give your request a descriptive title (min 6 characters).';
  }

  if (!state.ageRange) {
    errors.ageRange = 'Select your age range.';
  }

  if (!state.nationality.trim()) {
    errors.nationality = 'Let providers know your nationality.';
  }

  if (!state.currentLocation.trim()) {
    errors.currentLocation = 'Tell us if you are inside or outside Thailand.';
  } else if (state.currentLocation === 'IN_THAILAND') {
    if (!state.currentVisaExpiry) {
      errors.currentVisaExpiry = 'Share when your current visa expires.';
    } else {
      const expiry = new Date(state.currentVisaExpiry);
      if (Number.isNaN(expiry.getTime())) {
        errors.currentVisaExpiry = 'Enter a valid expiration date.';
      } else {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (expiry < today) {
          errors.currentVisaExpiry = 'Expiration date cannot be in the past.';
        }
      }
    }
    if (!state.currentVisaType.trim()) {
      errors.currentVisaType = 'Select the visa you are currently on.';
    }
  }

  if (!state.visaType) {
    errors.visaType = 'Select the visa type you are pursuing.';
  }

  if (!state.location) {
    errors.location = 'Choose where this visa will be processed.';
  } else if (state.location === 'OTHER' && !state.locationDetail.trim()) {
    const detailMessage = 'Share the city or embassy you will work with.';
    errors.location = detailMessage;
    errors.locationDetail = detailMessage;
  }

  const min = state.budgetMin ? Number(state.budgetMin) : NaN;
  const max = state.budgetMax ? Number(state.budgetMax) : NaN;

  if (!state.budgetMin || !state.budgetMax) {
    errors.budget = 'Provide a budget range so providers can qualify themselves.';
  } else if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0) {
    errors.budget = 'Budget values must be valid positive numbers.';
  } else if (min > max) {
    errors.budget = 'Minimum budget cannot exceed the maximum.';
  }

  return errors;
};

const stepFieldMap: Record<number, FormField[]> = {
  0: ['ageRange', 'nationality', 'currentLocation', 'currentVisaExpiry', 'currentVisaType'],
  1: ['title', 'visaType'],
  2: ['location', 'locationDetail'],
  3: ['budgetMin', 'budgetMax'],
  4: ['additionalNotes'],
};

type DirectErrorField = Exclude<FormField, 'budgetMin' | 'budgetMax'>;

const fieldErrorKeyMap: Record<DirectErrorField, keyof FormErrors> = {
  title: 'title',
  ageRange: 'ageRange',
  nationality: 'nationality',
  currentLocation: 'currentLocation',
  currentVisaExpiry: 'currentVisaExpiry',
  currentVisaType: 'currentVisaType',
  visaType: 'visaType',
  location: 'location',
  locationDetail: 'locationDetail',
  timeline: 'timeline',
  additionalNotes: 'additionalNotes',
};

const getErrorForField = (field: FormField, errors: FormErrors) => {
  if (field === 'budgetMin' || field === 'budgetMax') {
    return errors.budget;
  }

  const key = fieldErrorKeyMap[field as DirectErrorField];
  return key ? errors[key] : undefined;
};

const baseCardClass = 'bg-bg-primary border border-border-light rounded-base shadow-sm';
const sectionCardClass = `${baseCardClass} p-8`;
const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base bg-gradient-to-b from-primary to-primary-hover px-6 py-3 text-sm font-semibold text-white shadow-xs transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60';
const outlineButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base border border-border-light px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border transition';
const ghostButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-base border border-dashed border-border-light px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary transition';

export default function CreateRequestPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formState, setFormState] = useState<FormState>(() => createInitialFormState());
  const [touchedFields, setTouchedFields] = useState<Record<FormField, boolean>>(() =>
    createInitialTouchedState(),
  );
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Visa strategy & eligibility']);
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentStatus>>(
    () => createInitialDocumentState(),
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<Request | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [focusedField, setFocusedField] = useState<FormField | null>(null);
  const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);
  const [timelineShortcuts] = useState(() => createTimelineShortcuts());
  const [isCustomTimeline, setIsCustomTimeline] = useState(false);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);
  const [hasCustomTitle, setHasCustomTitle] = useState(false);
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await api.users.getCurrentUser();

        if (!user.emailVerified) {
          router.push('/auth/verify-email');
          return;
        }

        if (user.role !== 'SEEKER') {
          router.push('/');
          return;
        }

        setIsCheckingAuth(false);
      } catch (err: unknown) {
        const error = err as { status?: number };
        if (error?.status === 401) {
          router.push('/auth/login');
          return;
        }
        console.error('[CreateRequestPage] Error checking auth:', err);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!createdRequest) {
      return;
    }

    setRedirectCountdown(4);
    redirectTimeoutRef.current = setTimeout(() => {
      router.push(`/requests/${createdRequest.id}`);
    }, 4000);

    countdownIntervalRef.current = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [createdRequest, router]);

  useEffect(() => {
    if (!formState.timeline && timelineShortcuts.length) {
      setFormState((prev) => ({ ...prev, timeline: timelineShortcuts[0].value }));
    }
  }, [formState.timeline, timelineShortcuts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window.innerWidth >= 640) {
      return;
    }
    const targetButton = stepButtonRefs.current[currentStep];
    targetButton?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [currentStep]);

  const composedDescription = useMemo(() => {
    const sections: string[] = [];

    if (selectedNeeds.length) {
      sections.push(`Support Needed:\n${selectedNeeds.map((need) => `- ${need}`).join('\n')}`);
    }

    if (formState.timeline.trim()) {
      sections.push(`Timeline:\n${formState.timeline.trim()}`);
    }

    const documentLines = documentChecklist.map((doc) => {
      const status = documentStatuses[doc.key];
      const label =
        status === 'ready'
          ? 'Ready to submit'
          : status === 'in-progress'
          ? 'In progress'
          : 'Need help';
      return `- ${doc.label}: ${label}`;
    });

    if (documentLines.length) {
      sections.push(`Document Readiness:\n${documentLines.join('\n')}`);
    }

    if (formState.additionalNotes.trim()) {
      sections.push(`Notes:\n${formState.additionalNotes.trim()}`);
    }

    return sections.join('\n\n').trim();
  }, [documentStatuses, formState, selectedNeeds]);

  const resetForm = () => {
    setFormState(createInitialFormState());
    setTouchedFields(createInitialTouchedState());
    setSelectedNeeds(['Visa strategy & eligibility']);
    setDocumentStatuses(createInitialDocumentState());
    setFormErrors({});
    setStepError(null);
    setSubmitError(null);
    setCreatedRequest(null);
    setCurrentStep(0);
    setHasCustomTitle(false);
  };

  const markFieldTouched = (field: FormField) => {
    setTouchedFields((prev) => ({
      ...prev,
      [field]: true,
    }));
  };

  const markFieldsTouched = (fields: FormField[]) => {
    setTouchedFields((prev) => {
      const next = { ...prev };
      fields.forEach((field) => {
        next[field] = true;
      });
      return next;
    });
  };

  const updateField = (field: FormField, value: string) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };
      setFormErrors(computeFormErrors(next));
      return next;
    });
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) => (prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need]));
  };

  const setDocumentStatus = (key: string, status: DocumentStatus) => {
    setDocumentStatuses((prev) => ({ ...prev, [key]: status }));
  };

  const resolveLocationLabel = (value: string) => {
    const option = locationOptions.find((item) => item.value === value);
    return option ? option.label : value;
  };

  const isStepValid = (stepIndex: number, errors: FormErrors = formErrors) => {
    const requiredFields = stepFieldMap[stepIndex] || [];
    return requiredFields.every((field) => {
      if (field === 'locationDetail' && formState.location !== 'OTHER') {
        return true;
      }
      if (field === 'currentVisaExpiry' && formState.currentLocation !== 'IN_THAILAND') {
        return true;
      }
      if (field === 'currentVisaType' && formState.currentLocation !== 'IN_THAILAND') {
        return true;
      }
      if (field === 'additionalNotes') {
        return true;
      }
      if (field === 'budgetMin' || field === 'budgetMax') {
        return !errors.budget;
      }
      return !getErrorForField(field, errors);
    });
  };

  const handleContinue = () => {
    setStepError(null);
    const nextErrors = computeFormErrors(formState);
    setFormErrors(nextErrors);
    markFieldsTouched(stepFieldMap[currentStep] || []);

    if (!isStepValid(currentStep, nextErrors)) {
      setStepError('Please resolve the highlighted fields before continuing.');
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const touchAllFields = () => {
    setTouchedFields(
      Object.keys(formState).reduce((acc, key) => {
        acc[key as FormField] = true;
        return acc;
      }, {} as Record<FormField, boolean>),
    );
  };

  const focusFirstInvalidStep = (errors: FormErrors) => {
    const invalidStep = formSteps.findIndex((_, index) => !isStepValid(index, errors));
    if (invalidStep >= 0) {
      setCurrentStep(invalidStep);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStepError(null);
    setSubmitError(null);
    const nextErrors = computeFormErrors(formState);
    setFormErrors(nextErrors);
    touchAllFields();

    if (Object.keys(nextErrors).length > 0) {
      setStepError('Fill in the required fields before publishing.');
      focusFirstInvalidStep(nextErrors);
      return;
    }

    setIsSubmitting(true);

    const budgetMin = Number(formState.budgetMin);
    const budgetMax = Number(formState.budgetMax);
    const locationLabel = resolveLocationLabel(formState.location);
    const composedLocation =
      formState.location === 'OTHER'
        ? formState.locationDetail.trim()
        : formState.locationDetail.trim()
        ? `${locationLabel} - ${formState.locationDetail.trim()}`
        : locationLabel;

    try {
      const requestPayload = {
        title: formState.title.trim(),
        description: composedDescription,
        visaType: formState.visaType === 'OTHER' ? 'Other / Requires guidance' : formState.visaType,
        budgetMin,
        budgetMax,
        location: composedLocation,
      };

      const response = await api.requests.createRequest({
        requestBody: requestPayload,
      });

      setCreatedRequest(response);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setIsSubmitting(false);
      console.error('[CreateRequestPage] Error creating request:', err);
      const error = err as { status?: number; body?: { message?: string } };

      if (error?.status === 401) {
        setSubmitError('Your session expired. Please sign in again to post a request.');
        router.push('/auth/login');
        return;
      }

      if (error?.status === 429) {
        setSubmitError('You are sending requests too quickly. Please wait a moment and try again.');
      } else if (error?.body?.message) {
        setSubmitError(error.body.message);
      } else {
        setSubmitError('Something went wrong while publishing your request. Please try again.');
      }
    }
  };

  const handleStepIndicatorClick = (index: number) => {
    if (index === currentStep) {
      return;
    }

    if (index < currentStep || isStepValid(index - 1 >= 0 ? index - 1 : 0)) {
      setStepError(null);
      setCurrentStep(index);
    }
  };

  const getFieldValidationState = (field: FormField) => {
    if (!touchedFields[field]) {
      return 'default';
    }

    if (field === 'budgetMin' || field === 'budgetMax') {
      if (formErrors.budget) {
        return 'error';
      }
      if (formState.budgetMin && formState.budgetMax) {
        return 'success';
      }
      return 'default';
    }

    return getErrorForField(field, formErrors) ? 'error' : 'success';
  };

  const getInputClasses = (field: FormField) => {
    const state = getFieldValidationState(field);
    if (field === 'budgetMin' || field === 'budgetMax') {
      if (state === 'error' && formErrors.budget) {
        return 'border-error focus:ring-error/40';
      }
      if (state === 'success' && !formErrors.budget && formState.budgetMin && formState.budgetMax) {
        return 'border-success/70 bg-success/5 focus:ring-success/30';
      }
    }

    if (state === 'error') {
      return 'border-error focus:ring-error/40';
    }

    if (state === 'success') {
      return 'border-success/70 bg-success/5 focus:ring-success/30';
    }

    return 'border-border focus:ring-primary/40';
  };

  const renderValidationFeedback = (field: FormField, fallbackSuccess?: string) => {
    if (!touchedFields[field]) {
      return null;
    }

    if (field === 'budgetMin' || field === 'budgetMax') {
      if (formErrors.budget) {
        return (
          <p className="mt-2 text-sm text-error flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4" aria-hidden="true" />
            {formErrors.budget}
          </p>
        );
      }
      if (formState.budgetMin && formState.budgetMax) {
        return (
          <p className="mt-2 text-sm text-success flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Budget range looks good.
          </p>
        );
      }
      return null;
    }

    const fieldError = getErrorForField(field, formErrors);
    if (fieldError) {
      return (
        <p className="mt-2 text-sm text-error flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {fieldError}
        </p>
      );
    }

    if (fallbackSuccess) {
      return (
        <p className="mt-2 text-sm text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          {fallbackSuccess}
        </p>
      );
    }

    return null;
  };
  const handleAgeRangeSelect = (value: string) => {
    updateField('ageRange', value);
    markFieldTouched('ageRange');
  };

  const handleResidencySelect = (value: string) => {
    updateField('currentLocation', value);
    markFieldTouched('currentLocation');
    if (value !== 'IN_THAILAND') {
      setFormState((prev) => ({ ...prev, currentVisaExpiry: '', currentVisaType: '' }));
      setTouchedFields((prev) => ({ ...prev, currentVisaExpiry: false, currentVisaType: false }));
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next.currentVisaExpiry;
        delete next.currentVisaType;
        return next;
      });
    }
  };

  const handleVisaSelect = (value: string) => {
    updateField('visaType', value);
    markFieldTouched('visaType');
    if (!hasCustomTitle) {
      const suggestedTitle = createTitleFromVisa(value);
      if (suggestedTitle) {
        updateField('title', suggestedTitle);
      }
    }
  };

  const handleLocationSelect = (value: string) => {
    updateField('location', value);
    markFieldTouched('location');
    if (value !== 'OTHER') {
      updateField('locationDetail', '');
    }
    setIsLocationSelectOpen(false);
  };

  const handleBudgetPreset = (preset: (typeof budgetPresets)[number]) => {
    updateField('budgetMin', String(preset.min));
    updateField('budgetMax', String(preset.max));
    markFieldTouched('budgetMin');
    markFieldTouched('budgetMax');
  };

  const handleTimelineShortcut = (value: string) => {
    setIsCustomTimeline(false);
    updateField('timeline', value);
    markFieldTouched('timeline');
  };

  const handleStepSwipeStart = (event: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return;
    }
    const touchX = event.touches[0]?.clientX ?? null;
    touchStartXRef.current = touchX;
    touchCurrentXRef.current = touchX;
  };

  const handleStepSwipeMove = (event: React.TouchEvent) => {
    if (touchStartXRef.current === null) {
      return;
    }
    touchCurrentXRef.current = event.touches[0]?.clientX ?? touchCurrentXRef.current;
  };

  const resetSwipeTracking = () => {
    touchStartXRef.current = null;
    touchCurrentXRef.current = null;
  };

  const handleStepSwipeEnd = () => {
    if (touchStartXRef.current === null || touchCurrentXRef.current === null) {
      resetSwipeTracking();
      return;
    }

    const delta = touchStartXRef.current - touchCurrentXRef.current;
    const threshold = 50;

    if (delta > threshold && currentStep < formSteps.length - 1) {
      handleContinue();
    } else if (delta < -threshold && currentStep > 0) {
      handleBack();
    }

    resetSwipeTracking();
  };

  const handleStepSwipeCancel = () => {
    resetSwipeTracking();
  };

  const renderPersonalStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
          <Sparkles className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 1
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Tell us about you</h2>
          <p className="text-text-secondary">Nationality details help providers assess eligibility.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Age range</label>
            <div className="flex flex-wrap gap-3">
              {ageRangeOptions.map((option) => {
                const isActive = formState.ageRange === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAgeRangeSelect(option.value)}
                    className={`flex-1 min-w-[150px] h-12 rounded-base border px-4 text-base font-semibold transition focus-visible:ring-2 focus-visible:ring-primary/40 flex items-center justify-center ${
                      isActive
                        ? 'border-primary bg-primary/5 text-text-primary shadow-xs'
                        : 'border-border-light text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-tertiary">Requesters must be at least 18 years old.</p>
            {renderValidationFeedback('ageRange')}
          </div>

          <div className="space-y-2">
            <label htmlFor="nationality" className="text-sm font-medium text-text-secondary">
              Nationality
            </label>
            <div
              className={`relative flex h-12 items-center gap-3 rounded-base border bg-transparent px-4 ${getInputClasses('nationality')}`}
            >
              <Globe className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
              <select
                id="nationality"
                name="nationality"
                value={formState.nationality}
                onChange={(event) => updateField('nationality', event.target.value)}
                onBlur={() => markFieldTouched('nationality')}
                className="w-full bg-transparent text-base focus:outline-none appearance-none pr-6 h-full"
                aria-invalid={Boolean(formErrors.nationality)}
              >
                <option value="">Select nationality</option>
                {nationalityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-4 pointer-events-none" aria-hidden="true" />
            </div>
            {renderValidationFeedback('nationality')}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-base border border-border-light p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-text-secondary">Current location</p>
                <p className="text-xs text-text-tertiary">Let providers know where you are starting from.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {residencyOptions.map((option) => {
                const isActive = formState.currentLocation === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleResidencySelect(option.value)}
                    className={`rounded-base border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      isActive
                        ? 'border-primary bg-primary/5 text-text-primary shadow-xs'
                        : 'border-border-light text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                    aria-pressed={isActive}
                    aria-label={option.label}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-base ${
                          isActive ? 'bg-primary/10 text-primary' : 'bg-bg-secondary text-text-tertiary'
                        }`}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs text-text-tertiary">{option.description}</p>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-primary mt-1" aria-hidden="true" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          {renderValidationFeedback('currentLocation')}
        </div>

        {formState.currentLocation === 'IN_THAILAND' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="currentVisaType" className="text-sm font-medium text-text-secondary">
                Current visa type
              </label>
              <div
                className={`relative flex items-center gap-3 rounded-base border bg-transparent px-4 py-3 ${getInputClasses('currentVisaType')}`}
              >
                <FileText className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
                <select
                  id="currentVisaType"
                  name="currentVisaType"
                  value={formState.currentVisaType}
                  onChange={(event) => updateField('currentVisaType', event.target.value)}
                  onBlur={() => markFieldTouched('currentVisaType')}
                  className="w-full bg-transparent text-base focus:outline-none appearance-none pr-6"
                  aria-invalid={Boolean(formErrors.currentVisaType)}
                >
                  <option value="">Select visa type</option>
                  {inThailandVisaOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-4 pointer-events-none" aria-hidden="true" />
              </div>
              {renderValidationFeedback('currentVisaType')}
            </div>

            <div className="space-y-2">
              <label htmlFor="currentVisaExpiry" className="text-sm font-medium text-text-secondary">
                Current visa expiry date
              </label>
              <div
                className={`flex items-center gap-3 rounded-base border bg-transparent px-4 py-3 ${getInputClasses('currentVisaExpiry')}`}
              >
                <Calendar className="w-4 h-4 text-text-tertiary" aria-hidden="true" />
                <input
                  id="currentVisaExpiry"
                  name="currentVisaExpiry"
                  type="date"
                  value={formState.currentVisaExpiry}
                  onChange={(event) => updateField('currentVisaExpiry', event.target.value)}
                  onBlur={() => markFieldTouched('currentVisaExpiry')}
                  className="w-full bg-transparent text-base focus:outline-none"
                  aria-invalid={Boolean(formErrors.currentVisaExpiry)}
                />
              </div>
              {renderValidationFeedback('currentVisaExpiry')}
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderMissionStep = () => {
    const selectedMissionVisa = missionVisaOptions.find((option) => option.value === formState.visaType);

    return (
      <section className={sectionCardClass}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
              Step 2
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Share your mission</h2>
            <p className="text-text-secondary">Kick off with a clear title, add context only if needed.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
              Request title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formState.title}
            onChange={(event) => {
              const nextValue = event.target.value;
              setHasCustomTitle(nextValue.trim().length > 0);
              updateField('title', nextValue);
            }}
              onFocus={() => setFocusedField('title')}
              onBlur={() => {
                markFieldTouched('title');
                setFocusedField(null);
              }}
              placeholder="e.g. LTR visa with dependents arriving Q2 2025"
              className={`w-full rounded-base border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 transition ${getInputClasses('title')}`}
              maxLength={200}
              aria-invalid={Boolean(formErrors.title)}
            />
            {focusedField === 'title' && !formState.title && (
              <div className="mt-3 flex flex-wrap gap-2">
                {['Call out visa class', 'Mention timing', 'Highlight dependents'].map((tip) => (
                  <span
                    key={tip}
                    className="text-xs px-3 py-1 rounded-full border border-border-light text-text-secondary"
                  >
                    {tip}
                  </span>
                ))}
              </div>
            )}
            {renderValidationFeedback('title', 'Title looks descriptive.')}
          </div>

          <div className="rounded-base border border-border-light bg-bg-secondary/40 p-5 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-text-secondary">Which visa feels right?</p>
                <p className="text-xs text-text-tertiary">Pick what you are leaning toward right now.</p>
              </div>
              {selectedMissionVisa && <span className="text-xs text-primary font-medium">{selectedMissionVisa.label}</span>}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {missionVisaOptions.map((option) => {
                const isActive = formState.visaType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-2xl border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      isActive
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border-light bg-white/80 hover:border-primary/50'
                    }`}
                    onClick={() => handleVisaSelect(option.value)}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-text-secondary'}`}>{option.label}</p>
                        <p className="text-xs text-text-tertiary mt-0.5">{option.description}</p>
                      </div>
                      {option.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                            isActive ? 'bg-primary text-white' : 'bg-border-light/60 text-text-tertiary'
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.details.length > 0 && (
                      <ul className="mt-3 space-y-1 text-xs text-text-tertiary">
                        {option.details.map((detail) => (
                          <li key={detail} className="flex items-start gap-2">
                            <Check className={`w-3.5 h-3.5 mt-0.5 ${isActive ? 'text-primary' : 'text-border'}`} aria-hidden="true" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                );
              })}
            </div>
            {renderValidationFeedback('visaType')}
          </div>

        </div>
      </section>
    );
  };

  const renderIntentStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <Globe className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 3
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Preferred location</h2>
        </div>
      </div>

      <div className="rounded-base border border-border-light p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-secondary">Preferred location</p>
            <p className="text-xs text-text-tertiary">Where do you prefer to settle or spend most of your time?</p>
          </div>
          {formState.location && (
            <span className="text-xs text-primary font-medium">
              {locationOptions.find((opt) => opt.value === formState.location)?.label}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {locationOptions
            .filter((option) => featuredLocationOptions.includes(option.value))
            .map((option) => {
              const isActive = formState.location === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`px-3 py-1.5 rounded-base border text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
                  }`}
                  onClick={() => handleLocationSelect(option.value)}
                >
                  {option.label}
                </button>
              );
            })}
          <button
            type="button"
            className={`px-3 py-1.5 rounded-base border text-sm transition ${
              formState.location && !featuredLocationOptions.includes(formState.location)
                ? 'border-primary text-primary bg-primary/10'
                : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
            }`}
            onClick={() => setIsLocationSelectOpen((prev) => !prev)}
          >
            Somewhere else
          </button>
        </div>
        {isLocationSelectOpen && (
          <select
            className="w-full rounded-base border border-border-light bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={formState.location}
            onChange={(event) => handleLocationSelect(event.target.value)}
          >
            <option value="">Where do you see yourself living?</option>
            {locationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
        {formState.location === 'OTHER' && (
          <input
            type="text"
            className={`w-full rounded-base border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 transition ${getInputClasses('locationDetail')}`}
            placeholder="Share the city or embassy"
            value={formState.locationDetail}
            onChange={(event) => updateField('locationDetail', event.target.value)}
            onBlur={() => markFieldTouched('locationDetail')}
          />
        )}
        {renderValidationFeedback('location')}
      </div>
    </section>
  );

  const renderBudgetStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <Wallet className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 4
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Budget & timing</h2>
          <p className="text-text-secondary">Pick a range or set a custom number. Timeline defaults help.</p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-text-secondary">Budget range (THB)</p>
            <span className="text-xs text-text-tertiary uppercase tracking-wide">Private</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {budgetPresets.map((preset) => {
              const isActive =
                Number(formState.budgetMin) === preset.min && Number(formState.budgetMax) === preset.max;
              return (
                <button
                  key={preset.label}
                  type="button"
                  className={`px-3 py-1.5 rounded-base border text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
                  }`}
                  onClick={() => handleBudgetPreset(preset)}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {renderValidationFeedback('budgetMin')}
        </div>

        <div>
          <p className="text-sm font-medium text-text-secondary mb-3">Ideal submission timeline</p>
          <div className="flex flex-wrap gap-2">
            {timelineShortcuts.map((shortcut) => {
              const isActive = formState.timeline === shortcut.value && !isCustomTimeline;
              return (
                <button
                  key={shortcut.value}
                  type="button"
                  className={`px-3 py-1.5 rounded-base border text-sm transition ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
                  }`}
                  onClick={() => handleTimelineShortcut(shortcut.value)}
                >
                  {shortcut.label}
                </button>
              );
            })}
            <button
              type="button"
              className={`px-3 py-1.5 rounded-base border text-sm transition ${
                isCustomTimeline
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
              }`}
              onClick={() => setIsCustomTimeline(true)}
            >
              Custom
            </button>
          </div>
          {isCustomTimeline && (
            <div className="mt-3 rounded-base border border-border bg-transparent px-4 py-3 flex gap-3 items-center focus-within:ring-2 focus-within:ring-primary/30">
              <Calendar className="w-5 h-5 text-text-tertiary" aria-hidden="true" />
              <input
                id="timeline"
                name="timeline"
                type="text"
                value={formState.timeline}
                onChange={(event) => updateField('timeline', event.target.value)}
                onBlur={() => markFieldTouched('timeline')}
                placeholder="e.g. Need visa stamped before 30 April 2025"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );

  const documentReadyCount = Object.values(documentStatuses).filter((status) => status === 'ready').length;
  const documentHelpCount = Object.values(documentStatuses).filter((status) => status === 'need-help').length;

  const renderSupportStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <Shield className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 5
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">How can experts help?</h2>
          <p className="text-text-secondary">Collapse sections to keep the main action visible.</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-base border border-border-light">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setIsAssistanceOpen((prev) => !prev)}
          >
            <div>
              <p className="text-sm font-medium text-text-secondary">Assistance areas</p>
              <p className="text-xs text-text-tertiary">{selectedNeeds.length} selected</p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-tertiary transition-transform ${isAssistanceOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isAssistanceOpen && (
            <div className="border-t border-border-light p-4">
              <div className="flex flex-wrap gap-3" role="group" aria-label="Select assistance areas">
                {assistanceNeeds.map((need) => {
                  const isSelected = selectedNeeds.includes(need);
                  return (
                    <button
                      key={need}
                      type="button"
                      onClick={() => toggleNeed(need)}
                      className={`px-4 py-2 rounded-base border text-sm transition flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary/40 ${
                        isSelected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${need}${isSelected ? ' selected' : ''}`}
                    >
                      {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                      {need}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-base border border-border-light">
          <button
            type="button"
            className="w-full flex items-center justify-between px-4 py-3"
            onClick={() => setIsDocumentsOpen((prev) => !prev)}
          >
            <div>
              <p className="text-sm font-medium text-text-secondary">Document readiness</p>
              <p className="text-xs text-text-tertiary">
                {documentReadyCount} ready · {documentHelpCount} need help
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-text-tertiary transition-transform ${isDocumentsOpen ? 'rotate-180' : ''}`}
            />
          </button>
          {isDocumentsOpen && (
            <div className="border-t border-border-light p-4">
              <div className="grid gap-4 md:grid-cols-2">
                {documentChecklist.map((doc) => (
                  <div key={doc.key} className="rounded-base border border-border-light p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-base bg-primary/10 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.label}</p>
                        <p className="text-sm text-text-tertiary">
                          Tell providers if you need help gathering it.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2" role="group" aria-label={`${doc.label} status`}>
                      {(['ready', 'in-progress', 'need-help'] as DocumentStatus[]).map((status) => {
                        const isActive = documentStatuses[doc.key] === status;
                        const badgeLabel =
                          status === 'ready' ? 'Ready' : status === 'in-progress' ? 'In progress' : 'Need help';

                        return (
                          <button
                            key={status}
                            type="button"
                            className={`flex-1 rounded-base border px-3 py-2 text-sm transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                              isActive
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border-light text-text-tertiary hover:border-primary/40 hover:text-primary'
                            }`}
                            onClick={() => setDocumentStatus(doc.key, status)}
                            aria-pressed={isActive}
                            aria-label={`${doc.label}: ${badgeLabel}`}
                          >
                            {badgeLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="additionalNotes" className="block text-sm font-medium text-text-secondary mb-2">
            Anything else we should know?
          </label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={formState.additionalNotes}
            onChange={(event) => updateField('additionalNotes', event.target.value)}
            onBlur={() => markFieldTouched('additionalNotes')}
            placeholder="Dependent details, recent visa history, employer information..."
            className="w-full rounded-base border border-border bg-transparent px-4 py-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary transition"
            maxLength={2000}
          />
        </div>
      </div>
    </section>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalStep();
      case 1:
        return renderMissionStep();
      case 2:
        return renderIntentStep();
      case 3:
        return renderBudgetStep();
      case 4:
      default:
        return renderSupportStep();
    }
  };

  const isSubmitDisabled = isSubmitting || Boolean(createdRequest);
  const progressPercentage = Math.min(((currentStep + 1) / formSteps.length) * 100, 100);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" aria-hidden="true" />
          <p className="text-text-secondary text-sm">Checking your account...</p>
        </div>
      </div>
    );
  }

  if (createdRequest) {
    return (
      <div className="min-h-screen bg-bg-secondary p-6 lg:p-10 relative">
        <button
          onClick={() => logout(router)}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition duration-150 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Logout</span>
        </button>

        <div className="max-w-3xl mx-auto">
          <div className={`${baseCardClass} p-10 text-center space-y-6`}>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                Request published
              </p>
              <h1 className="text-3xl font-semibold">{createdRequest.title}</h1>
              <p className="text-text-secondary">
                Your visa brief is live. We will redirect you automatically in {redirectCountdown}s so you can
                monitor responses.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => router.push(`/requests/${createdRequest.id}`)}
                className={primaryButtonClass}
              >
                View request now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => router.push('/requests')} className={outlineButtonClass}>
                View all requests
              </button>
              <button type="button" onClick={resetForm} className={ghostButtonClass}>
                Post another request
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary p-6 lg:p-10 relative">
      <button
        onClick={() => logout(router)}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition duration-150 hover:border-border focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Logout</span>
      </button>

      <div className="max-w-4xl mx-auto space-y-6">
        <header className={`${baseCardClass} px-6 py-8 md:px-10`}>
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
              Visa seeker workspace
            </p>
            <h1 className="text-3xl md:text-[2.4rem] font-semibold leading-tight tracking-tight text-text-primary">
              Start with the essentials, unlock curated help
            </h1>
            <p className="text-text-secondary text-base md:text-lg max-w-2xl">
              We collect identity, intent, and timing in a focused flow so immigration partners can respond with
              confidence. Everything else hides behind accordions until you need it.
            </p>
          </div>
          <ul className="mt-6 grid gap-3 text-sm text-text-secondary sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              Personal details first to pre-qualify you.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              Presets for budget & timelines reduce typing.
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              Collapsible extras keep “Continue” in view.
            </li>
          </ul>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className={`${baseCardClass} p-6 md:p-8 space-y-6`}>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                Step {currentStep + 1} of {formSteps.length}
              </p>
              <h2 className="text-2xl font-semibold text-text-primary">{formSteps[currentStep]?.title}</h2>
              <p className="text-sm text-text-secondary">{formSteps[currentStep]?.subtitle}</p>
            </div>
            <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden" aria-hidden="true">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="relative">
              <ol
                className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-5 sm:overflow-visible sm:snap-none"
                aria-label="Request builder progress"
              >
                {formSteps.map((step, index) => {
                  const stepComplete = index < currentStep && isStepValid(index);
                  const isActive = index === currentStep;
                  const canJump = index <= currentStep + 1;
                  return (
                    <li key={step.id} className="snap-center flex-shrink-0 min-w-[72vw] sm:min-w-0 sm:w-auto">
                      <button
                        type="button"
                        onClick={() => handleStepIndicatorClick(index)}
                        ref={(element) => {
                          stepButtonRefs.current[index] = element;
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-xs sm:text-sm transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          isActive
                            ? 'border-primary bg-primary/5 text-text-primary shadow-sm'
                            : stepComplete
                            ? 'border-success/50 bg-success/5 text-text-secondary'
                            : 'border-border-light bg-bg-secondary/60 text-text-tertiary'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                        aria-label={`Step ${index + 1}: ${step.title}`}
                        disabled={!canJump}
                      >
                        <div className="flex items-center gap-2 font-semibold text-text-primary">
                          {stepComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                          ) : (
                            <span className="text-xs text-text-tertiary">{index + 1}</span>
                          )}
                          <span className="truncate">{step.title}</span>
                        </div>
                        <p className="text-[0.7rem] text-text-tertiary mt-1 line-clamp-2">{step.subtitle}</p>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="pointer-events-none absolute inset-y-2 left-0 w-10 bg-gradient-to-r from-bg-primary to-transparent sm:hidden" />
              <div className="pointer-events-none absolute inset-y-2 right-0 w-10 bg-gradient-to-l from-bg-primary to-transparent sm:hidden" />
            </div>
          </section>

          <div
            onTouchStart={handleStepSwipeStart}
            onTouchMove={handleStepSwipeMove}
            onTouchEnd={handleStepSwipeEnd}
            onTouchCancel={handleStepSwipeCancel}
          >
            {renderCurrentStep()}
          </div>

          <div className="sticky bottom-4 z-10">
            <div className="bg-bg-primary/95 border border-border-light rounded-base px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm backdrop-blur">
              {stepError && (
                <p className="text-error text-sm flex items-center gap-2" role="alert">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {stepError}
                </p>
              )}
              <div className="flex flex-wrap gap-3 md:ml-auto">
                <button type="button" onClick={() => router.push('/requests')} className={outlineButtonClass}>
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Cancel
                </button>
                {currentStep > 0 && (
                  <button type="button" onClick={handleBack} className={outlineButtonClass}>
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Back
                  </button>
                )}
                {currentStep < formSteps.length - 1 && (
                  <button type="button" onClick={handleContinue} className={primaryButtonClass}>
                    Continue
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                {currentStep === formSteps.length - 1 && (
                  <button type="submit" disabled={isSubmitDisabled} className={primaryButtonClass}>
                    {isSubmitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Publishing request...
                      </>
                    ) : (
                      <>
                        Publish request
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {submitError && (
            <p className="text-error text-sm flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              {submitError}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
