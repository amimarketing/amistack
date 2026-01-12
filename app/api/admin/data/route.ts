import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all data from database
    const [leads, contacts, subscriptions] = await Promise.all([
      prisma.lead.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.contactMessage.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.subscription.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    return NextResponse.json({
      leads,
      contacts,
      subscriptions
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}