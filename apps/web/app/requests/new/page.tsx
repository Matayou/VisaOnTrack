'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Request, RequestStatus } from '@visaontrack/client';
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
  Loader,
  LogOut,
  MapPin,
  Plus,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { logout } from '@/lib/auth';

type DocumentStatus = 'ready' | 'in-progress' | 'need-help';

interface FormState {
  title: string;
  summary: string;
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
  summary?: string;
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

const budgetPresets = [
  { label: 'THB 5k - 10k', min: 5000, max: 10000 },
  { label: 'THB 10k - 20k', min: 10000, max: 20000 },
  { label: 'THB 20k - 35k', min: 20000, max: 35000 },
  { label: 'THB 35k+', min: 35000, max: 60000 },
];

const summaryPresets = [
  'Relocating to Thailand for a long-term role, need LTR visa support for myself and spouse.',
  'Currently on tourist visa, aiming to convert to Non-Immigrant B with tight timelines.',
];

const summaryTips = [
  'Mention dependents',
  'Share current visa status',
  'Call out employer or sponsor details',
];

const featuredVisaOptions = ['NON-IMM-B', 'LTR', 'DTV', 'NON-IMM-O'];
const featuredLocationOptions = ['BANGKOK', 'CHIANG_MAI', 'PHUKET', 'ABROAD'];

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);

const createTimelineShortcuts = () => {
  const now = new Date();
  const offsets = [14, 30, 60];
  return offsets.map((days) => {
    const target = new Date(now);
    target.setDate(target.getDate() + days);
    return {
      label: `Need approval by ${formatDate(target)}`,
      value: `Need approval by ${formatDate(target)}`,
    };
  });
};

