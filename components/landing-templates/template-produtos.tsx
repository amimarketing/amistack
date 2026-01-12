'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, Star, Truck, Shield, Heart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TemplateProdutosProps {
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
  bag: ShoppingBag,
  star: Star,
  truck: Truck,
  shield: Shield,
  heart: Heart,
  gift: Gift,
};

export default function TemplateProdutos({ data, onCtaClick }: TemplateProdutosProps) {
  const primaryColor = data.primaryColor || '#FF6B35';
  const secondaryColor = data.secondaryColor || '#FFB800';

  const features = data.features || [
    { title: 'Qualidade Premium', description: 'Produtos selecionados com máximo cuidado', icon: 'star' },
    { title: 'Entrega Rápida', description: 'Receba em casa com segurança e agilidade', icon: 'truck' },
    { title: 'Garantia Total', description: '30 dias para troca ou devolução sem burocracia', icon: 'shield' },
    { title: 'Atendimento 5 Estrelas', description: 'Suporte dedicado sempre que precisar', icon: 'heart' },
  ];

  const testimonials = data.testimonials || [
    { name: 'Ana Paula', role: 'Cliente Verificada', text: 'Produtos de altíssima qualidade! Superou todas as expectativas.', photo: '' },
    { name: 'Carlos Eduardo', role: 'Cliente Verificado', text: 'Entrega rápida e atendimento impecável. Recomendo muito!', photo: '' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-6 font-semibold">
                ✨ Novidade
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {data.subtitle}
                </p>
              )}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.9/5 • 2.340+ avaliações</span>
              </div>
              <Button
                size="lg"
                onClick={onCtaClick}
                className="text-lg px-8 py-6 h-auto"
                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
              >
                <ShoppingBag className="mr-2 w-5 h-5" />
                {data.ctaText}
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl"
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
                  <ShoppingBag className="w-32 h-32 text-white" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Por Que Escolher Nossos Produtos?</h2>
            <p className="text-xl text-gray-600">Compromisso com excelência em cada detalhe</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon || 'star'];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full mb-4 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Clientes Satisfeitos</h2>
            <p className="text-xl text-gray-600">Veja o que dizem sobre nós</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg"
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
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
            <Gift className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Oferta Especial para Você</h2>
            <p className="text-xl mb-8 opacity-90">Desconto exclusivo na primeira compra. Aproveite agora!</p>
            <Button
              size="lg"
              onClick={onCtaClick}
              className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
            >
              <ShoppingBag className="mr-2 w-5 h-5" />
              {data.ctaText}
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}