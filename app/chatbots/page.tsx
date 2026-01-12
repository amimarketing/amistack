'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  MessageSquare,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Activity,
  Code,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Chatbot {
  id: string;
  name: string;
  description?: string;
  status: string;
  theme: string;
  totalMessages: number;
  totalSessions: number;
  createdAt: string;
  updatedAt: string;
}

export default function ChatbotsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [embedDialog, setEmbedDialog] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchChatbots();
  }, []);

  const fetchChatbots = async () => {
    try {
      const response = await fetch('/api/chatbots');
      if (response.ok) {
        const data = await response.json();
        setChatbots(data);
      }
    } catch (error) {
      console.error('Erro ao carregar chatbots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name) {
      toast({
        title: 'Erro',
        description: 'Nome é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newBot = await response.json();
        toast({
          title: 'Sucesso',
          description: 'Chatbot criado com sucesso!',
        });
        setCreateDialog(false);
        setFormData({ name: '', description: '' });
        router.push(`/chatbots/${newBot.id}/edit`);
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Erro ao criar chatbot',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar chatbot',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Chatbot excluído com sucesso',
        });
        fetchChatbots();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir chatbot',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  const getEmbedCode = (id: string) => {
    return `<!-- AmiStack Chatbot Widget -->
<script>
  (function() {
    var s = document.createElement('script');
    s.src = '${window.location.origin}/chatbot-widget.js';
    s.setAttribute('data-chatbot-id', '${id}');
    document.body.appendChild(s);
  })();
</script>`;
  };

  const copyEmbedCode = (id: string) => {
    navigator.clipboard.writeText(getEmbedCode(id));
    toast({
      title: 'Código Copiado!',
      description: 'Cole no seu site antes do </body>',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI Chatbots</h1>
            <p className="text-gray-600">
              Crie assistentes virtuais inteligentes para seu site
            </p>
          </div>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Chatbot
          </Button>
        </div>
      </div>

      {chatbots.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Nenhum Chatbot ainda</h3>
          <p className="text-gray-600 mb-6">
            Crie seu primeiro chatbot para atender seus clientes automaticamente
          </p>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeiro Chatbot
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{bot.name}</h3>
                    {bot.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {bot.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={bot.status === 'active' ? 'default' : 'secondary'}
                    className={
                      bot.status === 'active' ? 'bg-green-600' : 'bg-gray-500'
                    }
                  >
                    {bot.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">Mensagens</span>
                    </div>
                    <span className="font-bold text-orange-600">
                      {bot.totalMessages}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Conversas</span>
                    </div>
                    <span className="font-bold text-blue-600">
                      {bot.totalSessions}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/chatbots/${bot.id}/conversations`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Conversas
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/chatbots/${bot.id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog(bot.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEmbedDialog(bot.id)}
                    className="w-full"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Código de Incorporação
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Chatbot</DialogTitle>
            <DialogDescription>
              Configure as informações básicas do seu assistente virtual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ex: Assistente de Vendas"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva o propósito deste chatbot..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-orange-600 to-red-600"
            >
              Criar e Configurar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este chatbot? Todas as conversas
              associadas serão perdidas. Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Embed Code Dialog */}
      <Dialog open={!!embedDialog} onOpenChange={() => setEmbedDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Código de Incorporação</DialogTitle>
            <DialogDescription>
              Copie e cole este código no seu site, antes da tag &lt;/body&gt;
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{embedDialog && getEmbedCode(embedDialog)}</pre>
          </div>
          <DialogFooter>
            <Button
              onClick={() => embedDialog && copyEmbedCode(embedDialog)}
              className="bg-gradient-to-r from-orange-600 to-red-600"
            >
              <Code className="w-4 h-4 mr-2" />
              Copiar Código
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}