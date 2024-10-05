import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password } = await req.json()

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationToken = uuidv4()

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: 'VISA_SEEKER',
        emailVerified: null,
        verificationToken,
      },
    })

    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({ 
      message: 'User created successfully. Please check your email to verify your account.',
    }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: 'An error occurred during registration' }, { status: 500 })
  }
}