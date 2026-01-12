'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Linkedin,
  Edit,
  Trash2,
  Plus,
  Calendar,
  MessageSquare,
  PhoneCall,
  Video,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface Contact {
  id: string;
  firstName: string;
  lastName: string | null;
  fullName: string;
  email: string | null;
  phone: string | null;
  mobile: string | null;
  companyName: string | null;
  jobTitle: string | null;
  department: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  linkedIn: string | null;
  notes: string | null;
  photo: string | null;
  source: string | null;
  status: string;
  leadScore: number;
  createdAt: string;
  updatedAt: string;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      color: string;
    };
  }>;
  interactions: Interaction[];
}

interface Interaction {
  id: string;
  type: string;
  title: string;
  description: string | null;
  outcome: string | null;
  duration: number | null;
  scheduledAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ContactDetailPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false);
  const [interactionForm, setInteractionForm] = useState({
    type: 'call',
    title: '',
    description: '',
    outcome: '',
    duration: '',
    scheduledAt: '',
    completedAt: '',
  });
  const [savingInteraction, setSavingInteraction] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated' && contactId) {
      fetchContact();
    }
  }, [status, contactId]);

  const fetchContact = async () => {
    try {
      const response = await fetch(`/api/crm/contacts/${contactId}`);
      if (response.ok) {
        const data = await response.json();
        setContact(data.contact);
      } else {
        toast.error('Contato não encontrado');
        router.push('/crm/contacts');
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
      toast.error('Erro ao carregar contato');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    try {
      const response = await fetch(`/api/crm/contacts/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Contato excluído com sucesso');
        router.push('/crm/contacts');
      } else {
        toast.error('Erro ao excluir contato');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Erro ao excluir contato');
    }
    setDeleteDialogOpen(false);
  };

  const handleAddInteraction = async () => {
    setSavingInteraction(true);
    try {
      const response = await fetch('/api/crm/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactId,
          type: interactionForm.type,
          title: interactionForm.title,
          description: interactionForm.description || null,
          outcome: interactionForm.outcome || null,
          duration: interactionForm.duration ? parseInt(interactionForm.duration) : null,
          scheduledAt: interactionForm.scheduledAt || null,
          completedAt: interactionForm.completedAt || new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast.success('Interação adicionada com sucesso');
        setInteractionDialogOpen(false);
        setInteractionForm({
          type: 'call',
          title: '',
          description: '',
          outcome: '',
          duration: '',
          scheduledAt: '',
          completedAt: '',
        });
        fetchContact();
      } else {
        toast.error('Erro ao adicionar interação');
      }
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast.error('Erro ao adicionar interação');
    } finally {
      setSavingInteraction(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'qualified':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'qualified':
        return 'Qualificado';
      case 'inactive':
        return 'Inativo';
      case 'lost':
        return 'Perdido';
      default:
        return status;
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call':
        return PhoneCall;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      case 'note':
        return FileText;
      case 'video':
        return Video;
      default:
        return MessageSquare;
    }
  };

  const getInteractionLabel = (type: string) => {
    switch (type) {
      case 'call':
        return 'Ligação';
      case 'email':
        return 'Email';
      case 'meeting':
        return 'Reunião';
      case 'note':
        return 'Nota';
      case 'video':
        return 'Videoconferência';
      case 'demo':
        return 'Demonstração';
      case 'proposal':
        return 'Proposta';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInitials = (firstName: string, lastName: string | null) => {
    return `${firstName.charAt(0)}${lastName?.charAt(0) || ''}`;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando contato...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Contato não encontrado</p>
          <Link href="/crm/contacts">
            <Button className="mt-4" variant="outline">
              Voltar para Contatos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total de Interações',
      value: contact.interactions.length,
      icon: MessageSquare,
    },
    {
      label: 'Última Interação',
      value:
        contact.interactions.length > 0
          ? new Date(
              contact.interactions[0].createdAt
            ).toLocaleDateString('pt-BR')
          : 'Nenhuma',
      icon: Clock,
    },
    {
      label: 'Lead Score',
      value: contact.leadScore,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/crm/contacts">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {contact.fullName}
                </h1>
                {contact.jobTitle && (
                  <p className="text-orange-100">{contact.jobTitle}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/crm/contacts/${contactId}/edit`}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border-4 border-orange-500">
                      <AvatarImage src={contact.photo || ''} />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white text-2xl">
                        {getInitials(contact.firstName, contact.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold mt-4">
                      {contact.fullName}
                    </h2>
                    {contact.jobTitle && (
                      <p className="text-gray-600">{contact.jobTitle}</p>
                    )}
                    {contact.companyName && (
                      <p className="text-sm text-gray-500 mt-1">
                        {contact.companyName}
                      </p>
                    )}
                    <div className="mt-4">
                      <Badge className={getStatusColor(contact.status)}>
                        {getStatusLabel(contact.status)}
                      </Badge>
                    </div>
                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 justify-center mt-3">
                        {contact.tags.map((ct) => (
                          <Badge
                            key={ct.tag.id}
                            variant="outline"
                            style={{
                              borderColor: ct.tag.color,
                              color: ct.tag.color,
                            }}
                          >
                            {ct.tag.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações de Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-orange-500" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.mobile && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-orange-500" />
                      <a
                        href={`tel:${contact.mobile}`}
                        className="text-blue-600 hover:underline"
                      >
                        {contact.mobile} (Celular)
                      </a>
                    </div>
                  )}
                  {contact.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-orange-500" />
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  {contact.linkedIn && (
                    <div className="flex items-center gap-2 text-sm">
                      <Linkedin className="h-4 w-4 text-orange-500" />
                      <a
                        href={contact.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Company Information */}
            {(contact.companyName ||
              contact.department ||
              contact.address ||
              contact.city) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-orange-500" />
                      Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {contact.companyName && (
                      <div>
                        <span className="font-medium">Empresa:</span>
                        <br />
                        {contact.companyName}
                      </div>
                    )}
                    {contact.department && (
                      <div>
                        <span className="font-medium">Departamento:</span>
                        <br />
                        {contact.department}
                      </div>
                    )}
                    {(contact.address || contact.city) && (
                      <div className="flex items-start gap-2 pt-2">
                        <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                        <div>
                          {contact.address && <div>{contact.address}</div>}
                          {(contact.city || contact.state) && (
                            <div>
                              {contact.city}
                              {contact.state && `, ${contact.state}`}
                              {contact.zipCode && ` - ${contact.zipCode}`}
                            </div>
                          )}
                          {contact.country && <div>{contact.country}</div>}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estatísticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-orange-500" />
                          <span className="text-sm text-gray-600">
                            {stat.label}
                          </span>
                        </div>
                        <span className="font-semibold">{stat.value}</span>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>

            {/* Notes */}
            {contact.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-orange-500" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {contact.notes}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Right Column - Interactions Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Interaction Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <Button
                    onClick={() => setInteractionDialogOpen(true)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Interação
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Interactions Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Interações</CardTitle>
                  <CardDescription>
                    Timeline de todas as interações com este contato
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contact.interactions.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        Nenhuma interação registrada ainda
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Clique em "Adicionar Interação" para começar
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 to-red-500"></div>

                      <div className="space-y-8">
                        {contact.interactions.map((interaction, index) => {
                          const Icon = getInteractionIcon(interaction.type);
                          return (
                            <motion.div
                              key={interaction.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-16"
                            >
                              {/* Timeline dot */}
                              <div className="absolute left-3 top-0 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                                <Icon className="h-3 w-3 text-white" />
                              </div>

                              <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="pt-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">
                                          {getInteractionLabel(interaction.type)}
                                        </Badge>
                                        {interaction.outcome && (
                                          <Badge
                                            variant="secondary"
                                            className="bg-green-100 text-green-800"
                                          >
                                            {interaction.outcome}
                                          </Badge>
                                        )}
                                      </div>
                                      <h4 className="font-semibold text-gray-900">
                                        {interaction.title}
                                      </h4>
                                      {interaction.description && (
                                        <p className="text-sm text-gray-600 mt-2">
                                          {interaction.description}
                                        </p>
                                      )}
                                      {interaction.duration && (
                                        <p className="text-xs text-gray-500 mt-2">
                                          Duração: {interaction.duration} minutos
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {formatDate(interaction.createdAt)}
                                    </span>
                                    {interaction.completedAt && (
                                      <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle className="h-3 w-3" />
                                        Concluída
                                      </span>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser
              desfeita e todas as interações relacionadas serão removidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteContact}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Interaction Dialog */}
      <Dialog open={interactionDialogOpen} onOpenChange={setInteractionDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Adicionar Interação</DialogTitle>
            <DialogDescription>
              Registre uma nova interação com {contact.fullName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Tipo de Interação</Label>
                <Select
                  value={interactionForm.type}
                  onValueChange={(value) =>
                    setInteractionForm({ ...interactionForm, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Ligação</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="video">Videoconferência</SelectItem>
                    <SelectItem value="note">Nota</SelectItem>
                    <SelectItem value="demo">Demonstração</SelectItem>
                    <SelectItem value="proposal">Proposta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="outcome">Resultado</Label>
                <Select
                  value={interactionForm.outcome}
                  onValueChange={(value) =>
                    setInteractionForm({ ...interactionForm, outcome: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="successful">Bem-sucedida</SelectItem>
                    <SelectItem value="follow_up">Requer follow-up</SelectItem>
                    <SelectItem value="not_interested">Não interessado</SelectItem>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={interactionForm.title}
                onChange={(e) =>
                  setInteractionForm({ ...interactionForm, title: e.target.value })
                }
                placeholder="Ex: Ligação de apresentação"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={interactionForm.description}
                onChange={(e) =>
                  setInteractionForm({
                    ...interactionForm,
                    description: e.target.value,
                  })
                }
                placeholder="Detalhes da interação..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Duração (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={interactionForm.duration}
                  onChange={(e) =>
                    setInteractionForm({
                      ...interactionForm,
                      duration: e.target.value,
                    })
                  }
                  placeholder="30"
                />
              </div>
              <div>
                <Label htmlFor="scheduledAt">Data Agendada (opcional)</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={interactionForm.scheduledAt}
                  onChange={(e) =>
                    setInteractionForm({
                      ...interactionForm,
                      scheduledAt: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setInteractionDialogOpen(false)}
                disabled={savingInteraction}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAddInteraction}
                disabled={!interactionForm.title || savingInteraction}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
              >
                {savingInteraction ? 'Salvando...' : 'Salvar Interação'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
