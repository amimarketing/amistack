'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Zap, Shield, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SaaSLandingPage() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('🎉 Obrigado! Entraremos em contato em breve.');
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-6">
            Transforme Seu Negócio com IA
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A plataforma completa de gestão e automação que sua empresa precisa para crescer 10x mais rápido
          </p>
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 px-8"
            >
              Comece Grátis
            </Button>
          </form>
          <p className="text-sm text-gray-500 mt-4">✅ Sem cartão de crédito • Cancele quando quiser</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Por Que Escolher Nossa Plataforma?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Zap />, title: 'Rápido e Fácil', desc: 'Configure em minutos, não em dias' },
              { icon: <Shield />, title: '100% Seguro', desc: 'Seus dados protegidos com criptografia de ponta' },
              { icon: <TrendingUp />, title: 'Resultados Reais', desc: 'Clientes aumentam vendas em média 300%' },
            ].map((feature, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Planos e Preços</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Básico', price: 'R$ 97', features: ['Até 1.000 contatos', 'CRM completo', 'Suporte email'] },
              { name: 'Profissional', price: 'R$ 297', features: ['Até 10.000 contatos', 'Automações ilimitadas', 'Suporte prioritário', 'API access'], popular: true },
              { name: 'Enterprise', price: 'R$ 997', features: ['Contatos ilimitados', 'Tudo incluso', 'Suporte 24/7', 'Gerente dedicado'] },
            ].map((plan, i) => (
              <Card key={i} className={`p-8 ${plan.popular ? 'border-2 border-orange-500 shadow-2xl scale-105' : ''}`}>
                {plan.popular && (
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-3 py-1 rounded-full">
                    Mais Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold mt-4 mb-2">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-lg text-gray-500">/mês</span></p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90">
                  Comece Agora
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Pronto Para Crescer?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 10.000 empresas que já transformaram seus resultados
          </p>
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-12">
            Comece Seu Teste Gratuito
          </Button>
        </div>
      </section>
    </div>
  );
}
