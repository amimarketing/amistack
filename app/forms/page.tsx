'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, FileText, BarChart3, Trash2, Edit, Copy, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Form {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  _count: {
    submissions: number;
  };
}

export default function FormsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }
    if (status === 'authenticated') {
      fetchForms();
    }
  }, [status, router]);

  const fetchForms = async () => {
    try {
      const res = await fetch('/api/forms');
      if (res.ok) {
        const data = await res.json();
        setForms(data);
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Erro ao carregar formulários');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este formulário? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const res = await fetch(`/api/forms/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Formulário excluído com sucesso!');
        fetchForms();
      } else {
        toast.error('Erro ao excluir formulário');
      }
    } catch (error) {
      console.error('Error deleting form:', error);
      toast.error('Erro ao excluir formulário');
    }
  };

  const copyEmbedCode = (formId: string) => {
    const embedCode = `<!-- Código Embed AmiStack Form -->
<div id="amistack-form-${formId}"></div>
<script>
  (function() {
    const formId = '${formId}';
    const apiUrl = '${window.location.origin}/api/forms/' + formId + '/submit';
    const formContainer = document.getElementById('amistack-form-' + formId);
    
    fetch('${window.location.origin}/api/forms/' + formId)
      .then(res => res.json())
      .then(form => {
        let html = '<form class="amistack-form" style="max-width: 600px; margin: 0 auto;">';
        form.fields.forEach(field => {
          html += '<div style="margin-bottom: 1rem;">';
          html += '<label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">' + field.label;
          if (field.required) html += ' *';
          html += '</label>';
          
          if (field.fieldType === 'textarea') {
            html += '<textarea name="' + field.label + '" ' + (field.required ? 'required' : '') + ' placeholder="' + (field.placeholder || '') + '" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;"></textarea>';
          } else {
            html += '<input type="' + field.fieldType + '" name="' + field.label + '" ' + (field.required ? 'required' : '') + ' placeholder="' + (field.placeholder || '') + '" style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.375rem;" />';
          }
          html += '</div>';
        });
        html += '<button type="submit" style="background: linear-gradient(to right, #FFB800, #FF6B35); color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; cursor: pointer;">' + form.submitButtonText + '</button>';
        html += '</form>';
        formContainer.innerHTML = html;
        
        const formElement = formContainer.querySelector('form');
        formElement.addEventListener('submit', function(e) {
          e.preventDefault();
          const formData = new FormData(formElement);
          const values = {};
          formData.forEach((value, key) => { values[key] = value; });
          
          fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ values })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              alert(data.message);
              formElement.reset();
              if (data.redirectUrl) window.location.href = data.redirectUrl;
            }
          })
          .catch(err => alert('Erro ao enviar formulário'));
        });
      });
  })();
</script>`;
    
    navigator.clipboard.writeText(embedCode);
    toast.success('Código embed copiado!');
  };

  if (loading) {
    return <div className="container mx-auto p-6">Carregando...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Smart Forms
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie formulários customizáveis e capture leads automaticamente
          </p>
        </div>
        <Button
          onClick={() => router.push('/forms/new')}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Formulário
        </Button>
      </div>

      {forms.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">Nenhum formulário criado</h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro formulário para começar a capturar leads
          </p>
          <Button
            onClick={() => router.push('/forms/new')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Formulário
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form, index) => (
            <motion.div
              key={form.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{form.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {form.description || 'Sem descrição'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      form.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {form.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <BarChart3 className="w-4 h-4" />
                  <span>{form._count.submissions} respostas</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/forms/${form.id}`)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/forms/${form.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyEmbedCode(form.id)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(form.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
