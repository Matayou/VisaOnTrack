'use client';

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from "@/components/ui/button"

export function HeaderNavigation() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 font-poppins">
          VisaOnTrack
        </Link>
        <div className="space-x-4">
          {session ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              {session.user.role === 'provider' && (
                <Button asChild variant="ghost">
                  <Link href="/browse-requests">Browse Requests</Link>
                </Button>
              )}
              {session.user.role === 'seeker' && (
                <Button asChild variant="ghost">
                  <Link href="/my-requests">My Requests</Link>
                </Button>
              )}
              <Button asChild variant="ghost">
                <Link href="/profile">Profile</Link>
              </Button>
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