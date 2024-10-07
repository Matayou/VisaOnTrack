'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const verifyEmail = async () => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setTimeout(() => router.push('/signin'), 3000);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your email.');
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setStatus('error');
      setMessage('No email provided for resending verification.');
      return;
    }

    setStatus('loading');
    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while resending the verification email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {status === 'idle' && token && (
            <Button onClick={verifyEmail} className="w-full">
              Verify Email
            </Button>
          )}
          {status === 'loading' && <p>Processing...</p>}
          {(status === 'success' || status === 'error') && (
            <Alert variant={status === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
          {!token && email && (
            <Button onClick={resendVerificationEmail} className="w-full mt-4">
              Resend Verification Email
            </Button>
          )}
          <Button onClick={() => router.push('/signin')} className="w-full mt-4">
            Go to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}