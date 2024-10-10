'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verificationStatus, setVerificationStatus] = useState<{ success: boolean; error?: string } | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (response.ok) {
          setVerificationStatus({ success: true });
        } else {
          const error = await response.text();
          setVerificationStatus({ success: false, error });
        }
      } catch (error) {
        setVerificationStatus({ success: false, error: 'An unexpected error occurred' });
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setVerificationStatus({ success: false, error: 'No verification token provided' });
    }
  }, [token]);

  if (!verificationStatus) {
    return <div>Verifying email...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verificationStatus.success ? (
            <p className="text-green-600 text-center">Your email has been verified successfully!</p>
          ) : (
            <p className="text-red-600 text-center">{verificationStatus.error || 'Failed to verify email.'}</p>
          )}
          <div className="mt-6">
            <Link href="/signin" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Go to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
