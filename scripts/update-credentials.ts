import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Atualizando credenciais...');

  // Credenciais de Admin
  const adminEmail = 'admin@amistack.com';
  const adminPassword = 'AmiStack@2026';
  const adminHashedPassword = await bcrypt.hash(adminPassword, 10);

  // Credenciais de Demo
  const demoEmail = 'demo@amistack.com';
  const demoPassword = 'Demo@2026';
  const demoHashedPassword = await bcrypt.hash(demoPassword, 10);

  try {
    // Atualizar ou criar usuário Admin
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        password: adminHashedPassword,
        name: 'Administrador AmiStack',
        companyName: 'AMIMARKETING',
      },
      create: {
        email: adminEmail,
        password: adminHashedPassword,
        name: 'Administrador AmiStack',
        companyName: 'AMIMARKETING',
      },
    });

    console.log('✅ Usuário Admin atualizado:');
    console.log('   Email:', adminEmail);
    console.log('   Senha:', adminPassword);
    console.log('   ID:', admin.id);

    // Atualizar ou criar usuário Demo
    const demo = await prisma.user.upsert({
      where: { email: demoEmail },
      update: {
        password: demoHashedPassword,
        name: 'Usuário Demo',
        companyName: 'Empresa Demo',
      },
      create: {
        email: demoEmail,
        password: demoHashedPassword,
        name: 'Usuário Demo',
        companyName: 'Empresa Demo',
      },
    });

    console.log('\n✅ Usuário Demo atualizado:');
    console.log('   Email:', demoEmail);
    console.log('   Senha:', demoPassword);
    console.log('   ID:', demo.id);

    console.log('\n🎉 Credenciais atualizadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao atualizar credenciais:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
