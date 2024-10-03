import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const { data: session } = useSession()

  return (
    <nav className="bg-background border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-7">
            <div>
              <Link href="/" className="flex items-center py-4 px-2">
                <Typography variant="h6" className="text-primary font-bold">VisaOnTrack</Typography>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">
                <Typography variant="p">Home</Typography>
              </Link>
              {session && (
                <Link href="/dashboard" className="py-4 px-2 text-foreground hover:text-primary transition duration-300">
                  <Typography variant="p">Dashboard</Typography>
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            {session ? (
              <>
                <Link href="/profile" className="py-2 px-2 text-foreground hover:text-primary transition duration-300">
                  <Typography variant="p">Profile</Typography>
                </Link>
                <Button onClick={() => signOut()} variant="secondary">Log Out</Button>
              </>
            ) : (
              <>
                <Link href="/api/auth/signin" className="py-2 px-2 text-foreground hover:text-primary transition duration-300">
                  <Typography variant="p">Log In</Typography>
                </Link>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}