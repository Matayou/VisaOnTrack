'use client';

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Menu, User, Globe, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function HeaderNavigation() {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasNotification, setHasNotification] = useState(false) // Placeholder state for notifications
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
    }

    window.addEventListener('popstate', handleRouteChange)

    // Placeholder: Set a notification after 5 seconds (for demonstration)
    const timer = setTimeout(() => {
      setHasNotification(true)
    }, 5000)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
      clearTimeout(timer)
    }
  }, [])

  const handleLinkClick = (href: string) => {
    setIsMenuOpen(false)
    router.push(href)
  }

  const handleSignOut = async () => {
    setIsMenuOpen(false)
    await signOut()
  }

  return (
    <header className="bg-white shadow-sm w-full sticky top-0 z-10">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 font-poppins">
          VisaOnTrack
        </Link>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Globe size={20} />
          </button>
          {session && (
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Bell size={20} />
                {hasNotification && (
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
            </div>
          )}
          <div className="relative">
            <button onClick={toggleMenu} className="flex items-center space-x-2 border rounded-full p-2 hover:shadow-md">
              <Menu size={20} />
              <User size={20} />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2">
                {status === 'loading' ? (
                  <div className="px-4 py-2 text-gray-600">Loading...</div>
                ) : session ? (
                  <>
                    <button onClick={() => handleLinkClick('/dashboard')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Dashboard</button>
                    {session.user.role === 'PROVIDER' && (
                      <button onClick={() => handleLinkClick('/dashboard/browse-requests')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Browse Requests</button>
                    )}
                    <button onClick={() => handleLinkClick('/account')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Account</button>
                    {!session.user.profileCompleted && (
                      <button onClick={() => handleLinkClick('/dashboard/complete-profile')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Complete Profile</button>
                    )}
                    <hr className="my-2" />
                    <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Log out</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleLinkClick('/signin')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Log in</button>
                    <button onClick={() => handleLinkClick('/register')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Sign up</button>
                    <hr className="my-2" />
                    <button onClick={() => handleLinkClick('/help')} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Help Center</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
