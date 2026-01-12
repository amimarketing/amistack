'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Play,
  Pause,
  Edit,
  Trash2,
  Plus,
  Zap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Workflow {
  id: string
  name: string
  description: string | null
  status: string
  trigger: string
  actions: any[]
  _count: {
    executions: number
  }
  createdAt: string
  updatedAt: string
}

const triggerLabels: { [key: string]: string } = {
  new_lead: 'Novo Lead',
  new_contact: 'Novo Contato',
  form_submit: 'Submissão de Formulário',
  tag_added: 'Tag Adicionada',
  lead_score_changed: 'Score Alterado',
  date_based: 'Baseado em Data'
}

const statusColors: { [key: string]: string } = {
  draft: 'bg-gray-500',
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  archived: 'bg-gray-400'
}

export default function WorkflowsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchWorkflows()
    }
  }, [session])

  const fetchWorkflows = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/workflows')
      if (res.ok) {
        const data = await res.json()
        setWorkflows(data)
      }
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/activate`, {
        method: 'POST'
      })
      if (res.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to activate workflow:', error)
    }
  }

  const handlePause = async (id: string) => {
    try {
      const res = await fetch(`/api/workflows/${id}/pause`, {
        method: 'POST'
      })
      if (res.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to pause workflow:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este workflow?')) return

    try {
      const res = await fetch(`/api/workflows/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        fetchWorkflows()
      }
    } catch (error) {
      console.error('Failed to delete workflow:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-orange-500 to-red-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Automações & Workflows
          </h1>
          <p className="text-muted-foreground mt-1">
            Automatize seus processos de marketing e vendas
          </p>
        </div>

        <Link href="/workflows/new">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="w-4 h-4 mr-2" />
            Novo Workflow
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{workflows.length}</p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pausados</p>
                <p className="text-2xl font-bold">
                  {workflows.filter(w => w.status === 'paused').length}
                </p>
              </div>
              <Pause className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Execuções</p>
                <p className="text-2xl font-bold">
                  {workflows.reduce((sum, w) => sum + w._count.executions, 0)}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Zap className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum workflow criado</h3>
            <p className="text-muted-foreground mb-4">
              Crie seu primeiro workflow para automatizar processos
            </p>
            <Link href="/workflows/new">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500">
                <Plus className="w-4 h-4 mr-2" />
                Criar Workflow
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {workflows.map((workflow, index) => (
            <motion.div
              key={workflow.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle>{workflow.name}</CardTitle>
                        <Badge className={`${statusColors[workflow.status]} text-white`}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <CardDescription>
                        {workflow.description || 'Sem descrição'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {workflow.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePause(workflow.id)}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivate(workflow.id)}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                      <Link href={`/workflows/${workflow.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(workflow.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Trigger:</p>
                      <p className="font-medium">{triggerLabels[workflow.trigger] || workflow.trigger}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Ações:</p>
                      <p className="font-medium">{workflow.actions.length} ações</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Execuções:</p>
                      <p className="font-medium">{workflow._count.executions} vezes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
