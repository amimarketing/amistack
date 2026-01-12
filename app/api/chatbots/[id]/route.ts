import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/chatbots/[id] - Get specific chatbot
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

    // Parse JSON fields
    const response = {
      ...chatbot,
      knowledgeBase: chatbot.knowledgeBase ? JSON.parse(chatbot.knowledgeBase) : [],
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar chatbot:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar chatbot' },
      { status: 500 }
    );
  }
}

// PUT /api/chatbots/[id] - Update chatbot
export async function PUT(
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

    const data = await request.json();

    // Update chatbot
    const updated = await prisma.chatbot.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        status: data.status,
        greeting: data.greeting,
        fallbackMessage: data.fallbackMessage,
        theme: data.theme,
        position: data.position,
        knowledgeBase: data.knowledgeBase ? JSON.stringify(data.knowledgeBase) : null,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar chatbot:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar chatbot' },
      { status: 500 }
    );
  }
}

// DELETE /api/chatbots/[id] - Delete chatbot
export async function DELETE(
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

    await prisma.chatbot.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Chatbot excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir chatbot:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir chatbot' },
      { status: 500 }
    );
  }
}