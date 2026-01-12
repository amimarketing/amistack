import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default test account (required for testing)
  const testUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: await bcrypt.hash('johndoe123', 10),
      name: 'John Doe',
      role: 'admin',
      companyName: 'Test Company'
    }
  });

  console.log('✅ Test user created:', testUser.email);

  // Create admin user for AmiStack
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@amistack.com' },
    update: {},
    create: {
      email: 'admin@amistack.com',
      password: await bcrypt.hash('Admin@123', 10),
      name: 'Admin AmiStack',
      role: 'admin',
      companyName: 'AmiMarketing'
    }
  });

  console.log('✅ Admin user created:', adminUser.email);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
