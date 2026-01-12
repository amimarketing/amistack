'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  User,
  Bot,
  Clock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  visitorName: string | null;
  visitorEmail: string | null;
  createdAt: string;
  messages: Message[];
}

export default function ChatbotConversations() {
  const params = useParams();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetch(`/api/chatbots/${params.id}/conversations`)
        .then((res) => res.json())
        .then((data) => {
          setConversations(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Erro ao carregar conversas:', err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/chatbots')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <MessageCircle className="w-6 h-6 text-orange-600" />
            <div>
              <h1 className="text-2xl font-bold">Conversas do Chatbot</h1>
              <p className="text-sm text-gray-600">
                {conversations.length}{' '}
                {conversations.length === 1 ? 'conversa' : 'conversas'} registradas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {conversations.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold mb-2">Nenhuma conversa ainda</h3>
            <p className="text-gray-600 mb-4">
              As conversas aparecerão aqui quando os visitantes interagirem com
              seu chatbot.
            </p>
            <p className="text-sm text-gray-500">
              Certifique-se de que o chatbot está ativo e incorporado em seu site.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <Card key={conv.id} className="overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleExpanded(conv.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-bold">
                          {conv.visitorName || 'Visitante Anônimo'}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {conv.messages.length}{' '}
                          {conv.messages.length === 1 ? 'mensagem' : 'mensagens'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {conv.visitorEmail && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {conv.visitorEmail}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(conv.createdAt).toLocaleString('pt-BR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      {expandedId === conv.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === conv.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t bg-gray-50"
                    >
                      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
                        {conv.messages.map((msg, idx) => (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${
                              msg.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {msg.sender === 'bot' && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                                  <Bot className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender === 'user'
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-white border'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                              <p
                                className={`text-xs mt-1 ${
                                  msg.sender === 'user'
                                    ? 'text-orange-100'
                                    : 'text-gray-500'
                                }`}
                              >
                                {new Date(msg.createdAt).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                            {msg.sender === 'user' && (
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
