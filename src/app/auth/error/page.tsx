'use client';

import React, { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [resendStatus, setResendStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  let errorMessage = 'An error occurred during authentication'
  let action = null

  const handleResendVerification = async () => {
    setIsLoading(true)
    setResendStatus(null)

    try {
      const email = searchParams.get('email')
      if (!email) {
        throw new Error('Email not found')
      }

      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setResendStatus('success')
      } else {
        setResendStatus('error')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setResendStatus('error')
    } finally {
      setIsLoading(false)
    }
  }

  switch (error) {
    case 'Email not verified':
      errorMessage = 'Your email has not been verified. Please check your inbox for a verification email.'
      action = (
        <div className="mt-4">
          <Button onClick={handleResendVerification} disabled={isLoading} className="w-full">
            {isLoading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
        </div>
      )
      break
    case 'CredentialsSignin':
      errorMessage = 'Invalid email or password. Please try again.'
      break
    // Add more error cases as needed
  }

  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
      {action}
      {resendStatus === 'success' && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-300">
          <AlertDescription>Verification email sent successfully. Please check your inbox.</AlertDescription>
        </Alert>
      )}
      {resendStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>Failed to resend verification email. Please try again later.</AlertDescription>
        </Alert>
      )}
      <div className="text-center mt-6">
        <Link href="/signin" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Back to Sign In
        </Link>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentication Error
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <ErrorContent />
        </div>
      </div>
    </div>
  )
}