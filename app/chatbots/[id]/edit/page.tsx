'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Bot,
  Sparkles,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface KnowledgeItem {
  keywords: string[];
  response: string;
}

export default function EditChatbot() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<any>(null);
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>([]);
  const [newKeywords, setNewKeywords] = useState('');
  const [newResponse, setNewResponse] = useState('');

  useEffect(() => {
    if (params.id) {
      fetch(`/api/chatbots/${params.id}`)
        .then((res) => res.json())
        .then((chatbot) => {
          setData(chatbot);
          setKnowledgeBase(chatbot.knowledgeBase || []);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const payload = {
        ...data,
        knowledgeBase,
      };
      await fetch(`/api/chatbots/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      toast({ title: 'Sucesso', description: 'Chatbot atualizado!' });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao salvar',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const addKnowledgeItem = () => {
    if (!newKeywords.trim() || !newResponse.trim()) {
      toast({
        title: 'Atenção',
        description: 'Preencha palavras-chave e resposta',
        variant: 'destructive',
      });
      return;
    }

    const keywords = newKeywords
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywords.length === 0) {
      toast({
        title: 'Atenção',
        description: 'Adicione pelo menos uma palavra-chave',
        variant: 'destructive',
      });
      return;
    }

    setKnowledgeBase([...knowledgeBase, { keywords, response: newResponse }]);
    setNewKeywords('');
    setNewResponse('');
    toast({
      title: 'Item Adicionado',
      description: 'Base de conhecimento atualizada',
    });
  };

  const removeKnowledgeItem = (index: number) => {
    setKnowledgeBase(knowledgeBase.filter((_, i) => i !== index));
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
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/chatbots')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Bot className="w-6 h-6 text-orange-600" />
            <h1 className="text-xl font-bold">{data.name}</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
            <TabsTrigger value="knowledge">
              <Sparkles className="w-4 h-4 mr-2" />
              Base de Conhecimento
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <MessageSquare className="w-4 h-4 mr-2" />
              Aparência
            </TabsTrigger>
          </TabsList>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Informações Básicas</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome do Chatbot *</Label>
                    <Input
                      id="name"
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      placeholder="Ex: Assistente de Vendas"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={data.description || ''}
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                      rows={3}
                      placeholder="Descreva o propósito deste chatbot..."
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-4">Mensagens</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="greeting">Mensagem de Saudação</Label>
                    <Input
                      id="greeting"
                      value={data.greeting}
                      onChange={(e) =>
                        setData({ ...data, greeting: e.target.value })
                      }
                      placeholder="Olá! Como posso ajudar você hoje?"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Primeira mensagem que o visitante verá
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="fallback">Mensagem de Fallback</Label>
                    <Input
                      id="fallback"
                      value={data.fallbackMessage}
                      onChange={(e) =>
                        setData({ ...data, fallbackMessage: e.target.value })
                      }
                      placeholder="Desculpe, não entendi. Pode reformular?"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Resposta quando o bot não entender a pergunta
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Status do Chatbot</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {data.status === 'active'
                        ? 'Chatbot está ativo e respondendo visitantes'
                        : 'Chatbot está desativado'}
                    </p>
                  </div>
                  <Switch
                    checked={data.status === 'active'}
                    onCheckedChange={(checked) =>
                      setData({ ...data, status: checked ? 'active' : 'inactive' })
                    }
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab */}
          <TabsContent value="knowledge">
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-bold mb-2">
                  Adicionar Nova Resposta
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Ensine seu chatbot a responder perguntas específicas
                </p>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="keywords">
                      Palavras-Chave (separadas por vírgula)
                    </Label>
                    <Input
                      id="keywords"
                      value={newKeywords}
                      onChange={(e) => setNewKeywords(e.target.value)}
                      placeholder="Ex: preço, valor, custo, quanto custa"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Quando o visitante mencionar qualquer dessas palavras, o bot
                      responderá
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="response">Resposta do Bot</Label>
                    <Textarea
                      id="response"
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      rows={3}
                      placeholder="Ex: Nossos planos começam em R$ 99/mês. Visite nossa página de preços para mais detalhes!"
                    />
                  </div>
                  <Button
                    onClick={addKnowledgeItem}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar à Base de Conhecimento
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">
                  Base de Conhecimento Atual
                  <Badge className="ml-2 bg-orange-600">
                    {knowledgeBase.length} {knowledgeBase.length === 1 ? 'item' : 'itens'}
                  </Badge>
                </h2>

                {knowledgeBase.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum item na base de conhecimento ainda</p>
                    <p className="text-sm mt-1">
                      Adicione respostas personalizadas acima
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {knowledgeBase.map((item, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2">
                              <Label className="text-xs text-gray-500">
                                Palavras-Chave:
                              </Label>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.keywords.map((keyword, kidx) => (
                                  <Badge
                                    key={kidx}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500">
                                Resposta:
                              </Label>
                              <p className="text-sm mt-1">{item.response}</p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeKnowledgeItem(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="text-lg font-bold mb-4">Personalização Visual</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Cor do Tema</Label>
                    <select
                      id="theme"
                      value={data.theme}
                      onChange={(e) =>
                        setData({ ...data, theme: e.target.value })
                      }
                      className="w-full border rounded-md p-2 mt-1"
                    >
                      <option value="orange">Laranja (Padrão)</option>
                      <option value="blue">Azul</option>
                      <option value="green">Verde</option>
                      <option value="purple">Roxo</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="position">Posição na Tela</Label>
                    <select
                      id="position"
                      value={data.position}
                      onChange={(e) =>
                        setData({ ...data, position: e.target.value })
                      }
                      className="w-full border rounded-md p-2 mt-1"
                    >
                      <option value="bottom-right">Canto Inferior Direito</option>
                      <option value="bottom-left">Canto Inferior Esquerdo</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
