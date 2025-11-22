'use client';

import {
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api, type Request, type User } from '@visaontrack/client';

import type {
  BudgetPreset,
  DocumentStatus,
  FormErrors,
  FormField,
  FormState,
  TimelineShortcut,
} from '@/app/requests/new/types';
import {
  assistanceNeeds,
  documentChecklist,
  formSteps,
  timelineShortcuts,
  missionVisaOptions,
} from '@/config/requestForm';
import {
  computeFormErrors,
  createInitialDocumentState,
  createInitialFormState,
  createInitialTouchedState,
  createTitleFromVisa,
  formatDateDisplay,
  getDefaultReadiness,
  getErrorForField,
  resolveLocationLabel,
  resolveVisaLabel,
  stepFieldMap,
} from '@/lib/requestForm';

interface RequestFormContextValue {
  isCheckingAuth: boolean;
  formState: FormState;
  touchedFields: Record<FormField, boolean>;
  formErrors: FormErrors;
  selectedNeeds: string[];
  documentStatuses: Record<string, DocumentStatus>;
  readinessStatus: Record<string, DocumentStatus>;
  readinessItems: ReturnType<typeof getDefaultReadiness>;
  currentStep: number;
  stepError: string | null;
  submitError: string | null;
  isSubmitting: boolean;
  createdRequest: Request | null;
  redirectCountdown: number;
  focusedField: FormField | null;
  hasCustomTitle: boolean;
  timelineShortcuts: TimelineShortcut[];
  progressPercentage: number;
  documentReadyCount: number;
  documentHelpCount: number;
  readinessReadyCount: number;
  readinessHelpCount: number;
  isSubmitDisabled: boolean;
  composedDescription: string;
  stepButtonRefs: React.MutableRefObject<Array<HTMLButtonElement | null>>;
  isLocationSelectOpen: boolean;
  setIsLocationSelectOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  isPreFilledFromEligibility: boolean;

  updateField: (field: FormField, value: string) => void;
  markFieldTouched: (field: FormField) => void;
  markFieldsTouched: (fields: FormField[]) => void;
  handleAgeRangeSelect: (value: string) => void;
  handleResidencySelect: (value: string) => void;
  handleNationalitySelect: (value: string) => void;
  handleVisaSelect: (value: string) => void;
  handleLocationSelect: (value: string) => void;
  handleBudgetPreset: (preset: BudgetPreset) => void;
  handleTimelineShortcut: (value: string) => void;
  toggleNeed: (need: string) => void;
  setDocumentStatus: (key: string, status: DocumentStatus) => void;
  handleReadinessStatus: (key: string, status: DocumentStatus) => void;
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: (event: React.FormEvent) => Promise<void>;
  handleStepIndicatorClick: (index: number) => void;
  handleStepSwipeStart: (event: React.TouchEvent) => void;
  handleStepSwipeMove: (event: React.TouchEvent) => void;
  handleStepSwipeEnd: () => void;
  handleStepSwipeCancel: () => void;
  isStepValid: (stepIndex: number, errors?: FormErrors) => boolean;
  resetForm: () => void;
  setStepError: (value: string | null) => void;
  setSubmitError: (value: string | null) => void;
  setFocusedField: (value: FormField | null) => void;
  setHasCustomTitle: (value: boolean) => void;
  renderValidationFeedback: (field: FormField, fallbackSuccess?: string) => React.ReactNode;
  getInputClasses: (field: FormField) => string;
  formatDateDisplay: (value: string) => string;
  isLocationSelectOpen: boolean;
  setIsLocationSelectOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
}

const RequestFormContext = createContext<RequestFormContextValue | null>(null);

export const RequestFormProvider = ({ children }: { children: React.ReactNode }) => {
  const value = useRequestFormController();
  return <RequestFormContext.Provider value={value}>{children}</RequestFormContext.Provider>;
};

export const useRequestForm = () => {
  const context = useContext(RequestFormContext);
  if (!context) {
    throw new Error('useRequestForm must be used within a RequestFormProvider');
  }
  return context;
};

const defaultSelectedNeeds = assistanceNeeds.length ? [assistanceNeeds[0]] : [];

let cachedUser: User | null = null;

