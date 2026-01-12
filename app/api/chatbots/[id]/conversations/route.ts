import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/chatbots/[id]/conversations - List conversations for chatbot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const chatbot = await prisma.chatbot.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!chatbot) {
      return NextResponse.json({ error: 'Chatbot não encontrado' }, { status: 404 });
    }

    const conversations = await prisma.chatConversation.findMany({
      where: { chatbotId: params.id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 1, // Only first message for preview
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Erro ao buscar conversas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar conversas' },
      { status: 500 }
    );
  }
}