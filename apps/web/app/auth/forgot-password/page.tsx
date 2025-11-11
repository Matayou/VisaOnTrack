'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@visaontrack/client';

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailValidation, setEmailValidation] = useState<ValidationResult>({ status: 'empty', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
    setIsSuccess(false);
    const result = validateEmail(value);
    setEmailValidation(result);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSuccess(false);

    // Validate email before submit
    const emailResult = validateEmail(email);
    if (emailResult.status !== 'success') {
      setEmailValidation(emailResult);
      return;
    }

    setIsLoading(true);

    try {
      // Note: API method may need to be generated - using expected signature
      await (api.auth as any).forgotPassword({
        requestBody: {
          email,
        },
      });

      // Always show success message (no user enumeration per RFC-002)
      setIsSuccess(true);
    } catch (err: any) {
      // Even on error, show success message (no user enumeration)
      // Only show error for network issues or rate limiting
      if (err?.status === 429) {
        setError('Too many requests. Please try again in a few minutes.');
      } else {
        // Still show success to prevent user enumeration
        setIsSuccess(true);
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
            <Lock className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-tight">Reset your password</h1>
          <p className="text-sm text-text-secondary">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Success Message - Always shown after submission (no user enumeration) */}
            {isSuccess && (
              <div
                role="alert"
                className="p-5 bg-gradient-to-br from-success-light to-green-50 border border-green-200 rounded-base animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]"
              >
                <div className="flex gap-3 items-start">
                  <CheckCircle className="w-6 h-6 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-text-secondary leading-relaxed">
                    If an account with that email exists, a password reset link has been sent. Please check your inbox
                    and click the link to reset your password.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div role="alert" className="text-xs text-error flex items-center gap-2 animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {error}
              </div>
            )}

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
                  disabled={isSuccess}
                  aria-invalid={emailValidation.status === 'error'}
                  aria-describedby={emailValidation.status !== 'empty' ? 'email-message' : undefined}
                />
                {(emailValidation.status === 'success' || emailValidation.status === 'error') && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none transition-opacity duration-150 opacity-100">
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className={`w-full h-11 px-6 text-base font-medium text-white rounded-base border-none cursor-pointer transition-all duration-150 shadow-xs relative overflow-hidden flex items-center justify-center gap-2 ${
                isLoading || isSuccess
                  ? 'opacity-60 cursor-not-allowed'
                  : 'bg-gradient-to-b from-primary to-primary-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:translate-y-0'
              }`}
            >
              {isLoading && (
                <div className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              )}
              <span className={isLoading ? 'opacity-70' : ''}>
                {isLoading ? 'Sending...' : isSuccess ? 'Reset link sent' : 'Send reset link'}
              </span>
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary no-underline transition-colors duration-150 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to sign in
            </Link>
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

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(8px);
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

