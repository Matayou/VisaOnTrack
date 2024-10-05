'use client';

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = 'An error occurred during authentication'
  let action = null

  switch (error) {
    case 'Email not verified':
      errorMessage = 'Your email has not been verified. Please check your inbox for a verification email.'
      action = (
        <Button asChild>
          <Link href="/verify-email">Resend Verification Email</Link>
        </Button>
      )
      break
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password. Please try again.'
      break
    // Add more error cases as needed
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentication Error
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <p className="text-red-600 mb-4">{errorMessage}</p>
          {action}
          <div className="mt-4 text-center">
            <Link href="/signin" className="text-indigo-600 hover:text-indigo-800">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}