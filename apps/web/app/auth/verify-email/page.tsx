'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { api } from '@visaontrack/client';

type VerificationState = 'idle' | 'checking' | 'success' | 'error' | 'no-token';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>('idle');
  const [message, setMessage] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [devVerificationLink, setDevVerificationLink] = useState<string | null>(null);
  const verificationAttempted = useRef(false); // Prevent multiple verification attempts
  const verificationSucceeded = useRef(false); // Track if verification already succeeded

  // Check for dev verification link in sessionStorage (local dev only)
  useEffect(() => {
    const storedLink = sessionStorage.getItem('devVerificationLink');
    if (storedLink) {
      setDevVerificationLink(storedLink);
      // Clear it after reading
      sessionStorage.removeItem('devVerificationLink');
    }
  }, []);

  // Check for token in URL and verify if present
  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setState('no-token');
      return;
    }

    // Prevent multiple verification attempts (React StrictMode causes double renders in dev)
    // Also check if we're already in success state
    if (verificationAttempted.current || verificationSucceeded.current || state === 'success') {
      return;
    }
    verificationAttempted.current = true;

    // Verify token
    setState('checking');
    setMessage('Verifying your email...');

    api.auth
      .verifyEmail({ token })
      .then((response) => {
        // Mark verification as succeeded to prevent error handling from running
        verificationSucceeded.current = true;
        
        setState('success');
        setMessage(response.message || 'Email verified successfully!');
        
        // Clear token from URL to prevent re-verification attempts
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
        
        // Redirect to onboarding after 2 seconds
        setTimeout(() => {
          router.push('/onboarding/account-type');
        }, 2000);
      })
      .catch(async (err: any) => {
        // If verification already succeeded, ignore this error (prevents double-render issues)
        if (verificationSucceeded.current) {
          return;
        }
        
        // Log full error for debugging
        console.error('[VerifyEmailPage] Verification error:', {
          status: err?.status,
          statusText: err?.statusText,
          message: err?.message,
          body: err?.body,
          url: err?.url,
        });
        
        // Extract error message from response body
        const errorMessage = err?.body?.message || err?.message || 'An error occurred while verifying your email.';
        const errorCode = err?.body?.code;
        
        // If error is "already verified", check user status and treat as success
        if (err?.status === 400 && errorMessage.toLowerCase().includes('already verified')) {
          try {
            // Check if user's email is actually verified
            const user = await api.users.getCurrentUser();
            if (user.emailVerified) {
              // Email is already verified - treat as success
              setState('success');
              setMessage('Your email is already verified. Redirecting...');
              setTimeout(() => {
                router.push('/onboarding/account-type');
              }, 1500);
              return;
            }
          } catch (checkErr) {
            console.error('[VerifyEmailPage] Error checking user status:', checkErr);
            // If we can't check user status, fall through to error handling
          }
        }
        
        // Handle 401 Unauthorized - token invalid or expired
        if (err?.status === 401) {
          setState('error');
          // Use the actual backend error message if available, otherwise use generic message
          const message = errorCode === 'UNAUTHORIZED' && errorMessage 
            ? errorMessage 
            : 'Invalid or expired verification token. Please request a new verification email using the button below.';
          setMessage(message);
          return; // Don't redirect on error
        }
        
        // Handle other errors
        setState('error');
        if (err?.status === 400) {
          // Check if it's an "already verified" error that we couldn't confirm
          if (errorMessage.toLowerCase().includes('already verified')) {
            setMessage('Your email appears to be already verified. If you continue to see this error, please try logging in.');
          } else {
            setMessage(errorMessage);
          }
        } else {
          setMessage(errorMessage);
        }
      });
  }, [searchParams, router]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendError(null);
    setResendSuccess(false);

    try {
      const response = await api.auth.resendVerification();
      setResendSuccess(true);
      setResendError(null);
      
      // Update dev verification link if available in response
      if ((response as any).verificationLink) {
        setDevVerificationLink((response as any).verificationLink);
        // Also store in sessionStorage for persistence
        sessionStorage.setItem('devVerificationLink', (response as any).verificationLink);
      }
    } catch (err: any) {
      console.error('[VerifyEmailPage] Resend verification error:', {
        status: err?.status,
        body: err?.body,
        message: err?.message,
      });
      
      const errorMessage = err?.body?.message || err?.message || 'Failed to resend verification email.';
      
      if (err?.status === 400) {
        if (errorMessage.toLowerCase().includes('already verified')) {
          setResendError('Your email is already verified. You can proceed to onboarding.');
          // If already verified, redirect after a moment
          setTimeout(() => {
            router.push('/onboarding/account-type');
          }, 2000);
        } else {
          setResendError(errorMessage);
        }
      } else if (err?.status === 401) {
        setResendError('Please sign in to resend verification email.');
      } else if (err?.status === 429) {
        setResendError('Too many requests. Please try again in a few minutes.');
      } else {
        setResendError(errorMessage);
      }
      setResendSuccess(false);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center p-6">
      <div className="w-full max-w-[28rem] bg-bg-primary border border-border-light rounded-md shadow-md animate-[slideUp_300ms_cubic-bezier(0.16,1,0.3,1)]">
        {/* Header */}
        <div className="p-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary-hover rounded-base mb-5 shadow-[0_2px_8px_rgba(37,99,235,0.2)]">
            {state === 'success' ? (
              <CheckCircle className="w-6 h-6 text-white" aria-hidden="true" />
            ) : state === 'error' ? (
              <AlertCircle className="w-6 h-6 text-white" aria-hidden="true" />
            ) : (
              <Mail className="w-6 h-6 text-white" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2 leading-tight">
            {state === 'success'
              ? 'Email verified!'
              : state === 'error'
              ? 'Verification failed'
              : state === 'checking'
              ? 'Verifying email...'
              : 'Check your email'}
          </h1>
          <p className="text-sm text-text-secondary">
            {state === 'success'
              ? 'Redirecting to onboarding...'
              : state === 'error'
              ? 'We couldn\'t verify your email address'
              : state === 'checking'
              ? 'Please wait while we verify your email'
              : 'We sent a verification link to your email address'}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Success Message */}
          {state === 'success' && (
            <div
              role="alert"
              className="p-4 bg-gradient-to-br from-success-light to-green-50 border border-success rounded-base text-sm text-success animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]"
            >
              <div className="flex gap-3 items-start">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">{message}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {state === 'error' && (
            <div
              role="alert"
              className="p-4 bg-gradient-to-br from-error-light to-red-50 border border-red-200 rounded-base text-sm text-error animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)] mb-5"
            >
              <div className="flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">{message}</p>
              </div>
            </div>
          )}

          {/* No Token / Check Email Message */}
          {state === 'no-token' && (
            <div className="text-center mb-6">
              <p className="text-sm text-text-secondary mb-6">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
              
              {/* Dev-only: Show verification link for local development */}
              {devVerificationLink && (
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-base mb-6 text-left">
                  <p className="text-xs font-semibold text-primary mb-2">🔧 Development Mode</p>
                  <p className="text-xs text-text-secondary mb-3">
                    Since email service is not configured, use this link to verify your email:
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href={devVerificationLink}
                      className="text-xs text-primary hover:text-primary-hover underline break-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {devVerificationLink}
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(devVerificationLink);
                        setResendSuccess(true);
                        setTimeout(() => setResendSuccess(false), 2000);
                      }}
                      className="text-xs text-primary hover:text-primary-hover underline text-left"
                    >
                      📋 Copy link
                    </button>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-text-tertiary mb-6">
                Didn't receive the email? Check your spam folder or request a new verification email.
              </p>
            </div>
          )}

          {/* Resend Verification Section */}
          {(state === 'no-token' || state === 'error') && (
            <div className="mt-6">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className={`w-full h-11 px-6 text-base font-medium text-white rounded-base border-none cursor-pointer transition-all duration-150 shadow-xs relative overflow-hidden flex items-center justify-center gap-2 ${
                    isResending
                      ? 'opacity-60 cursor-not-allowed'
                      : 'bg-gradient-to-b from-primary to-primary-hover hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] active:translate-y-0'
                  }`}
                >
                  {isResending && (
                    <div className="absolute w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  <RefreshCw className={`w-4 h-4 ${isResending ? 'opacity-0' : ''}`} aria-hidden="true" />
                  <span className={isResending ? 'opacity-70' : ''}>
                    {isResending ? 'Sending...' : 'Resend verification email'}
                  </span>
                </button>

                {/* Resend Success Message */}
                {resendSuccess && (
                  <div
                    role="alert"
                    className="p-3 bg-gradient-to-br from-success-light to-green-50 border border-success rounded-base text-xs text-success animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <div className="flex gap-2 items-start">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p>Verification email sent! Please check your inbox.</p>
                    </div>
                  </div>
                )}

                {/* Resend Error Message */}
                {resendError && (
                  <div
                    role="alert"
                    className="p-3 bg-gradient-to-br from-error-light to-red-50 border border-red-200 rounded-base text-xs text-error animate-[fadeInUp_400ms_cubic-bezier(0.16,1,0.3,1)]"
                  >
                    <div className="flex gap-2 items-start">
                      <AlertCircle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <p>{resendError}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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


