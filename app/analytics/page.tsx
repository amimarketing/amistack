'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { 
  TrendingUp, 
  Users, 
  Activity, 
  FileText, 
  Target,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react'
import { motion } from 'framer-motion'

const COLORS = ['#FF6B35', '#FFB800', '#4ECDC4', '#95E1D3', '#F38181']

interface AnalyticsData {
  period: number
  contacts: {
    total: number
    new: number
    byStatus: Array<{ status: string; count: number }>
  }
  interactions: {
    total: number
    recent: number
    byType: Array<{ type: string; count: number }>
  }
  forms: {
    total: number
    submissions: number
    recentSubmissions: number
  }
  metrics: {
    conversionRate: number
    avgLeadScore: number
  }
}

interface TimelineData {
  period: number
  timeline: Array<{
    date: string
    contacts: number
    interactions: number
    submissions: number
  }>
}

interface FunnelData {
  period: number
  funnel: Array<{
    stage: string
    count: number
    percentage: number
  }>
  dropOffRates: Array<{
    from: string
    to: string
    rate: number
  }>
  conversionRate: number
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [period, setPeriod] = useState('30')
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null)
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session) {
      fetchAnalytics()
    }
  }, [session, period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      // Fetch all analytics data
      const [overviewRes, timelineRes, funnelRes] = await Promise.all([
        fetch(`/api/analytics/overview?period=${period}`),
        fetch(`/api/analytics/timeline?period=${period}`),
        fetch(`/api/analytics/funnel?period=${period}`)
      ])

      if (overviewRes.ok && timelineRes.ok && funnelRes.ok) {
        const overview = await overviewRes.json()
        const timeline = await timelineRes.json()
        const funnel = await funnelRes.json()

        setAnalyticsData(overview)
        setTimelineData(timeline)
        setFunnelData(funnel)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    if (!analyticsData) return

    const data = {
      exportDate: new Date().toISOString(),
      ...analyticsData
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${period}days-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-orange-500 to-red-500"></div>
      </div>
    )
  }

  if (!analyticsData || !timelineData || !funnelData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando dados...</p>
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
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Análise completa de performance e conversões
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="60">Últimos 60 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Contatos</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.contacts.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analyticsData.contacts.new} novos
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Interações</CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.interactions.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{analyticsData.interactions.recent} recentes
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.metrics.conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Últimos {period} dias
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Lead Score Médio</CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.metrics.avgLeadScore.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                De 100 possíveis
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="distribution">
            <PieChartIcon className="w-4 h-4 mr-2" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="funnel">
            <TrendingUp className="w-4 h-4 mr-2" />
            Funil
          </TabsTrigger>
        </TabsList>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Atividade ao Longo do Tempo</CardTitle>
              <CardDescription>
                Evolução de contatos, interações e submissões
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={timelineData.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="contacts" 
                    name="Contatos"
                    stroke="#FF6B35" 
                    fill="#FF6B35" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="interactions" 
                    name="Interações"
                    stroke="#FFB800" 
                    fill="#FFB800" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="submissions" 
                    name="Submissões"
                    stroke="#4ECDC4" 
                    fill="#4ECDC4" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contatos por Status</CardTitle>
                <CardDescription>Distribuição de status dos contatos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analyticsData.contacts.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {analyticsData.contacts.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interações por Tipo</CardTitle>
                <CardDescription>Distribuição de tipos de interação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.interactions.byType}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Quantidade">
                      {analyticsData.interactions.byType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>
                Análise do fluxo de leads até clientes - Taxa de conversão: {funnelData.conversionRate}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                  data={funnelData.funnel}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="stage" type="category" />
                  <Tooltip 
                    formatter={(value: any, name: string) => {
                      if (name === 'count') return [value, 'Quantidade']
                      if (name === 'percentage') return [value + '%', 'Percentual']
                      return [value, name]
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Quantidade" fill="#FF6B35" />
                </BarChart>
              </ResponsiveContainer>

              {/* Drop-off rates */}
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Taxas de Abandono</h4>
                {funnelData.dropOffRates.map((dropOff, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm">
                      {dropOff.from} → {dropOff.to}
                    </span>
                    <span className="text-sm font-medium text-red-500">
                      {dropOff.rate}% de perda
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Forms Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Estatísticas de Formulários</CardTitle>
          <CardDescription>Performance dos formulários de captura</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{analyticsData.forms.total}</div>
              <p className="text-sm text-muted-foreground">Total de Formulários</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{analyticsData.forms.submissions}</div>
              <p className="text-sm text-muted-foreground">Total de Submissões</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{analyticsData.forms.recentSubmissions}</div>
              <p className="text-sm text-muted-foreground">Submissões Recentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
