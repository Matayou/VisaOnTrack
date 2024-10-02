import { useSession } from "next-auth/react"
import { withRoleAccess } from "@/components/withRoleAccess"
import Head from 'next/head'

function Profile() {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>VisaOnTrack - User Profile</title>
        <meta name="description" content="VisaOnTrack user profile" />
      </Head>

      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-3xl font-extrabold text-gray-900">User Profile</h2>
                  <p>Name: {session?.user?.name || "Not provided"}</p>
                  <p>Email: {session?.user?.email}</p>
                  <p>Role: {session?.user?.role || "Not specified"}</p>
                </div>
                <div className="pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <p className="text-gray-500">Profile editing feature coming soon!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRoleAccess(Profile, ['ADMIN', 'PROVIDER', 'VISA_SEEKER'])