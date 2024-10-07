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
      return NextResponse.json({ message: 'No user found with this email' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email is already verified' }, { status: 400 })
    }

    // Generate new verification token
    const verificationToken = `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    })

    // Send verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ message: 'Verification email sent successfully' })
  } catch (error) {
    console.error('Resend verification email error:', error)
    return NextResponse.json({ message: 'An error occurred while resending the verification email' }, { status: 500 })
  }
}