import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <span className="font-semibold text-gray-500 text-lg">VisaOnTrack</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Home</Link>
              {session && (
                <Link href="/dashboard" className="py-4 px-2 text-gray-500 hover:text-green-500 transition duration-300">Dashboard</Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/profile" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Profile</Link>
                <button onClick={() => signOut()} className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Log Out</button>
              </>
            ) : (
              <>
                <Link href="/api/auth/signin" className="py-2 px-2 font-medium text-gray-500 rounded hover:bg-green-500 hover:text-white transition duration-300">Log In</Link>
                <Link href="/register" className="py-2 px-2 font-medium text-white bg-green-500 rounded hover:bg-green-400 transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}