import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Atualizando dados de contato do administrador...')
  
  // Atualizar usuário admin com telefone e cidade
  const admin = await prisma.user.update({
    where: { email: 'admin@amistack.com' },
    data: {
      name: 'AMIMARKETING',
    }
  })
  
  console.log('✅ Usuário admin atualizado:', admin.email)
  
  // Criar ou atualizar company com informações de contato
  let company = await prisma.company.findFirst({
    where: { 
      name: 'AMIMARKETING',
      userId: admin.id 
    }
  })
  
  if (!company) {
    company = await prisma.company.create({
      data: {
        name: 'AMIMARKETING',
        email: 'amimarketing4@gmail.com',
        phone: '5555992295440',
        website: 'https://amistack-6f0e3x.abacusai.app',
        industry: 'Tecnologia e Marketing Digital',
        size: '1-10',
        status: 'active',
        userId: admin.id
      }
    })
    console.log('✅ Empresa criada:', company.name)
  } else {
    company = await prisma.company.update({
      where: { id: company.id },
      data: {
        phone: '5555992295440',
        email: 'amimarketing4@gmail.com'
      }
    })
    console.log('✅ Empresa atualizada:', company.name)
  }
  
  // Atualizar o admin para ter o nome da empresa
  await prisma.user.update({
    where: { email: 'admin@amistack.com' },
    data: {
      companyName: 'AMIMARKETING'
    }
  })
  
  console.log('✅ Nome da empresa associado ao admin')
  
  // Adicionar contato próprio no CRM para referência
  const existingContact = await prisma.cRMContact.findFirst({
    where: { 
      OR: [
        { email: 'contato@amimarketing.com.br' },
        { email: 'amimarketing4@gmail.com' }
      ]
    }
  })
  
  if (!existingContact) {
    const contact = await prisma.cRMContact.create({
      data: {
        firstName: 'AMIMARKETING',
        lastName: 'Contato Principal',
        fullName: 'AMIMARKETING - Contato Principal',
        email: 'amimarketing4@gmail.com',
        phone: '5555992295440',
        mobile: '5555992295440',
        companyName: 'AMIMARKETING',
        jobTitle: 'Administração',
        status: 'active',
        source: 'internal',
        city: 'Frederico Westphalen',
        state: 'RS',
        country: 'Brasil',
        leadScore: 100,
        notes: 'Dados de contato principal da AMIMARKETING para referência e testes.\n\nEmail: amimarketing4@gmail.com\nTelefone: +55 55 99229-5440\nCidade: Frederico Westphalen - RS',
        userId: admin.id
      }
    })
    
    console.log('✅ Contato principal criado no CRM:', contact.fullName)
  } else {
    await prisma.cRMContact.update({
      where: { id: existingContact.id },
      data: {
        email: 'amimarketing4@gmail.com',
        phone: '5555992295440',
        mobile: '5555992295440',
        city: 'Frederico Westphalen',
        state: 'RS',
        country: 'Brasil',
        notes: 'Dados de contato principal da AMIMARKETING para referência e testes.\n\nEmail: amimarketing4@gmail.com\nTelefone: +55 55 99229-5440\nCidade: Frederico Westphalen - RS'
      }
    })
    console.log('✅ Contato principal atualizado no CRM')
  }
  
  console.log('\n📞 Dados de Contato Atualizados:')
  console.log('   Email: amimarketing4@gmail.com')
  console.log('   Telefone: +55 55 99229-5440')
  console.log('   Cidade: Frederico Westphalen - RS')
  console.log('   Empresa: AMIMARKETING')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
