'use client';

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export function HeaderNavigation() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 font-poppins">
          VisaOnTrack
        </Link>
        <div className="space-x-4">
          {status === 'loading' ? (
            <span>Loading...</span>
          ) : session ? (
            <>
              {session.user.profileCompleted ? (
                <>
                  <Button asChild variant="ghost">
                    <Link href="/dashboard">Dashboard</Link>
                  </Button>
                  {session.user.role === 'PROVIDER' && (
                    <Button asChild variant="ghost">
                      <Link href="/dashboard/browse-requests">Browse Requests</Link>
                    </Button>
                  )}
                  <Button asChild variant="ghost">
                    <Link href="/account">Account</Link>
                  </Button>
                </>
              ) : (
                <Button asChild variant="ghost">
                  <Link href="/dashboard/complete-profile">Complete Profile</Link>
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
