'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Loader,
  Info,
  Phone,
  Globe,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Check,
  MousePointerClick,
} from 'lucide-react';
import { api } from '@visaontrack/client';

type AutoSaveStatus = 'idle' | 'saving' | 'saved';

export default function BusinessDetailsPage() {
  const router = useRouter();
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<AutoSaveStatus>('idle');

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
  const [showExample, setShowExample] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
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
    triggerAutoSave();
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setLanguages(selected);
    triggerAutoSave();
  };

  const handleShowExample = () => {
    const example =
      "We specialize in marriage visas, retirement visas, and business visas for Thailand. With 10+ years of experience and a 98% success rate, we've helped over 500 families successfully navigate the Thai immigration process. Our team speaks English, Thai, and Chinese fluently.";
    setDescription(example);
    setShowExample(true);
    triggerAutoSave();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      console.log('[BusinessDetailsPage] Submitting provider profile:', {
        businessName,
        description,
        location: city,
        languages,
      });
      
      const result = await api.providers.createProvider({
        requestBody: {
          businessName,
          description: description || null,
          location: city || null,
          languages: languages.length > 0 ? languages : undefined,
        },
      });

      console.log('[BusinessDetailsPage] Provider created successfully:', result);

      router.push('/onboarding/provider/services');
    } catch (err: any) {
      console.error('[BusinessDetailsPage] Provider creation failed:', err);
      
      if (err?.status === 401) {
        setError('You must be logged in to continue. Please sign in.');
      } else if (err?.status === 403) {
        setError('You must have a PROVIDER role to create a provider profile.');
      } else {
        setError(err?.body?.message || 'An error occurred. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter: (value: string) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setter(e.target.value);
      triggerAutoSave();
    };
  };

  return (
    <div className="min-h-screen bg-bg-secondary p-6">
      <div className="max-w-[48rem] mx-auto bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 border-b border-border-light">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1 rounded-sm transition-all duration-150 ${
                  step <= 2 ? 'bg-primary' : 'bg-border-light'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold tracking-tight mb-2">Business Details</h1>
              <p className="text-sm text-text-secondary">Tell us about your business and expertise</p>
            </div>
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
                  <span>Saving...</span>
                </>
              ) : autoSaveStatus === 'saved' ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>All changes saved</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Error Message */}
          {error && (
            <div role="alert" className="mb-6 text-sm text-error flex items-center gap-2">
              <Info className="w-4 h-4" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-6 flex items-center gap-2">
              Basic Information
              <span className="inline-flex items-center px-3 py-1.5 bg-primary/5 border border-primary/10 rounded-md text-xs font-medium text-primary gap-1.5">
                <Info className="w-3.5 h-3.5" aria-hidden="true" />
                Help seekers find you
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="businessName" className="text-sm font-medium flex items-center gap-1">
                  Business Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={handleInputChange(setBusinessName)}
                  className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                  placeholder="Immigration Services Co., Ltd."
                  required
                />
                <span className="text-xs text-text-tertiary">This will be visible on your public profile</span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="registrationNumber" className="text-sm font-medium">
                  Registration Number
                </label>
                <input
                  type="text"
                  id="registrationNumber"
                  value={registrationNumber}
                  onChange={handleInputChange(setRegistrationNumber)}
                  className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                  placeholder="0105563123456"
                />
                <span className="text-xs text-text-tertiary">Thai business registration number</span>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-6">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="city" className="text-sm font-medium flex items-center gap-1">
                  City <span className="text-error">*</span>
                </label>
                <select
                  id="city"
                  value={city}
                  onChange={handleInputChange(setCity)}
                  className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
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
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Timezone
                </label>
                <input
                  type="text"
                  id="timezone"
                  value={timezone}
                  readOnly
                  disabled
                  className="w-full h-11 px-4 text-base font-sans text-bg-tertiary text-text-tertiary border border-border-light rounded-base bg-bg-tertiary"
                />
                <span className="text-xs text-text-tertiary">Thailand timezone (Indochina Time)</span>
              </div>
            </div>
          </div>

          {/* Expertise */}
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-6">Expertise</h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="languages" className="text-sm font-medium flex items-center gap-1">
                  Languages Spoken <span className="text-error">*</span>
                </label>
                <select
                  id="languages"
                  multiple
                  value={languages}
                  onChange={handleLanguageChange}
                  className="w-full min-h-[8rem] px-4 py-2 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  required
                >
                  <option value="en">English</option>
                  <option value="th">Thai</option>
                  <option value="zh">Chinese (Mandarin)</option>
                  <option value="zh-yue">Chinese (Cantonese)</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ar">Arabic</option>
                </select>
                <span className="text-xs text-text-tertiary flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5" aria-hidden="true" />
                  Hold Ctrl/Cmd to select multiple. English & Thai pre-selected.
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="yearsExperience" className="text-sm font-medium flex items-center gap-1">
                  Years of Experience <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  value={yearsExperience}
                  onChange={handleInputChange(setYearsExperience)}
                  className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                  placeholder="5"
                  min="0"
                  max="50"
                  required
                />
                <span className="text-xs text-primary bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                  Providers with 5+ years get a "Verified Expert" badge
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
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
                  onChange={handleInputChange(setDescription)}
                  className="w-full min-h-[6rem] px-4 py-3 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005] resize-y"
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
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-base font-semibold mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="phone" className="text-sm font-medium flex items-center gap-1">
                  Phone Number <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary pointer-events-none" aria-hidden="true" />
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                    placeholder="02-123-4567"
                    required
                  />
                </div>
                <span className="text-xs text-text-tertiary">Thai phone number (auto-formatted)</span>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="website" className="text-sm font-medium">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-tertiary pointer-events-none" aria-hidden="true" />
                  <input
                    type="url"
                    id="website"
                    value={website}
                    onChange={handleInputChange(setWebsite)}
                    className="w-full h-11 pl-11 pr-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.005]"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <span className="text-xs text-text-tertiary">Optional: Your business website</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-border-light flex justify-between gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.back();
                }
              }}
              aria-label="Go back to previous step"
              className="h-11 px-6 text-base font-medium text-text-primary bg-bg-secondary border border-border-light rounded-base cursor-pointer transition-all duration-150 inline-flex items-center gap-2 hover:bg-bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <ArrowLeft className="w-4.5 h-4.5" aria-hidden="true" />
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && !isLoading) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
              aria-label={isLoading ? 'Saving business details' : 'Continue to next step'}
              aria-disabled={isLoading}
              className={`h-11 px-6 text-base font-medium text-white rounded-base cursor-pointer transition-all duration-150 shadow-xs inline-flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isLoading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-primary to-primary-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4.5 h-4.5 animate-spin" aria-hidden="true" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4.5 h-4.5" aria-hidden="true" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

