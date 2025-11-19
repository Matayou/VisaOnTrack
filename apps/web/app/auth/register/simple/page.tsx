'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, CheckCircle, AlertCircle, ShieldCheck, Clock } from 'lucide-react';

// Email typo detection
const commonTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
};

type ValidationState = 'empty' | 'success' | 'error';

interface ValidationResult {
  status: ValidationState;
  message: string;
}

function validateEmail(email: string): ValidationResult {
  if (!email) return { status: 'empty', message: '' };

  if (!email.includes('@')) {
    return { status: 'error', message: 'Email is missing @ symbol' };
  }

  const parts = email.split('@');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { status: 'error', message: 'Email format looks incorrect' };
  }

  const domain = parts[1].toLowerCase();
  for (const [typo, correct] of Object.entries(commonTypos)) {
    if (domain === typo) {
      return {
        status: 'error',
        message: `Did you mean ${parts[0]}@${correct}?`,
      };
    }
  }

  if (!domain.includes('.')) {
    return { status: 'error', message: 'Domain needs a dot (like .com)' };
  }

  return { status: 'success', message: 'Looks good!' };
}

// Password validation - matches OpenAPI requirements
// Must have: length >= 8, uppercase, lowercase, number, special character
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  const missing: string[] = [];
  
  if (!/[a-z]/.test(password)) {
    missing.push('lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    missing.push('uppercase letter');
  }
  if (!/[0-9]/.test(password)) {
    missing.push('number');
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    missing.push('special character');
  }

  if (missing.length > 0) {
    return { valid: false, error: `Password must contain: ${missing.join(', ')}` };
  }

  return { valid: true };
}

export default function SimpleRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Validate password - must meet all OpenAPI requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.error || 'Password does not meet requirements');
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call when register endpoint is available
      // await api.auth.register({
      //   email,
      //   password,
      // });

      // Simulate API call for now
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to email verification page after successful registration
      // Email verification is REQUIRED before proceeding to onboarding
      router.push('/auth/verify-email');
    } catch (error: unknown) {
      console.error('[SimpleRegisterPage] Registration error:', error);
      if (error instanceof Error) {
        setError(error.message || 'An error occurred. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
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
            <Zap className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-tight">Get started in seconds</h1>
          <p className="text-sm text-text-secondary mb-4">Quick signup • Complete profile later</p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-success-light to-green-200 border border-green-300 rounded-base text-xs font-medium text-success mt-4 animate-pulse">
            <Clock className="w-4 h-4" aria-hidden="true" />
            <span>Takes less than 30 seconds</span>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium">
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
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
                {emailValidation.status !== 'empty' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    {emailValidation.status === 'success' ? (
                      <CheckCircle className="w-[18px] h-[18px] text-success" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="w-[18px] h-[18px] text-error" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-text-tertiary opacity-100">We&rsquo;ll send you a verification email</div>
              {emailValidation.status !== 'empty' && (
                <div
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
              <label htmlFor="password" className="text-sm font-medium">
                Create password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="w-full h-11 px-4 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.01]"
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
              <span className="text-xs text-text-tertiary">Use a strong password to protect your account</span>
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
              <span className={isLoading ? 'opacity-70' : ''}>{isLoading ? 'Creating account...' : 'Create account'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border-light"></div>
            <span className="text-xs text-text-tertiary">You can add more details later</span>
            <div className="flex-1 h-px bg-border-light"></div>
          </div>

          {/* Full Registration Link */}
          <div className="text-center">
            <span className="text-sm text-text-secondary">Need more options? </span>
            <Link href="/auth/register" className="font-medium text-primary no-underline transition-colors duration-150 hover:text-primary-hover">
              Full registration
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

