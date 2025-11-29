'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@visaontrack/client';
import { Button, GradientText } from '@/components/ui';
import { AuthPageShell } from '@/components/AuthPageShell';
import { checkPasswordStrength, type PasswordStrengthResult } from '@/lib/validation';
import { isApiError } from '@/lib/api-error';
import { getErrorDisplayMessage, getRateLimitMessage, isRateLimitError } from '@/lib/error-handling';

type ResetPasswordParams = {
  requestBody: {
    token: string;
    newPassword: string;
  };
};

type AuthWithResetPassword = typeof api.auth & {
  resetPassword: (params: ResetPasswordParams) => Promise<unknown>;
};

const authApi = api.auth as AuthWithResetPassword;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrengthResult>(checkPasswordStrength(''));
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Extract token from URL query parameter
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setTokenError('Reset token is missing. Please use the link from your email.');
    } else if (tokenParam.length < 10) {
      setTokenError('Invalid reset token format. Please use the link from your email.');
    } else {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    setError(null);
    setPasswordMatch(null);
    const result = checkPasswordStrength(value);
    setPasswordStrength(result);

    // Check password match if confirm password is filled
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError(null);
    setPasswordMatch(value === newPassword && value.length > 0);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setTokenError('Reset token is required.');
      return;
    }

    // Validate password strength
    const passwordResult = checkPasswordStrength(newPassword);
    if (passwordResult.strength < 4) {
      setError('Password must meet all requirements: 8+ characters, uppercase, lowercase, number, and special character.');
      return;
    }

    // Validate password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({
        requestBody: {
          token,
          newPassword,
        },
      });

      // Success - redirect to login page
      router.push('/auth/login');
    } catch (error: unknown) {
      // Handle rate limit errors
      if (isRateLimitError(error)) {
        setError(getRateLimitMessage(error));
        return;
      }

      // Handle token errors (401)
      if (isApiError(error) && error.status === 401) {
        setTokenError('Reset token is invalid or has expired. Please request a new password reset link.');
        return;
      }

      // Use standardized error handling for all other errors
      const message = getErrorDisplayMessage(error, 'reset password');
      setError(message);
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
            <Lock className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold leading-tight tracking-tight">
            <GradientText>Reset your password</GradientText>
          </h1>
          <p className="text-sm text-text-secondary">Enter your new password below</p>
        </div>

        {/* Form */}
        <div className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Token Error */}
            {tokenError && (
              <div
                role="alert"
                className="animate-fade-in-up rounded-base border border-red-200 bg-gradient-to-br from-error-light to-red-50 p-4 text-sm text-error"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-error" aria-hidden="true" />
                  <p className="leading-relaxed">{tokenError}</p>
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

            {/* New Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => handleNewPasswordChange(e.target.value)}
                  className="h-12 w-full rounded-base border border-border-light bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 hover:border-border-medium focus:border-primary focus:shadow-focus-primary"
                  placeholder="At least 8 characters"
                  required
                  disabled={!token || !!tokenError || isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center rounded-sm border-none bg-transparent p-2 text-text-tertiary transition-all duration-150 hover:bg-bg-secondary hover:text-text-secondary"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  disabled={!token || !!tokenError || isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div aria-live="polite" aria-atomic="true">
                  <div className="mt-2 flex h-1 gap-1 opacity-100 transition-opacity duration-150">
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
                  <div className={`mt-1 flex items-center gap-2 text-xs transition-opacity duration-150 ${newPassword ? 'opacity-100' : 'opacity-0'}`}>
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
                    {passwordStrength.hint && (
                      <span className="text-text-tertiary">— {passwordStrength.hint}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="mt-1 text-xs text-text-tertiary">
                Use 8+ characters with a mix of letters, numbers & symbols
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  className={`h-12 w-full rounded-base border bg-bg-primary px-4 pr-11 font-sans text-base text-text-primary outline-none transition-all duration-150 ${
                    passwordMatch === true
                      ? 'border-success bg-success-light/5 focus:shadow-focus-success'
                      : passwordMatch === false
                      ? 'border-error bg-error-light/5 focus:shadow-focus-error'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-focus-primary'
                  }`}
                  placeholder="Re-enter your password"
                  required
                  disabled={!token || !!tokenError || isLoading}
                  autoComplete="new-password"
                  aria-invalid={passwordMatch === false}
                  aria-describedby={passwordMatch !== null ? 'confirm-password-message' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 flex -translate-y-1/2 cursor-pointer items-center rounded-sm border-none bg-transparent p-2 text-text-tertiary transition-all duration-150 hover:bg-bg-secondary hover:text-text-secondary"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={!token || !!tokenError || isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div id="confirm-password-message">
                {passwordMatch === false && (
                  <div className="flex min-h-[1.125rem] items-center gap-2 text-xs text-error">
                    <AlertCircle className="h-4 w-4" aria-hidden="true" />
                    Passwords do not match
                  </div>
                )}
                {passwordMatch === true && (
                  <div className="flex min-h-[1.125rem] items-center gap-2 text-xs text-success">
                    <CheckCircle className="h-4 w-4" aria-hidden="true" />
                    Passwords match
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !token || !!tokenError || passwordStrength.strength < 4 || passwordMatch !== true}
              loading={isLoading}
              fullWidth
            >
              {isLoading ? 'Resetting password...' : 'Reset password'}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary no-underline transition-colors duration-150 hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
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
    </AuthPageShell>
  );
}

