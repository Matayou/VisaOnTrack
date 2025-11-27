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
      <div className="relative z-10 w-full max-w-[28rem] bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-xl shadow-lg shadow-primary/5 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
        {/* Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-xl mb-4 shadow-md shadow-primary/20">
            <Compass className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 leading-tight">
            <GradientText>Create your account</GradientText>
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">Start your visa journey with VisaOnTrack</p>
        </div>

        {/* Form */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                  First name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => handleFirstNameChange(e.target.value)}
                    className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none pr-11 ${
                      firstNameValidation.status === 'success'
                        ? 'border-success bg-success-light/5 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]'
                        : firstNameValidation.status === 'error'
                        ? 'border-error bg-error-light/5 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                        : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                    }`}
                    placeholder="John"
                    required
                    autoComplete="given-name"
                  />
                  {firstNameValidation.status !== 'empty' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {firstNameValidation.status === 'success' ? (
                        <CheckCircle className="w-[18px] h-[18px] text-success" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="w-[18px] h-[18px] text-error" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
                {firstNameValidation.status !== 'empty' && (
                  <div
                    className={`text-xs flex items-center gap-2 transition-all duration-150 min-h-[1.125rem] ${
                      firstNameValidation.status === 'success'
                        ? 'text-success opacity-100 translate-y-0'
                        : firstNameValidation.status === 'error'
                        ? 'text-error opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-1'
                    }`}
                  >
                    {firstNameValidation.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                  Last name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => handleLastNameChange(e.target.value)}
                    className={`w-full h-12 px-4 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none pr-11 ${
                      lastNameValidation.status === 'success'
                        ? 'border-success bg-success-light/5 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]'
                        : lastNameValidation.status === 'error'
                        ? 'border-error bg-error-light/5 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                        : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
                    }`}
                    placeholder="Doe"
                    required
                    autoComplete="family-name"
                  />
                  {lastNameValidation.status !== 'empty' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      {lastNameValidation.status === 'success' ? (
                        <CheckCircle className="w-[18px] h-[18px] text-success" aria-hidden="true" />
                      ) : (
                        <AlertCircle className="w-[18px] h-[18px] text-error" aria-hidden="true" />
                      )}
                    </div>
                  )}
                </div>
                {lastNameValidation.status !== 'empty' && (
                  <div
                    className={`text-xs flex items-center gap-2 transition-all duration-150 min-h-[1.125rem] ${
                      lastNameValidation.status === 'success'
                        ? 'text-success opacity-100 translate-y-0'
                        : lastNameValidation.status === 'error'
                        ? 'text-error opacity-100 translate-y-0'
                        : 'opacity-0 -translate-y-1'
                    }`}
                  >
                    {lastNameValidation.message}
                  </div>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
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
                  className="w-full h-12 px-4 pr-11 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
                  placeholder="At least 8 characters"
                  required
                  autoComplete="new-password"
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

              {/* Password Strength Meter */}
              {password && (
                <div aria-live="polite" aria-atomic="true">
                  <div className="flex gap-1 h-1 mt-1.5 transition-opacity duration-150 opacity-100">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`flex-1 rounded-[2px] transition-all duration-150 ${
                          bar <= passwordStrength.strength
                            ? passwordStrength.level === 'weak'
                              ? 'bg-error'
                              : passwordStrength.level === 'fair'
                              ? 'bg-warning'
                              : passwordStrength.level === 'good'
                              ? 'bg-[#10b981]'
                              : 'bg-success'
                            : 'bg-border-light'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className={`text-xs mt-1 flex items-center gap-2 transition-opacity duration-150 ${password ? 'opacity-100' : 'opacity-0'}`}>
                    <strong
                      className={
                        passwordStrength.level === 'weak'
                          ? 'text-error'
                          : passwordStrength.level === 'fair'
                          ? 'text-warning'
                          : passwordStrength.level === 'good'
                          ? 'text-[#10b981]'
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
                className="w-4 h-4 mt-0.5 cursor-pointer accent-primary flex-shrink-0"
                required
              />
              <label htmlFor="terms" className="text-xs text-text-secondary cursor-pointer select-none leading-relaxed">
                I agree to the <a href="#" className="text-primary no-underline font-medium hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-primary no-underline font-medium hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div role="alert" className="text-xs text-error flex items-center gap-2 animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
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
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-border-light"></div>
            <span className="text-xs text-text-tertiary">Already have an account?</span>
            <div className="flex-1 h-px bg-border-light"></div>
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
      <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
