'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Compass, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { api } from '@visaontrack/client';
import { Button, GradientText } from '@/components/ui';
import { AuthPageShell } from '@/components/AuthPageShell';
import { validateEmail, checkPasswordStrength, type ValidationResult, type PasswordStrengthResult } from '@/lib/validation';
import { LOADING_CREATING_ACCOUNT } from '@/lib/loading-messages';
import { getErrorDisplayMessage, isRateLimitError, getRateLimitMessage, isValidationError } from '@/lib/error-handling';

function validateName(name: string, fieldName: string): ValidationResult {
  if (!name.trim()) {
    return { status: 'empty', message: '' };
  }

  if (name.trim().length < 2) {
    return {
      status: 'error',
      message: `${fieldName} seems too short`,
    };
  }

  return { status: 'success', message: 'Looks good!' };
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState<ValidationResult>({ status: 'empty', message: '' });
  const [lastNameValidation, setLastNameValidation] = useState<ValidationResult>({ status: 'empty', message: '' });
  const [emailValidation, setEmailValidation] = useState<ValidationResult>({ status: 'empty', message: '' });
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult>(checkPasswordStrength(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFirstNameChange = (value: string) => {
    setFirstName(value);
    setError(null);
    const result = validateName(value, 'First name');
    setFirstNameValidation(result);
  };

  const handleLastNameChange = (value: string) => {
    setLastName(value);
    setError(null);
    const result = validateName(value, 'Last name');
    setLastNameValidation(result);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setError(null);
    const result = validateEmail(value);
    setEmailValidation(result);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setError(null);
    const result = checkPasswordStrength(value);
    setPasswordStrength(result);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    const firstNameResult = validateName(firstName, 'First name');
    const lastNameResult = validateName(lastName, 'Last name');
    const emailResult = validateEmail(email);
    const passwordResult = checkPasswordStrength(password);

    setFirstNameValidation(firstNameResult);
    setLastNameValidation(lastNameResult);
    setEmailValidation(emailResult);
    setPasswordStrength(passwordResult);

    if (
      firstNameResult.status !== 'success' ||
      lastNameResult.status !== 'success' ||
      emailResult.status !== 'success' ||
      passwordResult.strength < 3 // Require at least "good" password (strength 3 = 4 criteria met)
    ) {
      setError('Please ensure all fields are valid and your password meets the requirements.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      // Combine firstName and lastName into name field (as per API spec)
      const fullName = `${firstName} ${lastName}`.trim();
      
      const response = (await api.auth.register({
        requestBody: {
          email,
          password,
          name: fullName || undefined,
        },
      })) as Awaited<ReturnType<typeof api.auth.register>> & { verificationLink?: string };

      // Dev-only: Store verification link for local development
      if (response.verificationLink) {
        sessionStorage.setItem('devVerificationLink', response.verificationLink);
      }

      // Determine redirect logic
      const fromIntake = searchParams.get('from') === 'intake';
      
      // If user came from intake, pass that context to the verification page
      // so it can redirect appropriately after verification
      const redirectPath = fromIntake ? '/auth/verify-email?from=intake' : '/auth/verify-email';
      
      router.push(redirectPath);
    } catch (error: unknown) {
      console.error('[RegisterPage] Registration error:', error);
      
      // Handle rate limit errors
      if (isRateLimitError(error)) {
        setError(getRateLimitMessage(error));
        return;
      }

      // Handle validation errors with specific messages
      if (isValidationError(error)) {
        const message = getErrorDisplayMessage(error, 'create account');
        setError(message);
        return;
      }

      // Use standardized error handling for all other errors
      const message = getErrorDisplayMessage(error, 'create account');
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="ios-card w-full max-w-auth">
        {/* Header */}
        <div className="p-6 pb-4 text-center sm:p-8">
          <div className="bg-primary/10 border-primary/20 mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border text-primary">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            <GradientText>Create your account</GradientText>
          </h1>
          <p className="text-base leading-relaxed text-text-secondary">Start your visa journey with SawadeePass</p>
        </div>

        {/* Form */}
        <div className="px-6 pb-6 sm:px-8 sm:pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="flex items-center gap-2 text-sm font-medium">
                  First name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
                      firstNameValidation.status === 'success'
                        ? 'border-success bg-success-light/5 focus:shadow-focus-success'
                        : firstNameValidation.status === 'error'
                        ? 'border-error bg-error-light/5 focus:shadow-focus-error'
                        : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
                    }`}
                    placeholder="John"
                    required
                    autoComplete="given-name"
                  />
                  {firstNameValidation.status !== 'empty' && (
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      {firstNameValidation.status === 'success' ? (
                        <CheckCircle className="h-4.5 w-4.5 text-success" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4.5 w-4.5 text-error" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
                {firstNameValidation.status !== 'empty' && (
                  <div
                    className={`flex min-h-4.5 items-center gap-2 text-xs transition-all duration-150 ${
                      firstNameValidation.status === 'success'
                        ? 'translate-y-0 text-success opacity-100'
                        : firstNameValidation.status === 'error'
                        ? 'translate-y-0 text-error opacity-100'
                        : '-translate-y-1 opacity-0'
                    }`}
                  >
                    {firstNameValidation.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="flex items-center gap-2 text-sm font-medium">
                  Last name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
                      lastNameValidation.status === 'success'
                        ? 'border-success bg-success-light/5 focus:shadow-focus-success'
                        : lastNameValidation.status === 'error'
                        ? 'border-error bg-error-light/5 focus:shadow-focus-error'
                        : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
                    }`}
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                  />
                  {lastNameValidation.status !== 'empty' && (
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      {lastNameValidation.status === 'success' ? (
                        <CheckCircle className="h-4.5 w-4.5 text-success" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="h-4.5 w-4.5 text-error" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
                {lastNameValidation.status !== 'empty' && (
                  <div
                    className={`flex min-h-4.5 items-center gap-2 text-xs transition-all duration-150 ${
                      lastNameValidation.status === 'success'
                        ? 'translate-y-0 text-success opacity-100'
                        : lastNameValidation.status === 'error'
                        ? 'translate-y-0 text-error opacity-100'
                        : '-translate-y-1 opacity-0'
                    }`}
                  >
                    {lastNameValidation.message}
                  </div>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
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

            {/* Password Input with Strength Meter */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium">
                Create password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center rounded-sm border-none bg-transparent p-2 text-text-tertiary transition-all duration-150 hover:bg-bg-secondary hover:text-text-secondary"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div aria-live="polite" aria-atomic="true">
                  <div className="mt-1.5 flex h-1 gap-1 opacity-100 transition-opacity duration-150">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`flex-1 rounded-xs transition-all duration-150 ${
                          bar <= passwordStrength.strength
                            ? passwordStrength.level === 'weak'
                              ? 'bg-error'
                              : passwordStrength.level === 'fair'
                              ? 'bg-warning'
                              : passwordStrength.level === 'good'
                              ? 'bg-success-bright'
                              : 'bg-success'
                            : 'bg-border-light'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className={`mt-1 flex items-center gap-2 text-xs transition-opacity duration-150 ${password ? 'opacity-100' : 'opacity-0'}`}>
                    <strong
                      className={
                        passwordStrength.level === 'weak'
                          ? 'text-error'
                          : passwordStrength.level === 'fair'
                          ? 'text-warning'
                          : passwordStrength.level === 'good'
                          ? 'text-success-bright'
                          : 'text-success'
                      }
                    >
                      {passwordStrength.message}
                    </strong>
                    {passwordStrength.hint && passwordStrength.level !== 'strong' && (
                      <span className="text-text-tertiary">— {passwordStrength.hint}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="text-xs text-text-tertiary">
                Use 8+ characters with a mix of letters, numbers & symbols
              </div>
            </div>

            {/* Terms Acceptance */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-primary"
                required
              />
              <label htmlFor="terms" className="cursor-pointer select-none text-xs leading-relaxed text-text-secondary">
                I agree to the <a href="#" className="font-medium text-primary no-underline hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="font-medium text-primary no-underline hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="flex animate-slide-up items-center gap-2 text-xs text-error">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? LOADING_CREATING_ACCOUNT : 'Create account'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-light"></div>
            <span className="text-xs text-text-tertiary">Already have an account?</span>
            <div className="h-px flex-1 bg-border-light"></div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <Link href="/auth/login" className="text-sm font-semibold text-primary no-underline transition-colors duration-200 hover:text-primary-hover">
              Sign in instead
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
      `}</style>
    </AuthPageShell>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg-secondary">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
