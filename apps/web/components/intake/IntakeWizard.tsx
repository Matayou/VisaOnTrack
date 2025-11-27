'use client';

import { useEffect, useMemo, useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import {
  Globe,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Clock,
  Wallet,
  BarChart3,
  Sparkles,
  Info,
  Compass,
  Coffee,
  Building2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { api } from '@visaontrack/client';
import { generateRecommendations, type EligibilityState, type VisaRecommendation } from '@/lib/intake/recommendations';
import { countEligibleVisas, isPurposeDisabled } from '@/lib/intake/eligibilityUtils';
import { 
  estimateBudgetFromSavings, 
  mapEligibilityCodeToVisaType
} from '@/lib/eligibilityMapping';
import { baseCardClass } from '@/app/requests/new/constants';
import { nationalityOptions } from '@/config/requestForm';
import { Button } from '@/components/ui';
import { getErrorDisplayMessage } from '@/lib/error-handling';

// Key for localStorage persistence
const INTAKE_DATA_KEY = 'vot_intake_data';

interface IntakeWizardProps {
  mode: 'public' | 'authenticated';
}

export function IntakeWizard({ mode }: IntakeWizardProps) {
  const router = useRouter();
  const locationSelectId = useId();
  const durationSelectId = useId();
  const incomeSelectId = useId();
  const savingsSelectId = useId();
  const visaExpirationSelectId = useId();
  const visaTypeSelectId = useId();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<EligibilityState>({
    age: '',
    purpose: '',
    nationality: '',
    incomeType: '',
    savings: '',
    location: '',
    duration: '',
    fields: [],
  });
  const [results, setResults] = useState<VisaRecommendation[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Progress calculation
  const progress = (step / 4) * 100;

  // Count eligible visas using shared utility
  const possibleVisasCount = useMemo(() => countEligibleVisas(state), [state]);

  // Generate results when reaching step 3
  useEffect(() => {
    if (step === 3 && results.length === 0) {
      const generated = generateRecommendations(state);
      setResults(generated);
    }
  }, [step, state, results.length]);

  const handleFieldToggle = (field: string) => {
    setState((prev) => ({
      ...prev,
      fields: prev.fields.includes(field) ? prev.fields.filter((f) => f !== field) : [...prev.fields, field],
    }));
  };

  const selectResult = (code: string) => {
    setSelectedCard(code);
  };

  const getVisaAvailabilityMessage = (): { message: string; type: 'info' | 'warning' | 'error' } => {
    if (!state.age || !state.purpose) {
      return { message: '', type: 'info' };
    }

    if (!state.location || !state.savings || !state.incomeType) {
      return { message: 'Complete all fields to see available visas', type: 'info' };
    }
    
    if (possibleVisasCount === 0) {
      return { 
        message: 'No visas match your current selections. Try adjusting your savings, income, or location.', 
        type: 'error' 
      };
    }
    
    if (possibleVisasCount === 1) {
      return { message: `1 visa option available`, type: 'info' };
    }
    
    return { message: `${possibleVisasCount} visa options available`, type: 'info' };
  };

  const handleSubmit = async () => {
    if (!selectedCard) return;

    if (mode === 'public') {
      // Public Mode: Save to LocalStorage and redirect to Register
      const eligibilityData = {
        ...state,
        selectedCode: selectedCard,
      };
      localStorage.setItem(INTAKE_DATA_KEY, JSON.stringify(eligibilityData));
      router.push('/auth/register?from=intake');
    } else {
      // Authenticated Mode: Create request directly via API
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const budget = estimateBudgetFromSavings(state.savings);
        const locationLabel = state.location === 'Inside Thailand' ? 'Inside Thailand' : 'Outside Thailand';
        
        const requestPayload = {
          title: `Visa application for ${mapEligibilityCodeToVisaType(selectedCard)}`,
          description: state.fields?.join(', ') || 'None', // Use simpler description
          visaType: mapEligibilityCodeToVisaType(selectedCard),
          budgetMin: budget.min,
          budgetMax: budget.max,
          location: locationLabel,
          intakeData: state,
        };

        const newRequest = await api.requests.createRequest({
          requestBody: requestPayload,
        });

        router.push(`/requests/${newRequest.id}`);
      } catch (error) {
        console.error('Failed to create request:', error);
        setSubmitError(getErrorDisplayMessage(error, 'create your request'));
        setIsSubmitting(false);
      }
    }
  };

  // Step 1: Age & Purpose
  const Step1 = () => (
    <div className="space-y-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-text-primary mb-2 bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">
          {mode === 'authenticated' ? 'Create a New Request' : "Let's find your perfect visa"}
        </h2>
        <p className="text-text-secondary">Answer a few questions to get personalized recommendations</p>
        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-full"></div>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
            </div>
            Your Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="nationality" className="block text-xs font-medium text-text-secondary">
                Nationality
              </label>
              <select
                id="nationality"
                value={state.nationality}
                onChange={(e) => setState((prev) => ({ ...prev, nationality: e.target.value }))}
                className="w-full h-[48px] px-4 py-3 rounded-base border-2 border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:border-primary hover:border-primary/40 cursor-pointer"
              >
                <option value="">Select nationality</option>
                {nationalityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-medium text-text-secondary">
                Age Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['Under 50', '50+'].map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => {
                      setState((prev) => {
                        const newState = { ...prev, age };
                        if (age !== '50+' && prev.purpose === 'retirement') {
                          newState.purpose = '';
                        }
                        return newState;
                      });
                    }}
                    className={`h-[48px] px-4 py-3 rounded-base border-2 font-medium transition-all duration-200 ${
                      state.age === age
                        ? 'border-primary bg-primary/5 text-primary shadow-xs'
                        : 'border-border-light bg-bg-primary text-text-secondary hover:border-primary/40 hover:text-primary'
                    }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
            Primary Purpose
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { value: 'remote', label: 'Remote Work / Freelance', icon: Globe },
              { value: 'retirement', label: 'Retirement', icon: Coffee },
              { value: 'longstay', label: 'Long Stay', icon: Building2 },
              { value: 'study', label: 'Study / Education', icon: GraduationCap },
              { value: 'family', label: 'Family / Marriage', icon: Users },
              { value: 'premium', label: 'Premium / Convenience', icon: Sparkles },
            ].map(({ value, label, icon: Icon }) => {
              const { disabled, reason } = isPurposeDisabled(value, state.age || '');

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (!disabled) {
                      setState((prev) => ({ ...prev, purpose: value as EligibilityState['purpose'] }));
                    }
                  }}
                  disabled={disabled}
                  title={reason || undefined}
                  className={`flex items-center gap-3 px-4 py-3 rounded-base border-2 font-medium transition-all duration-300 ${
                    disabled
                      ? 'border-border-light bg-bg-secondary text-text-tertiary cursor-not-allowed opacity-50'
                      : state.purpose === value
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md shadow-primary/10'
                      : 'border-border-light bg-bg-primary text-text-secondary hover:border-primary/50 hover:text-primary hover:bg-primary/3'
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${disabled ? 'opacity-50' : ''}`} />
                  <span className="text-left">{label}</span>
                  {disabled && reason && (
                    <span className="ml-auto text-xs text-text-tertiary">({reason})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={() => setStep(2)}
        disabled={!state.nationality || !state.age || !state.purpose}
        fullWidth
        size="lg"
        icon={<ArrowRight className="w-5 h-5" />}
        iconPosition="right"
      >
        Continue to Details
      </Button>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-8">
      <div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1"
        >
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-text-primary mb-2">Tell us more about yourself</h2>
        <p className="text-text-secondary">This helps us find the best visa options for you</p>
      </div>

      <div className="rounded-base border border-border-light bg-white p-4 sm:p-5 shadow-sm space-y-4">
        <div className="space-y-1">
          <label htmlFor={locationSelectId} className="text-xs font-semibold text-text-secondary">
            I am
          </label>
          <select
            id={locationSelectId}
            value={state.location}
            onChange={(e) => {
              setState((prev) => ({ ...prev, location: e.target.value }));
            }}
            className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
          >
            <option value="">Select location</option>
            <option value="Outside Thailand">Outside Thailand</option>
            <option value="Inside Thailand">Inside Thailand</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor={durationSelectId} className="text-xs font-semibold text-text-secondary">
            Planning to stay for
          </label>
          <select
            id={durationSelectId}
            value={state.duration}
            onChange={(e) => {
              setState((prev) => ({ ...prev, duration: e.target.value }));
            }}
            className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
          >
            <option value="">Select duration</option>
            <option value="90_180">3-6 months</option>
            <option value="365">around 1 year</option>
            <option value="365_5y">1-5 years</option>
            <option value="1825_plus">5+ years</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor={incomeSelectId} className="text-xs font-semibold text-text-secondary">
            Income source
          </label>
          <select
            id={incomeSelectId}
            value={state.incomeType}
            onChange={(e) => {
              setState((prev) => ({ ...prev, incomeType: e.target.value }));
            }}
            className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
          >
            <option value="">Select income source</option>
            <option value="Remote/freelance">Remote/freelance work</option>
            <option value="Foreign salary">Foreign salary</option>
            <option value="Pension">Pension</option>
            <option value="Investments">Investments</option>
            <option value="Varies">Varies</option>
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor={savingsSelectId} className="text-xs font-semibold text-text-secondary">
            Savings
          </label>
          <select
            id={savingsSelectId}
            value={state.savings}
            onChange={(e) => {
              setState((prev) => ({ ...prev, savings: e.target.value }));
            }}
            className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
          >
            <option value="">Select savings</option>
            <option value="0_500k">&lt;500k THB</option>
            <option value="500k_800k">500k-800k THB</option>
            <option value="800k_3M">800k-3M THB</option>
            <option value="3M_10M">3M-10M THB</option>
            <option value="10M_plus">&gt;10M THB</option>
          </select>
        </div>

        {state.location === 'Inside Thailand' && ['90_180', '365', '365_5y', '1825_plus'].includes(state.duration) && (
          <>
            <div className="space-y-1">
              <label htmlFor={visaExpirationSelectId} className="text-xs font-semibold text-text-secondary">
                Current visa expires in
              </label>
              <select
                id={visaExpirationSelectId}
                value={state.currentVisaExpiration || ''}
                onChange={(e) => {
                  setState((prev) => ({ ...prev, currentVisaExpiration: e.target.value }));
                }}
                className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
              >
                <option value="">Select timeframe</option>
                <option value="<1month">less than 1 month</option>
                <option value="1-2months">1 to 2 months</option>
                <option value=">2months">more than 2 months</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor={visaTypeSelectId} className="text-xs font-semibold text-text-secondary">
                Current visa type
              </label>
              <select
                id={visaTypeSelectId}
                value={state.currentVisaType || ''}
                onChange={(e) => {
                  setState((prev) => ({ ...prev, currentVisaType: e.target.value }));
                }}
                className="w-full h-[48px] px-4 py-3 rounded-base border border-border-light bg-bg-primary text-text-primary font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 hover:border-primary/40"
              >
                <option value="">Select visa type</option>
                <option value="Tourist Visa (TR)">Tourist Visa (TR)</option>
                <option value="Visa Exemption">Visa Exemption</option>
                <option value="Education Visa (ED)">Education Visa (ED)</option>
                <option value="Non-Immigrant O">Non-Immigrant O (Family/Retirement)</option>
                <option value="Non-Immigrant B">Non-Immigrant B (Business/Work)</option>
                <option value="Elite Visa">Elite Visa</option>
                <option value="Other">Other</option>
                <option value="Not sure">Not sure</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
            <Info className="w-4 h-4 text-primary" />
          </div>
          Additional Context (Optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {['Have dependents', 'Spouse/family in Thailand'].map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => handleFieldToggle(field)}
              className={`px-4 py-2.5 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                state.fields.includes(field)
                  ? 'border-primary bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20'
                  : 'border-border-light bg-bg-primary text-text-secondary hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {state.age && state.purpose && state.location && state.savings && state.incomeType && (
        <div className="mt-6">
          {(() => {
            const { message, type } = getVisaAvailabilityMessage();
            if (!message) return null;
            
            const bgColor = type === 'error' ? 'bg-warning/10 border-warning/30 text-warning' : 
                          type === 'warning' ? 'bg-warning/10 border-warning/30 text-warning' :
                          'bg-primary/10 border-primary/20 text-primary';
            
            return (
              <div className={`${bgColor} rounded-base p-4 border flex items-start gap-3`}>
                <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${type === 'error' ? 'text-warning' : 'text-primary'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{message}</p>
                  {state.purpose === 'family' && !state.fields.includes('Spouse/family in Thailand') && (
                    <p className="text-xs mt-2 opacity-90">
                      💡 Tip: Selecting "Spouse/family in Thailand" above will unlock family visa options
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {(() => {
        const needsVisaExpirationInfo = 
          state.location === 'Inside Thailand' && 
          ['90_180', '365', '365_5y', '1825_plus'].includes(state.duration);
        
        const hasBasicFields = state.age && state.purpose && state.incomeType && state.savings && state.location && state.duration;
        const hasVisaFields = needsVisaExpirationInfo ? (state.currentVisaExpiration && state.currentVisaType) : true;
        const hasAllFields = hasBasicFields && hasVisaFields;

        if (hasAllFields) {
          if (possibleVisasCount === 0) {
            return (
              <div className="text-sm text-text-tertiary text-center">
                <span className="text-warning">⚠️ No visas match your selections. Try adjusting your savings, income, or location.</span>
              </div>
            );
          }

          return (
            <Button
              type="button"
              onClick={() => setStep(3)}
              fullWidth
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
            >
              See My Recommendations
            </Button>
          );
        } else {
          return (
            <div className="text-sm text-text-tertiary text-center">
              <span>✨ Complete all fields to see recommendations</span>
            </div>
          );
        }
      })()}
    </div>
  );

  const Step3 = () => {
    const mainOptions = results.slice(0, 3);
    const moreOptions = results.slice(3);

    return (
      <div className="space-y-8">
        <div>
          <button
            type="button"
            onClick={() => {
              setResults([]);
              setSelectedCard(null);
              setStep(2);
            }}
            className="text-sm text-text-secondary hover:text-text-primary mb-4 flex items-center gap-1"
          >
            ← Back to Questions
          </button>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Your Recommended Visas</h2>
          <p className="text-text-secondary">We found {results.length} visa options that match your profile</p>
        </div>

        <div className="space-y-4">
          {mainOptions.map((option, idx) => {
            const isSelected = selectedCard === option.code;
            const badges = {
              0: { label: 'Recommended', color: 'bg-success/10 text-success border-success/20' },
              1: { label: 'Alternative', color: 'bg-primary/10 text-primary border-primary/20' },
              2: { label: 'Premium', color: 'bg-purple-100 text-purple-700 border-purple-200' },
            };
            const badge = badges[idx as keyof typeof badges] || badges[1];

            return (
              <div
                key={option.code}
                onClick={() => selectResult(option.code)}
                className={`relative ${baseCardClass} p-6 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-2 border-primary shadow-lg shadow-primary/20 bg-gradient-to-br from-primary/5 to-white'
                    : 'border-2 border-border-light hover:border-primary/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-hover to-primary"></div>
                )}
                {/* Selection indicator - checked when selected, unchecked when not */}
                <div className="absolute top-6 right-6 z-10">
                  {isSelected ? (
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  ) : (
                    <div className="w-8 h-8 rounded-full border-2 border-border bg-bg-primary hover:border-primary transition-all duration-150 flex items-center justify-center shadow-sm">
                      {/* Empty circle to show it's unchecked/selectable */}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-text-primary">{option.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border border-border-light text-text-secondary">
                        {option.confidence} confidence
                      </span>
                    </div>
                    <p className="text-text-secondary leading-relaxed">{option.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Wallet className="w-4 h-4 text-text-tertiary" />
                    <span className="font-medium">{option.cost}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Clock className="w-4 h-4 text-text-tertiary" />
                    <span className="font-medium">{option.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <BarChart3 className="w-4 h-4 text-text-tertiary" />
                    <span className="font-medium">{option.difficulty}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <Button
          type="button"
          onClick={() => setStep(4)}
          disabled={!selectedCard}
          fullWidth
          size="lg"
          icon={selectedCard ? <ArrowRight className="w-5 h-5" /> : undefined}
          iconPosition="right"
        >
          {selectedCard ? 'Continue with Selected Visa' : 'Select a visa to continue'}
        </Button>
      </div>
    );
  };

  const Step4 = () => {
    const selected = results.find((r) => r.code === selectedCard);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Perfect! Here's your summary</h2>
          <p className="text-text-secondary">Review your details before proceeding</p>
        </div>

        {selected && (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-base p-6 border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-base flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary">{selected.title}</h3>
                <p className="text-sm text-text-secondary">{selected.badge}</p>
              </div>
            </div>
            <p className="text-text-primary mb-4">{selected.desc}</p>
          </div>
        )}

        <div className={`${baseCardClass} p-6 space-y-4`}>
          <h4 className="font-bold text-text-primary mb-3">Your Profile Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Age Range:</span>
              <span className="font-medium text-text-primary">{state.age}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Purpose:</span>
              <span className="font-medium text-text-primary">{state.purpose}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Current Location:</span>
              <span className="font-medium text-text-primary">{state.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Duration:</span>
              <span className="font-medium text-text-primary">{state.duration}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Income Source:</span>
              <span className="font-medium text-text-primary">{state.incomeType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Savings:</span>
              <span className="font-medium text-text-primary">{state.savings}</span>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="p-4 bg-error/10 text-error rounded-base border border-error/20 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p className="text-sm">{submitError}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button 
            type="button" 
            onClick={() => setStep(3)} 
            variant="outline"
            size="lg"
            className="flex-1"
            disabled={isSubmitting}
          >
            ← Back
          </Button>
          <Button 
            type="button" 
            onClick={handleSubmit}
            size="lg"
            className="flex-1"
            icon={!isSubmitting ? <ArrowRight className="w-5 h-5" /> : undefined}
            iconPosition="right"
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {mode === 'authenticated' ? 'Create Request' : 'Connect with Visa Experts'}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center justify-between gap-4 rounded-base border border-border-light bg-white px-4 py-3 shadow-sm">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-text-secondary whitespace-nowrap min-w-[90px] text-right">
            Step {step} of 4
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${baseCardClass} p-6 sm:p-8 lg:p-10`}>
        {step === 1 && <Step1 />}
        {step === 2 && <Step2 />}
        {step === 3 && <Step3 />}
        {step === 4 && <Step4 />}
      </div>
    </>
  );
}