const useRequestFormController = (): RequestFormContextValue => {
  // TODO: Cover the happy-path and validation edge cases with Playwright once the seeker E2E suite is restored.
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isPreFilledFromEligibility, setIsPreFilledFromEligibility] = useState(false);
  const [formState, setFormState] = useState<FormState>(() => createInitialFormState());
  const [touchedFields, setTouchedFields] = useState<Record<FormField, boolean>>(() =>
    createInitialTouchedState(),
  );
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(defaultSelectedNeeds);
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentStatus>>(() =>
    createInitialDocumentState(),
  );
  const [readinessStatus, setReadinessStatus] = useState<Record<string, DocumentStatus>>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<Request | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchCurrentXRef = useRef<number | null>(null);
  const [focusedField, setFocusedField] = useState<FormField | null>(null);
  const [hasCustomTitle, setHasCustomTitle] = useState(false);
  const stepButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [isLocationSelectOpen, setIsLocationSelectOpen] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = cachedUser ?? (await api.users.getCurrentUser());
        cachedUser = user;

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

  // Pre-fill form from eligibility data (after auth check)
  useEffect(() => {
    if (isCheckingAuth) return;

    const eligibility = searchParams.get('eligibility');
    if (eligibility !== 'true') return;

    setIsPreFilledFromEligibility(true);

    // Read and map eligibility data from query params
    const ageRange = searchParams.get('ageRange');
    const nationality = searchParams.get('nationality');
    const visaType = searchParams.get('visaType');
    const currentLocation = searchParams.get('currentLocation');
    const timeline = searchParams.get('timeline');
    const budgetMin = searchParams.get('budgetMin');
    const budgetMax = searchParams.get('budgetMax');

    setFormState((prev) => {
      const updates: Partial<FormState> = {};
      
      if (ageRange && !prev.ageRange) {
        updates.ageRange = ageRange;
      }
      if (nationality && !prev.nationality) {
        updates.nationality = nationality;
      }
      if (visaType && !prev.visaType) {
        updates.visaType = visaType;
      }
      if (currentLocation && !prev.currentLocation) {
        // Map INSIDE_THAILAND/OUTSIDE_THAILAND to IN_THAILAND/OUTSIDE_THAILAND if needed
        if (currentLocation === 'INSIDE_THAILAND') {
          updates.currentLocation = 'IN_THAILAND';
        } else if (currentLocation === 'OUTSIDE_THAILAND') {
          updates.currentLocation = 'OUTSIDE_THAILAND';
        } else {
          updates.currentLocation = currentLocation;
        }
      }
      if (timeline && !prev.timeline) {
        updates.timeline = timeline;
      }
      if (budgetMin && !prev.budgetMin) {
        updates.budgetMin = budgetMin;
      }
      if (budgetMax && !prev.budgetMax) {
        updates.budgetMax = budgetMax;
      }

      // Auto-generate title from visa type if available
      if (updates.visaType && !prev.title) {
        const visaOption = missionVisaOptions.find((opt) => opt.value === updates.visaType);
        if (visaOption) {
          updates.title = `Visa application for ${visaOption.label}`;
        }
      }

      return { ...prev, ...updates };
    });

    // Mark relevant fields as touched so validation feedback shows
    const fieldsToTouch: FormField[] = [];
    if (ageRange) fieldsToTouch.push('ageRange');
    if (nationality) fieldsToTouch.push('nationality');
    if (visaType) fieldsToTouch.push('visaType');
    if (currentLocation) fieldsToTouch.push('currentLocation');
    if (timeline) fieldsToTouch.push('timeline');
    if (budgetMin || budgetMax) {
      fieldsToTouch.push('budgetMin', 'budgetMax');
    }

    if (fieldsToTouch.length > 0) {
      setTouchedFields((prev) => {
        const updated = { ...prev };
        fieldsToTouch.forEach((field) => {
          updated[field] = true;
        });
        return updated;
      });
    }
  }, [isCheckingAuth, searchParams]);

  useEffect(() => {
    setFormState((prev) => {
      if (prev.currentVisaExpiry) {
        return prev;
      }
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Bangkok' });
      const today = formatter.format(now);
      return { ...prev, currentVisaExpiry: today };
    });
  }, []);

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

  const composedDescription = useMemo(() => {
    const sections: string[] = [];

    sections.push(
      [
        `Age Range: ${formState.ageRange || 'Not specified'}`,
        `Nationality: ${formState.nationality || 'Not provided'}`,
        `Current Status: ${
          formState.currentLocation === 'IN_THAILAND'
            ? 'Inside Thailand'
            : formState.currentLocation
            ? 'Outside Thailand'
            : 'Not provided'
        }`,
      ].join(' · '),
    );

    if (formState.currentLocation === 'IN_THAILAND') {
      sections.push(
        [
          `Current Visa: ${formState.currentVisaType || 'Not provided'}`,
          `Visa Expiry: ${formatDateDisplay(formState.currentVisaExpiry)}`,
        ].join(' · '),
      );
    }

    sections.push(
      [
        `Target Visa: ${resolveVisaLabel(formState.visaType) || 'Not specified'}`,
        `Preferred Location: ${resolveLocationLabel(formState.location) || 'Not specified'}`,
        `Budget: ${
          formState.budgetMin && formState.budgetMax
            ? `THB ${formState.budgetMin} - ${formState.budgetMax}`
            : 'Not specified'
        }`,
        `Timeline: ${formState.timeline || 'Not provided'}`,
      ].join(' · '),
    );

    if (selectedNeeds.length) {
      sections.push(`Support Needed:\n${selectedNeeds.map((need) => `- ${need}`).join('\n')}`);
    }

    const documentLines = documentChecklist.map((doc) => {
      const status = documentStatuses[doc.key] ?? 'in-progress';
      const label =
        status === 'ready' ? 'Ready to submit' : status === 'in-progress' ? 'In progress' : 'Need help';
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

  const readinessItems = useMemo(() => getDefaultReadiness(formState.visaType), [formState.visaType]);

  const resetForm = () => {
    setFormState(createInitialFormState());
    setTouchedFields(createInitialTouchedState());
    setSelectedNeeds(defaultSelectedNeeds);
    setDocumentStatuses(createInitialDocumentState());
    setFormErrors({});
    setReadinessStatus({});
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
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need],
    );
  };

  const handleNationalitySelect = (value: string) => {
    updateField('nationality', value);
    markFieldTouched('nationality');
  };

  const setDocumentStatus = (key: string, status: DocumentStatus) => {
    setDocumentStatuses((prev) => ({ ...prev, [key]: status }));
  };

  const handleReadinessStatus = (key: string, status: DocumentStatus) => {
    setReadinessStatus((prev) => ({ ...prev, [key]: status }));
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
  };

  const handleBudgetPreset = (preset: BudgetPreset) => {
    updateField('budgetMin', String(preset.min));
    updateField('budgetMax', String(preset.max));
    markFieldTouched('budgetMin');
    markFieldTouched('budgetMax');
  };

  const handleTimelineShortcut = (value: string) => {
    updateField('timeline', value);
    markFieldTouched('timeline');
  };

  const touchAllFields = () => {
    setTouchedFields(
      Object.keys(formState).reduce((acc, key) => {
        acc[key as FormField] = true;
        return acc;
      }, {} as Record<FormField, boolean>),
    );
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
      setStepError('Please finish the highlighted fields to continue.');
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const handleBack = () => {
    setStepError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
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
      setStepError('Please finish the highlighted fields to continue.');
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
        return 'border-primary focus:ring-primary/30 bg-primary/5 text-primary';
      }
    }

    if (state === 'error') {
      return 'border-error focus:ring-error/40';
    }
    if (state === 'success') {
      return 'border-primary focus:ring-primary/30 bg-primary/5 text-primary';
    }
    return 'border-border-light focus:ring-primary/30';
  };

  const renderValidationFeedback = (field: FormField, fallbackSuccess?: string) => {
    if (!touchedFields[field]) {
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

  const documentReadyCount = Object.values(documentStatuses).filter((status) => status === 'ready').length;
  const documentHelpCount = Object.values(documentStatuses).filter((status) => status === 'need-help').length;
  const readinessReadyCount = readinessItems.filter((item) => readinessStatus[item.key] === 'ready').length;
  const readinessHelpCount = readinessItems.filter((item) => readinessStatus[item.key] === 'need-help').length;

  const isSubmitDisabled = isSubmitting || Boolean(createdRequest);
  const progressPercentage = Math.min(((currentStep + 1) / formSteps.length) * 100, 100);

  return {
    isCheckingAuth,
    formState,
    touchedFields,
    formErrors,
    selectedNeeds,
    documentStatuses,
    readinessStatus,
    readinessItems,
    currentStep,
    stepError,
    submitError,
    isSubmitting,
    createdRequest,
    redirectCountdown,
    focusedField,
    hasCustomTitle,
    timelineShortcuts,
    progressPercentage,
    documentReadyCount,
    documentHelpCount,
    readinessReadyCount,
    readinessHelpCount,
    isSubmitDisabled,
    composedDescription,
    stepButtonRefs,
    isLocationSelectOpen,
    setIsLocationSelectOpen,
    isPreFilledFromEligibility,
    updateField,
    markFieldTouched,
    markFieldsTouched,
    handleAgeRangeSelect,
    handleResidencySelect,
    handleNationalitySelect,
    handleVisaSelect,
    handleLocationSelect,
    handleBudgetPreset,
    handleTimelineShortcut,
    toggleNeed,
    setDocumentStatus,
    handleReadinessStatus,
    handleContinue,
    handleBack,
    handleSubmit,
    handleStepIndicatorClick,
    handleStepSwipeStart,
    handleStepSwipeMove,
    handleStepSwipeEnd,
    handleStepSwipeCancel,
    isStepValid,
    resetForm,
    setStepError,
    setSubmitError,
    setFocusedField,
    setHasCustomTitle,
    renderValidationFeedback,
    getInputClasses,
    formatDateDisplay,
  };
};
