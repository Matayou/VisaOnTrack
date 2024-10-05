import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (token) {
    if (!token.emailVerified && !request.nextUrl.pathname.startsWith('/verify-email')) {
      return NextResponse.redirect(new URL('/verify-email', request.url))
    }

    if (token.role === 'provider' && request.nextUrl.pathname === '/dashboard/my-requests') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (token.role === 'seeker' && request.nextUrl.pathname === '/dashboard/browse-requests') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/verify-email'],
}