import { useSession } from "next-auth/react"
import { withRoleAccess } from "@/components/withRoleAccess"
import Head from 'next/head'

function Dashboard() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>VisaOnTrack - Dashboard</title>
        <meta name="description" content="VisaOnTrack user dashboard" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-3xl font-extrabold text-gray-900">Dashboard</h2>
                  <p>Welcome, {session?.user?.name || session?.user?.email}!</p>
                  <p>Your role: {session?.user?.role || "Not specified"}</p>
                  {session?.user?.role === 'ADMIN' && (
                    <p>Admin-only content: You have access to all features.</p>
                  )}
                  {session?.user?.role === 'PROVIDER' && (
                    <p>Provider-only content: You can manage your visa services here.</p>
                  )}
                  {session?.user?.role === 'VISA_SEEKER' && (
                    <p>Visa Seeker-only content: You can browse and apply for visas here.</p>
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

export default withRoleAccess(Dashboard, ['ADMIN', 'PROVIDER', 'VISA_SEEKER'])