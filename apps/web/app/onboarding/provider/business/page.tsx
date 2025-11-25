'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle,
  CheckCircle2,
  Loader,
  Info,
  Phone,
  Globe,
  Lightbulb,
  MapPin,
  MessageCircle,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Briefcase,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Button } from '@/components/ui';
import { baseCardClass } from '@/app/requests/new/constants';
import { LOADING_SAVING } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';

type AutoSaveStatus = 'idle' | 'saving' | 'saved';
type FieldName =
  | 'businessName'
  | 'city'
  | 'languages'
  | 'yearsExperience'
  | 'description'
  | 'phone'
  | 'registrationNumber'
  | 'website';

type FormErrors = Partial<Record<FieldName, string>>;
type TouchedFields = Partial<Record<FieldName, boolean>>;

export default function BusinessDetailsPage() {
  const router = useRouter();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({});
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [city, setCity] = useState('');
  const [timezone] = useState('ICT (UTC+7)'); // Read-only
  const [languages, setLanguages] = useState<string[]>(['en', 'th']); // Pre-selected
  const [yearsExperience, setYearsExperience] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [descriptionLength, setDescriptionLength] = useState(0);
  const [descriptionHint, setDescriptionHint] = useState('Tip: Mention specific visa types you specialize in');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // We don't set full page loading state to avoid flashing, just populate fields if data exists
        const profile = await api.providers.getCurrentProvider();
        
        if (profile) {
          if (profile.businessName) setBusinessName(profile.businessName);
          if (profile.location) setCity(profile.location);
          if (profile.description) setDescription(profile.description);
          if (profile.languages && profile.languages.length > 0) setLanguages(profile.languages);
          
          if (profile.contactPhone) setPhone(profile.contactPhone);
          if (profile.website) setWebsite(profile.website);
          if (profile.yearsExperience !== undefined && profile.yearsExperience !== null) {
             setYearsExperience(profile.yearsExperience.toString());
          }
          
          // Note: Registration number is not in the schema yet, ignoring for now
        }
      } catch (error: any) {
        // Ignore 404 (not found) as it means new profile
        // Ignore 401 (unauthorized) if handled by global interceptors or middleware
        if (error?.status !== 404 && error?.status !== 401) {
          console.error('Failed to fetch provider profile:', error);
        }
      }
    };
    
    fetchProfile();
  }, []);

  // Character counter for description
  useEffect(() => {
    setDescriptionLength(description.length);
    if (description.length === 0) {
      setDescriptionHint('Tip: Mention specific visa types you specialize in');
    } else if (description.length < 100) {
      setDescriptionHint(`Good start! Add ${100 - description.length} more characters for better visibility`);
    } else if (description.length < 200) {
      setDescriptionHint('Great! Detailed descriptions help seekers find you');
    } else {
      setDescriptionHint('Excellent description! This will help you stand out');
    }
  }, [description]);

  // Validation functions
  const validateField = (field: FieldName, value: string | string[] | number): string | null => {
    switch (field) {
      case 'businessName':
        if (!value || (typeof value === 'string' && value.trim().length < 2)) {
          return 'Business name must be at least 2 characters';
        }
        return null;
      case 'city':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please select a city';
        }
        return null;
      case 'languages':
        if (!Array.isArray(value) || value.length === 0) {
          return 'Please select at least one language';
        }
        return null;
      case 'yearsExperience':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter years of experience';
        }
        const numValue = typeof value === 'string' ? parseInt(value, 10) : Array.isArray(value) ? NaN : value;
        if (isNaN(numValue) || numValue < 0 || numValue > 50) {
          return 'Please enter a valid number between 0 and 50';
        }
        return null;
      case 'description':
        if (!value || (typeof value === 'string' && value.trim().length < 100)) {
          return 'Description must be at least 100 characters';
        }
        return null;
      case 'phone':
        if (!value || (typeof value === 'string' && value.trim().length === 0)) {
          return 'Please enter a phone number';
        }
        const phoneDigits = typeof value === 'string' ? value.replace(/\D/g, '') : '';
        if (phoneDigits.length < 9) {
          return 'Please enter a valid Thai phone number';
        }
        return null;
      case 'website':
        // Optional field - only validate if user has entered something
        if (value && typeof value === 'string' && value.trim().length > 0) {
          const urlValue = value.trim();
          
          // Must start with http:// or https://
          if (!/^https?:\/\//i.test(urlValue)) {
            return 'Please enter a valid URL starting with http:// or https://';
          }
          
          // Must have at least a domain name (not just protocol)
          // Pattern: https:// + at least one character that's not a slash
          if (!/^https?:\/\/[^\/\s]+/i.test(urlValue)) {
            return 'Please enter a complete URL with a domain name';
          }
          
          // Use URL constructor for strict validation
          try {
            const url = new URL(urlValue);
            // Ensure it has a valid hostname (not empty, not just dots)
            if (!url.hostname || url.hostname.length < 3 || !url.hostname.includes('.')) {
              return 'Please enter a complete URL with a valid domain name';
            }
            // Ensure hostname doesn't end with a dot
            if (url.hostname.endsWith('.')) {
              return 'Please enter a valid domain name';
            }
          } catch {
            return 'Please enter a valid website URL';
          }
        }
        return null;
      default:
        return null;
    }
  };

  const getFieldValidationState = (field: FieldName): 'error' | 'success' | 'default' => {
    if (!touchedFields[field]) {
      return 'default';
    }
    return formErrors[field] ? 'error' : 'success';
  };

  const getInputClasses = (field: FieldName): string => {
    const state = getFieldValidationState(field);
    if (state === 'error') {
      return 'border-error focus:ring-error/40';
    }
    if (state === 'success') {
      return 'border-primary focus:ring-primary/30 bg-primary/5';
    }
    return 'border-border-light focus:ring-primary/30';
  };

  const renderValidationFeedback = (field: FieldName, fallbackSuccess?: string): React.ReactNode => {
    // Only show feedback if field has been touched (user has interacted with it)
    if (!touchedFields[field]) {
      return null;
    }

    const fieldError = formErrors[field];
    if (fieldError) {
      return (
        <p className="mt-2 text-sm text-error flex items-center gap-2" role="alert">
          <AlertCircle className="w-4 h-4" aria-hidden="true" />
          {fieldError}
        </p>
      );
    }

    // Only show success message if there's no error AND we have a value (for optional fields)
    // For website field, only show success if URL is actually valid
    if (fallbackSuccess) {
      // For website field, check if it's actually valid before showing success
      if (field === 'website') {
        const websiteValue = typeof website === 'string' ? website.trim() : '';
        if (websiteValue.length === 0) {
          return null; // Don't show success for empty optional field
        }
        // Double-check validation before showing success
        const validationError = validateField('website', websiteValue);
        if (validationError) {
          return null; // Don't show success if there's actually an error
        }
      }
      
      return (
        <p className="mt-2 text-sm text-success flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          {fallbackSuccess}
        </p>
      );
    }

    return null;
  };

  const markFieldTouched = (field: FieldName) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const validateAndSetError = (field: FieldName, value: string | string[] | number) => {
    const error = validateField(field, value);
    setFormErrors((prev) => {
      if (error) {
        return { ...prev, [field]: error };
      }
      const { [field]: _, ...rest } = prev;
      return rest;
    });
    return error === null;
  };

  // Auto-save functionality
  const triggerAutoSave = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setAutoSaveStatus('saving');

    autoSaveTimeoutRef.current = setTimeout(async () => {
      try {
        // TODO: Call API to save draft (when backend is ready)
        // For now, just simulate save
        await new Promise((resolve) => setTimeout(resolve, 800));
        setAutoSaveStatus('saved');

        // Hide after 2 seconds
        setTimeout(() => {
          setAutoSaveStatus('idle');
        }, 2000);
      } catch {
        setAutoSaveStatus('idle');
      }
    }, 800);
  };

  // Phone number formatting
  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.startsWith('0')) {
      if (digits.length <= 2) return digits;
      if (digits.length <= 5) return `${digits.slice(0, 2)}-${digits.slice(2)}`;
      return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5, 9)}`;
    }
    return digits;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setPhone(formatted);
    markFieldTouched('phone');
    validateAndSetError('phone', formatted);
    triggerAutoSave();
  };


  const handleShowExample = () => {
    const example =
      "We specialize in marriage visas, retirement visas, and business visas for Thailand. With 10+ years of experience and a 98% success rate, we&rsquo;ve helped over 500 families successfully navigate the Thai immigration process. Our team speaks English, Thai, and Chinese fluently.";
    setDescription(example);
    triggerAutoSave();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    // Mark all required fields as touched
    const requiredFields: FieldName[] = ['businessName', 'city', 'languages', 'yearsExperience', 'description', 'phone'];
    requiredFields.forEach((field) => markFieldTouched(field));
    
    // Validate all fields
    const validationResults = requiredFields.map((field) => {
      let value: string | string[] | number;
      switch (field) {
        case 'businessName':
          value = businessName;
          break;
        case 'city':
          value = city;
          break;
        case 'languages':
          value = languages;
          break;
        case 'yearsExperience':
          value = yearsExperience;
          break;
        case 'description':
          value = description;
          break;
        case 'phone':
          value = phone;
          break;
        default:
          value = '';
      }
      return validateAndSetError(field, value);
    });
    
    // If any validation fails, stop submission
    if (!validationResults.every((result) => result)) {
      setError('Please fix the errors in the form before continuing.');
      return;
    }
    
    setIsLoading(true);

    try {
      console.log('[BusinessDetailsPage] Submitting provider profile:', {
        businessName,
        description,
        location: city,
        languages,
        website,
        contactPhone: phone,
        yearsExperience,
      });
      
      const updateData = {
        businessName,
        description: description || null,
        location: city || null,
        languages: languages.length > 0 ? languages : undefined,
        website: website || null,
        contactPhone: phone || null,
        yearsExperience: yearsExperience ? parseInt(yearsExperience, 10) : undefined,
      };

      // Create or update provider profile (backend handles upsert automatically)
      const result = await api.providers.createProvider({
        requestBody: updateData,
      });
      console.log('[BusinessDetailsPage] Provider profile saved successfully:', result);
      router.push('/onboarding/provider/services');
      return;
    } catch (error: unknown) {
      console.error('[BusinessDetailsPage] Provider operation failed:', error);
      setError(getErrorDisplayMessage(error, 'save business details'));
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: (value: string) => void, field?: FieldName) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setter(value);
      // Only clear errors on change, don't validate until blur
      // This allows users to type freely without seeing errors mid-typing
      if (field && touchedFields[field] && formErrors[field]) {
        // Clear error if field was previously in error state and user is typing
        const error = validateField(field, value);
        if (!error) {
          setFormErrors((prev) => {
            const { [field]: _, ...rest } = prev;
            return rest;
          });
        }
      }
      triggerAutoSave();
    };
  };

  const handleBlur = (field: FieldName, value: string | string[] | number) => {
    markFieldTouched(field);
    validateAndSetError(field, value);
  };

  const providerSteps = [
    {
      id: 'business',
      title: 'Business',
      subtitle: 'Company details, location, languages, and expertise. Help seekers find and trust your business.',
    },
    {
      id: 'services',
      title: 'Services',
      subtitle: 'Define your service packages with pricing, deliverables, and timelines. What you offer to visa seekers.',
    },
    {
      id: 'credentials',
      title: 'Credentials',
      subtitle: 'Upload licenses, certifications, and verification documents. Build trust with proof of qualifications.',
    },
    {
      id: 'payouts',
      title: 'Payouts',
      subtitle: 'Connect your Stripe account to receive payments securely. Set up your payment method for earnings.',
    },
  ];

  const currentStepIndex = 0; // Business is step 1
  const progressPercentage = ((currentStepIndex + 1) / providerSteps.length) * 100;

  return (
    <div className="min-h-screen bg-bg-secondary">
      <ProviderHeader />
      <div className="p-6 lg:p-10 relative">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className={`${baseCardClass} px-6 py-8 md:px-10 md:py-10`}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:items-center">
              {/* Left Column: Heading & Description */}
              <div className="space-y-5">
                <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                  Provider onboarding
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-semibold leading-[1.15] tracking-tight text-text-primary">
                  Set up your provider profile
                </h1>
                <p className="text-text-secondary text-base md:text-lg leading-relaxed max-w-xl">
                  Complete your business details to start receiving requests from visa seekers. Your profile helps seekers find and trust you.
                </p>
              </div>

              {/* Right Column: Feature List */}
              <div className="lg:pl-6 lg:border-l lg:border-border-light">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      Verified providers get priority in search results.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      Complete profiles receive more requests from seekers.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <span className="text-sm text-text-secondary leading-relaxed">
                      All changes are saved automatically as you type.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className={`${baseCardClass} p-6 md:p-8 space-y-6`}>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-text-tertiary font-semibold">
                  Step {currentStepIndex + 1} of {providerSteps.length}
                </p>
                <h2 className="text-2xl font-semibold text-text-primary">Business Details</h2>
                <p className="text-sm text-text-secondary">Tell us about your business and expertise</p>
              </div>
              <div className="h-2 w-full bg-border/30 rounded-full overflow-hidden" aria-hidden="true">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercentage}%` }} />
              </div>
              <ol
                className="no-scrollbar flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible sm:snap-none"
                aria-label="Provider onboarding progress"
              >
                {providerSteps.map((step, index) => {
                  const stepComplete = index < currentStepIndex;
                  const isActive = index === currentStepIndex;
                  return (
                    <li key={step.id} className="snap-center flex-shrink-0 min-w-[72vw] sm:min-w-0 sm:w-auto">
                      <div
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-xs sm:text-sm ${
                          isActive
                            ? 'border-primary bg-primary/5 text-text-primary shadow-sm'
                            : stepComplete
                            ? 'border-success/50 bg-success/5 text-text-secondary'
                            : 'border-border-light bg-bg-secondary/60 text-text-tertiary'
                        }`}
                        aria-current={isActive ? 'step' : undefined}
                      >
                        <div className="flex items-center gap-2 font-semibold text-text-primary">
                          {stepComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                          ) : (
                            <span className="text-xs text-text-tertiary">{index + 1}</span>
                          )}
                          <span className="truncate">{step.title}</span>
                        </div>
                        <p className="text-[0.7rem] text-text-tertiary mt-1 line-clamp-3 leading-relaxed">{step.subtitle}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* Form Content */}
            <section className={`${baseCardClass} p-6 md:p-8 space-y-8`}>
              {/* Auto-save indicator */}
              <div
                aria-live="polite"
                aria-atomic="true"
                className={`inline-flex items-center gap-2 text-xs transition-opacity duration-150 ${
                  autoSaveStatus === 'idle' ? 'opacity-0' : 'opacity-100'
                } ${
                  autoSaveStatus === 'saving'
                    ? 'text-primary'
                    : autoSaveStatus === 'saved'
                    ? 'text-success'
                    : 'text-text-tertiary'
                }`}
              >
                {autoSaveStatus === 'saving' ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    <span>{LOADING_SAVING}</span>
                  </>
                ) : autoSaveStatus === 'saved' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>All changes saved</span>
                  </>
                ) : null}
              </div>

              {/* Error Message */}
              {error && (
                <div role="alert" className="text-sm text-error flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {error}
                </div>
              )}

              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white flex-shrink-0">
                    <Briefcase className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Basic Information</h2>
                    <p className="text-sm text-text-secondary">Help seekers find you with accurate business details</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="businessName" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                      Business Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      value={businessName}
                      onChange={handleInputChange(setBusinessName, 'businessName')}
                      onBlur={() => handleBlur('businessName', businessName)}
                      className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('businessName')}`}
                      placeholder="Immigration Services Co., Ltd."
                      required
                    />
                    <span className="text-xs text-text-tertiary">This will be visible on your public profile</span>
                    {renderValidationFeedback('businessName', 'Business name looks good.')}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="registrationNumber" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-text-tertiary/30" aria-hidden="true" />
                      Registration Number
                    </label>
                    <input
                      type="text"
                      id="registrationNumber"
                      value={registrationNumber}
                      onChange={handleInputChange(setRegistrationNumber)}
                      className="w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="0105563123456"
                    />
                    <span className="text-xs text-text-tertiary">Thai business registration number</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white flex-shrink-0">
                    <MapPin className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Location</h2>
                    <p className="text-sm text-text-secondary">Where your business is located</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="city" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                      City <span className="text-error">*</span>
                    </label>
                    <select
                      id="city"
                      value={city}
                      onChange={handleInputChange(setCity, 'city')}
                      onBlur={() => handleBlur('city', city)}
                      className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('city')}`}
                      required
                    >
                      <option value="">Select city</option>
                      <option value="bangkok">Bangkok</option>
                      <option value="chiang-mai">Chiang Mai</option>
                      <option value="chiang-rai">Chiang Rai</option>
                      <option value="phuket">Phuket</option>
                      <option value="pattaya">Pattaya</option>
                      <option value="other">Other</option>
                    </select>
                    <span className="text-xs text-text-tertiary">All providers must be based in Thailand</span>
                    {renderValidationFeedback('city', 'Location selected.')}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="timezone" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-text-tertiary/30" aria-hidden="true" />
                      Timezone
                    </label>
                    <input
                      type="text"
                      id="timezone"
                      value={timezone}
                      readOnly
                      disabled
                      className="w-full h-12 px-4 text-base font-sans text-text-tertiary border border-border-light rounded-base bg-bg-tertiary cursor-not-allowed"
                    />
                    <span className="text-xs text-text-tertiary">Thailand timezone (Indochina Time)</span>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white flex-shrink-0">
                    <Award className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">Expertise</h2>
                    <p className="text-sm text-text-secondary">Your experience and language capabilities</p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <label id="languages-label" htmlFor="languages" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                      Languages Spoken <span className="text-error">*</span>
                    </label>
                    <p className="text-xs text-text-tertiary">Click to select all languages you can communicate in with clients</p>
                    <div 
                      role="group" 
                      aria-labelledby="languages-label"
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5"
                    >
                      {[
                        { value: 'en', label: 'English', flag: '🇬🇧' },
                        { value: 'th', label: 'Thai', flag: '🇹🇭' },
                        { value: 'zh', label: 'Chinese (Mandarin)', flag: '🇨🇳' },
                        { value: 'zh-yue', label: 'Chinese (Cantonese)', flag: '🇭🇰' },
                        { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
                        { value: 'ko', label: 'Korean', flag: '🇰🇷' },
                        { value: 'es', label: 'Spanish', flag: '🇪🇸' },
                        { value: 'fr', label: 'French', flag: '🇫🇷' },
                        { value: 'de', label: 'German', flag: '🇩🇪' },
                        { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
                      ].map((lang) => {
                        const isSelected = languages.includes(lang.value);
                        return (
                          <button
                            key={lang.value}
                            type="button"
                            id={`lang-${lang.value}`}
                            onClick={() => {
                              const newLanguages = isSelected
                                ? languages.filter((l) => l !== lang.value)
                                : [...languages, lang.value];
                              setLanguages(newLanguages);
                              markFieldTouched('languages');
                              validateAndSetError('languages', newLanguages);
                              triggerAutoSave();
                            }}
                            onBlur={() => handleBlur('languages', languages)}
                            className={`group relative flex items-center justify-center gap-2 h-12 px-4 rounded-lg border-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 ${
                              isSelected
                                ? 'border-primary bg-primary text-white shadow-sm hover:border-primary-hover hover:bg-primary-hover'
                                : 'border-border-light text-text-secondary hover:border-primary/60 hover:text-primary bg-bg-primary hover:bg-primary/5'
                            }`}
                            aria-pressed={isSelected}
                            aria-label={`${isSelected ? 'Deselect' : 'Select'} ${lang.label}`}
                          >
                            <span className="text-base leading-none" aria-hidden="true">{lang.flag}</span>
                            <span className="font-medium">{lang.label}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 absolute -top-1.5 -right-1.5 bg-white text-primary rounded-full border-2 border-primary" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-text-tertiary flex items-center gap-1.5">
                        {languages.length > 0 ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-success" aria-hidden="true" />
                            <span className="font-medium text-text-secondary">
                              {languages.length} language{languages.length !== 1 ? 's' : ''} selected
                            </span>
                          </>
                        ) : (
                          <span>Select at least one language</span>
                        )}
                      </p>
                    </div>
                    {renderValidationFeedback('languages', languages.length > 0 ? `${languages.length} language${languages.length !== 1 ? 's' : ''} selected.` : undefined)}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="yearsExperience" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                      <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                      Years of Experience <span className="text-error">*</span>
                    </label>
                    <input
                      type="number"
                      id="yearsExperience"
                      value={yearsExperience}
                      onChange={handleInputChange(setYearsExperience, 'yearsExperience')}
                      onBlur={() => handleBlur('yearsExperience', yearsExperience)}
                      className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('yearsExperience')}`}
                      placeholder="5"
                      min="0"
                      max="50"
                      required
                    />
                    <span className="text-xs text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                      Providers with 5+ years get a &ldquo;Verified Expert&rdquo; badge
                    </span>
                    {renderValidationFeedback('yearsExperience', yearsExperience && parseInt(yearsExperience, 10) >= 5 ? 'You qualify for the Verified Expert badge!' : 'Experience level recorded.')}
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="description" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                        Business Description <span className="text-error">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleShowExample}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleShowExample();
                          }
                        }}
                        aria-label="Show example business description"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-transparent border border-border-light rounded-md text-xs text-text-secondary cursor-pointer transition-all duration-150 hover:bg-bg-secondary hover:border-border-medium hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        <Sparkles className="w-3 h-3" aria-hidden="true" />
                        Show example
                      </button>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={handleInputChange(setDescription, 'description')}
                      onBlur={() => handleBlur('description', description)}
                      className={`w-full min-h-[6rem] px-4 py-3 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 resize-y ${getInputClasses('description')}`}
                      placeholder="Describe your business, expertise, and what makes you unique..."
                      maxLength={500}
                      required
                    />
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-xs flex items-center gap-1.5 ${
                          descriptionLength >= 200
                            ? 'text-success'
                            : descriptionLength >= 100
                            ? 'text-primary'
                            : 'text-text-tertiary'
                        }`}
                      >
                        {descriptionLength >= 200 ? (
                          <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : descriptionLength >= 100 ? (
                          <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        <span>{descriptionHint}</span>
                      </span>
                      <div
                        className={`text-xs text-right transition-colors duration-150 ${
                          descriptionLength > 450 ? 'text-error' : descriptionLength >= 150 ? 'text-success' : 'text-text-tertiary'
                        }`}
                      >
                        {descriptionLength} / 500
                      </div>
                    </div>
                    {renderValidationFeedback('description', descriptionLength >= 200 ? 'Excellent description! This will help you stand out.' : undefined)}
                  </div>
                </div>
              </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-base bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center text-white flex-shrink-0">
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">Contact Information</h2>
                  <p className="text-sm text-text-secondary">How seekers can reach you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <span className="h-3 w-1 rounded-full bg-primary" aria-hidden="true" />
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary pointer-events-none" aria-hidden="true" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onBlur={() => handleBlur('phone', phone)}
                      className={`w-full h-12 pl-11 pr-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('phone')}`}
                      placeholder="02-123-4567"
                      required
                    />
                  </div>
                  <span className="text-xs text-text-tertiary">Thai phone number (auto-formatted)</span>
                  {renderValidationFeedback('phone', 'Phone number looks valid.')}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="website" className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
                    <span className="h-3 w-1 rounded-full bg-text-tertiary/30" aria-hidden="true" />
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary pointer-events-none" aria-hidden="true" />
                    <input
                      type="url"
                      id="website"
                      value={website}
                      onChange={handleInputChange(setWebsite, 'website')}
                      onBlur={() => handleBlur('website', website)}
                      className={`w-full h-12 pl-11 pr-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:outline-none focus:ring-2 ${getInputClasses('website')}`}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <span className="text-xs text-text-tertiary">Optional: Your business website</span>
                  {renderValidationFeedback('website', website.trim().length > 0 ? 'Website URL looks valid.' : undefined)}
                </div>
              </div>
            </div>
            </section>

            <div className="sticky bottom-4 z-10">
              <div className="bg-bg-primary/95 border border-border-light rounded-base px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm backdrop-blur">
                {error && (
                  <p className="text-error text-sm flex items-center gap-2" role="alert">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    {error}
                  </p>
                )}
                <div className="flex flex-wrap gap-3 md:ml-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/onboarding/provider/welcome')}
                    icon={<ArrowLeft className="w-4 h-4" aria-hidden="true" />}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                    iconPosition="right"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
