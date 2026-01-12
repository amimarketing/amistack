import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/chatbots/[id]/chat - Send message to chatbot (PUBLIC)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { message, conversationId, visitorName, visitorEmail } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      );
    }

    // Get chatbot
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: params.id },
    });

    if (!chatbot || chatbot.status !== 'active') {
      return NextResponse.json(
        { error: 'Chatbot não disponível' },
        { status: 404 }
      );
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId },
      });
    }

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          chatbotId: params.id,
          visitorName: visitorName || null,
          visitorEmail: visitorEmail || null,
        },
      });

      // Increment session count
      await prisma.chatbot.update({
        where: { id: params.id },
        data: { totalSessions: { increment: 1 } },
      });
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'user',
        message: message.trim(),
      },
    });

    // Generate bot response
    const botResponse = generateBotResponse(message, chatbot);

    // Save bot response
    const botMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        sender: 'bot',
        message: botResponse,
      },
    });

    // Increment message count
    await prisma.chatbot.update({
      where: { id: params.id },
      data: { totalMessages: { increment: 2 } }, // User + Bot
    });

    return NextResponse.json({
      conversationId: conversation.id,
      botMessage: botMessage.message,
      messageId: botMessage.id,
    });
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    );
  }
}

// Simple keyword-based response generator
function generateBotResponse(userMessage: string, chatbot: any): string {
  const message = userMessage.toLowerCase().trim();

  // Parse knowledge base
  let knowledgeBase: Array<{ keywords: string[]; response: string }> = [];
  if (chatbot.knowledgeBase) {
    try {
      knowledgeBase = JSON.parse(chatbot.knowledgeBase);
    } catch (e) {
      console.error('Error parsing knowledge base:', e);
    }
  }

  // Check knowledge base for matches
  for (const item of knowledgeBase) {
    const keywords = item.keywords.map((k: string) => k.toLowerCase());
    if (keywords.some((keyword: string) => message.includes(keyword))) {
      return item.response;
    }
  }

  // Common greetings
  if (
    message.includes('olá') ||
    message.includes('oi') ||
    message.includes('bom dia') ||
    message.includes('boa tarde') ||
    message.includes('boa noite')
  ) {
    return chatbot.greeting;
  }

  // Fallback response
  return chatbot.fallbackMessage;
}