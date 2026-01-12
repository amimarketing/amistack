# 🚀 AmiStack - Plataforma Completa de Marketing

Plataforma SaaS completa de gestão de leads e relacionamento com clientes.

## ✨ Funcionalidades

- 📊 **CRM Inteligente** - Gestão completa de contatos e interações
- 🌐 **Landing Pages** - Criador visual com 3 templates profissionais
- 🤖 **AI Chatbots** - Chatbots inteligentes para atendimento
- 📝 **Formulários Smart** - Captura e gestão de leads
- 📈 **Analytics** - Dashboard com métricas e funis
- 🏢 **Multi-Company** - Gestão de múltiplas empresas
- ⚡ **Automações** - Workflows automatizados
- 💳 **Stripe Integration** - Pagamentos e assinaturas

## 🛠️ Tecnologias

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Animations:** Framer Motion

## 📦 Instalação

```bash
# Instalar dependências
yarn install

# Configurar variáveis de ambiente
cp .env.example .env

# Executar migrations
yarn prisma migrate deploy
yarn prisma generate

# Iniciar servidor de desenvolvimento
yarn dev
```

## 🔐 Variáveis de Ambiente

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# LLM API (opcional)
ABACUSAI_API_KEY="..."
```

## 🚀 Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

## 📞 Suporte

- Email: amimarketing4@gmail.com
- WhatsApp: +55 55 99229-5440

---

Desenvolvido por **AMIMARKETING**
