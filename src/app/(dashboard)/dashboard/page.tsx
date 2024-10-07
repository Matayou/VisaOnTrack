'use client';

import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }

    if (searchParams.get('emailVerified') === 'true') {
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 5000) // Hide message after 5 seconds
    }
  }, [status, router, searchParams])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <>
      {showSuccessMessage && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-300 mb-4">
          <AlertDescription>Your email has been successfully verified. Welcome to VisaOnTrack!</AlertDescription>
        </Alert>
      )}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {session.user.firstName}!</h1>
      
      {session.user.role === 'SEEKER' ? (
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            As a visa seeker, you can manage your visa requests and track their progress here.
          </p>
          <Button asChild>
            <Link href="/dashboard/my-requests">View My Requests</Link>
          </Button>
        </div>
      ) : session.user.role === 'PROVIDER' ? (
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            As a service provider, you can browse and manage visa requests from seekers.
          </p>
          <Button asChild>
            <Link href="/dashboard/browse-requests">Browse Visa Requests</Link>
          </Button>
        </div>
      ) : (
        <p className="text-lg text-gray-600">
          Welcome to your dashboard. Your account type is not recognized.
        </p>
      )}
    </>
  )
}