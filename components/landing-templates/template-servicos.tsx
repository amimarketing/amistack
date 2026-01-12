'use client';

import { motion } from 'framer-motion';
import { Briefcase, Clock, Award, Phone, CheckCircle, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface TemplateServicosProps {
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
  briefcase: Briefcase,
  clock: Clock,
  award: Award,
  phone: Phone,
  check: CheckCircle,
  message: MessageSquare,
};

export default function TemplateServicos({ data, onCtaClick }: TemplateServicosProps) {
  const primaryColor = data.primaryColor || '#FF6B35';
  const secondaryColor = data.secondaryColor || '#FFB800';

  const features = data.features || [
    { title: 'Expertise Comprovada', description: '+10 anos de experiência no mercado', icon: 'award' },
    { title: 'Atendimento Ágil', description: 'Resposta em até 24 horas', icon: 'clock' },
    { title: 'Profissionais Certificados', description: 'Equipe altamente qualificada', icon: 'briefcase' },
    { title: 'Suporte Dedicado', description: 'Acompanhamento em todas as etapas', icon: 'phone' },
  ];

  const testimonials = data.testimonials || [
    { name: 'Ricardo Almeida', role: 'Empresário', text: 'Serviço impecável! Profissionalismo e qualidade do início ao fim.', photo: '' },
    { name: 'Fernanda Costa', role: 'Gerente de Projetos', text: 'Superaram nossas expectativas. Parceria de longo prazo garantida!', photo: '' },
  ];

  const steps = [
    { number: '1', title: 'Contato Inicial', description: 'Entre em contato e conte suas necessidades' },
    { number: '2', title: 'Proposta Personalizada', description: 'Desenvolvemos solução sob medida' },
    { number: '3', title: 'Execução', description: 'Colocamos seu projeto em prática' },
    { number: '4', title: 'Entrega & Suporte', description: 'Resultados garantidos com acompanhamento' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {data.title}
              </h1>
              {data.subtitle && (
                <p className="text-xl text-gray-600 mb-8">
                  {data.subtitle}
                </p>
              )}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Resultados Garantidos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Sem Burocracia</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={onCtaClick}
                  className="text-lg px-8 py-6 h-auto"
                  style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                >
                  {data.ctaText}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto"
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Falar com Especialista
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
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
                  <Briefcase className="w-24 h-24 text-white" />
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
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Por Que Somos Referência</h2>
            <p className="text-xl text-gray-600">Compromisso com a excelência</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon || 'briefcase'];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-xl border-2 border-gray-100 hover:border-orange-200 transition-all hover:shadow-lg"
                >
                  <div
                    className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}20, ${secondaryColor}20)` }}
                  >
                    <IconComponent className="w-7 h-7" style={{ color: primaryColor }} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Como Funciona</h2>
            <p className="text-xl text-gray-600">Processo simples e transparente</p>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  <div
                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gray-300" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Depoimentos de Clientes</h2>
            <p className="text-xl text-gray-600">Veja o que dizem sobre nossos serviços</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 rounded-2xl"
              >
                <MessageSquare className="w-10 h-10 text-orange-500 mb-4" />
                <p className="text-gray-700 mb-6 text-lg italic">"{testimonial.text}"</p>
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
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Vamos Conversar?</h2>
            <p className="text-xl mb-8 opacity-90">Agende uma consultoria gratuita e sem compromisso</p>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={onCtaClick}
                className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              >
                {data.ctaText}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
              >
                <Phone className="mr-2 w-5 h-5" />
                Ligar Agora
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}