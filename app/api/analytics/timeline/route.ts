import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Parse URL params
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(period))

    // Get daily contacts created
    const contacts = await prisma.cRMContact.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Get daily interactions
    const interactions = await prisma.cRMInteraction.findMany({
      where: {
        contact: { userId: user.id },
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true,
        type: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Get daily form submissions
    const submissions = await prisma.formSubmission.findMany({
      where: {
        form: { userId: user.id },
        createdAt: { gte: startDate }
      },
      select: {
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    })

    // Group by date
    const timelineData: { [key: string]: any } = {}

    // Process contacts
    contacts.forEach(contact => {
      const date = contact.createdAt.toISOString().split('T')[0]
      if (!timelineData[date]) {
        timelineData[date] = { date, contacts: 0, interactions: 0, submissions: 0 }
      }
      timelineData[date].contacts++
    })

    // Process interactions
    interactions.forEach(interaction => {
      const date = interaction.createdAt.toISOString().split('T')[0]
      if (!timelineData[date]) {
        timelineData[date] = { date, contacts: 0, interactions: 0, submissions: 0 }
      }
      timelineData[date].interactions++
    })

    // Process submissions
    submissions.forEach(submission => {
      const date = submission.createdAt.toISOString().split('T')[0]
      if (!timelineData[date]) {
        timelineData[date] = { date, contacts: 0, interactions: 0, submissions: 0 }
      }
      timelineData[date].submissions++
    })

    // Convert to array and sort
    const timeline = Object.values(timelineData).sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    )

    return NextResponse.json({
      period: parseInt(period),
      timeline
    })

  } catch (error) {
    console.error('Analytics timeline error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch timeline data' },
      { status: 500 }
    )
  }
}
