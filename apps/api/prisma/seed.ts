import { PrismaClient, UserRole, ProviderBusinessType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('Password123!', salt);

  // Create Seeker
  const seeker = await prisma.user.upsert({
    where: { email: 'seeker@example.com' },
    update: {},
    create: {
      email: 'seeker@example.com',
      passwordHash,
      role: UserRole.SEEKER,
      name: 'John Seeker',
      emailVerified: true,
      onboardingCompleted: true,
      seekerOnboardingCompleted: true,
    },
  });

  console.log('Created Seeker:', seeker.email);

  // Create Provider
  const providerUser = await prisma.user.upsert({
    where: { email: 'provider@example.com' },
    update: {},
    create: {
      email: 'provider@example.com',
      passwordHash,
      role: UserRole.PROVIDER,
      name: 'Jane Provider',
      emailVerified: true,
      onboardingCompleted: true,
      providerOnboardingCompleted: true,
    },
  });

  // Note: Using create instead of upsert or checking existence manually because upsert failed with obscure column error in dev pivot
  const existingProfile = await prisma.providerProfile.findUnique({ where: { userId: providerUser.id } });
  
  if (!existingProfile) {
    await prisma.providerProfile.create({
      data: {
        userId: providerUser.id,
        businessName: 'Bangkok Visa Services',
        businessType: ProviderBusinessType.AGENT,
        description: 'Professional visa agency in Bangkok',
        location: 'Bangkok',
        credits: 10,
      },
    });
    console.log('Created Provider Profile');
  } else {
    console.log('Provider Profile already exists');
  }

  console.log('Created Provider:', providerUser.email);

  // Create Admin
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      role: 'ADMIN',
    },
  });

  console.log('Created Admin:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
