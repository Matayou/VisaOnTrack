'use client';

import React, { useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = useCallback((path: string) => pathname === path, [pathname])

  const userRole = session?.user?.role || 'guest'

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
          {userRole === 'PROVIDER' && (
            <Link
              href="/dashboard/browse-requests"
              aria-label="Browse Requests"
              className={`block p-2 rounded ${
                isActive('/dashboard/browse-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Browse Requests
            </Link>
          )}
          {userRole === 'SEEKER' && (
            <Link
              href="/dashboard/my-requests"
              aria-label="View My Requests"
              className={`block p-2 rounded ${
                isActive('/dashboard/my-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
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
