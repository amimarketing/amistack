'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Plus,
  Building2,
  Edit,
  Trash2,
  Mail,
  Phone,
  Globe,
  Users,
  Briefcase,
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

interface Company {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  size?: string;
  status: string;
  createdAt: string;
}

export default function CompaniesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);
  const [editDialog, setEditDialog] = useState<Company | null>(null);
  const [createDialog, setCreateDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
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
      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Empresa criada com sucesso!',
        });
        setCreateDialog(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          website: '',
          industry: '',
          size: '',
        });
        fetchCompanies();
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Erro ao criar empresa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar empresa',
        variant: 'destructive',
      });
    }
  };

  const handleUpdate = async () => {
    if (!editDialog || !formData.name) {
      toast({
        title: 'Erro',
        description: 'Nome é obrigatório',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch(`/api/companies/${editDialog.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Empresa atualizada com sucesso!',
        });
        setEditDialog(null);
        fetchCompanies();
      } else {
        const error = await response.json();
        toast({
          title: 'Erro',
          description: error.error || 'Erro ao atualizar empresa',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar empresa',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Sucesso',
          description: 'Empresa excluída com sucesso',
        });
        fetchCompanies();
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir empresa',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog(null);
    }
  };

  const openEditDialog = (company: Company) => {
    setEditDialog(company);
    setFormData({
      name: company.name,
      email: company.email || '',
      phone: company.phone || '',
      website: company.website || '',
      industry: company.industry || '',
      size: company.size || '',
    });
  };

  const closeEditDialog = () => {
    setEditDialog(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      website: '',
      industry: '',
      size: '',
    });
  };

  const getSizeLabel = (size: string) => {
    const sizes: Record<string, string> = {
      '1-10': '1-10 funcionários',
      '11-50': '11-50 funcionários',
      '51-200': '51-200 funcionários',
      '201-500': '201-500 funcionários',
      '500+': 'Mais de 500 funcionários',
    };
    return sizes[size] || size;
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
            <h1 className="text-3xl font-bold mb-2">Gerenciamento de Empresas</h1>
            <p className="text-gray-600">
              Gerencie múltiplas empresas em um só lugar
            </p>
          </div>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nova Empresa
          </Button>
        </div>
      </div>

      {companies.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-bold mb-2">Nenhuma Empresa Cadastrada</h3>
          <p className="text-gray-600 mb-6">
            Adicione sua primeira empresa para começar
          </p>
          <Button
            onClick={() => setCreateDialog(true)}
            className="bg-gradient-to-r from-orange-600 to-red-600"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar Primeira Empresa
          </Button>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{company.name}</h3>
                      {company.industry && (
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={company.status === 'active' ? 'default' : 'secondary'}
                    className={company.status === 'active' ? 'bg-green-600' : 'bg-gray-500'}
                  >
                    {company.status === 'active' ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  {company.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{company.email}</span>
                    </div>
                  )}
                  {company.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{company.phone}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <span className="truncate">{company.website}</span>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{getSizeLabel(company.size)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(company)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteDialog(company.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Empresa</DialogTitle>
            <DialogDescription>
              Preencha as informações da empresa
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: AMIMARKETING"
              />
            </div>
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="industry">Setor</Label>
              <Input
                id="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Ex: Tecnologia, Marketing"
              />
            </div>
            <div>
              <Label htmlFor="size">Tamanho</Label>
              <select
                id="size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                <option value="">Selecione</option>
                <option value="1-10">1-10 funcionários</option>
                <option value="11-50">11-50 funcionários</option>
                <option value="51-200">51-200 funcionários</option>
                <option value="201-500">201-500 funcionários</option>
                <option value="500+">Mais de 500 funcionários</option>
              </select>
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
              Criar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onOpenChange={() => closeEditDialog()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Empresa</DialogTitle>
            <DialogDescription>
              Atualize as informações da empresa
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2">
              <Label htmlFor="edit-name">Nome da Empresa *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: AMIMARKETING"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">E-mail</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Telefone</Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="edit-website">Website</Label>
              <Input
                id="edit-website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://www.empresa.com"
              />
            </div>
            <div>
              <Label htmlFor="edit-industry">Setor</Label>
              <Input
                id="edit-industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                placeholder="Ex: Tecnologia, Marketing"
              />
            </div>
            <div>
              <Label htmlFor="edit-size">Tamanho</Label>
              <select
                id="edit-size"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full border rounded-md p-2"
              >
                <option value="">Selecione</option>
                <option value="1-10">1-10 funcionários</option>
                <option value="11-50">11-50 funcionários</option>
                <option value="51-200">51-200 funcionários</option>
                <option value="201-500">201-500 funcionários</option>
                <option value="500+">Mais de 500 funcionários</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => closeEditDialog()}>
              Cancelar
            </Button>
            <Button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-orange-600 to-red-600"
            >
              Salvar Alterações
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
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
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
