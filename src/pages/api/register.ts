import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

// Define Role enum to match Prisma schema
enum Role {
  ADMIN = 'ADMIN',
  PROVIDER = 'PROVIDER',
  VISA_SEEKER = 'VISA_SEEKER'
}

type TransactionClient = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

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

    const result = await prisma.$transaction(async (tx: TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: role as Role,
        },
      });

      switch (role) {
        case Role.PROVIDER:
          await tx.provider.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case Role.VISA_SEEKER:
          await tx.visaSeeker.create({
            data: {
              userId: user.id,
            },
          });
          break;
        case Role.ADMIN:
          // No additional action needed for admin
          break;
        default:
          throw new Error('Unexpected role');
      }

      return user;
    });

    console.log(`User registered successfully: ${result.id}`);
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully', 
      data: { userId: result.id, email: result.email, role: result.role } 
    });
  } catch (error: unknown) {
    console.error('Registration error:', error);
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already in use' });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Error creating user', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}