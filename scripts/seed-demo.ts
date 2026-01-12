import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de dados demo...');

  // 1. Criar usuário demo
  const hashedPassword = await bcrypt.hash('Demo@123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@amistack.com' },
    update: {},
    create: {
      email: 'demo@amistack.com',
      name: 'Usuário Demo',
      password: hashedPassword,
      role: 'user',
    },
  });

  console.log('✅ Usuário demo criado:', demoUser.email);

  // 2. Criar tags
  const tags = [
    { name: 'Cliente VIP', color: '#FFD700' },
    { name: 'Lead Qualificado', color: '#4CAF50' },
    { name: 'Oportunidade', color: '#2196F3' },
    { name: 'Urgente', color: '#FF5722' },
    { name: 'Networking', color: '#9C27B0' },
    { name: 'Parceiro', color: '#FF9800' },
    { name: 'Follow-up', color: '#00BCD4' },
    { name: 'Cold Lead', color: '#607D8B' },
  ];

  const createdTags = await Promise.all(
    tags.map((tag) =>
      prisma.cRMTag.upsert({
        where: { name: tag.name },
        update: {},
        create: {
          ...tag,
          userId: demoUser.id,
        },
      })
    )
  );

  console.log(`✅ ${createdTags.length} tags criadas`);

  // 3. Criar contatos realistas
  const contacts = [
    {
      firstName: 'Carlos',
      lastName: 'Silva',
      fullName: 'Carlos Silva',
      email: 'carlos.silva@techcorp.com.br',
      phone: '+55 11 98765-4321',
      companyName: 'TechCorp Brasil',
      jobTitle: 'Diretor de TI',
      website: 'https://techcorp.com.br',
      status: 'cliente',
      source: 'indicacao',
      leadScore: 95,
      address: 'Av. Paulista, 1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      country: 'Brasil',
      notes: 'Cliente desde 2023. Muito satisfeito com nosso serviço. Planeja expandir contrato em 2025.',
      tags: ['Cliente VIP', 'Oportunidade'],
    },
    {
      firstName: 'Mariana',
      lastName: 'Costa',
      fullName: 'Mariana Costa',
      email: 'mariana@startupx.io',
      phone: '+55 21 99123-4567',
      companyName: 'StartupX',
      jobTitle: 'CEO & Founder',
      website: 'https://startupx.io',
      status: 'qualified',
      source: 'website',
      leadScore: 85,
      address: 'Rua do Ouvidor, 50',
      city: 'Rio de Janeiro',
      state: 'RJ',
      zipCode: '20040-030',
      country: 'Brasil',
      notes: 'Startup em crescimento rápido. Buscando solução de CRM escalável. Orçamento confirmado.',
      tags: ['Lead Qualificado', 'Follow-up'],
    },
    {
      firstName: 'Roberto',
      lastName: 'Almeida',
      fullName: 'Roberto Almeida',
      email: 'roberto.almeida@gmail.com',
      phone: '+55 31 98234-5678',
      companyName: 'Consultoria Almeida',
      jobTitle: 'Consultor Senior',
      status: 'active',
      source: 'linkedin',
      leadScore: 70,
      address: 'Rua da Bahia, 1200',
      city: 'Belo Horizonte',
      state: 'MG',
      zipCode: '30160-011',
      country: 'Brasil',
      notes: 'Conheceu a plataforma no LinkedIn. Interessado em testar gratuitamente.',
      tags: ['Oportunidade', 'Networking'],
    },
    {
      firstName: 'Ana Paula',
      lastName: 'Santos',
      fullName: 'Ana Paula Santos',
      email: 'ana.santos@marketingpro.com',
      phone: '+55 11 97345-6789',
      companyName: 'MarketingPro',
      jobTitle: 'Head of Marketing',
      website: 'https://marketingpro.com',
      status: 'cliente',
      source: 'indicacao',
      leadScore: 92,
      address: 'Rua Augusta, 2690',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01413-000',
      country: 'Brasil',
      notes: 'Cliente premium. Usa todas as funcionalidades. Enviou 3 indicações este mês.',
      tags: ['Cliente VIP', 'Parceiro'],
    },
    {
      firstName: 'João Pedro',
      lastName: 'Lima',
      fullName: 'João Pedro Lima',
      email: 'jp.lima@empresa.com.br',
      phone: '+55 41 98567-1234',
      companyName: 'Empresa ABC',
      jobTitle: 'Gerente Comercial',
      status: 'qualified',
      source: 'google',
      leadScore: 78,
      address: 'Av. Cândido de Abreu, 200',
      city: 'Curitiba',
      state: 'PR',
      zipCode: '80530-000',
      country: 'Brasil',
      notes: 'Demonstrou interesse após busca no Google. Agendada reunião para próxima semana.',
      tags: ['Lead Qualificado', 'Follow-up'],
    },
    {
      firstName: 'Fernanda',
      lastName: 'Oliveira',
      fullName: 'Fernanda Oliveira',
      email: 'fernanda@ecommerce.com',
      phone: '+55 51 99678-9012',
      companyName: 'E-commerce Brasil',
      jobTitle: 'Diretora de Vendas',
      website: 'https://ecommercebrasil.com',
      status: 'active',
      source: 'website',
      leadScore: 65,
      address: 'Rua dos Andradas, 1000',
      city: 'Porto Alegre',
      state: 'RS',
      zipCode: '90020-000',
      country: 'Brasil',
      notes: 'Cadastrou-se no site hoje. Ainda não entrou em contato.',
      tags: ['Oportunidade'],
    },
    {
      firstName: 'Ricardo',
      lastName: 'Mendes',
      fullName: 'Ricardo Mendes',
      email: 'ricardo.mendes@corp.com',
      phone: '+55 85 98123-4567',
      companyName: 'Corporation S.A.',
      jobTitle: 'VP de Operações',
      status: 'inactive',
      source: 'evento',
      leadScore: 45,
      address: 'Av. Beira Mar, 3000',
      city: 'Fortaleza',
      state: 'CE',
      zipCode: '60165-121',
      country: 'Brasil',
      notes: 'Conheceu no evento de networking. Sem retorno há 2 meses.',
      tags: ['Cold Lead', 'Networking'],
    },
    {
      firstName: 'Juliana',
      lastName: 'Rodrigues',
      fullName: 'Juliana Rodrigues',
      email: 'juliana@agencia.digital',
      phone: '+55 71 99234-5678',
      companyName: 'Agência Digital',
      jobTitle: 'Sócia Diretora',
      website: 'https://agenciadigital.com',
      status: 'qualified',
      source: 'indicacao',
      leadScore: 88,
      address: 'Av. Tancredo Neves, 450',
      city: 'Salvador',
      state: 'BA',
      zipCode: '41820-020',
      country: 'Brasil',
      notes: 'Indicada por Ana Paula Santos. Muito interessada. Proposta enviada.',
      tags: ['Lead Qualificado', 'Urgente'],
    },
    {
      firstName: 'Paulo',
      lastName: 'Henrique',
      fullName: 'Paulo Henrique',
      email: 'paulo@consultoria.tech',
      phone: '+55 61 98345-6789',
      companyName: 'Consultoria Tech',
      jobTitle: 'Consultor',
      status: 'active',
      source: 'google',
      leadScore: 72,
      address: 'SHS Quadra 6, Bloco A',
      city: 'Brasília',
      state: 'DF',
      zipCode: '70316-000',
      country: 'Brasil',
      notes: 'Contato recente. Pediu demonstração da plataforma.',
      tags: ['Follow-up', 'Oportunidade'],
    },
    {
      firstName: 'Camila',
      lastName: 'Ferreira',
      fullName: 'Camila Ferreira',
      email: 'camila@softwarehouse.com',
      phone: '+55 19 99456-7890',
      companyName: 'Software House',
      jobTitle: 'Gerente de Projetos',
      website: 'https://softwarehouse.com',
      status: 'cliente',
      source: 'linkedin',
      leadScore: 90,
      address: 'Av. das Amoreiras, 500',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13070-115',
      country: 'Brasil',
      notes: 'Cliente ativo. Participa ativamente dos webinars. Potencial para upgrade.',
      tags: ['Cliente VIP', 'Parceiro'],
    },
  ];

  console.log('📋 Criando contatos...');

  for (const contactData of contacts) {
    const { tags: contactTags, ...contactInfo } = contactData;

    const contact = await prisma.cRMContact.create({
      data: {
        ...contactInfo,
        userId: demoUser.id,
      },
    });

    // Associar tags
    if (contactTags && contactTags.length > 0) {
      for (const tagName of contactTags) {
        const tag = createdTags.find((t) => t.name === tagName);
        if (tag) {
          await prisma.cRMContactTag.create({
            data: {
              contactId: contact.id,
              tagId: tag.id,
            },
          });
        }
      }
    }

    console.log(`  ✅ ${contact.fullName} criado`);
  }

  // 4. Criar interações para alguns contatos
  const allContacts = await prisma.cRMContact.findMany({
    where: { userId: demoUser.id },
  });

  console.log('💬 Criando interações...');

  // Carlos Silva (Cliente VIP)
  const carlos = allContacts.find((c) => c.email === 'carlos.silva@techcorp.com.br');
  if (carlos) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: carlos.id,
          userId: demoUser.id,
          type: 'meeting',
          title: 'Reunião de Kickoff',
          description: 'Primeira reunião para entender necessidades e apresentar a plataforma.',
          outcome: 'successful',
          duration: 60,
          scheduledAt: new Date('2023-06-15T10:00:00'),
          completedAt: new Date('2023-06-15T11:00:00'),
        },
        {
          contactId: carlos.id,
          userId: demoUser.id,
          type: 'call',
          title: 'Follow-up Implementação',
          description: 'Ligação para verificar progresso da implementação.',
          outcome: 'successful',
          duration: 20,
          scheduledAt: new Date('2023-07-10T14:00:00'),
          completedAt: new Date('2023-07-10T14:20:00'),
        },
        {
          contactId: carlos.id,
          userId: demoUser.id,
          type: 'email',
          title: 'Proposta de Expansão',
          description: 'Enviado proposta para adicionar mais usuários e módulos premium.',
          outcome: 'follow_up',
          scheduledAt: new Date('2024-11-20T09:00:00'),
          completedAt: new Date('2024-11-20T09:15:00'),
        },
        {
          contactId: carlos.id,
          userId: demoUser.id,
          type: 'meeting',
          title: 'Reunião de Expansão',
          description: 'Discussão sobre expansão do contrato para 2025.',
          outcome: 'scheduled',
          duration: 45,
          scheduledAt: new Date('2024-12-20T15:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de Carlos Silva criadas');
  }

  // Mariana Costa (Lead Qualificado)
  const mariana = allContacts.find((c) => c.email === 'mariana@startupx.io');
  if (mariana) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: mariana.id,
          userId: demoUser.id,
          type: 'email',
          title: 'Primeiro Contato',
          description: 'Email de apresentação e agendamento de demonstração.',
          outcome: 'successful',
          scheduledAt: new Date('2024-11-10T10:00:00'),
          completedAt: new Date('2024-11-10T10:05:00'),
        },
        {
          contactId: mariana.id,
          userId: demoUser.id,
          type: 'demo',
          title: 'Demonstração da Plataforma',
          description: 'Demo completa focada em escalabilidade e automações.',
          outcome: 'successful',
          duration: 45,
          scheduledAt: new Date('2024-11-15T16:00:00'),
          completedAt: new Date('2024-11-15T16:45:00'),
        },
        {
          contactId: mariana.id,
          userId: demoUser.id,
          type: 'proposal',
          title: 'Envio de Proposta Comercial',
          description: 'Proposta personalizada com desconto para startups.',
          outcome: 'follow_up',
          scheduledAt: new Date('2024-11-18T11:00:00'),
          completedAt: new Date('2024-11-18T11:30:00'),
        },
        {
          contactId: mariana.id,
          userId: demoUser.id,
          type: 'call',
          title: 'Follow-up Proposta',
          description: 'Ligar para esclarecer dúvidas sobre a proposta.',
          outcome: 'scheduled',
          duration: 30,
          scheduledAt: new Date('2024-12-16T10:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de Mariana Costa criadas');
  }

  // Ana Paula Santos (Cliente VIP e Parceira)
  const ana = allContacts.find((c) => c.email === 'ana.santos@marketingpro.com');
  if (ana) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: ana.id,
          userId: demoUser.id,
          type: 'meeting',
          title: 'Onboarding',
          description: 'Sessão de onboarding e treinamento da equipe.',
          outcome: 'successful',
          duration: 90,
          scheduledAt: new Date('2023-03-01T09:00:00'),
          completedAt: new Date('2023-03-01T10:30:00'),
        },
        {
          contactId: ana.id,
          userId: demoUser.id,
          type: 'call',
          title: 'Check-in Mensal',
          description: 'Ligação de rotina para verificar satisfação.',
          outcome: 'successful',
          duration: 15,
          scheduledAt: new Date('2024-11-05T15:00:00'),
          completedAt: new Date('2024-11-05T15:15:00'),
        },
        {
          contactId: ana.id,
          userId: demoUser.id,
          type: 'email',
          title: 'Agradecimento por Indicações',
          description: 'Email agradecendo pelas 3 indicações enviadas este mês.',
          outcome: 'successful',
          scheduledAt: new Date('2024-11-25T10:00:00'),
          completedAt: new Date('2024-11-25T10:05:00'),
        },
        {
          contactId: ana.id,
          userId: demoUser.id,
          type: 'video',
          title: 'Reunião Trimestral',
          description: 'Reunião para revisar resultados e planejar próximo trimestre.',
          outcome: 'scheduled',
          duration: 60,
          scheduledAt: new Date('2024-12-18T14:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de Ana Paula Santos criadas');
  }

  // João Pedro Lima (Lead Qualificado)
  const joao = allContacts.find((c) => c.email === 'jp.lima@empresa.com.br');
  if (joao) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: joao.id,
          userId: demoUser.id,
          type: 'email',
          title: 'Resposta à Solicitação',
          description: 'Email respondendo dúvidas iniciais e agendando demo.',
          outcome: 'successful',
          scheduledAt: new Date('2024-11-28T09:00:00'),
          completedAt: new Date('2024-11-28T09:10:00'),
        },
        {
          contactId: joao.id,
          userId: demoUser.id,
          type: 'demo',
          title: 'Demonstração Agendada',
          description: 'Demo focada em gestão comercial e automações de vendas.',
          outcome: 'scheduled',
          duration: 40,
          scheduledAt: new Date('2024-12-17T10:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de João Pedro Lima criadas');
  }

  // Juliana Rodrigues (Lead Qualificado Urgente)
  const juliana = allContacts.find((c) => c.email === 'juliana@agencia.digital');
  if (juliana) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: juliana.id,
          userId: demoUser.id,
          type: 'call',
          title: 'Contato Inicial',
          description: 'Ligação após indicação de Ana Paula Santos.',
          outcome: 'successful',
          duration: 25,
          scheduledAt: new Date('2024-11-22T11:00:00'),
          completedAt: new Date('2024-11-22T11:25:00'),
        },
        {
          contactId: juliana.id,
          userId: demoUser.id,
          type: 'demo',
          title: 'Demonstração Express',
          description: 'Demo rápida focada em funcionalidades para agências.',
          outcome: 'successful',
          duration: 30,
          scheduledAt: new Date('2024-11-26T16:00:00'),
          completedAt: new Date('2024-11-26T16:30:00'),
        },
        {
          contactId: juliana.id,
          userId: demoUser.id,
          type: 'proposal',
          title: 'Proposta Comercial',
          description: 'Enviada proposta com condições especiais por indicação.',
          outcome: 'follow_up',
          scheduledAt: new Date('2024-11-29T14:00:00'),
          completedAt: new Date('2024-11-29T14:20:00'),
        },
        {
          contactId: juliana.id,
          userId: demoUser.id,
          type: 'call',
          title: 'Negociação Final',
          description: 'Ligar para fechar negócio. Cliente tem urgência.',
          outcome: 'scheduled',
          duration: 20,
          scheduledAt: new Date('2024-12-15T09:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de Juliana Rodrigues criadas');
  }

  // Camila Ferreira (Cliente VIP)
  const camila = allContacts.find((c) => c.email === 'camila@softwarehouse.com');
  if (camila) {
    await prisma.cRMInteraction.createMany({
      data: [
        {
          contactId: camila.id,
          userId: demoUser.id,
          type: 'meeting',
          title: 'Implementação Inicial',
          description: 'Reunião de implementação e configuração.',
          outcome: 'successful',
          duration: 75,
          scheduledAt: new Date('2024-01-15T10:00:00'),
          completedAt: new Date('2024-01-15T11:15:00'),
        },
        {
          contactId: camila.id,
          userId: demoUser.id,
          type: 'email',
          title: 'Convite Webinar',
          description: 'Convite para participar do webinar sobre novas funcionalidades.',
          outcome: 'successful',
          scheduledAt: new Date('2024-10-15T08:00:00'),
          completedAt: new Date('2024-10-15T08:05:00'),
        },
        {
          contactId: camila.id,
          userId: demoUser.id,
          type: 'note',
          title: 'Participou do Webinar',
          description: 'Cliente participou ativamente do último webinar. Fez 3 perguntas excelentes.',
          outcome: 'successful',
          scheduledAt: new Date('2024-11-12T15:00:00'),
          completedAt: new Date('2024-11-12T15:05:00'),
        },
        {
          contactId: camila.id,
          userId: demoUser.id,
          type: 'meeting',
          title: 'Avaliação de Upgrade',
          description: 'Reunião para avaliar upgrade para plano Enterprise.',
          outcome: 'scheduled',
          duration: 45,
          scheduledAt: new Date('2024-12-19T11:00:00'),
        },
      ],
    });
    console.log('  ✅ Interações de Camila Ferreira criadas');
  }

  console.log('\n🎉 Seed de dados demo concluído com sucesso!');
  console.log('\n📊 Resumo:');
  console.log(`   👤 1 usuário demo`);
  console.log(`   🏷️  ${createdTags.length} tags`);
  console.log(`   👥 ${contacts.length} contatos`);
  console.log(`   💬 Múltiplas interações`);
  console.log('\n🔑 Credenciais de acesso:');
  console.log('   Email: demo@amistack.com');
  console.log('   Senha: Demo@123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
