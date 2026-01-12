'use client';

import { motion } from 'framer-motion';
import { Check, Zap, Shield, TrendingUp, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TemplateSaaSProps {
  data: {
    title: string;
    subtitle?: string;
    heroImage?: string;
    ctaText: string;
    ctaUrl?: string;
    features?: Array<{ title: string; description: string; icon?: string }>;
    testimonials?: Array<{ name: string; role: string; text: string; photo?: string }>;
    primaryColor?: string;
    secondaryColor?: string;
  };
  onCtaClick?: () => void;
}

const iconMap: Record<string, any> = {
  zap: Zap,
  shield: Shield,
  trending: TrendingUp,
  users: Users,
  sparkles: Sparkles,
};

export default function TemplateSaaS({ data, onCtaClick }: TemplateSaaSProps) {
  const primaryColor = data.primaryColor || '#FF6B35';
  const secondaryColor = data.secondaryColor || '#FFB800';

  const features = data.features || [
    { title: 'Automação Inteligente', description: 'Economize tempo com fluxos automatizados', icon: 'zap' },
    { title: 'Segurança Avançada', description: 'Seus dados protegidos com criptografia de ponta', icon: 'shield' },
    { title: 'Crescimento Escalável', description: 'Cresça sem limites com nossa infraestrutura', icon: 'trending' },
    { title: 'Colaboração em Equipe', description: 'Trabalhe junto em tempo real', icon: 'users' },
  ];

  const testimonials = data.testimonials || [
    { name: 'Maria Silva', role: 'CEO, TechStart', text: 'Transformou completamente nossa operação. Resultados incríveis!', photo: '' },
    { name: 'João Santos', role: 'Diretor de Marketing', text: 'A melhor decisão que tomamos este ano. ROI impressionante.', photo: '' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {data.subtitle}
                </p>
              )}
              <Button
                size="lg"
                onClick={onCtaClick}
                className="text-lg px-8 py-6 h-auto"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                {data.ctaText}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            >
              {data.heroImage ? (
                <Image
                  src={data.heroImage}
                  alt={data.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-white" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Recursos Poderosos</h2>
            <p className="text-xl text-gray-600">Tudo que você precisa para ter sucesso</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon || 'sparkles'];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div
                    className="w-12 h-12 rounded-lg mb-4 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-xl text-gray-600">Junte-se a milhares de empresas satisfeitas</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para Começar?</h2>
            <p className="text-xl mb-8 opacity-90">Experimente gratuitamente por 14 dias. Sem cartão de crédito.</p>
            <Button
              size="lg"
              onClick={onCtaClick}
              className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              {data.ctaText}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}