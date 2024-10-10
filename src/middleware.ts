import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  if (token) {
    // Redirect logged-in users away from /signin and /verify-email
    if (request.nextUrl.pathname === '/signin' || request.nextUrl.pathname === '/verify-email') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Redirect visa seekers to complete profile if not done
    if (token.role === 'SEEKER' && token.profileCompleted === false) {
      if (!request.nextUrl.pathname.startsWith('/dashboard/complete-profile')) {
        return NextResponse.redirect(new URL('/dashboard/complete-profile', request.url))
      }
    }
  } else {
    // Redirect non-logged-in users to signin for protected routes
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/signin', '/verify-email'],
}
