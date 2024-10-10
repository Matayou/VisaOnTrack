import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dateOfBirth, nationality, thaiVisaType, visaExpiryDate } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        thaiVisaType,
        visaExpiryDate: new Date(visaExpiryDate),
        profileCompleted: true,
      },
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      user: {
        ...updatedUser,
        dateOfBirth: updatedUser.dateOfBirth?.toISOString(),
        visaExpiryDate: updatedUser.visaExpiryDate?.toISOString(),
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
