import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { signJwtAccessToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_token', req.url))
    }

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/error?error=invalid_token', req.url))
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        emailVerified: new Date(),
        verificationToken: null,
      },
    })

    // Generate JWT token
    const jwtToken = signJwtAccessToken({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    })

    // Set the token as a cookie
    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    // Add a success message as a query parameter
    const successUrl = new URL('/dashboard', req.url)
    successUrl.searchParams.set('emailVerified', 'true')
    
    return NextResponse.redirect(successUrl)
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(new URL('/auth/error?error=verification_failed', req.url))
  }
}