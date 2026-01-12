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

    // Total contacts
    const totalContacts = await prisma.cRMContact.count({
      where: { userId: user.id }
    })

    // New contacts in period
    const newContacts = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        createdAt: { gte: startDate }
      }
    })

    // Contacts by status
    const contactsByStatus = await prisma.cRMContact.groupBy({
      by: ['status'],
      where: { userId: user.id },
      _count: true
    })

    // Total interactions
    const totalInteractions = await prisma.cRMInteraction.count({
      where: {
        contact: { userId: user.id }
      }
    })

    // Interactions in period
    const recentInteractions = await prisma.cRMInteraction.count({
      where: {
        contact: { userId: user.id },
        createdAt: { gte: startDate }
      }
    })

    // Interactions by type
    const interactionsByType = await prisma.cRMInteraction.groupBy({
      by: ['type'],
      where: {
        contact: { userId: user.id }
      },
      _count: true
    })

    // Forms data
    const totalForms = await prisma.form.count({
      where: { userId: user.id }
    })

    const totalSubmissions = await prisma.formSubmission.count({
      where: {
        form: { userId: user.id }
      }
    })

    const recentSubmissions = await prisma.formSubmission.count({
      where: {
        form: { userId: user.id },
        createdAt: { gte: startDate }
      }
    })

    // Calculate conversion rate
    const conversionRate = totalContacts > 0 
      ? ((contactsByStatus.find(s => s.status === 'active')?._count || 0) / totalContacts * 100).toFixed(2)
      : '0.00'

    // Average lead score
    const avgLeadScore = await prisma.cRMContact.aggregate({
      where: { userId: user.id },
      _avg: { leadScore: true }
    })

    return NextResponse.json({
      period: parseInt(period),
      contacts: {
        total: totalContacts,
        new: newContacts,
        byStatus: contactsByStatus.map(s => ({
          status: s.status,
          count: s._count
        }))
      },
      interactions: {
        total: totalInteractions,
        recent: recentInteractions,
        byType: interactionsByType.map(i => ({
          type: i.type,
          count: i._count
        }))
      },
      forms: {
        total: totalForms,
        submissions: totalSubmissions,
        recentSubmissions
      },
      metrics: {
        conversionRate: parseFloat(conversionRate),
        avgLeadScore: avgLeadScore._avg.leadScore || 0
      }
    })

  } catch (error) {
    console.error('Analytics overview error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
