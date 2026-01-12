'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Building2, Mail, Calendar, Settings, Shield, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-black flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Carregando...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-black py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Olá, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Bem-vindo ao seu painel de controle da AmiStack</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="mb-8 shadow-lg border-orange-200 dark:border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <User className="w-5 h-5" />
                Informações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{user.email}</p>
                  </div>
                </div>

                {user.companyName && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Empresa</p>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.companyName}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tipo de conta</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-orange-600">
                          <Shield className="w-4 h-4" />
                          Administrador
                        </span>
                      ) : (
                        'Usuário'
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Link href="/profile">
                  <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                      <Shield className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-lg border-orange-200 dark:border-orange-500/20 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Explorar Recursos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conheça todas as funcionalidades da plataforma</p>
                  <Link href="/features" className="w-full">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                      Ver recursos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-orange-200 dark:border-orange-500/20 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Ver Planos</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Escolha o plano ideal para o seu negócio</p>
                  <Link href="/pricing" className="w-full">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                      Ver planos
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-orange-200 dark:border-orange-500/20 hover:shadow-xl transition-shadow cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">Fale Conosco</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tire suas dúvidas ou envie sugestões</p>
                  <Link href="/contact" className="w-full">
                    <Button variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-50">
                      Contato
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
