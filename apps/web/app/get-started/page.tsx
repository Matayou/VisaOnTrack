'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Globe,
  Briefcase,
  GraduationCap,
  Users,
  Home,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  Clock,
  Wallet,
  BarChart3,
  Sparkles,
  Info,
  Compass,
  Menu,
  X,
  Coffee,
  Building2,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { generateRecommendations, type EligibilityState, type VisaRecommendation } from './lib/recommendations';
import { countEligibleVisas, isPurposeDisabled } from './lib/eligibilityUtils';
import { eligibilityToQueryParams } from '@/lib/eligibilityMapping';
import { baseCardClass } from '@/app/requests/new/constants';
import { nationalityOptions } from '@/config/requestForm';
import { Button } from '@/components/ui';

export default function GetStartedPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [allowAutoAdvance, setAllowAutoAdvance] = useState(true);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Progress calculation
  const progress = (step / 4) * 100;

  // Count eligible visas using shared utility
  const possibleVisasCount = useMemo(() => countEligibleVisas(state), [state]);

  // Auto-advance logic for step 2 (with delay to allow optional field interaction)
  useEffect(() => {
    if (step === 2 && allowAutoAdvance) {
      const needsVisaExpirationInfo = 
        state.location === 'Inside Thailand' && 
        ['90_180', '365', '365_5y', '1825_plus'].includes(state.duration);
      
      const hasAll = state.age && state.purpose && state.incomeType && state.savings && state.location && state.duration &&
        (needsVisaExpirationInfo ? (state.currentVisaExpiration && state.currentVisaType) : true);
      
      if (hasAll && possibleVisasCount > 0) {
        // Start countdown from 3 seconds to give users time to interact with optional fields
        setAutoAdvanceCountdown(3);
      } else {
        // Reset countdown if fields become incomplete
        setAutoAdvanceCountdown(null);
      }
    } else {
      setAutoAdvanceCountdown(null);
    }
  }, [state, step, allowAutoAdvance, possibleVisasCount]);

  // Countdown timer effect
  useEffect(() => {
    if (autoAdvanceCountdown === null) return;
    
    if (autoAdvanceCountdown === 0) {
      setStep(3);
      setAutoAdvanceCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setAutoAdvanceCountdown(autoAdvanceCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoAdvanceCountdown]);

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

  // Helper: Get feedback message about available visas
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

  const proceed = () => {
    if (!selectedCard) return;

    const eligibilityData = {
      ...state,
      selectedCode: selectedCard,
    };

    const params = eligibilityToQueryParams(eligibilityData);
    router.push(`/requests/new?${params.toString()}`);
  };

  // Step 1: Age & Purpose
  const Step1 = () => (
    <div className="space-y-8">
      <div className="relative">
        <h2 className="text-3xl font-bold text-text-primary mb-2 bg-gradient-to-r from-text-primary to-primary bg-clip-text text-transparent">
          Let's find your perfect visa
        </h2>
        <p className="text-text-secondary">Answer a few questions to get personalized recommendations</p>
        {/* Decorative accent line */}
        <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-primary to-primary-hover rounded-full"></div>
      </div>

      <div className="space-y-6">
        {/* Nationality and Age Selection - Same Line */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
            </div>
            Your Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Nationality Dropdown */}
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

            {/* Age Selection */}
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
                        // Clear retirement purpose if user changes age to under 50
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

        {/* Purpose Selection */}
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
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md shadow-primary/10 scale-[1.02]'
                      : 'border-border-light bg-bg-primary text-text-secondary hover:border-primary/50 hover:text-primary hover:shadow-sm hover:bg-primary/3'
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

  // Step 2: Detailed Questions (Mad-libs style)
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

      <div className="relative bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 rounded-base p-6 sm:p-8 border-2 border-primary/30 shadow-lg shadow-primary/5 overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}></div>
        </div>
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-primary/10 pointer-events-none"></div>
        <div className="relative text-lg leading-relaxed text-text-primary space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span>I am</span>
            <select
              value={state.location}
              onChange={(e) => {
                setState((prev) => ({ ...prev, location: e.target.value }));
                setAllowAutoAdvance(true);
              }}
              className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="">...</option>
              <option value="Outside Thailand">outside Thailand</option>
              <option value="Inside Thailand">already in Thailand</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>planning to stay for</span>
            <select
              value={state.duration}
              onChange={(e) => {
                setState((prev) => ({ ...prev, duration: e.target.value }));
                setAllowAutoAdvance(true);
              }}
              className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="">...</option>
              <option value="90_180">3-6 months</option>
              <option value="365">around 1 year</option>
              <option value="365_5y">1-5 years</option>
              <option value="1825_plus">5+ years</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>with income from</span>
            <select
              value={state.incomeType}
              onChange={(e) => {
                setState((prev) => ({ ...prev, incomeType: e.target.value }));
                setAllowAutoAdvance(true);
              }}
              className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="">...</option>
              <option value="Remote/freelance">remote/freelance work</option>
              <option value="Foreign salary">foreign salary</option>
              <option value="Pension">pension</option>
              <option value="Investments">investments</option>
              <option value="Varies">varies</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span>and I have savings of</span>
            <select
              value={state.savings}
              onChange={(e) => {
                setState((prev) => ({ ...prev, savings: e.target.value }));
                setAllowAutoAdvance(true);
              }}
              className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
            >
              <option value="">...</option>
              <option value="0_500k">&lt;500k THB</option>
              <option value="500k_800k">500k-800k THB</option>
              <option value="800k_3M">800k-3M THB</option>
              <option value="3M_10M">3M-10M THB</option>
              <option value="10M_plus">&gt;10M THB</option>
            </select>
          </div>

          {/* Conditional: Visa expiration questions for people in Thailand seeking long-term visas (6+ months) */}
          {state.location === 'Inside Thailand' && ['90_180', '365', '365_5y', '1825_plus'].includes(state.duration) && (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span>My current visa expires in</span>
                <select
                  value={state.currentVisaExpiration || ''}
                  onChange={(e) => {
                    setState((prev) => ({ ...prev, currentVisaExpiration: e.target.value }));
                    setAllowAutoAdvance(true);
                  }}
                  className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="">...</option>
                  <option value="<1month">less than 1 month</option>
                  <option value="1-2months">1 to 2 months</option>
                  <option value=">2months">more than 2 months</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span>and I currently have a</span>
                <select
                  value={state.currentVisaType || ''}
                  onChange={(e) => {
                    setState((prev) => ({ ...prev, currentVisaType: e.target.value }));
                    setAllowAutoAdvance(true);
                  }}
                  className="inline-flex px-4 py-2 bg-bg-primary border-2 border-primary/30 rounded-base font-semibold text-primary
                    focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <option value="">...</option>
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
      </div>

      {/* Optional Fields */}
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
                  ? 'border-primary bg-gradient-to-r from-primary to-primary-hover text-white shadow-md shadow-primary/20 scale-105'
                  : 'border-border-light bg-bg-primary text-text-secondary hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm'
              }`}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time visa availability feedback */}
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

      {/* Show manual continue button if auto-advance is disabled, or helpful text if enabled */}
      {(() => {
        const needsVisaExpirationInfo = 
          state.location === 'Inside Thailand' && 
          ['90_180', '365', '365_5y', '1825_plus'].includes(state.duration);
        
        const hasBasicFields = state.age && state.purpose && state.incomeType && state.savings && state.location && state.duration;
        const hasVisaFields = needsVisaExpirationInfo ? (state.currentVisaExpiration && state.currentVisaType) : true;
        const hasAllFields = hasBasicFields && hasVisaFields;

        if (!allowAutoAdvance && hasAllFields) {
          return (
            <Button
              type="button"
              onClick={() => {
                setAllowAutoAdvance(true);
                setStep(3);
              }}
              disabled={possibleVisasCount === 0}
              fullWidth
              size="lg"
              icon={possibleVisasCount > 0 ? <ArrowRight className="w-5 h-5" /> : undefined}
              iconPosition="right"
            >
              {possibleVisasCount === 0 ? 'No visas available - adjust your selections' : 'See My Recommendations'}
            </Button>
          );
        } else if (hasAllFields) {
          if (possibleVisasCount === 0) {
            return (
              <div className="text-sm text-text-tertiary text-center">
                <span className="text-warning">⚠️ No visas match your selections. Try adjusting your savings, income, or location.</span>
              </div>
            );
          }
          
          // Show countdown with action buttons
          if (autoAdvanceCountdown !== null) {
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span>Showing recommendations in {autoAdvanceCountdown} second{autoAdvanceCountdown !== 1 ? 's' : ''}...</span>
                </div>
                <div className="flex gap-3 justify-center">
                  <Button
                    type="button"
                    onClick={() => {
                      setAutoAdvanceCountdown(null);
                      setStep(3);
                    }}
                    size="sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    Show now
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setAutoAdvanceCountdown(null);
                      setAllowAutoAdvance(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Wait, I'm not done
                  </Button>
                </div>
              </div>
            );
          }
          
          return (
            <div className="text-sm text-text-tertiary text-center">
              <span>✨ Recommendations will appear automatically when complete</span>
            </div>
          );
        } else {
          return (
            <div className="text-sm text-text-tertiary text-center">✨ Complete all fields to see recommendations</div>
          );
        }
      })()}
    </div>
  );

  // Step 3: Results
  const Step3 = () => {
    const mainOptions = results.slice(0, 3);
    const moreOptions = results.slice(3);

    // Helper function to format values for display
    const formatValue = (key: string, value: string): string => {
      if (!value) return 'Not specified';
      
      const formatMap: Record<string, Record<string, string>> = {
        nationality: {},
        age: {
          'Under 50': 'Under 50',
          '50+': '50+',
        },
        purpose: {
          'remote': 'Remote Work / Freelance',
          'retirement': 'Retirement',
          'longstay': 'Long Stay',
          'study': 'Study / Education',
          'family': 'Family / Marriage',
          'premium': 'Premium / Convenience',
        },
        location: {
          'Outside Thailand': 'Outside Thailand',
          'Inside Thailand': 'Inside Thailand',
        },
        duration: {
          '90_180': '3-6 months',
          '365': 'Around 1 year',
          '365_5y': '1-5 years',
          '1825_plus': '5+ years',
        },
        incomeType: {
          'Remote/freelance': 'Remote/Freelance Work',
          'Foreign salary': 'Foreign Salary',
          'Pension': 'Pension',
          'Investments': 'Investments',
          'Varies': 'Varies',
        },
        savings: {
          '0_500k': '<500k THB',
          '500k_800k': '500k-800k THB',
          '800k_3M': '800k-3M THB',
          '3M_10M': '3M-10M THB',
          '10M_plus': '>10M THB',
        },
      };

      if (key === 'nationality') {
        const option = nationalityOptions.find((opt) => opt.value === value);
        return option ? option.label : value;
      }

      return formatMap[key]?.[value] || value;
    };

    return (
      <div className="space-y-8">
        <div>
          <button
            type="button"
            onClick={() => {
              setAllowAutoAdvance(false);
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

        {/* Warm Prospect Message */}
        {state.location === 'Inside Thailand' && (
          <div className={`relative ${baseCardClass} p-5 border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/8 shadow-md shadow-primary/10 overflow-hidden`}>
            {/* Decorative accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary-hover"></div>
            <div className="flex items-start gap-3 relative">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
              </div>
              <p className="text-sm text-text-primary leading-relaxed">
                <span className="font-semibold text-primary">Because you're already in Thailand,</span> several long-stay visas may be activated or converted from your current location.
              </p>
            </div>
          </div>
        )}

        {/* Visa Expiration Urgency Warning */}
        {state.currentVisaExpiration && (
          <div className={`${baseCardClass} p-5 border-2 ${
            state.currentVisaExpiration === '<1month' 
              ? 'bg-error/10 border-error/30' 
              : state.currentVisaExpiration === '1-2months'
              ? 'bg-warning/10 border-warning/30'
              : 'bg-success/10 border-success/20'
          }`}>
            <div className="flex items-start gap-3">
              {state.currentVisaExpiration === '<1month' ? (
                <>
                  <AlertTriangle className="w-6 h-6 text-error mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-error mb-2">⚠️ Urgent: Your visa expires in less than 1 month</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      Consider emergency extension options first, or expedited processing visas. Contact immigration immediately to avoid overstay penalties.
                    </p>
                  </div>
                </>
              ) : state.currentVisaExpiration === '1-2months' ? (
                <>
                  <Clock className="w-6 h-6 text-warning mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-warning mb-2">⏰ Time-sensitive: Your visa expires in 1-2 months</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      We recommend starting your application immediately. Processing times vary, so act quickly to ensure a smooth transition.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-6 h-6 text-success mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-bold text-success mb-2">✓ Good timing: You have sufficient time to explore all options</p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      You have plenty of time to research, prepare documents, and choose the best visa for your situation.
                    </p>
                  </div>
                </>
              )}
            </div>
            {state.currentVisaType && (
              <div className="mt-3 pt-3 border-t border-border-light">
                <p className="text-xs text-text-tertiary">
                  Current visa: <span className="font-semibold text-text-secondary">{state.currentVisaType}</span>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Settings Summary */}
        <div className={`relative ${baseCardClass} p-6 border-2 border-primary/30 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 shadow-lg shadow-primary/5 overflow-hidden`}>
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
          <div className="relative flex items-center gap-3 mb-5">
            <div className="p-2 rounded-lg bg-primary/15 border border-primary/25">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Recommendations based on:</h3>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Globe className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Nationality:</span>
                <div className="font-semibold text-text-primary">{formatValue('nationality', state.nationality)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Age:</span>
                <div className="font-semibold text-text-primary">{formatValue('age', state.age)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Briefcase className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Purpose:</span>
                <div className="font-semibold text-text-primary">{formatValue('purpose', state.purpose)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Compass className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Location:</span>
                <div className="font-semibold text-text-primary">{formatValue('location', state.location)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Duration:</span>
                <div className="font-semibold text-text-primary">{formatValue('duration', state.duration)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <Wallet className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Income:</span>
                <div className="font-semibold text-text-primary">{formatValue('incomeType', state.incomeType)}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors">
              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                <BarChart3 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              </div>
              <div>
                <span className="text-text-tertiary text-xs">Savings:</span>
                <div className="font-semibold text-text-primary">{formatValue('savings', state.savings)}</div>
              </div>
            </div>
            {state.fields.length > 0 && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-primary/10 hover:bg-white/70 transition-colors sm:col-span-2 lg:col-span-1">
                <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                  <Users className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                </div>
                <div>
                  <span className="text-text-tertiary text-xs">Additional:</span>
                  <div className="font-semibold text-text-primary">{state.fields.join(', ')}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main recommendations */}
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
                    : 'border-2 border-border-light hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5'
                }`}
              >
                {/* Selected indicator accent */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-hover to-primary"></div>
                )}
                {isSelected && (
                  <div className="absolute top-6 right-6">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                )}

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

                {option.reasons.length > 0 && (
                  <div className="bg-primary/5 rounded-base p-4 border border-primary/10 space-y-2 mb-4">
                    <p className="text-sm font-semibold text-primary flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Why this fits
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      {option.reasons.map((reason) => (
                        <li key={reason} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {option.tradeoffs && option.tradeoffs.length > 0 && (
                  <div className="rounded-base border border-warning/30 bg-warning/10 p-4 space-y-2">
                    <p className="text-sm font-semibold text-warning flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Things to keep in mind
                    </p>
                    <ul className="space-y-2 text-sm text-text-secondary">
                      {option.tradeoffs.map((tradeoff) => (
                        <li key={tradeoff} className="flex items-start gap-3">
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{tradeoff}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* More options */}
        {moreOptions.length > 0 && (
          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => setShowMore(!showMore)}
              variant="outline"
              fullWidth
              icon={<ChevronDown className={`w-5 h-5 transition-transform duration-200 ${showMore ? 'rotate-180' : ''}`} />}
              iconPosition="right"
            >
              {showMore ? 'Hide' : 'Show'} {moreOptions.length} More Options
            </Button>

            {showMore && (
              <div className="space-y-3">
                {moreOptions.map((option) => (
                  <div
                    key={option.code}
                    onClick={() => selectResult(option.code)}
                    className={`${baseCardClass} p-4 cursor-pointer transition-all duration-200 ${
                      selectedCard === option.code ? 'border-primary shadow-sm' : 'hover:border-primary/40 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-text-primary">{option.title}</h4>
                      {selectedCard === option.code && <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />}
                    </div>
                    <p className="text-sm text-text-secondary mb-3">{option.desc}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-text-tertiary mb-2">
                      <span>💰 {option.cost}</span>
                      <span>⏱️ {option.time}</span>
                      <span>📊 {option.difficulty}</span>
                    </div>
                    {option.reasons.length > 0 && (
                      <p className="text-xs text-text-secondary">
                        <span className="font-semibold">Why:</span> {option.reasons.slice(0, 2).join(' • ')}
                      </p>
                    )}
                    {option.tradeoffs && option.tradeoffs.length > 0 && (
                      <p className="text-xs text-warning mt-1">Heads up: {option.tradeoffs[0]}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Proceed button */}
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

  // Step 4: Final Summary
  const Step4 = () => {
    const selected = results.find((r) => r.code === selectedCard);

    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-success to-success/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Perfect! Here's your summary</h2>
          <p className="text-text-secondary">Review your details before proceeding to the full application</p>
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
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-bg-primary rounded-base p-3">
                <Wallet className="w-5 h-5 text-text-tertiary mx-auto mb-1" />
                <div className="text-xs text-text-tertiary mb-1">Cost</div>
                <div className="font-semibold text-text-primary">{selected.cost}</div>
              </div>
              <div className="bg-bg-primary rounded-base p-3">
                <Clock className="w-5 h-5 text-text-tertiary mx-auto mb-1" />
                <div className="text-xs text-text-tertiary mb-1">Timeline</div>
                <div className="font-semibold text-text-primary">{selected.time}</div>
              </div>
              <div className="bg-bg-primary rounded-base p-3">
                <BarChart3 className="w-5 h-5 text-text-tertiary mx-auto mb-1" />
                <div className="text-xs text-text-tertiary mb-1">Difficulty</div>
                <div className="font-semibold text-text-primary">{selected.difficulty}</div>
              </div>
            </div>
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
            {state.fields.length > 0 && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Additional:</span>
                <span className="font-medium text-text-primary">{state.fields.join(', ')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            onClick={() => setStep(3)} 
            variant="outline"
            size="lg"
            className="flex-1"
          >
            ← Back to Results
          </Button>
          <Button 
            type="button" 
            onClick={proceed}
            size="lg"
            className="flex-1"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Start Full Application
          </Button>
        </div>
      </div>
    );
  };

  // Smooth scroll handler
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute top-0 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(37, 99, 235, 0.1) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}></div>
      </div>
      {/* Sticky Header - Same as landing page */}
      <header
        className={`sticky top-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-b border-border-light shadow-md shadow-black/5'
            : 'bg-white/90 backdrop-blur-xl border-b border-border-light'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 sm:px-8 py-4 flex items-center justify-between" aria-label="Site header">
          <Link 
            href="/" 
            className="flex items-center gap-3 text-lg font-bold text-text-primary hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            aria-label="VisaOnTrack homepage"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center" aria-hidden="true">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span>VisaOnTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link
              href="/#features"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="View features"
            >
              Features
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </Link>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="How it works"
            >
              How it Works
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150 relative group"
              aria-label="View pricing"
            >
              Pricing
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-primary transition-all duration-150 group-hover:w-full"></span>
            </a>
            <Link
              href="/get-started"
              className="text-sm font-semibold text-primary relative group"
              aria-label="Check your visa eligibility"
            >
              Eligibility
              <span className="absolute bottom-[-4px] left-0 w-full h-0.5 bg-primary"></span>
            </Link>
            <Link
              href="/auth/login"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            <Link
              href="/get-started"
              className="px-5 py-2 min-h-[44px] text-sm font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:shadow-md hover:shadow-primary/15 transition-all duration-200 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              aria-label="Check your visa eligibility"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-light bg-white">
            <nav className="max-w-7xl mx-auto px-6 py-4 space-y-3" aria-label="Mobile navigation">
              <Link
                href="/#features"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="View features"
              >
                Features
              </Link>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="How it works"
              >
                How it Works
              </a>
              <a
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors"
                aria-label="View pricing"
              >
                Pricing
              </a>
              <div className="pt-2 space-y-2 border-t border-border-light">
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-semibold text-primary bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/15 transition-colors text-center"
                  aria-label="Check your visa eligibility"
                >
                  Check Eligibility
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-text-primary bg-transparent border border-border-light rounded-lg hover:bg-bg-secondary transition-colors text-center"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full px-4 py-3 text-base font-medium text-white bg-gradient-to-b from-primary to-primary-hover rounded-lg hover:shadow-md hover:shadow-primary/15 transition-all duration-200 text-center"
                  aria-label="Check your visa eligibility"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Progress Bar - Below header */}
        <div className="border-t border-border-light bg-bg-primary">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex items-center justify-between py-3">
              <div className="flex-1 h-1 bg-border-light rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-hover transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
              </div>
              <span className="ml-4 text-sm font-medium text-text-secondary whitespace-nowrap">Step {step} of 4</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-6 sm:px-8 py-8 sm:py-12 z-10">
        <div className={`${baseCardClass} p-6 sm:p-8 lg:p-10`}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-text-secondary">
        <p>
          Need help?{' '}
          <a href="#" className="text-primary hover:text-primary-hover font-medium">
            Contact our visa specialists
          </a>
        </p>
      </footer>
    </div>
  );
}







