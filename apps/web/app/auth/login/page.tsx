'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck, Clock } from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { getApiErrorMessage, isApiError } from '@/lib/api-error';

// Email typo detection
const commonTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmil.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
};

type ValidationState = 'empty' | 'success' | 'error';

interface ValidationResult {
  status: ValidationState;
  message: string;
  suggestion?: string;
}

function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { status: 'empty', message: '' };
  }

  if (!email.includes('@')) {
    return {
      status: 'error',
      message: 'Email is missing @ symbol',
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return {
      status: 'error',
      message: 'Email format looks incorrect',
    };
  }

  const domain = parts[1].toLowerCase();

  // Check for common typos
  for (const [typo, correct] of Object.entries(commonTypos)) {
    if (domain === typo) {
      return {
        status: 'error',
        message: `Did you mean ${parts[0]}@${correct}?`,
        suggestion: `${parts[0]}@${correct}`,
      };
    }
  }

  // Check for basic domain format
  if (!domain.includes('.')) {
    return {
      status: 'error',
      message: 'Domain needs a dot (like .com)',
    };
  }

  // Valid!
  return {
    status: 'success',
    message: 'Looks good!',
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailValidation, setEmailValidation] = useState<ValidationResult>({ status: 'empty', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
    const result = validateEmail(value);
    setEmailValidation(result);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate email before submit
    const emailResult = validateEmail(email);
    if (emailResult.status !== 'success') {
      setEmailValidation(emailResult);
      return;
    }

    if (!password) {
      return;
    }

    setIsLoading(true);

    try {
      await api.auth.login({
        requestBody: {
          email,
          password,
          // Note: rememberMe is not in OpenAPI spec - stored in localStorage
        },
      });

      // Store rememberMe preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // Redirect to dashboard/home after successful login
      // Check onboarding status and redirect accordingly
      try {
        const user = await api.users.getCurrentUser();
        console.log('[LoginPage] User after login:', {
          id: user.id,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          providerOnboardingCompleted: user.providerOnboardingCompleted,
          providerBusinessStepCompleted: user.providerBusinessStepCompleted,
          providerServicesStepCompleted: user.providerServicesStepCompleted,
          providerCredentialsStepCompleted: user.providerCredentialsStepCompleted,
        });
        
        // Check email verification first
        if (!user.emailVerified) {
          console.log('[LoginPage] Email not verified, redirecting to verify-email');
          router.push('/auth/verify-email');
          return;
        }

        // Check provider onboarding progress
        if (user.role === 'PROVIDER' && !user.providerOnboardingCompleted) {
          const nextStep = getNextProviderOnboardingStep(user);
          console.log('[LoginPage] Provider with incomplete onboarding, next step:', nextStep);
          if (nextStep) {
            router.push(nextStep);
            return;
          }
        }

        // SEEKER users go directly to their dashboard (no onboarding process)
        if (user.role === 'SEEKER') {
          console.log('[LoginPage] Seeker user, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }

        // For completed onboarding, redirect to landing page
        // (The landing page will handle further redirects if needed)
        console.log('[LoginPage] Redirecting to landing page (role:', user.role, ', onboarding complete:', user.providerOnboardingCompleted || user.seekerOnboardingCompleted, ')');
        router.push('/');
      } catch (userError) {
        console.error('[LoginPage] Error fetching user after login:', userError);
        // Fallback to landing page if user fetch fails
        router.push('/');
      }
    } catch (error: unknown) {
      if (isApiError(error) && (error.body?.code === 'UNAUTHORIZED' || error.status === 401)) {
        setError('Invalid email or password');
      } else {
        const message = isApiError(error)
          ? getApiErrorMessage(error, 'An error occurred. Please try again.')
          : 'An error occurred. Please try again.';
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-[28rem] bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-base mb-5 shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
            <Compass className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-tight">Welcome back</h1>
          <p className="text-sm text-text-secondary">Sign in to your VisaOnTrack account</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium tracking-normal flex items-center gap-2">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none pr-11 ${
                    emailValidation.status === 'success'
                      ? 'border-success bg-success-light/5 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]'
                      : emailValidation.status === 'error'
                      ? 'border-error bg-error-light/5 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.01]'
                  }`}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  aria-invalid={emailValidation.status === 'error'}
                  aria-describedby={emailValidation.status !== 'empty' ? 'email-message' : undefined}
                />
                {(emailValidation.status === 'success' || emailValidation.status === 'error') && (
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-150 opacity-100"
                  >
                    {emailValidation.status === 'success' ? (
                      <CheckCircle className="w-[18px] h-[18px] text-success" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-[18px] h-[18px] text-error" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              {emailValidation.status !== 'empty' && (
                <div
                  id="email-message"
                  className={`text-xs flex items-center gap-2 transition-all duration-150 min-h-[1.125rem] ${
                    emailValidation.status === 'success'
                      ? 'text-success opacity-100 translate-y-0'
                      : emailValidation.status === 'error'
                      ? 'text-error opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-1'
                  }`}
                >
                  {emailValidation.message}
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium tracking-normal">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full h-11 px-4 pr-11 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.01]"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none p-2 cursor-pointer text-text-tertiary flex items-center rounded-sm transition-all duration-150 hover:text-text-secondary hover:bg-bg-secondary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                      <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
                    ) : (
                      <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 cursor-pointer accent-primary"
                />
                <label htmlFor="remember" className="text-sm text-text-secondary cursor-pointer select-none">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm font-medium text-primary no-underline transition-colors duration-150 hover:text-primary-hover ml-auto"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="text-xs text-error flex items-center gap-2 animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 px-6 text-base font-medium text-white rounded-base border-none cursor-pointer transition-all duration-200 shadow-xs relative overflow-hidden flex items-center justify-center gap-2 ${
                isLoading
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-primary to-primary-hover hover:shadow-md hover:shadow-primary/15'
              }`}
            >
              {isLoading && (
                <div className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span className={isLoading ? 'opacity-70' : ''}>{isLoading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-light"></div>
            <span className="text-xs text-text-tertiary">New to VisaOnTrack?</span>
            <div className="flex-1 h-px bg-border-light"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-sm text-text-secondary">Don&rsquo;t have an account? </span>
            <Link href="/auth/register" className="font-medium text-primary no-underline transition-colors duration-150 hover:text-primary-hover">
              Create account
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="px-8 pb-8">
          <div className="flex items-center justify-center gap-6 pt-8">
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Secure & encrypted</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-text-tertiary">
              <Clock className="w-4 h-4" aria-hidden="true" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
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

