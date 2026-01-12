'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Field {
  label: string;
  fieldType: string;
  placeholder: string;
  required: boolean;
}

export default function NewFormPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submitButtonText, setSubmitButtonText] = useState('Enviar');
  const [successMessage, setSuccessMessage] = useState('Obrigado! Recebemos seu formulário.');
  const [integrateCRM, setIntegrateCRM] = useState(true);
  const [fields, setFields] = useState<Field[]>([
    { label: 'Nome', fieldType: 'text', placeholder: 'Seu nome completo', required: true },
    { label: 'Email', fieldType: 'email', placeholder: 'seu@email.com', required: true },
  ]);
  const [saving, setSaving] = useState(false);

  const addField = () => {
    setFields([...fields, { label: '', fieldType: 'text', placeholder: '', required: false }]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, key: keyof Field, value: any) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Nome do formulário é obrigatório');
      return;
    }

    if (fields.length === 0) {
      toast.error('Adicione pelo menos um campo');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          submitButtonText,
          successMessage,
          integrateCRM,
          fields,
        }),
      });

      if (res.ok) {
        const form = await res.json();
        toast.success('Formulário criado com sucesso!');
        router.push(`/forms/${form.id}`);
      } else {
        toast.error('Erro ao criar formulário');
      }
    } catch (error) {
      console.error('Error creating form:', error);
      toast.error('Erro ao criar formulário');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          Novo Formulário
        </h1>
        <p className="text-muted-foreground mt-2">
          Crie um formulário customizado para capturar leads
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Formulário *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Formulário de Contato"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição opcional"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="submitButton">Texto do Botão</Label>
                <Input
                  id="submitButton"
                  value={submitButtonText}
                  onChange={(e) => setSubmitButtonText(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 pt-8">
                <input
                  type="checkbox"
                  id="integrateCRM"
                  checked={integrateCRM}
                  onChange={(e) => setIntegrateCRM(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="integrateCRM" className="cursor-pointer">
                  Integrar com CRM automaticamente
                </Label>
              </div>
            </div>

            <div>
              <Label htmlFor="successMessage">Mensagem de Sucesso</Label>
              <Textarea
                id="successMessage"
                value={successMessage}
                onChange={(e) => setSuccessMessage(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Campos do Formulário</h2>
            <Button type="button" onClick={addField} variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Campo
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <Card key={index} className="p-4 bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label>Rótulo *</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(index, 'label', e.target.value)}
                      placeholder="Ex: Nome"
                      required
                    />
                  </div>

                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={field.fieldType}
                      onValueChange={(value) => updateField(index, 'fieldType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Telefone</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="textarea">Texto Longo</SelectItem>
                        <SelectItem value="date">Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Placeholder</Label>
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                      placeholder="Texto de ajuda"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, 'required', e.target.checked)}
                        className="w-4 h-4"
                      />
                      <Label className="cursor-pointer">Obrigatório</Label>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeField(index)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90"
          >
            {saving ? 'Salvando...' : 'Criar Formulário'}
          </Button>
        </div>
      </form>
    </div>
  );
}
