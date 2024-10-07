'use client';

import React from 'react'
import { SignInForm } from '@/components/SignInForm'
import { useSearchParams } from 'next/navigation'
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {error === 'CredentialsSignin'
                  ? 'Invalid email or password'
                  : error === 'EmailNotVerified'
                  ? 'Please verify your email before signing in'
                  : 'An error occurred during sign in'}
              </AlertDescription>
            </Alert>
          )}
          <SignInForm />
        </div>
      </div>
    </div>
  )
}