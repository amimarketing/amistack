'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import TemplateSaaS from '@/components/landing-templates/template-saas';
import TemplateProdutos from '@/components/landing-templates/template-produtos';
import TemplateServicos from '@/components/landing-templates/template-servicos';

interface LandingPageData {
  id: string;
  name: string;
  slug: string;
  template: string;
  status: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  ctaText: string;
  ctaUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  primaryColor?: string;
  secondaryColor?: string;
  features?: Array<{ title: string; description: string; icon?: string }>;
  testimonials?: Array<{ name: string; role: string; text: string; photo?: string }>;
  formId?: string;
}

export default function EditLandingPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<LandingPageData | null>(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (params.id) {
      fetchLandingPage();
    }
  }, [params.id]);

  const fetchLandingPage = async () => {
    try {
      const response = await fetch(`/api/landing-pages/${params.id}`);
      if (response.ok) {
        const landingPage = await response.json();
        setData(landingPage);
      } else {
        toast({
          title: 'Erro',
          description: 'Landing page não encontrada',
          variant: 'destructive',
        });
        router.push('/landing-pages');
      }
    } catch (error) {
      console.error('Erro ao carregar landing page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!data) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/landing-pages/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Landing page atualizada com sucesso!',
        });
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Erro ao salvar',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar landing page',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    if (!data) return null;

    const templateProps = {
      data: {
        title: data.title,
        subtitle: data.subtitle,
        heroImage: data.heroImage,
        ctaText: data.ctaText,
        ctaUrl: data.ctaUrl,
        features: data.features,
        testimonials: data.testimonials,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      },
      onCtaClick: () => {
        toast({
          title: 'Preview',
          description: 'Botão CTA clicado (modo preview)',
        });
      },
    };

    switch (data.template) {
      case 'saas':
        return <TemplateSaaS {...templateProps} />;
      case 'produtos':
        return <TemplateProdutos {...templateProps} />;
      case 'servicos':
        return <TemplateServicos {...templateProps} />;
      default:
        return <div>Template não encontrado</div>;
    }
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/landing-pages')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-xl font-bold">{data.name}</h1>
                <p className="text-sm text-gray-600">/lp/{data.slug}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {data.status === 'published' && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`/lp/${data.slug}`, '_blank')}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Público
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-orange-600 to-red-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 space-y-6">
                <div>
                  <Label htmlFor="title">Título Principal *</Label>
                  <Input
                    id="title"
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="Ex: Transforme seu Negócio com IA"
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtítulo</Label>
                  <Textarea
                    id="subtitle"
                    value={data.subtitle || ''}
                    onChange={(e) => setData({ ...data, subtitle: e.target.value })}
                    placeholder="Descreva brevemente sua oferta..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="heroImage">URL da Imagem Hero</Label>
                  <Input
                    id="heroImage"
                    value={data.heroImage || ''}
                    onChange={(e) => setData({ ...data, heroImage: e.target.value })}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctaText">Texto do Botão CTA *</Label>
                    <Input
                      id="ctaText"
                      value={data.ctaText}
                      onChange={(e) => setData({ ...data, ctaText: e.target.value })}
                      placeholder="Ex: Começar Agora"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaUrl">URL do CTA</Label>
                    <Input
                      id="ctaUrl"
                      value={data.ctaUrl || ''}
                      onChange={(e) => setData({ ...data, ctaUrl: e.target.value })}
                      placeholder="/contato"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="seo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 space-y-6">
                <div>
                  <Label htmlFor="metaTitle">Título SEO</Label>
                  <Input
                    id="metaTitle"
                    value={data.metaTitle || ''}
                    onChange={(e) => setData({ ...data, metaTitle: e.target.value })}
                    placeholder="Ex: Melhor Software de Marketing com IA"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 50-60 caracteres
                  </p>
                </div>
                <div>
                  <Label htmlFor="metaDescription">Descrição SEO</Label>
                  <Textarea
                    id="metaDescription"
                    value={data.metaDescription || ''}
                    onChange={(e) =>
                      setData({ ...data, metaDescription: e.target.value })
                    }
                    placeholder="Descreva sua página para os mecanismos de busca..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recomendado: 150-160 caracteres
                  </p>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="design">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-6 space-y-6">
                <div>
                  <Label>Cores Personalizadas (opcional)</Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Deixe em branco para usar as cores padrão da AMIMARKETING
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryColor">Cor Primária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="primaryColor"
                          value={data.primaryColor || ''}
                          onChange={(e) =>
                            setData({ ...data, primaryColor: e.target.value })
                          }
                          placeholder="#FF6B35"
                        />
                        <input
                          type="color"
                          value={data.primaryColor || '#FF6B35'}
                          onChange={(e) =>
                            setData({ ...data, primaryColor: e.target.value })
                          }
                          className="w-12 h-10 rounded border"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="secondaryColor">Cor Secundária</Label>
                      <div className="flex gap-2">
                        <Input
                          id="secondaryColor"
                          value={data.secondaryColor || ''}
                          onChange={(e) =>
                            setData({ ...data, secondaryColor: e.target.value })
                          }
                          placeholder="#FFB800"
                        />
                        <input
                          type="color"
                          value={data.secondaryColor || '#FFB800'}
                          onChange={(e) =>
                            setData({ ...data, secondaryColor: e.target.value })
                          }
                          className="w-12 h-10 rounded border"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="preview">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {renderPreview()}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}