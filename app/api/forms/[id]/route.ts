import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Get single form
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
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
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch form' },
      { status: 500 }
    );
  }
}

// PUT - Update form
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, fields, submitButtonText, successMessage, redirectUrl, notifyEmail, integrateCRM, status } = body;

    // Verify ownership
    const existingForm = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingForm) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Delete existing fields
    await prisma.formField.deleteMany({
      where: { formId: params.id },
    });

    // Update form with new fields
    const form = await prisma.form.update({
      where: { id: params.id },
      data: {
        name,
        description,
        submitButtonText,
        successMessage,
        redirectUrl,
        notifyEmail,
        integrateCRM,
        status,
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

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json(
      { error: 'Failed to update form' },
      { status: 500 }
    );
  }
}

// DELETE - Delete form
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify ownership
    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 });
    }

    // Delete form (cascade will delete fields and submissions)
    await prisma.form.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    return NextResponse.json(
      { error: 'Failed to delete form' },
      { status: 500 }
    );
  }
}
