import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/landing-pages/slug/[slug] - Get landing page by slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const landingPage = await prisma.landingPage.findUnique({
      where: {
        slug: params.slug,
        status: 'published',
      },
      include: {
        form: {
          select: {
            id: true,
            name: true,
            fields: {
              select: {
                id: true,
                label: true,
                fieldType: true,
                placeholder: true,
                required: true,
                options: true,
                order: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page não encontrada' }, { status: 404 });
    }

    // Increment view count
    await prisma.landingPage.update({
      where: { id: landingPage.id },
      data: { views: { increment: 1 } },
    });

    // Parse JSON fields
    const response = {
      ...landingPage,
      features: landingPage.features ? JSON.parse(landingPage.features) : null,
      testimonials: landingPage.testimonials ? JSON.parse(landingPage.testimonials) : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Erro ao buscar landing page por slug:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar landing page' },
      { status: 500 }
    );
  }
}