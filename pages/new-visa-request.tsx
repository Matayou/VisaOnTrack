import React from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function NewVisaRequest() {
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
        <title>New Visa Request - VisaOnTrack</title>
        <meta name="description" content="Create a new visa request with VisaOnTrack" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">New Visa Request</h1>
        <p>Create your new visa request here, {session.user.firstName} {session.user.lastName}.</p>
        {/* Add form for new visa request here */}
      </div>
    </>
  )
}