import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET /api/crm/stats - Get CRM statistics
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

    // Get total contacts
    const totalContacts = await prisma.cRMContact.count({
      where: { userId: user.id },
    });

    // Get active contacts
    const activeContacts = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        status: 'active',
      },
    });

    // Get qualified contacts
    const qualifiedContacts = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        status: 'qualified',
      },
    });

    // Get total interactions
    const totalInteractions = await prisma.cRMInteraction.count({
      where: { userId: user.id },
    });

    // Get interactions by type
    const interactionsByType = await prisma.cRMInteraction.groupBy({
      by: ['type'],
      where: { userId: user.id },
      _count: true,
    });

    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentContacts = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    // Get upcoming interactions
    const upcomingInteractions = await prisma.cRMInteraction.count({
      where: {
        userId: user.id,
        scheduledAt: {
          gte: new Date(),
        },
        completedAt: null,
      },
    });

    return NextResponse.json({
      stats: {
        totalContacts,
        activeContacts,
        qualifiedContacts,
        totalInteractions,
        recentContacts,
        upcomingInteractions,
        interactionsByType,
      },
    });
  } catch (error) {
    console.error('Error fetching CRM stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CRM statistics' },
      { status: 500 }
    );
  }
}
