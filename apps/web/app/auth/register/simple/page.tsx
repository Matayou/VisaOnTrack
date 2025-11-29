'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, CheckCircle, AlertCircle, ShieldCheck, Clock } from 'lucide-react';
import { validateEmail, validatePassword, type ValidationResult } from '@/lib/validation';
import { LOADING_CREATING_ACCOUNT } from '@/lib/loading-messages';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { AuthPageShell } from '@/components/AuthPageShell';

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
    if (passwordValidation.status !== 'success') {
      setError(passwordValidation.message || 'Password does not meet requirements');
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
      setError(getErrorDisplayMessage(error, 'create your account'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="ios-card w-full max-w-auth animate-slide-up">
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="bg-primary/10 border-primary/20 mb-5 inline-flex h-12 w-12 items-center justify-center rounded-base border text-primary">
            <Zap className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold leading-tight tracking-tight">Get started in seconds</h1>
          <p className="mb-4 text-sm text-text-secondary">Quick signup • Complete profile later</p>
          <div className="mt-4 inline-flex animate-pulse items-center gap-2 rounded-base border border-green-300 bg-gradient-to-br from-success-light to-green-200 px-4 py-2 text-xs font-medium text-success">
            <Clock className="h-4 w-4" aria-hidden="true" />
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
                  className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
                    emailValidation.status === 'success'
                      ? 'border-success bg-success-light/5 focus:shadow-focus-success'
                      : emailValidation.status === 'error'
                      ? 'border-error bg-error-light/5 focus:shadow-focus-error'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
                  }`}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                />
                {emailValidation.status !== 'empty' && (
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                    {emailValidation.status === 'success' ? (
                      <CheckCircle className="h-4.5 w-4.5 text-success" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4.5 w-4.5 text-error" aria-hidden="true" />
                    )}
                  </div>
                )}
              </div>
              <div className="text-xs text-text-tertiary opacity-100">We&rsquo;ll send you a verification email</div>
              {emailValidation.status !== 'empty' && (
                <div
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
                className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                placeholder="At least 8 characters"
                required
                autoComplete="new-password"
              />
              <span className="text-xs text-text-tertiary">Use a strong password to protect your account</span>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="flex animate-slide-up items-center gap-2 text-xs text-error">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative flex h-11 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-base border-none px-6 text-base font-medium text-white shadow-xs transition-all duration-200 ${
                isLoading
                  ? 'cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-b from-primary to-primary-hover'
              }`}
            >
              {isLoading && (
                <div className="absolute h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              )}
              <span className={isLoading ? 'opacity-70' : ''}>{isLoading ? LOADING_CREATING_ACCOUNT : 'Create account'}</span>
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-light"></div>
            <span className="text-xs text-text-tertiary">You can add more details later</span>
            <div className="h-px flex-1 bg-border-light"></div>
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
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
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
    </AuthPageShell>
  );
}

