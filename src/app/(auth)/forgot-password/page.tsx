import React from 'react'
import { ForgotPasswordForm } from '@/components/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">Forgot Password</h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter your email to reset your password
          </p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}