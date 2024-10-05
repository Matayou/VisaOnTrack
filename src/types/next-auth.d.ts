import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      role: string
      emailVerified: Date | null
    } & DefaultSession["user"]
  }

  interface User {
    firstName: string
    lastName: string
    role: string
    emailVerified: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    firstName: string
    lastName: string
    role: string
    emailVerified: Date | null
  }
}