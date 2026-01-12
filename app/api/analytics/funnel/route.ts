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

    // Funnel stages
    const stages = [
      { name: 'Leads Capturados', key: 'captured' },
      { name: 'Contatos Criados', key: 'contacted' },
      { name: 'Qualificados', key: 'qualified' },
      { name: 'Ativos', key: 'active' },
      { name: 'Clientes', key: 'client' }
    ]

    // Get form submissions (leads captured)
    const leadsCaptured = await prisma.formSubmission.count({
      where: {
        form: { userId: user.id },
        createdAt: { gte: startDate }
      }
    })

    // Get contacts created in period
    const contactsCreated = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        createdAt: { gte: startDate }
      }
    })

    // Get qualified contacts (lead score >= 50)
    const qualified = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        leadScore: { gte: 50 },
        createdAt: { gte: startDate }
      }
    })

    // Get active contacts
    const active = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        status: 'active',
        createdAt: { gte: startDate }
      }
    })

    // Get clients (can be a custom status or tag)
    const clients = await prisma.cRMContact.count({
      where: {
        userId: user.id,
        leadScore: { gte: 80 },
        status: 'active',
        createdAt: { gte: startDate }
      }
    })

    // Build funnel data
    const funnelData = [
      { stage: 'Leads Capturados', count: leadsCaptured, percentage: 100 },
      { 
        stage: 'Contatos Criados', 
        count: contactsCreated, 
        percentage: leadsCaptured > 0 ? (contactsCreated / leadsCaptured * 100) : 0 
      },
      { 
        stage: 'Qualificados', 
        count: qualified, 
        percentage: contactsCreated > 0 ? (qualified / contactsCreated * 100) : 0 
      },
      { 
        stage: 'Ativos', 
        count: active, 
        percentage: qualified > 0 ? (active / qualified * 100) : 0 
      },
      { 
        stage: 'Clientes', 
        count: clients, 
        percentage: active > 0 ? (clients / active * 100) : 0 
      }
    ]

    // Calculate drop-off rates
    const dropOffRates = funnelData.map((stage, index) => {
      if (index === 0) return null
      const previous = funnelData[index - 1]
      const dropOff = previous.count > 0 
        ? ((previous.count - stage.count) / previous.count * 100).toFixed(2)
        : '0.00'
      return {
        from: previous.stage,
        to: stage.stage,
        rate: parseFloat(dropOff)
      }
    }).filter(Boolean)

    return NextResponse.json({
      period: parseInt(period),
      funnel: funnelData.map(stage => ({
        ...stage,
        percentage: parseFloat(stage.percentage.toFixed(2))
      })),
      dropOffRates,
      conversionRate: leadsCaptured > 0 
        ? parseFloat((clients / leadsCaptured * 100).toFixed(2))
        : 0
    })

  } catch (error) {
    console.error('Analytics funnel error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch funnel data' },
      { status: 500 }
    )
  }
}
