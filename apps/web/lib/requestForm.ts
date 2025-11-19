import type {
  DocumentStatus,
  FormErrors,
  FormField,
  FormState,
} from '@/app/requests/new/types';
import {
  documentChecklist,
  locationOptions,
  missionVisaOptions,
  visaTypeOptions,
} from '@/config/requestForm';
import {
  defaultReadiness,
  visaRequirementsMap,
} from '@/config/visaRequirements';

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

export const stepFieldMap: Record<number, FormField[]> = {
  0: ['ageRange', 'nationality', 'currentLocation', 'currentVisaExpiry', 'currentVisaType'],
  1: ['title', 'visaType', 'location', 'locationDetail'],
  2: ['budgetMin', 'budgetMax'],
  3: ['additionalNotes'],
};

export const createInitialFormState = (): FormState => ({
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

export const createInitialDocumentState = (): Record<string, DocumentStatus> =>
  documentChecklist.reduce<Record<string, DocumentStatus>>((acc, doc) => {
    acc[doc.key] = 'in-progress';
    return acc;
  }, {});

export const createInitialTouchedState = (): Record<FormField, boolean> =>
  Object.keys(createInitialFormState()).reduce(
    (acc, key) => {
      acc[key as FormField] = false;
      return acc;
    },
    {} as Record<FormField, boolean>,
  );

export const computeFormErrors = (state: FormState): FormErrors => {
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

export const getErrorForField = (field: FormField, errors: FormErrors) => {
  if (field === 'budgetMin' || field === 'budgetMax') {
    return errors.budget;
  }

  const key = fieldErrorKeyMap[field as DirectErrorField];
  return key ? errors[key] : undefined;
};

export const formatDateDisplay = (value: string) => {
  if (!value) {
    return 'Pick a date';
  }
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(value));
};

export const resolveVisaLabel = (value: string) => {
  if (!value) {
    return '';
  }
  const configMatch = visaRequirementsMap[value];
  if (configMatch) {
    return configMatch.label;
  }
  const missionMatch = missionVisaOptions.find((option) => option.value === value);
  if (missionMatch) {
    return missionMatch.label;
  }
  const formMatch = visaTypeOptions.find((option) => option.value === value);
  return formMatch ? formMatch.label : value;
};

export const createTitleFromVisa = (value: string) => {
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

export const resolveLocationLabel = (value: string) => {
  const option = locationOptions.find((item) => item.value === value);
  return option ? option.label : value;
};

export const getDefaultReadiness = (visaType: string) => {
  const specific = visaRequirementsMap[visaType]?.readiness ?? [];
  const combined = specific.length ? [...specific, ...defaultReadiness] : defaultReadiness;
  const seen = new Set<string>();
  return combined.filter((item) => {
    if (seen.has(item.key)) {
      return false;
    }
    seen.add(item.key);
    return true;
  });
};
