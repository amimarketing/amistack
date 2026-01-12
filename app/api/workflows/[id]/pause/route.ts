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
      }
    })

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 })
    }

    // Pause workflow
    const updatedWorkflow = await prisma.workflow.update({
      where: { id: params.id },
      data: { status: 'paused' },
      include: {
        actions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json(updatedWorkflow)

  } catch (error) {
    console.error('Failed to pause workflow:', error)
    return NextResponse.json(
      { error: 'Failed to pause workflow' },
      { status: 500 }
    )
  }
}
