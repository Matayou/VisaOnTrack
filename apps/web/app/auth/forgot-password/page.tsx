'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@visaontrack/client';
import { Button, GradientText } from '@/components/ui';
import { AuthPageShell } from '@/components/AuthPageShell';
import { validateEmail, type ValidationResult } from '@/lib/validation';
import { isRateLimitError, getRateLimitMessage } from '@/lib/error-handling';

type ForgotPasswordParams = {
  requestBody: {
    email: string;
  };
};

type AuthWithForgotPassword = typeof api.auth & {
  forgotPassword: (params: ForgotPasswordParams) => Promise<unknown>;
};

const authApi = api.auth as AuthWithForgotPassword;

export default function ForgotPasswordPage() {
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
      await authApi.forgotPassword({
        requestBody: {
          email,
        },
      });

      // Always show success message (no user enumeration per RFC-002)
      setIsSuccess(true);
    } catch (error: unknown) {
      // Even on error, show success message (no user enumeration)
      // Only show error for network issues or rate limiting
      if (isRateLimitError(error)) {
        setError(getRateLimitMessage(error));
      } else {
        // Still show success to prevent user enumeration
        setIsSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="relative z-10 w-full max-w-[28rem] bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl shadow-lg shadow-primary/5 transition-all duration-300 overflow-hidden p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
        {/* Header */}
        <div className="pb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary to-primary-hover rounded-xl mb-6 shadow-md shadow-primary/20">
            <Lock className="w-7 h-7 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 leading-tight">
            <GradientText>Reset your password</GradientText>
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {/* Form */}
        <div className="px-2 sm:px-4 md:px-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Success Message - Always shown after submission (no user enumeration) */}
            {isSuccess && (
              <div
                role="alert"
                className="p-5 bg-gradient-to-br from-success-light to-green-50 border border-green-200 rounded-lg"
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
                  className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none pr-11 ${
                    emailValidation.status === 'success'
                      ? 'border-success bg-success-light/5 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]'
                      : emailValidation.status === 'error'
                      ? 'border-error bg-error-light/5 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
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
            <Button
              type="submit"
              disabled={isLoading || isSuccess}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? 'Sending...' : isSuccess ? 'Reset link sent' : 'Send reset link'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-8 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-base font-semibold text-text-secondary no-underline transition-colors duration-200 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}

