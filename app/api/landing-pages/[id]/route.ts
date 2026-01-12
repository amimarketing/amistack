import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/landing-pages/[id] - Get specific landing page
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

    const landingPage = await prisma.landingPage.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        form: {
          select: {
            id: true,
            name: true,
            status: true,
          },
        },
      },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 });
    }

    // Parse JSON fields
    const response = {
      ...landingPage,
      features: landingPage.features ? JSON.parse(landingPage.features) : null,
      testimonials: landingPage.testimonials ? JSON.parse(landingPage.testimonials) : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar landing page:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar landing page' },
      { status: 500 }
    );
  }
}

// PUT /api/landing-pages/[id] - Update landing page
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

    const landingPage = await prisma.landingPage.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 });
    }

    const data = await request.json();

    // If changing slug, check if new slug is available
    if (data.slug && data.slug !== landingPage.slug) {
      const existingPage = await prisma.landingPage.findUnique({
        where: { slug: data.slug },
      });

      if (existingPage) {
        return NextResponse.json(
          { error: 'Já existe uma landing page com este slug' },
          { status: 400 }
        );
      }
    }

    // Update landing page
    const updated = await prisma.landingPage.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        template: data.template,
        status: data.status,
        title: data.title,
        subtitle: data.subtitle,
        heroImage: data.heroImage,
        ctaText: data.ctaText,
        ctaUrl: data.ctaUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        features: data.features ? JSON.stringify(data.features) : null,
        testimonials: data.testimonials ? JSON.stringify(data.testimonials) : null,
        formId: data.formId,
        publishedAt:
          data.status === 'published' && landingPage.status !== 'published'
            ? new Date()
            : landingPage.publishedAt,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Erro ao atualizar landing page:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar landing page' },
      { status: 500 }
    );
  }
}

// DELETE /api/landing-pages/[id] - Delete landing page
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

    const landingPage = await prisma.landingPage.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 });
    }

    await prisma.landingPage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Landing page excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir landing page:', error);
    return NextResponse.json(
      { error: 'Erro ao excluir landing page' },
      { status: 500 }
    );
  }
}