const formSteps = [
  {
    id: 'mission',
    title: 'Share your mission',
    subtitle: 'Give providers context before they reply.',
  },
  {
    id: 'intent',
    title: 'Visa intent & location',
    subtitle: 'Match with specialists covering your visa class and region.',
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
  summary: '',
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
const REQUEST_STATUS_OPEN: RequestStatus = RequestStatus.OPEN;

const computeFormErrors = (state: FormState): FormErrors => {
  const errors: FormErrors = {};

  if (!state.title.trim() || state.title.trim().length < 6) {
    errors.title = 'Give your request a descriptive title (min 6 characters).';
  }

  if (!state.summary.trim() || state.summary.trim().length < 40) {
    errors.summary = 'Describe your situation in at least 40 characters.';
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
  0: ['title', 'summary'],
  1: ['visaType', 'location', 'locationDetail'],
  2: ['budgetMin', 'budgetMax'],
  3: ['additionalNotes'],
};

type DirectErrorField = Exclude<FormField, 'budgetMin' | 'budgetMax'>;

const fieldErrorKeyMap: Record<DirectErrorField, keyof FormErrors> = {
  title: 'title',
  summary: 'summary',
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
const compactCardClass = `${baseCardClass} p-6`;
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
  const [showSummaryField, setShowSummaryField] = useState(false);
  const [focusedField, setFocusedField] = useState<FormField | null>(null);
  const [isVisaSelectOpen, setIsVisaSelectOpen] = useState(false);
  const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);
  const [budgetMode, setBudgetMode] = useState<'preset' | 'custom'>('preset');
  const [timelineShortcuts] = useState(() => createTimelineShortcuts());
  const [isCustomTimeline, setIsCustomTimeline] = useState(false);
  const [isAssistanceOpen, setIsAssistanceOpen] = useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = useState(false);

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
    if (formState.budgetMin && formState.budgetMax) {
      setBudgetMode('custom');
    }
  }, [formState.budgetMin, formState.budgetMax]);

  const composedDescription = useMemo(() => {
    const sections: string[] = [];

    if (formState.summary.trim()) {
      sections.push(`Overview:\n${formState.summary.trim()}`);
    }

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

  const checklistItems = useMemo(
    () => [
      {
        id: 'title',
        label: 'Title states visa type and timing',
        complete: !!formState.title && !formErrors.title,
      },
      {
        id: 'summary',
        label: 'Description covers dependents and status',
        complete: !!formState.summary && !formErrors.summary,
      },
      {
        id: 'budget',
        label: 'Budget range reflects service expectations',
        complete: !!formState.budgetMin && !!formState.budgetMax && !formErrors.budget,
      },
      {
        id: 'documents',
        label: 'Document readiness shows where help is needed',
        complete: Object.values(documentStatuses).some((status) => status !== 'in-progress'),
      },
    ],
    [documentStatuses, formErrors, formState],
  );
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
        description: composedDescription || formState.summary.trim(),
        visaType: formState.visaType === 'OTHER' ? 'Other / Requires guidance' : formState.visaType,
        budgetMin,
        budgetMax,
        location: composedLocation,
        status: REQUEST_STATUS_OPEN,
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
  const handleSummaryPreset = (text: string) => {
    setShowSummaryField(true);
    updateField('summary', text);
    markFieldTouched('summary');
  };

  const appendSummaryTip = (tip: string) => {
    if (formState.summary.includes(tip)) {
      return;
    }
    const next = formState.summary ? `${formState.summary}\n${tip}` : tip;
    updateField('summary', next);
  };

  const handleVisaSelect = (value: string) => {
    updateField('visaType', value);
    markFieldTouched('visaType');
    setIsVisaSelectOpen(false);
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
    setBudgetMode('preset');
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

  const renderMissionStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
          <Sparkles className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 1
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
            onChange={(event) => updateField('title', event.target.value)}
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

        {!showSummaryField && !formState.summary ? (
          <div className="rounded-base border border-border-light bg-bg-secondary/40 p-5 space-y-3">
            <p className="text-sm font-medium text-text-secondary">Need help describing your case?</p>
            <div className="flex flex-wrap gap-2">
              {summaryPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="px-3 py-2 text-sm rounded-base border border-border-light text-left hover:border-primary hover:text-primary transition"
                  onClick={() => handleSummaryPreset(preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="text-sm font-medium text-primary hover:text-primary-hover inline-flex items-center gap-2"
              onClick={() => setShowSummaryField(true)}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              Add more context
            </button>
          </div>
        ) : (
          <div className="relative">
            <label htmlFor="summary" className="block text-sm font-medium text-text-secondary mb-2">
              Additional context
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formState.summary}
              onChange={(event) => updateField('summary', event.target.value)}
              onFocus={() => setFocusedField('summary')}
              onBlur={() => {
                markFieldTouched('summary');
                setFocusedField(null);
              }}
              placeholder="Explain current status, dependents, constraints."
              className={`w-full rounded-base border bg-transparent px-4 py-3 text-base min-h-[140px] focus:outline-none focus:ring-2 transition ${getInputClasses('summary')}`}
              maxLength={5000}
              aria-invalid={Boolean(formErrors.summary)}
            />
            <div className="mt-2 flex items-center justify-between text-sm text-text-tertiary">
              <span>Give providers enough detail to pre-qualify themselves.</span>
              <span>{formState.summary.length}/5000</span>
            </div>
            {focusedField === 'summary' && !formState.summary && (
              <div className="mt-3 flex flex-wrap gap-2">
                {summaryTips.map((tip) => (
                  <button
                    key={tip}
                    type="button"
                    className="text-xs px-3 py-1 rounded-full border border-border-light text-text-secondary hover:border-primary hover:text-primary transition"
                    onClick={() => appendSummaryTip(tip)}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            )}
            {renderValidationFeedback('summary', 'Great context—providers will appreciate the detail.')}
          </div>
        )}
      </div>
    </section>
  );

  const renderIntentStep = () => (
    <section className={sectionCardClass}>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
          <FileText className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
            Step 2
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Visa intent & location</h2>
          <p className="text-text-secondary">
            Pick quick options or open the full list when you need something else.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-base border border-border-light p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Target visa</p>
              <p className="text-xs text-text-tertiary">Providers filter by visa class</p>
            </div>
            {formState.visaType && (
              <span className="text-xs text-primary font-medium">
                {visaTypeOptions.find((opt) => opt.value === formState.visaType)?.label}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {visaTypeOptions
              .filter((option) => featuredVisaOptions.includes(option.value))
              .map((option) => {
                const isActive = formState.visaType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`px-3 py-1.5 rounded-base border text-sm transition ${
                      isActive
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
                    }`}
                    onClick={() => handleVisaSelect(option.value)}
                  >
                    {option.label.replace(/ \(.+\)/, '')}
                  </button>
                );
              })}
            <button
              type="button"
              className={`px-3 py-1.5 rounded-base border text-sm transition ${
                formState.visaType && !featuredVisaOptions.includes(formState.visaType)
                  ? 'border-primary text-primary bg-primary/10'
                  : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
              }`}
              onClick={() => setIsVisaSelectOpen((prev) => !prev)}
            >
              Browse all
            </button>
          </div>
          {isVisaSelectOpen && (
            <select
              className="w-full rounded-base border border-border-light bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={formState.visaType}
              onChange={(event) => handleVisaSelect(event.target.value)}
            >
              <option value="">Select a visa</option>
              {visaTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
          {renderValidationFeedback('visaType')}
        </div>

        <div className="rounded-base border border-border-light p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Processing location</p>
              <p className="text-xs text-text-tertiary">Route to specialists in that region</p>
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
              <option value="">Where will you apply?</option>
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
            Step 3
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
                budgetMode === 'preset' &&
                Number(formState.budgetMin) === preset.min &&
                Number(formState.budgetMax) === preset.max;
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
            <button
              type="button"
              className={`px-3 py-1.5 rounded-base border text-sm transition ${
                budgetMode === 'custom'
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border-light text-text-secondary hover:border-primary/50 hover:text-primary'
              }`}
              onClick={() => setBudgetMode('custom')}
            >
              Custom
            </button>
          </div>

          {budgetMode === 'custom' && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetMin" className="sr-only">
                  Minimum budget
                </label>
                <div
                  className={`flex items-center gap-2 rounded-base border bg-transparent px-4 py-3 ${getInputClasses('budgetMin')}`}
                >
                  <span className="text-text-tertiary text-sm">Min</span>
                  <input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    min={0}
                    step={500}
                    value={formState.budgetMin}
                    onChange={(event) => updateField('budgetMin', event.target.value)}
                    onBlur={() => markFieldTouched('budgetMin')}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="10,000"
                    aria-invalid={Boolean(formErrors.budget)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="budgetMax" className="sr-only">
                  Maximum budget
                </label>
                <div
                  className={`flex items-center gap-2 rounded-base border bg-transparent px-4 py-3 ${getInputClasses('budgetMax')}`}
                >
                  <span className="text-text-tertiary text-sm">Max</span>
                  <input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    min={0}
                    step={500}
                    value={formState.budgetMax}
                    onChange={(event) => updateField('budgetMax', event.target.value)}
                    onBlur={() => markFieldTouched('budgetMax')}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="25,000"
                    aria-invalid={Boolean(formErrors.budget)}
                  />
                </div>
              </div>
            </div>
          )}
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
          Step 4
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
        return renderMissionStep();
      case 1:
        return renderIntentStep();
      case 2:
        return renderBudgetStep();
      case 3:
      default:
        return renderSupportStep();
    }
  };

  const isSubmitDisabled = isSubmitting || Boolean(createdRequest);
  const progressPercentage = ((currentStep + 1) / formSteps.length) * 100;

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-text-secondary">Checking your account...</p>
        </div>
      </div>
    );
  }
  if (createdRequest) {
    return (
      <div className="min-h-screen bg-bg-secondary p-6 lg:p-10 relative">
        <button
          onClick={() => logout(router)}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 hover:border-border hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" />
          <span>Logout</span>
        </button>

        <div className="max-w-4xl mx-auto">
        <div className={`${baseCardClass} p-10 text-center space-y-6`}>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary font-semibold mb-2">
                Request published
              </p>
              <h1 className="text-3xl font-semibold mb-4">{createdRequest.title}</h1>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Your visa request is live in the marketplace. We are redirecting you to the request detail
                so you can monitor responses. This will happen automatically in {redirectCountdown}s.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <button
                type="button"
                onClick={() => router.push(`/requests/${createdRequest.id}`)}
                className={`${primaryButtonClass}`}
              >
                View request now
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => router.push('/requests')}
                className={`${outlineButtonClass}`}
              >
                View all requests
              </button>
              <button
                type="button"
                onClick={resetForm}
                className={`${ghostButtonClass}`}
              >
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
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 hover:border-border hover:-translate-y-px focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Logout"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Logout</span>
      </button>

      <div className="max-w-6xl mx-auto space-y-8">
        <header className={`${baseCardClass} px-8 py-10`}>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold mb-3">
                Visa seeker workspace
              </p>
              <h1 className="text-3xl lg:text-[2.65rem] font-semibold leading-tight tracking-tight">
                Design your visa request like a pro
              </h1>
              <p className="mt-4 text-lg text-text-secondary max-w-3xl">
                Provide clarity once, get curated proposals from vetted Thai immigration specialists.
                Every step mirrors what providers see in the marketplace.
              </p>
            </div>
            <div className={`${compactCardClass} w-full max-w-sm`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white shadow-[0_8px_20px_rgba(37,99,235,0.35)]">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-medium">Human-reviewed</p>
                  <p className="text-xs text-text-tertiary">Requests go live in less than 5 minutes</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li>- Providers only see what you share below</li>
                <li>- Messaging unlocks after you accept a quote</li>
                <li>- Escrow protects both sides from surprises</li>
              </ul>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className={`${compactCardClass} p-6`}>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-text-tertiary font-semibold">
                      Step {currentStep + 1} of {formSteps.length}
                    </p>
                    <h3 className="text-xl font-semibold">{formSteps[currentStep].title}</h3>
                    <p className="text-sm text-text-secondary">{formSteps[currentStep].subtitle}</p>
                  </div>
                  <span className="text-sm text-text-tertiary hidden md:inline">
                    {Math.round(progressPercentage)}% complete
                  </span>
                </div>
                <div className="h-2 w-full bg-border/40 rounded-full overflow-hidden" aria-hidden="true">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                <ol className="mt-6 grid gap-3 sm:grid-cols-4" aria-label="Request builder progress">
                  {formSteps.map((step, index) => {
                    const stepComplete = index < currentStep && isStepValid(index);
                    const isActive = index === currentStep;
                    return (
                      <li key={step.id}>
                        <button
                          type="button"
                          onClick={() => handleStepIndicatorClick(index)}
                          className={`w-full rounded-base border px-4 py-3 text-left transition focus-visible:ring-2 focus-visible:ring-primary/40 ${
                            isActive
                              ? 'border-primary bg-primary/5 text-text-primary'
                              : stepComplete
                              ? 'border-success/50 bg-success/5 text-text-secondary'
                              : 'border-border-light bg-bg-secondary/40 text-text-tertiary'
                          }`}
                          aria-current={isActive ? 'step' : undefined}
                          aria-label={`Step ${index + 1}: ${step.title}`}
                          disabled={index > currentStep + 1}
                        >
                          <div className="flex items-center gap-2 text-sm font-medium">
                            {stepComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                            ) : (
                              <span className="text-xs text-text-tertiary">{index + 1}</span>
                            )}
                            <span className="truncate">{step.title}</span>
                          </div>
                          <p className="text-xs text-text-tertiary mt-1 line-clamp-2">{step.subtitle}</p>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {renderCurrentStep()}

              <div className="sticky bottom-4 z-10">
                <div className="bg-bg-secondary/95 border border-border-light rounded-base px-4 py-3 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
                {stepError && (
                  <p className="text-error text-sm flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {stepError}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 md:ml-auto">
                  <button
                    type="button"
                    onClick={() => router.push('/requests')}
                    className={outlineButtonClass}
                  >
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                    Cancel
                  </button>

                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className={outlineButtonClass}
                    >
                      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                      Back
                    </button>
                  )}

                  {currentStep < formSteps.length - 1 && (
                    <button
                      type="button"
                      onClick={handleContinue}
                      className={primaryButtonClass}
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}

                  {currentStep === formSteps.length - 1 && (
                    <button
                      type="submit"
                      disabled={isSubmitDisabled}
                      className={primaryButtonClass}
                    >
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

          <aside className="space-y-6 xl:sticky xl:top-10">
            <div className={compactCardClass}>
              <p className="text-xs uppercase tracking-[0.4em] text-text-tertiary font-semibold mb-3">
                Live summary
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                Provider snapshot
              </h3>
              <div className="rounded-base border border-border-light bg-bg-secondary p-4 text-sm leading-relaxed whitespace-pre-line text-text-secondary min-h-[220px]">
                {composedDescription || 'Your live brief will appear here as you fill in the form.'}
              </div>
              <p className="mt-4 text-xs text-text-tertiary">
                Providers receive this snapshot in their marketplace feed before choosing to respond.
              </p>
            </div>

            <div className={compactCardClass}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Quality checklist</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                {checklistItems.map((item) => (
                  <li key={item.id} className="flex items-start gap-3">
                    {item.complete ? (
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-text-tertiary mt-0.5" aria-hidden="true" />
                    )}
                    <span className={item.complete ? 'text-text-primary' : 'text-text-secondary'}>
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
              >
                Review from the top
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


