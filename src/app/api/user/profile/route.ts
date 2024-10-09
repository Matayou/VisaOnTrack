import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(req: Request) {
  console.log('Profile API - Request received')
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('Profile API - No session, returning 401')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const userId = searchParams.get('userId')

  console.log('Profile API - User ID:', userId)

  if (!userId) {
    console.log('Profile API - No user ID provided, returning 400')
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }

  try {
    console.log('Profile API - Fetching user data from database')
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        serviceProviderProfile: true,
      },
    })

    if (!user) {
      console.log('Profile API - User not found, returning 404')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.id !== session.user.id) {
      console.log('Profile API - Unauthorized access, returning 403')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const profileData = user.serviceProviderProfile || {
      about: '',
      areaOfExpertise: [],
      location: '',
    }

    console.log('Profile API - Returning profile data:', profileData)
    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Profile API - Error fetching profile data:', error)
    return NextResponse.json({ error: 'Error fetching profile data' }, { status: 500 })
  }
}