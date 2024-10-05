import React from 'react'
import { SignInForm } from '@/components/SignInForm'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Sign In to VisaOnTrack</h1>
          <SignInForm />
        </div>
      </div>
    </div>
  )
}