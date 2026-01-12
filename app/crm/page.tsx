'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  Calendar,
  Award,
  Phone,
  Mail,
  MessageSquare,
  UserPlus,
  BarChart3,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CRMStats {
  totalContacts: number;
  activeContacts: number;
  qualifiedContacts: number;
  totalInteractions: number;
  recentContacts: number;
  upcomingInteractions: number;
  interactionsByType: Array<{
    type: string;
    _count: number;
  }>;
}

export default function CRMDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [stats, setStats] = useState<CRMStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/crm/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Contatos',
      value: stats?.totalContacts || 0,
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
      description: 'Contatos cadastrados',
    },
    {
      title: 'Contatos Ativos',
      value: stats?.activeContacts || 0,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
      description: 'Em atividade',
    },
    {
      title: 'Qualificados',
      value: stats?.qualifiedContacts || 0,
      icon: Award,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Leads qualificados',
    },
    {
      title: 'Interações',
      value: stats?.totalInteractions || 0,
      icon: MessageSquare,
      gradient: 'from-orange-500 to-red-500',
      description: 'Total de interações',
    },
    {
      title: 'Novos (7 dias)',
      value: stats?.recentContacts || 0,
      icon: UserPlus,
      gradient: 'from-indigo-500 to-blue-500',
      description: 'Últimos 7 dias',
    },
    {
      title: 'Próximas Atividades',
      value: stats?.upcomingInteractions || 0,
      icon: Calendar,
      gradient: 'from-yellow-500 to-orange-500',
      description: 'Agendadas',
    },
  ];

  const interactionTypes = [
    { type: 'call', label: 'Ligações', icon: Phone },
    { type: 'email', label: 'Emails', icon: Mail },
    { type: 'meeting', label: 'Reuniões', icon: Calendar },
    { type: 'note', label: 'Notas', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">CRM - Dashboard</h1>
              <p className="text-orange-100">
                Gerencie seus contatos e relacionamentos
              </p>
            </div>
            <Link href="/crm/contacts/new">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Novo Contato
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interaction Types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-orange-500" />
                  Interações por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactionTypes.map((type) => {
                    const Icon = type.icon;
                    const count =
                      stats?.interactionsByType?.find(
                        (i) => i.type === type.type
                      )?._count || 0;
                    const total = stats?.totalInteractions || 1;
                    const percentage = Math.round((count / total) * 100);

                    return (
                      <div key={type.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium">
                              {type.label}
                            </span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link href="/crm/contacts">
                    <Button
                      variant="outline"
                      className="w-full justify-between group hover:border-orange-500 hover:text-orange-600"
                    >
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Ver Todos os Contatos
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/crm/contacts/new">
                    <Button
                      variant="outline"
                      className="w-full justify-between group hover:border-orange-500 hover:text-orange-600"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="h-4 w-4" />
                        Adicionar Novo Contato
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      className="w-full justify-between group hover:border-orange-500 hover:text-orange-600"
                    >
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Dashboard Principal
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card className="mt-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 mb-2">
                  📚 Primeiros Passos
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Comece adicionando seus primeiros contatos e registrando
                  interações para manter um histórico completo de seus
                  relacionamentos.
                </p>
                <Link href="/crm/contacts/new">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  >
                    Adicionar Primeiro Contato
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
