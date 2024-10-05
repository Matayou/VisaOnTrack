import React from 'react'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function MyRequestsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  if (session.user.role !== 'seeker') {
    redirect('/dashboard')
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Visa Requests</h1>
      <p className="text-gray-600">
        This page will display your visa requests and their current status. 
        Feature coming soon!
      </p>
    </>
  )
}