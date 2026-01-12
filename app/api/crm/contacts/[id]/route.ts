import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/crm/contacts/[id] - Get single contact
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const contact = await prisma.cRMContact.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        interactions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    return NextResponse.json({ contact });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact' },
      { status: 500 }
    );
  }
}

// PUT /api/crm/contacts/[id] - Update contact
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      mobile,
      companyName,
      jobTitle,
      department,
      website,
      address,
      city,
      state,
      country,
      zipCode,
      linkedIn,
      notes,
      photo,
      source,
      status,
      leadScore,
      tags,
    } = body;

    // Check if contact exists and belongs to user
    const existingContact = await prisma.cRMContact.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Build full name
    const fullName = `${firstName} ${lastName || ''}`.trim();

    // Update contact
    const contact = await prisma.cRMContact.update({
      where: { id: params.id },
      data: {
        firstName,
        lastName,
        fullName,
        email,
        phone,
        mobile,
        companyName,
        jobTitle,
        department,
        website,
        address,
        city,
        state,
        country,
        zipCode,
        linkedIn,
        notes,
        photo,
        source,
        status,
        leadScore,
      },
    });

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove all existing tags
      await prisma.cRMContactTag.deleteMany({
        where: { contactId: contact.id },
      });

      // Add new tags
      for (const tagName of tags) {
        // Find or create tag
        let tag = await prisma.cRMTag.findUnique({
          where: { name: tagName },
        });

        if (!tag) {
          tag = await prisma.cRMTag.create({
            data: {
              name: tagName,
              userId: user.id,
            },
          });
        }

        // Link tag to contact
        await prisma.cRMContactTag.create({
          data: {
            contactId: contact.id,
            tagId: tag.id,
          },
        });
      }
    }

    // Fetch complete contact with relations
    const completeContact = await prisma.cRMContact.findUnique({
      where: { id: contact.id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        interactions: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    return NextResponse.json({ contact: completeContact });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
      { status: 500 }
    );
  }
}

// DELETE /api/crm/contacts/[id] - Delete contact
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if contact exists and belongs to user
    const existingContact = await prisma.cRMContact.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!existingContact) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
    }

    // Delete contact (cascade will delete tags and interactions)
    await prisma.cRMContact.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
