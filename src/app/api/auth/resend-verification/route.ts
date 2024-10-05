import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 400 })
    }

    const newVerificationToken = uuidv4()

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken: newVerificationToken }
    })

    await sendVerificationEmail(user.email, newVerificationToken)

    return NextResponse.json({ message: 'Verification email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json({ message: 'An error occurred while resending the verification email' }, { status: 500 })
  }
}