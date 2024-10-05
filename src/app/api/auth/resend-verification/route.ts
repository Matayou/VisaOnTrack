import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 400 })
    }

    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    })

    // Create a new verification token
    const verificationToken = await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken.token)

    return NextResponse.json({ message: 'Verification email sent successfully' })
  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json({ message: 'An error occurred while resending the verification email' }, { status: 500 })
  }
}