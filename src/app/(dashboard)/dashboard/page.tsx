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

  // In a real application, you'd fetch this data from your API
  const activeRequests = [
    { id: 1, type: 'Tourist Visa', status: 'In Progress', provider: 'Thai Visa Expert' },
    { id: 2, type: 'Work Permit', status: 'Awaiting Documents', provider: 'Bangkok Legal Services' },
  ]

  const previousRequests = [
    { id: 3, type: 'Education Visa', status: 'Completed', provider: 'Study in Thailand Co.' },
    { id: 4, type: 'Retirement Visa', status: 'Expired', provider: 'Golden Years Visa Services' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">Welcome, {session.user.firstName}!</h1>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Active Requests</h2>
            {activeRequests.map((request) => (
              <div key={request.id} className="mb-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">{request.type}</h3>
                <p className="text-gray-600">Status: {request.status}</p>
                <p className="text-gray-600">Provider: {request.provider}</p>
              </div>
            ))}
            <Button asChild className="mt-4">
              <Link href="/new-request">New Request</Link>
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Previous Requests</h2>
            {previousRequests.map((request) => (
              <div key={request.id} className="mb-4 p-4 border rounded">
                <h3 className="text-xl font-semibold">{request.type}</h3>
                <p className="text-gray-600">Status: {request.status}</p>
                <p className="text-gray-600">Provider: {request.provider}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-blue-600 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild variant="outline">
              <Link href="/profile">View Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/settings">Account Settings</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">Get Support</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/resources">Visa Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}