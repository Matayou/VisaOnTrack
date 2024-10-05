'use client';

import React, { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Settings, CreditCard, Users, Clock, UserPlus, HelpCircle, MessageCircle, LogOut } from 'lucide-react'

export function HeaderNavigation() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { label: 'View Profile', icon: Users, href: '/profile' },
    { label: 'Settings', icon: Settings, href: '/settings' },
    { label: 'Subscription', icon: CreditCard, href: '/subscription' },
    { label: 'Request History', icon: Clock, href: '/history' },
    { label: 'Invite Member', icon: UserPlus, href: '/invite' },
    { label: 'Support', icon: HelpCircle, href: '/support' },
    { label: 'Community', icon: MessageCircle, href: '/community' },
  ]

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            VisaOnTrack
          </Link>
          {session ? (
            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center space-x-2"
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {session.user.firstName[0]}{session.user.lastName[0]}
                </div>
                <span>{session.user.firstName} {session.user.lastName}</span>
              </Button>
              {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-medium">{session.user.firstName} {session.user.lastName}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    <div className="border-t border-gray-100"></div>
                    {menuItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <item.icon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                        {item.label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100"
                      role="menuitem"
                    >
                      <LogOut className="mr-3 h-5 w-5 text-red-400" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Button asChild variant="ghost">
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}