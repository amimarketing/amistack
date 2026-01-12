import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - List all forms for user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const forms = await prisma.form.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
        _count: {
          select: {
            submissions: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch forms' },
      { status: 500 }
    );
  }
}

// POST - Create new form
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, fields, submitButtonText, successMessage, redirectUrl, notifyEmail, integrateCRM } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Create form with fields
    const form = await prisma.form.create({
      data: {
        name,
        description,
        submitButtonText: submitButtonText || 'Enviar',
        successMessage: successMessage || 'Obrigado! Recebemos seu formulário.',
        redirectUrl,
        notifyEmail,
        integrateCRM: integrateCRM || false,
        userId: session.user.id,
        fields: {
          create: fields?.map((field: any, index: number) => ({
            label: field.label,
            fieldType: field.fieldType,
            placeholder: field.placeholder,
            required: field.required || false,
            options: field.options ? JSON.stringify(field.options) : null,
            order: index,
          })) || [],
        },
      },
      include: {
        fields: {
          orderBy: { order: 'asc' },
        },
      },
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json(
      { error: 'Failed to create form' },
      { status: 500 }
    );
  }
}
