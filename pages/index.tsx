import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function Home() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>VisaOnTrack - Home</title>
        <meta name="description" content="VisaOnTrack - Your visa application made easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-3xl font-extrabold text-gray-900">Welcome to VisaOnTrack</h1>
                  <p>Your one-stop solution for visa applications and tracking.</p>
                  {session ? (
                    <p>You are logged in as {session.user?.name || session.user?.email}.</p>
                  ) : (
                    <p>Please log in to access your dashboard.</p>
                  )}
                </div>
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  {session ? (
                    <Link href="/dashboard" className="text-cyan-600 hover:text-cyan-700">
                      Go to Dashboard
                    </Link>
                  ) : (
                    <Link href="/api/auth/signin" className="text-cyan-600 hover:text-cyan-700">
                      Log In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}