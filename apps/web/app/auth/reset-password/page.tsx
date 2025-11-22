'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '@visaontrack/client';
import { getApiErrorMessage, isApiError } from '@/lib/api-error';
import { Button, Spinner, PageBackground, GradientText } from '@/components/ui';

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

type PasswordStrength = 0 | 1 | 2 | 3 | 4;
type PasswordLevel = 'empty' | 'weak' | 'fair' | 'good' | 'strong';

interface PasswordStrengthResult {
  strength: PasswordStrength;
  level: PasswordLevel;
  message: string;
  hint: string;
}

function checkPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return { strength: 0, level: 'empty', message: '', hint: '' };
  }

  let count = 0;
  const feedback: string[] = [];

  // Length (8+)
  if (password.length >= 8) count++;
  else feedback.push('Use 8+ characters');

  // Lowercase (required)
  if (/[a-z]/.test(password)) count++;
  else feedback.push('add lowercase letters');

  // Uppercase (required)
  if (/[A-Z]/.test(password)) count++;
  else feedback.push('add uppercase letters');

  // Number (required)
  if (/[0-9]/.test(password)) count++;
  else feedback.push('add numbers');

  // Special character (required)
  if (/[^A-Za-z0-9]/.test(password)) count++;
  else feedback.push('add symbols (!@#$)');

  // Map 5 criteria to 4 strength levels (0-4)
  let strength: PasswordStrength;
  if (count >= 5) {
    strength = 4; // Strong - all criteria met
  } else if (count === 4) {
    strength = 3; // Good - 4 criteria met
  } else if (count === 3) {
    strength = 2; // Fair - 3 criteria met
  } else if (count >= 1) {
    strength = 1; // Weak - 1-2 criteria met
  } else {
    strength = 0; // Empty
  }

  const levels: Record<PasswordStrength, { level: PasswordLevel; message: string; hint: string }> = {
    0: { level: 'empty', message: '', hint: '' },
    1: { level: 'weak', message: 'Weak password', hint: feedback.join(', ') },
    2: { level: 'fair', message: 'Fair password', hint: feedback.join(', ') },
    3: { level: 'good', message: 'Good password', hint: feedback.join(', ') },
    4: { level: 'strong', message: 'Strong password!', hint: 'Excellent choice' },
  };

  return { strength, ...levels[strength] };
}

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
      const apiError = isApiError(error) ? error : null;
      // Handle different error types
      if (apiError?.status === 400) {
        if (apiError.body?.code === 'VALIDATION_ERROR') {
          setError('Password does not meet requirements. Please check all criteria.');
        } else {
          setError(getApiErrorMessage(apiError, 'Invalid reset token or password.'));
        }
      } else if (apiError?.status === 401) {
        if (apiError.body?.code === 'UNAUTHORIZED') {
          setTokenError('Reset token is invalid or has expired. Please request a new password reset link.');
        } else {
          setError('Reset token has expired. Please request a new password reset link.');
        }
      } else if (apiError?.status === 429) {
        setError('Too many requests. Please try again in a few minutes.');
      } else {
        const fallback = 'An error occurred. Please try again.';
        setError(apiError ? getApiErrorMessage(apiError, fallback) : fallback);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary relative overflow-hidden flex items-center justify-center p-6">
      <PageBackground />
      <div className="relative z-10 w-full max-w-[28rem] bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-2 border-primary/30 rounded-md shadow-lg shadow-primary/5 animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)] overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full"></div>
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-base mb-5 shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
            <Lock className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-tight">
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
                className="p-4 bg-gradient-to-br from-error-light to-red-50 border border-red-200 rounded-base text-sm text-error animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]"
              >
                <div className="flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="leading-relaxed">{tokenError}</p>
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
                  className="w-full h-11 px-4 pr-11 text-base font-sans text-text-primary bg-bg-primary border border-border-light rounded-base transition-all duration-150 outline-none hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.01]"
                  placeholder="At least 8 characters"
                  required
                  disabled={!token || !!tokenError || isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none p-2 cursor-pointer text-text-tertiary flex items-center rounded-sm transition-all duration-150 hover:text-text-secondary hover:bg-bg-secondary"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                  disabled={!token || !!tokenError || isLoading}
                >
                  {showNewPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password Strength Meter */}
              {newPassword && (
                <div aria-live="polite" aria-atomic="true">
                  <div className="flex gap-1 h-1 mt-2 transition-opacity duration-150 opacity-100">
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
                  <div className={`text-xs mt-1 flex items-center gap-2 transition-opacity duration-150 ${newPassword ? 'opacity-100' : 'opacity-0'}`}>
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
                    {passwordStrength.hint && (
                      <span className="text-text-tertiary">— {passwordStrength.hint}</span>
                    )}
                  </div>
                </div>
              )}
              <div className="text-xs text-text-tertiary mt-1">
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
                  className={`w-full h-11 px-4 pr-11 text-base font-sans text-text-primary bg-bg-primary border rounded-base transition-all duration-150 outline-none ${
                    passwordMatch === true
                      ? 'border-success bg-success-light/5 focus:shadow-[0_0_0_3px_rgba(22,163,74,0.1)]'
                      : passwordMatch === false
                      ? 'border-error bg-error-light/5 focus:shadow-[0_0_0_3px_rgba(220,38,38,0.1)]'
                      : 'border-border-light hover:border-border-medium focus:border-primary focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] focus:scale-[1.01]'
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none p-2 cursor-pointer text-text-tertiary flex items-center rounded-sm transition-all duration-150 hover:text-text-secondary hover:bg-bg-secondary"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={!token || !!tokenError || isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" aria-hidden="true" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div id="confirm-password-message">
                {passwordMatch === false && (
                  <div className="text-xs text-error flex items-center gap-2 min-h-[1.125rem]">
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                    Passwords do not match
                  </div>
                )}
                {passwordMatch === true && (
                  <div className="text-xs text-success flex items-center gap-2 min-h-[1.125rem]">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
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

