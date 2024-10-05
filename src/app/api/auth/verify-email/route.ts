import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { token } = await req.json()

  if (!token) {
    return NextResponse.json({ message: 'Verification token is required' }, { status: 400 })
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token }
    })

    if (!user) {
      return NextResponse.json({ message: 'Invalid verification token' }, { status: 400 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email already verified' }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationToken: null
      }
    })

    return NextResponse.json({ 
      message: 'Email verified successfully',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified
      }
    }, { status: 200 })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json({ message: 'An error occurred during email verification' }, { status: 500 })
  }
}