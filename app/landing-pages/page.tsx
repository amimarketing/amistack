'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  Eye,
  Edit,
  Trash2,
  Globe,
  Copy,
  CheckCircle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  template: string;
  status: string;
  title: string;
  views: number;
  conversions: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

const templateLabels: Record<string, string> = {
  saas: 'SaaS',
  produtos: 'Produtos',
  servicos: 'Serviços',
};

export default function LandingPagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Form state for creation
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    template: 'saas',
    title: '',
    subtitle: '',
  });

  useEffect(() => {
    fetchLandingPages();
  }, []);

  const fetchLandingPages = async () => {
    try {
      const response = await fetch('/api/landing-pages');
      if (response.ok) {
        const data = await response.json();
        setLandingPages(data);
      }
    } catch (error) {
      console.error('Erro ao carregar landing pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.slug || !formData.title) {
      toast({
        title: 'Erro',
        description: 'Preencha todos os campos obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newPage = await response.json();
        toast({
          title: 'Sucesso',
          description: 'Landing page criada com sucesso!',
        });
        setCreateDialog(false);
        setFormData({ name: '', slug: '', template: 'saas', title: '', subtitle: '' });
        router.push(`/landing-pages/${newPage.id}/edit`);
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Erro ao criar landing page',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar landing page',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/landing-pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Landing page excluída com sucesso',
        });
        fetchLandingPages();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir landing page',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  const handlePublishToggle = async (id: string, currentStatus: string) => {
    const action = currentStatus === 'published' ? 'unpublish' : 'publish';

    try {
      const response = await fetch(`/api/landing-pages/${id}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description:
            action === 'publish'
              ? 'Landing page publicada!'
              : 'Landing page despublicada',
        });
        fetchLandingPages();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status',
        variant: 'destructive',
      });
    }
  };

  const copyPublicUrl = (slug: string) => {
    const url = `${window.location.origin}/lp/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    toast({
      title: 'URL Copiada!',
      description: 'Link da landing page copiado para a área de transferência',
    });
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
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
            <h1 className="text-3xl font-bold mb-2">Landing Pages</h1>
            <p className="text-gray-600">
              Crie e gerencie suas páginas de captura personalizadas
            </p>
          </div>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Landing Page
          </Button>
        </div>
      </div>

      {landingPages.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Nenhuma Landing Page ainda</h3>
          <p className="text-gray-600 mb-6">
            Crie sua primeira landing page para começar a capturar leads
          </p>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Primeira Landing Page
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {landingPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{page.name}</h3>
                    <p className="text-sm text-gray-600">{page.title}</p>
                  </div>
                  <Badge
                    variant={page.status === 'published' ? 'default' : 'secondary'}
                    className={
                      page.status === 'published'
                        ? 'bg-green-600'
                        : 'bg-gray-500'
                    }
                  >
                    {page.status === 'published' ? 'Publicada' : 'Rascunho'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Template:</span>
                    <span className="font-medium">
                      {templateLabels[page.template]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visualizações:</span>
                    <span className="font-medium">{page.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Conversões:</span>
                    <span className="font-medium">{page.conversions}</span>
                  </div>
                </div>

                {page.status === 'published' && (
                  <div className="mb-4 p-2 bg-gray-50 rounded flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <code className="text-xs flex-1 truncate">/lp/{page.slug}</code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyPublicUrl(page.slug)}
                      className="h-6 w-6 p-0"
                    >
                      {copiedSlug === page.slug ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2">
                  {page.status === 'published' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`/lp/${page.slug}`, '_blank')}
                      className="flex-1"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/landing-pages/${page.id}/edit`)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog(page.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handlePublishToggle(page.id, page.status)}
                    className="w-full"
                  >
                    {page.status === 'published' ? 'Despublicar' : 'Publicar'}
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
            <DialogTitle>Nova Landing Page</DialogTitle>
            <DialogDescription>
              Escolha um template e configure sua nova landing page
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: generateSlug(name),
                  });
                }}
                placeholder="Ex: Campanha Black Friday"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL) *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="Ex: campanha-black-friday"
              />
              <p className="text-xs text-gray-500 mt-1">
                URL da página: /lp/{formData.slug || '...'}
              </p>
            </div>
            <div>
              <Label htmlFor="template">Template *</Label>
              <Select
                value={formData.template}
                onValueChange={(value) =>
                  setFormData({ ...formData, template: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS - Software como Serviço</SelectItem>
                  <SelectItem value="produtos">Produtos - E-commerce</SelectItem>
                  <SelectItem value="servicos">Serviços - Profissionais</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="title">Título Principal *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ex: Transforme seu Negócio com IA"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtítulo</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) =>
                  setFormData({ ...formData, subtitle: e.target.value })
                }
                placeholder="Descreva brevemente sua oferta..."
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
              Criar e Editar
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
              Tem certeza que deseja excluir esta landing page? Esta ação não pode ser
              desfeita.
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
    </div>
  );
}