'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, type Request, type RequestStatus } from '@visaontrack/client';
import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader,
  LogOut,
  MapPin,
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

interface FormErrors {
  title?: string;
  summary?: string;
  visaType?: string;
  location?: string;
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

const timelineSuggestions = [
  'Need to submit within 2 weeks',
  'Target approval within 1-2 months',
  'Planning 3+ months ahead',
  'Flexible timeline, need guidance',
];

const budgetPresets = [
  { label: 'THB 5k - 10k', min: 5000, max: 10000 },
  { label: 'THB 10k - 20k', min: 10000, max: 20000 },
  { label: 'THB 20k - 35k', min: 20000, max: 35000 },
  { label: 'THB 35k+', min: 35000, max: 60000 },
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

const REQUEST_STATUS_OPEN: RequestStatus = 'OPEN';

export default function CreateRequestPage() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formState, setFormState] = useState<FormState>(() => createInitialFormState());
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>(['Visa strategy & eligibility']);
  const [documentStatuses, setDocumentStatuses] = useState<Record<string, DocumentStatus>>(
    () => createInitialDocumentState(),
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] = useState<Request | null>(null);

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
      } catch (err: any) {
        if (err?.status === 401) {
          router.push('/auth/login');
          return;
        }
        console.error('[CreateRequestPage] Error checking auth:', err);
        router.push('/auth/login');
      }
    };

    checkAuth();
  }, [router]);

  const resetForm = () => {
    setFormState(createInitialFormState());
    setSelectedNeeds(['Visa strategy & eligibility']);
    setDocumentStatuses(createInitialDocumentState());
    setFormErrors({});
    setSubmitError(null);
    setCreatedRequest(null);
  };

  const updateField = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const toggleNeed = (need: string) => {
    setSelectedNeeds((prev) =>
      prev.includes(need) ? prev.filter((item) => item !== need) : [...prev, need],
    );
  };

  const setDocumentStatus = (key: string, status: DocumentStatus) => {
    setDocumentStatuses((prev) => ({ ...prev, [key]: status }));
  };

  const composedDescription = useMemo(() => {
    const sections: string[] = [];

    if (formState.summary.trim()) {
      sections.push(`Overview:
${formState.summary.trim()}`);
    }

    if (selectedNeeds.length) {
      sections.push(`Support Needed:
${selectedNeeds.map((need) => `- ${need}`).join('\n')}`);
    }

    if (formState.timeline.trim()) {
      sections.push(`Timeline:
${formState.timeline.trim()}`);
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
      sections.push(`Document Readiness:
${documentLines.join('\n')}`);
    }

    if (formState.additionalNotes.trim()) {
      sections.push(`Notes:
${formState.additionalNotes.trim()}`);
    }

    return sections.join('\n\n').trim();
  }, [
    documentStatuses,
    formState.additionalNotes,
    formState.summary,
    formState.timeline,
    selectedNeeds,
  ]);
  const validateForm = () => {
    const errors: FormErrors = {};

    if (!formState.title.trim() || formState.title.trim().length < 6) {
      errors.title = 'Give your request a descriptive title (min 6 characters).';
    }

    if (!formState.summary.trim() || formState.summary.trim().length < 40) {
      errors.summary = 'Describe your situation in at least 40 characters.';
    }

    if (!formState.visaType) {
      errors.visaType = 'Select the visa type you are pursuing.';
    }

    if (!formState.location) {
      errors.location = 'Choose where this visa will be processed.';
    } else if (formState.location === 'OTHER' && !formState.locationDetail.trim()) {
      errors.location = 'Share the city or embassy you will work with.';
    }

    const min = formState.budgetMin ? Number(formState.budgetMin) : NaN;
    const max = formState.budgetMax ? Number(formState.budgetMax) : NaN;

    if (!formState.budgetMin || !formState.budgetMax) {
      errors.budget = 'Provide a budget range so providers can qualify themselves.';
    } else if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0) {
      errors.budget = 'Budget values must be valid positive numbers.';
    } else if (min > max) {
      errors.budget = 'Minimum budget cannot exceed the maximum.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resolveLocationLabel = (value: string) => {
    const option = locationOptions.find((item) => item.value === value);
    return option ? option.label : value;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitError(null);
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
    } catch (err: any) {
      console.error('[CreateRequestPage] Error creating request:', {
        status: err?.status,
        body: err?.body,
        message: err?.message,
      });

      if (err?.status === 401) {
        setSubmitError('Your session expired. Please sign in again to post a request.');
        router.push('/auth/login');
        return;
      }

      if (err?.status === 429) {
        setSubmitError('You are sending requests too quickly. Please wait a moment and try again.');
      } else if (err?.body?.message) {
        setSubmitError(err.body.message);
      } else {
        setSubmitError('Something went wrong while publishing your request. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Checking your account...</p>
        </div>
      </div>
    );
  }

  const isSubmitDisabled = isSubmitting || Boolean(createdRequest);
  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section className="bg-bg-primary border border-border-light rounded-xl p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white">
            <Sparkles className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
              Step 1
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Share your mission</h2>
            <p className="text-text-secondary">Give providers context before they reply.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-2">
              Request Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formState.title}
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="e.g. LTR visa with dependents arriving Q2 2025"
              className={`w-full rounded-lg border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary transition ${
                formErrors.title ? 'border-error focus:ring-error/60' : 'border-border'
              }`}
              maxLength={200}
            />
            {formErrors.title && <p className="mt-2 text-sm text-error">{formErrors.title}</p>}
          </div>

          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-text-secondary mb-2">
              Situation Overview
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formState.summary}
              onChange={(event) => updateField('summary', event.target.value)}
              placeholder="Explain your current visa status, objectives, dependents, and any constraints providers should know."
              className={`w-full rounded-lg border bg-transparent px-4 py-3 text-base min-h-[160px] focus:outline-none focus:ring-2 focus:ring-primary transition ${
                formErrors.summary ? 'border-error focus:ring-error/60' : 'border-border'
              }`}
              maxLength={5000}
            />
            <div className="mt-2 flex items-center justify-between text-sm text-text-tertiary">
              <span>Help providers understand where you are in the process.</span>
              <span>{formState.summary.length}/5000</span>
            </div>
            {formErrors.summary && <p className="mt-2 text-sm text-error">{formErrors.summary}</p>}
          </div>
        </div>
      </section>
      <section className="bg-bg-primary border border-border-light rounded-xl p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
            <FileText className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
              Step 2
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Visa Intent & Location</h2>
            <p className="text-text-secondary">
              We'll match you with specialists who cover the same visa class and region.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <label htmlFor="visaType" className="block text-sm font-medium text-text-secondary">
              Target visa
            </label>
            <div className={`rounded-lg border ${formErrors.visaType ? 'border-error' : 'border-border'} focus-within:ring-2 focus-within:ring-primary`}>
              <select
                id="visaType"
                name="visaType"
                value={formState.visaType}
                onChange={(event) => updateField('visaType', event.target.value)}
                className="w-full bg-transparent px-4 py-3 focus:outline-none"
              >
                <option value="" disabled>
                  Select a visa type
                </option>
                {visaTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {formErrors.visaType && <p className="text-sm text-error">{formErrors.visaType}</p>}
          </div>

          <div className="space-y-3">
            <label htmlFor="location" className="block text-sm font-medium text-text-secondary">
              Processing location
            </label>
            <div className={`rounded-lg border ${formErrors.location ? 'border-error' : 'border-border'} focus-within:ring-2 focus-within:ring-primary`}>
              <select
                id="location"
                name="location"
                value={formState.location}
                onChange={(event) => updateField('location', event.target.value)}
                className="w-full bg-transparent px-4 py-3 focus:outline-none"
              >
                <option value="" disabled>
                  Where will you apply?
                </option>
                {locationOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              type="text"
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-primary transition"
              placeholder={
                formState.location === 'OTHER' || formState.location === 'ABROAD'
                  ? 'Share the embassy or province'
                  : 'Neighborhood / province / embassy preference (optional)'
              }
              value={formState.locationDetail}
              onChange={(event) => updateField('locationDetail', event.target.value)}
            />
            {formErrors.location && <p className="text-sm text-error">{formErrors.location}</p>}
          </div>
        </div>
      </section>
      <section className="bg-bg-primary border border-border-light rounded-xl p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
            <Wallet className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
              Step 3
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">Budget & timing</h2>
            <p className="text-text-secondary">
              Transparent ranges help providers respond with accurate quotes.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-text-secondary">Budget range (THB)</label>
              <span className="text-xs text-text-tertiary uppercase tracking-wide">Private</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="budgetMin" className="sr-only">
                  Minimum budget
                </label>
                <div className={`flex items-center gap-2 rounded-lg border bg-transparent px-4 py-3 ${formErrors.budget ? 'border-error' : 'border-border'}`}>
                  <span className="text-text-tertiary text-sm">Min</span>
                  <input
                    id="budgetMin"
                    name="budgetMin"
                    type="number"
                    min={0}
                    step={500}
                    value={formState.budgetMin}
                    onChange={(event) => updateField('budgetMin', event.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="10,000"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="budgetMax" className="sr-only">
                  Maximum budget
                </label>
                <div className={`flex items-center gap-2 rounded-lg border bg-transparent px-4 py-3 ${formErrors.budget ? 'border-error' : 'border-border'}`}>
                  <span className="text-text-tertiary text-sm">Max</span>
                  <input
                    id="budgetMax"
                    name="budgetMax"
                    type="number"
                    min={0}
                    step={500}
                    value={formState.budgetMax}
                    onChange={(event) => updateField('budgetMax', event.target.value)}
                    className="w-full bg-transparent focus:outline-none"
                    placeholder="25,000"
                  />
                </div>
              </div>
            </div>
            {formErrors.budget && <p className="mt-2 text-sm text-error">{formErrors.budget}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {budgetPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="px-3 py-1.5 rounded-full border border-border text-sm text-text-secondary hover:border-primary hover:text-primary transition"
                  onClick={() => {
                    updateField('budgetMin', String(preset.min));
                    updateField('budgetMax', String(preset.max));
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="timeline" className="block text-sm font-medium text-text-secondary mb-3">
              Ideal submission timeline
            </label>
            <div className="rounded-lg border border-border bg-transparent px-4 py-3 flex gap-3 items-center">
              <Calendar className="w-5 h-5 text-text-tertiary" aria-hidden="true" />
              <input
                id="timeline"
                name="timeline"
                type="text"
                value={formState.timeline}
                onChange={(event) => updateField('timeline', event.target.value)}
                placeholder="e.g. Need visa stamped before 30 April 2025"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {timelineSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  className="px-3 py-1.5 rounded-full border border-border text-xs text-text-tertiary hover:border-primary hover:text-primary transition"
                  onClick={() => updateField('timeline', suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-bg-primary border border-border-light rounded-xl p-8 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white">
            <Shield className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-text-tertiary font-semibold">
              Step 4
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">How can experts help?</h2>
            <p className="text-text-secondary">
              Highlight the exact touchpoints you expect support on.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-text-tertiary font-semibold mb-3">
              Assistance areas
            </p>
            <div className="flex flex-wrap gap-3">
              {assistanceNeeds.map((need) => {
                const isSelected = selectedNeeds.includes(need);
                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleNeed(need)}
                    className={`px-4 py-2 rounded-full border text-sm transition flex items-center gap-2 ${
                      isSelected
                        ? 'border-primary bg-primary/10 text-primary shadow-[0_4px_12px_rgba(37,99,235,0.15)]'
                        : 'border-border text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {isSelected && <Check className="w-4 h-4" aria-hidden="true" />}
                    {need}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-wide text-text-tertiary font-semibold mb-4">
              Document readiness snapshot
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {documentChecklist.map((doc) => (
                <div key={doc.key} className="rounded-lg border border-border p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.label}</p>
                      <p className="text-sm text-text-tertiary">Tell providers if you need help gathering it.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {(['ready', 'in-progress', 'need-help'] as DocumentStatus[]).map((status) => {
                      const isActive = documentStatuses[doc.key] === status;
                      const badgeLabel =
                        status === 'ready'
                          ? 'Ready'
                          : status === 'in-progress'
                          ? 'In progress'
                          : 'Need help';

                      return (
                        <button
                          key={status}
                          type="button"
                          className={`flex-1 rounded-md border px-3 py-2 text-sm transition ${
                            isActive
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border text-text-tertiary hover:border-primary/40 hover:text-primary'
                          }`}
                          onClick={() => setDocumentStatus(doc.key, status)}
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

          <div>
            <label
              htmlFor="additionalNotes"
              className="block text-sm font-medium text-text-secondary mb-2"
            >
              Anything else we should know?
            </label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formState.additionalNotes}
              onChange={(event) => updateField('additionalNotes', event.target.value)}
              placeholder="Dependent details, recent visa history, employer information, concierge expectations..."
              className="w-full rounded-lg border border-border bg-transparent px-4 py-3 text-base min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary transition"
              maxLength={2000}
            />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {submitError && <p className="text-error text-sm">{submitError}</p>}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:ml-auto">
          <button
            type="button"
            onClick={() => router.push('/requests')}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:border-border-light transition"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" aria-hidden="true" />
                Publishing request...
              </>
            ) : (
              <>
                {createdRequest ? 'Request published' : 'Publish request'}
                {!createdRequest && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
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
        <header className="bg-gradient-to-br from-bg-primary to-bg-primary/70 border border-border-light rounded-2xl px-8 py-10 shadow-[0_25px_60px_rgba(15,23,42,0.15)]">
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
                Every question below mirrors what providers see in the marketplace.
              </p>
            </div>
            <div className="rounded-xl bg-bg-secondary/70 border border-border-light p-5 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
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

        {createdRequest ? (
          <section className="bg-bg-primary border border-border-light rounded-2xl p-10 shadow-[0_25px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-[0.3em] text-text-tertiary font-semibold mb-2">
                  Request published
                </p>
                <h2 className="text-2xl font-semibold tracking-tight mb-3">
                  {createdRequest.title}
                </h2>
                <p className="text-text-secondary mb-6">
                  Your visa request is now in the marketplace. Expect vetted specialists to respond
                  with curated quotes shortly. Keep an eye on your inbox for new messages.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => router.push(`/requests/${createdRequest.id}`)}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    View request details
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/requests')}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-3 text-sm font-semibold text-text-secondary hover:text-text-primary"
                  >
                    Back to requests
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border px-5 py-3 text-sm font-medium text-text-secondary hover:text-text-primary"
                  >
                    Post another request
                  </button>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[3fr_2fr]">
          <div>{renderForm()}</div>

          <aside className="space-y-6 xl:sticky xl:top-10">
            <div className="bg-bg-primary border border-border-light rounded-2xl p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
              <p className="text-xs uppercase tracking-[0.4em] text-text-tertiary font-semibold mb-3">
                Live summary
              </p>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
                Provider snapshot
              </h3>
              <div className="rounded-xl border border-border bg-bg-secondary/40 p-4 text-sm leading-relaxed whitespace-pre-line text-text-secondary min-h-[220px]">
                {composedDescription || 'Your live brief will appear here as you fill in the form.'}
              </div>
              <p className="mt-4 text-xs text-text-tertiary">
                Providers receive this snapshot in their marketplace feed before choosing to respond.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-border-light rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                <h3 className="text-lg font-semibold">Quality checklist</h3>
              </div>
              <ul className="space-y-3 text-sm text-text-secondary">
                <li>- Title clearly states visa type and timing</li>
                <li>- Description covers dependents and current status</li>
                <li>- Budget range reflects service fee expectations</li>
                <li>- Document readiness shows where help is needed</li>
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
