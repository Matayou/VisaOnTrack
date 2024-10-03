import React from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function MyRequests() {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Head>
        <title>My Requests - VisaOnTrack</title>
        <meta name="description" content="View and manage your visa requests on VisaOnTrack" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">My Requests</h1>
        <p>View and manage your visa requests here, {session.user.firstName} {session.user.lastName}.</p>
        {/* Add list of user's visa requests here */}
      </div>
    </>
  )
}