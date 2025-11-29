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
      <div className="ios-card w-full max-w-auth p-6 sm:p-8">
        {/* Header */}
        <div className="pb-6 text-center">
          <div className="bg-primary/10 border-primary/20 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border text-primary">
            <Lock className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            <GradientText>Reset your password</GradientText>
          </h1>
          <p className="text-base leading-relaxed text-text-secondary">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {/* Form */}
        <div className="px-1 sm:px-2 md:px-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Success Message - Always shown after submission (no user enumeration) */}
            {isSuccess && (
              <div
                role="alert"
                className="rounded-lg border border-green-200 bg-gradient-to-br from-success-light to-green-50 p-5"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-success" aria-hidden="true" />
                  <p className="text-sm leading-relaxed text-text-secondary">
                    If an account with that email exists, a password reset link has been sent. Please check your inbox
                    and click the link to reset your password.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div role="alert" className="flex animate-slide-up items-center gap-2 text-xs text-error">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium tracking-normal">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
                    emailValidation.status === 'success'
                      ? 'border-success bg-success-light/5 focus:shadow-focus-success'
                      : emailValidation.status === 'error'
                      ? 'border-error bg-error-light/5 focus:shadow-focus-error'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
                  }`}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  disabled={isSuccess}
                  aria-invalid={emailValidation.status === 'error'}
                  aria-describedby={emailValidation.status !== 'empty' ? 'email-message' : undefined}
                />
                {(emailValidation.status === 'success' || emailValidation.status === 'error') && (
                  <div className="pointer-events-none absolute right-4 top-1/2 flex -translate-y-1/2 items-center opacity-100 transition-opacity duration-150">
                    {emailValidation.status === 'success' ? (
                      <CheckCircle className="h-4.5 w-4.5 text-success" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4.5 w-4.5 text-error" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              {emailValidation.status !== 'empty' && (
                <div
                  id="email-message"
                  className={`flex min-h-4.5 items-center gap-2 text-xs transition-all duration-150 ${
                    emailValidation.status === 'success'
                      ? 'translate-y-0 text-success opacity-100'
                      : emailValidation.status === 'error'
                      ? 'translate-y-0 text-error opacity-100'
                      : '-translate-y-1 opacity-0'
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
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}

