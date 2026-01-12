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

    const workflows = await prisma.workflow.findMany({
      where: { userId: user.id },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: { executions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(workflows)

  } catch (error) {
    console.error('Failed to fetch workflows:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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

    const body = await req.json()
    const { name, description, trigger, triggerConfig, actions } = body

    if (!name || !trigger) {
      return NextResponse.json(
        { error: 'Name and trigger are required' },
        { status: 400 }
      )
    }

    // Create workflow with actions
    const workflow = await prisma.workflow.create({
      data: {
        name,
        description,
        trigger,
        triggerConfig: triggerConfig ? JSON.stringify(triggerConfig) : null,
        userId: user.id,
        actions: actions && actions.length > 0 ? {
          create: actions.map((action: any, index: number) => ({
            type: action.type,
            config: JSON.stringify(action.config),
            order: index,
            delayMinutes: action.delayMinutes || 0
          }))
        } : undefined
      },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(workflow, { status: 201 })

  } catch (error) {
    console.error('Failed to create workflow:', error)
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    )
  }
}
