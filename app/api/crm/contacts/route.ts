import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/crm/contacts - List all contacts
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const tag = searchParams.get('tag') || '';

    const where: any = {
      userId: user.id,
    };

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    let contacts = await prisma.cRMContact.findMany({
      where,
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
          take: 5,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Filter by tag if provided
    if (tag) {
      contacts = contacts.filter((contact: any) =>
        contact.tags.some((ct: any) => ct.tag.name === tag)
      );
    }

    return NextResponse.json({ contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST /api/crm/contacts - Create new contact
export async function POST(request: NextRequest) {
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

    if (!firstName) {
      return NextResponse.json(
        { error: 'First name is required' },
        { status: 400 }
      );
    }

    // Build full name
    const fullName = `${firstName} ${lastName || ''}`.trim();

    // Create contact
    const contact = await prisma.cRMContact.create({
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
        status: status || 'active',
        leadScore: leadScore || 0,
        userId: user.id,
      },
    });

    // Add tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
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
        interactions: true,
      },
    });

    return NextResponse.json({ contact: completeContact }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
