import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function POST(
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
      },
      include: {
        actions: true
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Validate workflow has at least one action
    if (!workflow.actions || workflow.actions.length === 0) {
      return NextResponse.json(
        { error: 'Workflow must have at least one action' },
        { status: 400 }
      )
    }

    // Activate workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: params.id },
      data: { status: 'active' },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedWorkflow)

  } catch (error) {
    console.error('Failed to activate workflow:', error)
    return NextResponse.json(
      { error: 'Failed to activate workflow' },
      { status: 500 }
    )
  }
}
