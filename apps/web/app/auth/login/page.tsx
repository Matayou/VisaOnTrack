'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { Button, GradientText } from '@/components/ui';
import { AuthPageShell } from '@/components/AuthPageShell';
import { validateEmail, type ValidationResult } from '@/lib/validation';
import { LOADING_SIGNING_IN } from '@/lib/loading-messages';
import { getErrorDisplayMessage, isAuthError } from '@/lib/error-handling';

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
        },
      });

      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      try {
        const user = await api.users.getCurrentUser();

        if (!user.emailVerified) {
          router.push('/auth/verify-email');
          return;
        }

        if (user.role === 'PROVIDER' && !user.providerOnboardingCompleted) {
          const nextStep = getNextProviderOnboardingStep(user);
          if (nextStep) {
            router.push(nextStep);
            return;
          }
        }

        if (user.role === 'SEEKER') {
          router.push('/dashboard');
          return;
        }

        if (user.role === 'PROVIDER') {
          router.push('/providers/dashboard');
          return;
        }

        router.push('/');
      } catch (userError) {
        console.error('[LoginPage] Error fetching user after login:', userError);
        router.push('/');
      }
    } catch (err: unknown) {
      if (isAuthError(err)) {
        setError('Invalid email or password');
      } else {
        const message = getErrorDisplayMessage(err, 'sign in');
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageShell>
      <div className="ios-card w-full max-w-[28rem] mx-auto p-6 sm:p-8">
        <div className="relative pb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-xl mb-6 border border-primary/20">
            <Compass className="w-7 h-7" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 leading-tight">
            <GradientText>Welcome back</GradientText>
          </h1>
          <p className="text-base text-text-secondary leading-relaxed">Sign in to your SawadeePass account</p>
        </div>

        <div className="px-1 sm:px-2 md:px-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
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
                  className="w-full h-12 px-4 pr-11 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]"
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
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" /> : <Eye className="w-[18px] h-[18px]" aria-hidden="true" />}
                </button>
              </div>
            </div>

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

            {error && (
              <div role="alert" className="text-xs text-error flex items-center gap-2 animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
                <AlertCircle className="w-4 h-4" aria-hidden="true" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} loading={isLoading} fullWidth>
              {isLoading ? LOADING_SIGNING_IN : 'Sign in'}
            </Button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border-light" />
            <span className="text-sm text-text-tertiary">New to SawadeePass?</span>
            <div className="flex-1 h-px bg-border-light" />
          </div>

          <div className="text-center">
            <span className="text-base text-text-secondary">Don&rsquo;t have an account? </span>
            <Link
              href="/auth/register"
              className="font-semibold text-primary no-underline transition-colors duration-200 hover:text-primary-hover"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    </AuthPageShell>
  );
}
