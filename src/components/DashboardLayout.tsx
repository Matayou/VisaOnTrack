'use client';

import React, { useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession() as { data: Session | null }

  const isActive = useCallback((path: string) => pathname === path, [pathname])

  const userRole = session?.user?.role || 'guest'
  const profileCompleted = session?.user?.profileCompleted

  if (!profileCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Profile Incomplete</h1>
          <p className="mb-4">Please complete your profile to access the dashboard.</p>
          <Link href="/complete-profile" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Complete Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 min-h-screen p-4">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            aria-label="Go to Dashboard"
            className={`block p-2 rounded ${
              isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </Link>
          {userRole === 'provider' && (
            <Link
              href="/browse-requests"
              aria-label="Browse Requests"
              className={`block p-2 rounded ${
                isActive('/browse-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Browse Requests
            </Link>
          )}
          {userRole === 'seeker' && (
            <Link
              href="/my-requests"
              aria-label="View My Requests"
              className={`block p-2 rounded ${
                isActive('/my-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Requests
            </Link>
          )}
          <Link
            href="/profile"
            aria-label="Go to Profile"
            className={`block p-2 rounded ${
              isActive('/profile') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Profile
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
