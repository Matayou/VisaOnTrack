import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  // Paths that should not be accessible if the user is logged in
  const authRoutes = ['/signin', '/register', '/forgot-password', '/reset-password']

  // If the user is logged in and trying to access an auth route, redirect to dashboard
  if (token && authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If the user is not logged in, allow access to auth routes
  if (!token && authRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // If the user is not logged in and trying to access a protected route, redirect to signin
  if (!token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Check if the user is a service provider and trying to access protected routes
  if (token.role === 'PROVIDER' && isProtectedRoute(request.nextUrl.pathname)) {
    // Fetch profile data
    const profileResponse = await fetch(`${request.nextUrl.origin}/api/user/profile?userId=${token.sub}`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      
      // Check if profile is complete
      const isProfileComplete = profileData.about && 
                                profileData.about.trim() !== '' &&
                                profileData.areaOfExpertise &&
                                profileData.areaOfExpertise.length > 0 && 
                                profileData.location &&
                                profileData.location.trim() !== ''

      console.log('Middleware - Is profile complete:', isProfileComplete)

      if (!isProfileComplete) {
        console.log('Middleware - Profile incomplete, redirecting to profile page')
        return NextResponse.redirect(new URL('/profile', request.url))
      }
    } else {
      console.log('Middleware - Error fetching profile data, redirecting to profile page')
      return NextResponse.redirect(new URL('/profile', request.url))
    }
  }

  console.log('Middleware - Allowing access to:', request.nextUrl.pathname)
  return NextResponse.next()
}

function isProtectedRoute(pathname: string): boolean {
  const protectedRoutes = ['/dashboard', '/browse-requests']
  return protectedRoutes.some(route => pathname.startsWith(route))
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/browse-requests/:path*', 
    '/profile',
    '/signin',
    '/register/:path*',
    '/forgot-password',
    '/reset-password',
  ],
}