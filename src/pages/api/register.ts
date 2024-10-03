import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Define Role enum to match Prisma schema
enum Role {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  VISA_SEEKER = 'VISA_SEEKER'
}

// Define a type for Prisma error
type PrismaError = Error & {
  code?: string;
};

// Define types for extended Prisma client
type PrismaClientWithProvider = typeof prisma & {
  provider: {
    create: (args: { data: { userId: string } }) => Promise<{ id: string; userId: string }>;
  };
};

type PrismaClientWithVisaSeeker = typeof prisma & {
  visaSeeker: {
    create: (args: { data: { userId: string } }) => Promise<{ id: string; userId: string }>;
  };
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email, password, name, role } = req.body;

  // Input validation
  if (!email || !password || !name || !role) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
  }

  // Validate role
  if (!Object.values(Role).includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as Role,
      },
    });

    // Check if provider and visaSeeker models exist and create records if they do
    if (role === Role.PROVIDER && 'provider' in prisma) {
      try {
        await (prisma as PrismaClientWithProvider).provider.create({
          data: {
            userId: user.id,
          },
        });
      } catch (error) {
        console.error('Error creating provider:', error);
      }
    } else if (role === Role.VISA_SEEKER && 'visaSeeker' in prisma) {
      try {
        await (prisma as PrismaClientWithVisaSeeker).visaSeeker.create({
          data: {
            userId: user.id,
          },
        });
      } catch (error) {
        console.error('Error creating visa seeker:', error);
      }
    }

    console.log(`User registered successfully: ${user.id}`);
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      data: { userId: user.id, email: user.email, role: user.role } 
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (error instanceof Error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}