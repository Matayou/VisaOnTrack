import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })

  console.log('Middleware - Token:', token)

  if (!token) {
    console.log('Middleware - No token, redirecting to signin')
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Check if the user is a service provider and trying to access protected routes
  if (token.role === 'PROVIDER' && isProtectedRoute(request.nextUrl.pathname)) {
    console.log('Middleware - Service provider accessing protected route')
    // Fetch profile data
    const profileResponse = await fetch(`${request.nextUrl.origin}/api/user/profile?userId=${token.sub}`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
    })
    
    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      console.log('Middleware - Profile data:', profileData)
      
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
  matcher: ['/dashboard/:path*', '/browse-requests/:path*', '/profile'],
}