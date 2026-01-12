'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Copy, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FormData {
  id: string;
  name: string;
  description: string;
  status: string;
  submitButtonText: string;
  integrateCRM: boolean;
  fields: any[];
  _count: { submissions: number };
  createdAt: string;
}

interface Submission {
  id: string;
  values: Array<{ fieldLabel: string; fieldValue: string }>;
  createdAt: string;
  status: string;
}

export default function FormDetailPage() {
  const router = useRouter();
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<FormData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formId) {
      fetchFormDetails();
      fetchSubmissions();
    }
  }, [formId]);

  const fetchFormDetails = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}`);
      if (res.ok) {
        const data = await res.json();
        setForm(data);
      }
    } catch (error) {
      console.error('Error fetching form:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/forms/${formId}/submissions`);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const copyEmbedCode = () => {
    const embedCode = `<!-- Código Embed AmiStack Form -->
<div id="amistack-form-${formId}"></div>
<script src="${window.location.origin}/embed-form.js?id=${formId}"></script>`;
    
    navigator.clipboard.writeText(embedCode);
    toast.success('Código embed copiado!');
  };

  if (loading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  if (!form) {
    return <div className="container mx-auto p-6">Formulário não encontrado</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Button variant="ghost" onClick={() => router.push('/forms')} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {form.name}
              </h1>
              <p className="text-muted-foreground mt-2">{form.description}</p>
            </div>
            <Badge variant={form.status === 'active' ? 'default' : 'secondary'}>
              {form.status === 'active' ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => router.push(`/forms/${formId}/edit`)}
              variant="outline"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button onClick={copyEmbedCode} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Copiar Código Embed
            </Button>
          </div>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Respostas</p>
              <p className="text-3xl font-bold">{submissions.length}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Campos:</span>
              <span className="font-medium">{form.fields.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Integra CRM:</span>
              <span className="font-medium">{form.integrateCRM ? 'Sim' : 'Não'}</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Respostas Recebidas</h2>
        {submissions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma resposta recebida ainda
          </p>
        ) : (
          <div className="space-y-4">
            {submissions.map((submission) => (
              <Card key={submission.id} className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(submission.createdAt).toLocaleString('pt-BR')}
                  </span>
                  <Badge variant="outline">{submission.status}</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {submission.values.map((value, idx) => (
                    <div key={idx}>
                      <p className="text-sm font-medium text-muted-foreground">
                        {value.fieldLabel}:
                      </p>
                      <p className="font-medium">{value.fieldValue}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
