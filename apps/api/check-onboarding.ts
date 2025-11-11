import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkOnboarding() {
  try {
    console.log('=== Recent Users ===');
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
        createdAt: true,
        providerProfile: {
          select: {
            id: true,
            businessName: true,
            createdAt: true,
          },
        },
      },
    });
    
    console.log(JSON.stringify(users, null, 2));
    
    console.log('\n=== Recent Provider Profiles ===');
    const providers = await prisma.providerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        userId: true,
        businessName: true,
        description: true,
        location: true,
        languages: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            role: true,
          },
        },
      },
    });
    
    console.log(JSON.stringify(providers, null, 2));
    
    console.log('\n=== Recent Audit Logs (Registration & Provider Creation) ===');
    const auditLogs = await prisma.auditLog.findMany({
      where: {
        action: {
          in: ['USER_REGISTERED', 'PROVIDER_CREATED', 'USER_PROFILE_UPDATED'],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        actorUserId: true,
        action: true,
        entityType: true,
        entityId: true,
        createdAt: true,
        diff: true,
      },
    });
    
    console.log(JSON.stringify(auditLogs, null, 2));
    
  } catch (error) {
    console.error('Error querying database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkOnboarding();
