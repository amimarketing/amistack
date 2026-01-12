import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST /api/landing-pages/[id]/publish - Publish or unpublish landing page
export async function POST(
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

    const landingPage = await prisma.landingPage.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 });
    }

    const { action } = await request.json();

    const newStatus = action === 'publish' ? 'published' : 'draft';

    const updated = await prisma.landingPage.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        publishedAt: action === 'publish' ? new Date() : null,
      },
    });

    return NextResponse.json({
      message: action === 'publish' ? 'Landing page publicada com sucesso' : 'Landing page despublicada',
      landingPage: updated,
    });
  } catch (error) {
    console.error('Erro ao publicar/despublicar landing page:', error);
    return NextResponse.json(
      { error: 'Erro ao publicar/despublicar landing page' },
      { status: 500 }
    );
  }
}