import React from 'react'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {session.user.firstName}!</h1>
      
      {session.user.role === 'seeker' ? (
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            As a visa seeker, you can manage your visa requests and track their progress here.
          </p>
          <Button asChild>
            <Link href="/my-requests">View My Requests</Link>
          </Button>
        </div>
      ) : session.user.role === 'provider' ? (
        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            As a service provider, you can browse and manage visa requests from seekers.
          </p>
          <Button asChild>
            <Link href="/browse-requests">Browse Visa Requests</Link>
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