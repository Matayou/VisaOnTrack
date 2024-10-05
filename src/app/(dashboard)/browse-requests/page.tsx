import React from 'react'
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dynamic from 'next/dynamic'

const BrowseRequestsContent = dynamic(() => import('../../../components/BrowseRequestsContent').then(mod => mod.BrowseRequestsContent), {
  ssr: false,
})

export default async function BrowseRequestsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/signin')
  }

  if (session.user.role !== 'provider') {
    redirect('/dashboard')
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Browse Visa Requests</h1>
      <BrowseRequestsContent />
    </>
  )
}