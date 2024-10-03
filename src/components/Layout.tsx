import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const hideNavigation = ['/signin', '/register', '/forgot-password'].includes(router.pathname)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                VisaOnTrack
              </Link>
            </div>
            {!hideNavigation && (
              <>
                <nav className="hidden md:flex items-center space-x-4">
                  {session ? (
                    <>
                      <NavLink href="/dashboard">Dashboard</NavLink>
                      <NavLink href="/new-visa-request">New Visa Request</NavLink>
                      <NavLink href="/my-requests">My Requests</NavLink>
                      <NavLink href="/messages">Messages</NavLink>
                      <div className="relative">
                        <button
                          onClick={toggleProfile}
                          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                          <span>{session.user?.firstName} {session.user?.lastName}</span>
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        {isProfileOpen && <ProfileDropdown onSignOut={handleSignOut} />}
                      </div>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost">
                        <Link href="/signin">Log in</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Sign up</Link>
                      </Button>
                    </>
                  )}
                </nav>
                <div className="md:hidden">
                  <button onClick={toggleMenu} className="text-gray-700 hover:text-gray-900 focus:outline-none p-2">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        {isMenuOpen && !hideNavigation && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {session ? (
                <>
                  <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                  <MobileNavLink href="/new-visa-request">New Visa Request</MobileNavLink>
                  <MobileNavLink href="/my-requests">My Requests</MobileNavLink>
                  <MobileNavLink href="/messages">Messages</MobileNavLink>
                  <MobileNavLink href="/profile">Profile</MobileNavLink>
                  <MobileNavLink href="/settings">Settings</MobileNavLink>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/signin">Log in</MobileNavLink>
                  <MobileNavLink href="/register">Sign up</MobileNavLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-gray-50 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} VisaOnTrack. All rights reserved.
            </div>
            <nav className="flex space-x-4">
              <Link href="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
      {children}
    </Link>
  )
}

function ProfileDropdown({ onSignOut }: { onSignOut: () => void }) {
  return (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Profile
      </Link>
      <Link href="/messages" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Messages
      </Link>
      <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
        Settings
      </Link>
      <button
        onClick={onSignOut}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Sign out
      </button>
    </div>
  )
}