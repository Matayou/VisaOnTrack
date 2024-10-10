import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      firstName: string
      lastName: string
      role: string
      profileCompleted: boolean
    }
  }

  interface User {
    firstName: string
    lastName: string
    role: string
    profileCompleted: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    firstName: string
    lastName: string
    role: string
    profileCompleted: boolean
  }
}
