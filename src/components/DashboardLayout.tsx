'use client';

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-100 min-h-screen p-4">
        <nav className="space-y-2">
          <Link
            href="/dashboard"
            className={`block p-2 rounded ${
              isActive('/dashboard') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            Dashboard
          </Link>
          {session?.user.role === 'provider' && (
            <Link
              href="/browse-requests"
              className={`block p-2 rounded ${
                isActive('/browse-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              Browse Requests
            </Link>
          )}
          {session?.user.role === 'seeker' && (
            <Link
              href="/my-requests"
              className={`block p-2 rounded ${
                isActive('/my-requests') ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Requests
            </Link>
          )}
          <Link
            href="/profile"
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