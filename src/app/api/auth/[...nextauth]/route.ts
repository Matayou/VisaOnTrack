import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextApiRequest, NextApiResponse } from "next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Modify the authOptions to include email in the error redirect
  const modifiedAuthOptions = {
    ...authOptions,
    callbacks: {
      ...authOptions.callbacks,
      async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
        // If it's an error page, include the email in the URL
        if (url.startsWith("/auth/error") && req.body?.email) {
          return `${url}&email=${encodeURIComponent(req.body.email)}`
        }
        // Default redirect behavior
        return url.startsWith(baseUrl) ? url : baseUrl
      },
    },
  }

  return await NextAuth(req, res, modifiedAuthOptions)
}

export { handler as GET, handler as POST }