'use client';

import React, { useEffect } from 'react'
import { SignInForm } from '@/components/SignInForm'
import { useSearchParams } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"

export default function SignInPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const { toast } = useToast()

  useEffect(() => {
    if (error) {
      let errorMessage = 'An error occurred during sign in'
      if (error === 'CredentialsSignin') {
        errorMessage = 'Invalid email or password'
      } else if (error === 'EmailNotVerified') {
        errorMessage = 'Please verify your email before signing in'
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }, [error, toast])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <SignInForm />
        </div>
      </div>
    </div>
  )
}