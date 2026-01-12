import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/landing-pages - List all landing pages for authenticated user
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

    const landingPages = await prisma.landingPage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        slug: true,
        template: true,
        status: true,
        title: true,
        views: true,
        conversions: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error('Erro ao buscar landing pages:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar landing pages' },
      { status: 500 }
    );
  }
}

// POST /api/landing-pages - Create new landing page
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
    if (!data.name || !data.slug || !data.template || !data.title) {
      return NextResponse.json(
        { error: 'Nome, slug, template e título são obrigatórios' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await prisma.landingPage.findUnique({
      where: { slug: data.slug },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: 'Já existe uma landing page com este slug' },
        { status: 400 }
      );
    }

    // Create landing page
    const landingPage = await prisma.landingPage.create({
      data: {
        name: data.name,
        slug: data.slug,
        template: data.template,
        status: data.status || 'draft',
        title: data.title,
        subtitle: data.subtitle,
        heroImage: data.heroImage,
        ctaText: data.ctaText || 'Começar Agora',
        ctaUrl: data.ctaUrl,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        features: data.features ? JSON.stringify(data.features) : null,
        testimonials: data.testimonials ? JSON.stringify(data.testimonials) : null,
        formId: data.formId,
        userId: user.id,
        publishedAt: data.status === 'published' ? new Date() : null,
      },
    });

    return NextResponse.json(landingPage, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar landing page:', error);
    return NextResponse.json(
      { error: 'Erro ao criar landing page' },
      { status: 500 }
    );
  }
}