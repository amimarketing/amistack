import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/chatbots - List all chatbots for authenticated user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const chatbots = await prisma.chatbot.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        theme: true,
        totalMessages: true,
        totalSessions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(chatbots);
  } catch (error) {
    console.error('Erro ao buscar chatbots:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar chatbots' },
      { status: 500 }
    );
  }
}

// POST /api/chatbots - Create new chatbot
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Create chatbot
    const chatbot = await prisma.chatbot.create({
      data: {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        greeting: data.greeting || 'Olá! Como posso ajudar você hoje?',
        fallbackMessage: data.fallbackMessage || 'Desculpe, não entendi. Pode reformular?',
        theme: data.theme || 'orange',
        position: data.position || 'bottom-right',
        knowledgeBase: data.knowledgeBase ? JSON.stringify(data.knowledgeBase) : null,
        userId: user.id,
      },
    });

    return NextResponse.json(chatbot, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar chatbot:', error);
    return NextResponse.json(
      { error: 'Erro ao criar chatbot' },
      { status: 500 }
    );
  }
}