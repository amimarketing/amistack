'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Building2, Calendar, CreditCard, User, MessageSquare, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  interest?: string;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
  createdAt: string;
}

interface Subscription {
  id: string;
  stripeSessionId: string;
  customerEmail?: string;
  plan: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  // Authentication check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/data');
      const data = await response.json();
      setLeads(data.leads || []);
      setContacts(data.contacts || []);
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'basic': return 'bg-blue-500';
      case 'professional': return 'bg-orange-500';
      case 'enterprise': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Show loading state while checking authentication or loading data
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-2xl">Carregando...</div>
      </div>
    );
  }

  // Show unauthorized message if not admin
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800/50 border-red-500/20">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Acesso Negado</h2>
              <p className="text-gray-400">Você não tem permissão para acessar esta página.</p>
              <p className="text-sm text-gray-500">Apenas administradores podem acessar o painel administrativo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render if not authenticated or not admin
  if (!session?.user || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent mb-2">
            Dashboard Administrativo
          </h1>
          <p className="text-gray-400">Visão geral de leads, contatos e assinaturas da AmiStack</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Total de Leads
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{leads.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Mensagens de Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{contacts.length}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="bg-gray-800/50 border-orange-500/20 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Assinaturas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{subscriptions.length}</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="w-full">
          <TabsList className="bg-gray-800/50 border border-orange-500/20">
            <TabsTrigger value="leads" className="data-[state=active]:bg-orange-500">
              Leads ({leads.length})
            </TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-red-500">
              Contatos ({contacts.length})
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-green-500">
              Assinaturas ({subscriptions.length})
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads" className="space-y-4 mt-6">
            {leads.length === 0 ? (
              <Card className="bg-gray-800/50 border-orange-500/20">
                <CardContent className="py-8 text-center text-gray-400">
                  Nenhum lead capturado ainda.
                </CardContent>
              </Card>
            ) : (
              leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-800/50 border-orange-500/20 hover:border-orange-500/40 transition-colors">
                    <CardContent className="py-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="flex items-center gap-1 text-gray-400">
                              <Mail className="w-4 h-4" />
                              {lead.email}
                            </span>
                            {lead.company && (
                              <span className="flex items-center gap-1 text-gray-400">
                                <Building2 className="w-4 h-4" />
                                {lead.company}
                              </span>
                            )}
                            {lead.phone && (
                              <span className="flex items-center gap-1 text-gray-400">
                                <Phone className="w-4 h-4" />
                                {lead.phone}
                              </span>
                            )}
                          </div>
                          {lead.interest && (
                            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                              {lead.interest}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-4 h-4" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-4 mt-6">
            {contacts.length === 0 ? (
              <Card className="bg-gray-800/50 border-orange-500/20">
                <CardContent className="py-8 text-center text-gray-400">
                  Nenhuma mensagem de contato recebida ainda.
                </CardContent>
              </Card>
            ) : (
              contacts.map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-800/50 border-red-500/20 hover:border-red-500/40 transition-colors">
                    <CardContent className="py-6">
                      <div className="space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
                            <div className="flex flex-wrap gap-3 text-sm">
                              <span className="flex items-center gap-1 text-gray-400">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </span>
                              {contact.company && (
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Building2 className="w-4 h-4" />
                                  {contact.company}
                                </span>
                              )}
                              {contact.phone && (
                                <span className="flex items-center gap-1 text-gray-400">
                                  <Phone className="w-4 h-4" />
                                  {contact.phone}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(contact.createdAt)}
                          </div>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                          <p className="text-sm text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4 mt-6">
            {subscriptions.length === 0 ? (
              <Card className="bg-gray-800/50 border-orange-500/20">
                <CardContent className="py-8 text-center text-gray-400">
                  Nenhuma assinatura ativa ainda.
                </CardContent>
              </Card>
            ) : (
              subscriptions.map((sub, index) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-gray-800/50 border-green-500/20 hover:border-green-500/40 transition-colors">
                    <CardContent className="py-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-semibold text-white">
                              {sub.customerEmail || 'Email não disponível'}
                            </h3>
                            <Badge className={`${getStatusBadgeColor(sub.status)} text-white`}>
                              {sub.status}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <Badge className={`${getPlanBadgeColor(sub.plan)} text-white`}>
                              Plano: {sub.plan ? sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1) : 'N/A'}
                            </Badge>
                            <span className="text-gray-400">
                              Session ID: {sub.stripeSessionId ? sub.stripeSessionId.substring(0, 20) : 'N/A'}...
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Criado: {formatDate(sub.createdAt)}
                          </span>
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Atualizado: {formatDate(sub.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}