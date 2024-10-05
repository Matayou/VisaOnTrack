import NextAuth, { DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      role: string
      emailVerified: Date | null
    }
  }

  interface User extends DefaultUser {
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
    email: string
    role: string
    emailVerified: Date | null
  }
}