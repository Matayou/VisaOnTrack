'use client';

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export function HeaderNavigation() {
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log('Session status:', status)
    console.log('Session data:', session)
  }, [session, status])

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 font-poppins">
          VisaOnTrack
        </Link>
        <div className="space-x-4">
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              {session.user.emailVerified ? (
                <>
                  {session.user.role === 'PROVIDER' && (
                    <>
                      <Button asChild variant="ghost">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      <Button asChild variant="ghost">
                        <Link href="/dashboard/browse-requests">Browse Requests</Link>
                      </Button>
                    </>
                  )}
                  {session.user.role === 'SEEKER' && (
                    <Button asChild variant="ghost">
                      <Link href="/dashboard/my-requests">My Requests</Link>
                    </Button>
                  )}
                  <Button asChild variant="ghost">
                    <Link href="/profile">Profile</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="ghost">
                  <Link href="/verify-email">Verify Email</Link>
                </Button>
              )}
              <Button onClick={() => signOut()} variant="outline">
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}