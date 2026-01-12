'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from './language-switcher';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, LayoutDashboard, LogOut, User, Shield, Users, FileText, BarChart3, Zap, Building2, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Header() {
  const { t } = useLanguage();
  const { data: session, status } = useSession() || {};
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t?.nav?.home ?? '' },
    { href: '/features', label: t?.nav?.features ?? '' },
    { href: '/pricing', label: t?.nav?.pricing ?? '' },
    { href: '/about', label: t?.nav?.about ?? '' },
    { href: '/contact', label: t?.nav?.contact ?? '' },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              AmiStack
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href ?? '/'}
                className="text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
              >
                {link?.label ?? ''}
              </Link>
            )) ?? null}
          </nav>

          {/* Language Switcher & Auth */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {status === 'loading' ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-orange-500">
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold">
                          {getUserInitials(session.user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/crm" className="cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>CRM</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/companies" className="cursor-pointer">
                        <Building2 className="mr-2 h-4 w-4" />
                        <span>Empresas</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/forms" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Formulários</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/chatbots" className="cursor-pointer">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>AI Chatbots</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/analytics" className="cursor-pointer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Analytics</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/workflows" className="cursor-pointer">
                        <Zap className="mr-2 h-4 w-4" />
                        <span>Automações</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/landing-pages" className="cursor-pointer">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Landing Pages</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                      </Link>
                    </DropdownMenuItem>
                    {session.user.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer text-orange-600">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-gray-700 dark:text-gray-300 hover:text-orange-600">
                      <LogIn className="w-4 h-4 mr-2" />
                      Entrar
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Criar conta
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {navLinks?.map((link) => (
              <Link
                key={link?.href}
                href={link?.href ?? '/'}
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link?.label ?? ''}
              </Link>
            )) ?? null}
            
            <div className="pt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
              {status === 'loading' ? (
                <div className="w-full h-10 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
              ) : session?.user ? (
                <>
                  <div className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {session.user.email}
                    </p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    href="/crm"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Users className="w-4 h-4" />
                    CRM
                  </Link>
                  <Link
                    href="/companies"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Building2 className="w-4 h-4" />
                    Empresas
                  </Link>
                  <Link
                    href="/forms"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4" />
                    Formulários
                  </Link>
                  <Link
                    href="/chatbots"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageSquare className="w-4 h-4" />
                    AI Chatbots
                  </Link>
                  <Link
                    href="/analytics"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Link>
                  <Link
                    href="/workflows"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Zap className="w-4 h-4" />
                    Automações
                  </Link>
                  <Link
                    href="/landing-pages"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <FileText className="w-4 h-4" />
                    Landing Pages
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Perfil
                  </Link>
                  {session.user.role === 'admin' && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 w-full py-2 px-4 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-2 py-2 px-4 border border-orange-500 text-orange-600 rounded-lg hover:bg-orange-50 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    Criar conta
                  </Link>
                </>
              )}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}
