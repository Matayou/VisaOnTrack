import { NextResponse } from 'next/server'
import { createUser } from '@/lib/auth-service'
import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email'
import prisma from '@/lib/prisma'
import { Role } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const user = await createUser(email, password, firstName, lastName, Role.PROVIDER)

    if (user.verificationToken) {
      // Send verification email
      await sendVerificationEmail(email, user.verificationToken)
    }

    // Send welcome email
    await sendWelcomeEmail(email, firstName)

    return NextResponse.json({ message: 'User created successfully. Please check your email to verify your account.' }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}
