import React from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export default function Profile() {
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
        <title>Profile - VisaOnTrack</title>
        <meta name="description" content="View and edit your VisaOnTrack profile" />
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <div>
          <p>First Name: {session.user.firstName}</p>
          <p>Last Name: {session.user.lastName}</p>
          <p>Email: {session.user.email}</p>
          <p>Role: {session.user.role}</p>
        </div>
        {/* Add form to edit profile information here */}
      </div>
    </>
  )
}