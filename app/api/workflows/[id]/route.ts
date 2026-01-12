import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        userId: user.id
      },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        },
        executions: {
          take: 10,
          orderBy: { startedAt: 'desc' },
          include: {
            logs: {
              orderBy: { createdAt: 'asc' }
            }
          }
        }
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    return NextResponse.json(workflow)

  } catch (error) {
    console.error('Failed to fetch workflow:', error)
    return NextResponse.json(
      { error: 'Failed to fetch workflow' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    const { name, description, trigger, triggerConfig, status, actions } = body

    // Check if workflow exists and belongs to user
    const existingWorkflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!existingWorkflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Update workflow
    const workflow = await prisma.workflow.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(trigger && { trigger }),
        ...(triggerConfig !== undefined && {
          triggerConfig: triggerConfig ? JSON.stringify(triggerConfig) : null
        }),
        ...(status && { status })
      },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    // If actions are provided, delete existing and create new ones
    if (actions && Array.isArray(actions)) {
      await prisma.workflowAction.deleteMany({
        where: { workflowId: params.id }
      })

      if (actions.length > 0) {
        await prisma.workflowAction.createMany({
          data: actions.map((action: any, index: number) => ({
            workflowId: params.id,
            type: action.type,
            config: JSON.stringify(action.config),
            order: index,
            delayMinutes: action.delayMinutes || 0
          }))
        })
      }
    }

    // Fetch updated workflow with actions
    const updatedWorkflow = await prisma.workflow.findUnique({
      where: { id: params.id },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedWorkflow)

  } catch (error) {
    console.error('Failed to update workflow:', error)
    return NextResponse.json(
      { error: 'Failed to update workflow' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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

    // Check if workflow exists and belongs to user
    const workflow = await prisma.workflow.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Delete workflow (cascades to actions, executions, logs)
    await prisma.workflow.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Failed to delete workflow:', error)
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    )
  }
}
