import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

const areaOfExpertiseOptions = [
  'Visa Application',
  'Legal Consultation',
  'Document Translation',
  'Immigration Law',
  'Work Permits',
] as const;

const locationOptions = ['BANGKOK', 'CHIANG_MAI', 'PATTAYA', 'PHUKET', 'HUA_HIN'] as const;

type AreaOfExpertise = typeof areaOfExpertiseOptions[number];
type Location = typeof locationOptions[number];

export async function PUT(req: Request) {
  console.log('Update Profile API - Request received')
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('Update Profile API - No session, returning 401')
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await req.json()
  const { about, areaOfExpertise, location } = body

  console.log('Update Profile API - Received data:', { about, areaOfExpertise, location })

  // Validate input
  if (typeof about !== 'string') {
    console.log('Update Profile API - Invalid about field')
    return NextResponse.json({ error: 'Invalid about field' }, { status: 400 })
  }

  if (!Array.isArray(areaOfExpertise) || !areaOfExpertise.every(area => areaOfExpertiseOptions.includes(area as AreaOfExpertise))) {
    console.log('Update Profile API - Invalid area of expertise')
    return NextResponse.json({ error: 'Invalid area of expertise' }, { status: 400 })
  }

  if (!locationOptions.includes(location as Location)) {
    console.log('Update Profile API - Invalid location')
    return NextResponse.json({ error: 'Invalid location' }, { status: 400 })
  }

  try {
    if (session.user.role === 'PROVIDER') {
      console.log('Update Profile API - Updating profile for provider')
      const updatedProfile = await prisma.serviceProviderProfile.upsert({
        where: { userId: session.user.id },
        update: {
          about: about.trim(),
          areaOfExpertise,
          location,
        },
        create: {
          userId: session.user.id,
          about: about.trim(),
          areaOfExpertise,
          location,
        },
      })

      console.log('Update Profile API - Profile updated:', updatedProfile)
      return NextResponse.json(updatedProfile)
    } else {
      console.log('Update Profile API - User is not a service provider')
      return NextResponse.json({ error: 'User is not a service provider' }, { status: 403 })
    }
  } catch (error) {
    console.error('Update Profile API - Error updating profile:', error)
    return NextResponse.json({ error: 'Error updating profile' }, { status: 500 })
  }
}