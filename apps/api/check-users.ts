import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('\n=== All Users ===\n');
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
      emailVerified: true,
      providerOnboardingCompleted: true,
      providerBusinessStepCompleted: true,
      providerServicesStepCompleted: true,
      providerCredentialsStepCompleted: true,
      seekerOnboardingCompleted: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (users.length === 0) {
    console.log('No users found in database.\n');
    return;
  }

  console.log(`Found ${users.length} user(s):\n`);

  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email}`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Name: ${user.name || 'N/A'}`);
    console.log(`   Email Verified: ${user.emailVerified}`);
    
    if (user.role === 'PROVIDER') {
      console.log(`   Provider Onboarding Complete: ${user.providerOnboardingCompleted}`);
      console.log(`   Step 1 (Business): ${user.providerBusinessStepCompleted ? '✓' : '✗'}`);
      console.log(`   Step 2 (Services): ${user.providerServicesStepCompleted ? '✓' : '✗'}`);
      console.log(`   Step 3 (Credentials): ${user.providerCredentialsStepCompleted ? '✓' : '✗'}`);
    } else if (user.role === 'SEEKER') {
      console.log(`   Seeker Onboarding Complete: ${user.seekerOnboardingCompleted}`);
    }
    
    console.log(`   Created: ${user.createdAt.toISOString()}`);
    console.log('');
  });

  // List provider users separately
  const providers = users.filter(u => u.role === 'PROVIDER');
  if (providers.length > 0) {
    console.log(`\n=== Provider Users (${providers.length}) ===\n`);
    providers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Onboarding Complete: ${user.providerOnboardingCompleted}`);
      console.log(`   Steps: Business=${user.providerBusinessStepCompleted ? '✓' : '✗'}, Services=${user.providerServicesStepCompleted ? '✓' : '✗'}, Credentials=${user.providerCredentialsStepCompleted ? '✓' : '✗'}`);
      console.log('');
    });
  } else {
    console.log('\n=== No Provider Users Found ===\n');
    console.log('You can create a provider user by:');
    console.log('1. Registering a new user');
    console.log('2. Going to /onboarding/account-type');
    console.log('3. Selecting PROVIDER role');
    console.log('');
  }
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


