'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Compass, Eye, EyeOff } from 'lucide-react';
import { api } from '@visaontrack/client';
import { getNextProviderOnboardingStep } from '@/lib/onboarding';
import { Button, GradientText, FormField } from '@/components/ui';
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
      <div className="ios-card mx-auto w-full max-w-auth p-6 sm:p-8">
        <div className="relative pb-6 text-center">
          <div className="bg-primary/10 border-primary/20 mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border text-primary">
            <Compass className="h-7 w-7" aria-hidden="true" />
          </div>
          <h1 className="mb-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            <GradientText>Welcome back</GradientText>
          </h1>
          <p className="text-base leading-relaxed text-text-secondary">Sign in to your SawadeePass account</p>
        </div>

        <div className="px-1 sm:px-2 md:px-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FormField
              label="Email address"
              name="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              validationStatus={emailValidation.status === 'empty' ? undefined : emailValidation.status}
              error={emailValidation.status === 'error' ? emailValidation.message : undefined}
              success={emailValidation.status === 'success' ? emailValidation.message : undefined}
            />

            <div className="flex flex-col gap-2">
              <FormField
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="pr-12"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text-secondary"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" aria-hidden="true" /> : <Eye className="h-4.5 w-4.5" aria-hidden="true" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-primary"
                />
                <label htmlFor="remember" className="cursor-pointer select-none text-sm text-text-secondary">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm font-medium text-primary no-underline transition-colors duration-150 hover:text-primary-hover"
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <div role="alert" className="flex animate-slide-up items-center gap-2 text-xs text-error">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                {error}
              </div>
            )}

            <Button type="submit" disabled={isLoading} loading={isLoading} fullWidth>
              {isLoading ? LOADING_SIGNING_IN : 'Sign in'}
            </Button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-border-light" />
            <span className="text-sm text-text-tertiary">New to SawadeePass?</span>
            <div className="h-px flex-1 bg-border-light" />
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
