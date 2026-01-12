'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Sparkles,
  Bot,
  Layout,
  FileText,
  BarChart3,
  Zap,
  GitBranch,
  Target,
  Smartphone,
  Building2,
  ArrowRight,
  CheckCircle2,
  Quote,
} from 'lucide-react';
import { LeadModal } from '@/components/lead-modal';

export default function HomePage() {
  const { t } = useLanguage();
  const [leadModalOpen, setLeadModalOpen] = useState(false);

  const features = [
    { icon: Building2, key: 'crm' },
    { icon: Bot, key: 'chatbot' },
    { icon: Layout, key: 'landing' },
    { icon: FileText, key: 'forms' },
    { icon: BarChart3, key: 'analytics' },
    { icon: Zap, key: 'automation' },
    { icon: GitBranch, key: 'workflow' },
    { icon: Target, key: 'scoring' },
    { icon: Smartphone, key: 'pwa' },
    { icon: Sparkles, key: 'multicompany' },
  ];

  const benefits = [
    { icon: Sparkles, key: 'ai' },
    { icon: Zap, key: 'integration' },
    { icon: CheckCircle2, key: 'support' },
    { icon: BarChart3, key: 'scalability' },
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      company: 'TechStart Brasil',
      text: 'O AmiStack transformou nossa gestão de leads. Aumentamos as conversões em 150% em 3 meses!',
      avatar: 'CS',
    },
    {
      name: 'Maria Santos',
      company: 'Marketing Pro',
      text: 'A automação com IA nos economizou 20 horas semanais. Simplesmente incrível!',
      avatar: 'MS',
    },
    {
      name: 'João Costa',
      company: 'VendaMais',
      text: 'Melhor plataforma de CRM que já utilizamos. Suporte excepcional e recursos avançados.',
      avatar: 'JC',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t?.hero?.title ?? ''}{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t?.hero?.titleHighlight ?? ''}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              {t?.hero?.subtitle ?? ''}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => setLeadModalOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {t?.hero?.cta ?? ''}
                <ArrowRight size={20} />
              </motion.button>
              <motion.button
                onClick={() => {
                  const overviewSection = document?.getElementById?.('overview');
                  overviewSection?.scrollIntoView?.({ behavior: 'smooth' });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700"
              >
                {t?.hero?.ctaSecondary ?? ''}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t?.overview?.title ?? ''}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t?.overview?.subtitle ?? ''}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features?.map((feature, index) => {
              const Icon = feature?.icon;
              const featureData = (t?.features as any)?.[feature?.key ?? ''];
              return (
                <motion.div
                  key={feature?.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    {Icon && <Icon className="text-white" size={24} />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{featureData?.title ?? ''}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{featureData?.description ?? ''}</p>
                </motion.div>
              );
            }) ?? null}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t?.benefits?.title ?? ''}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t?.benefits?.subtitle ?? ''}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits?.map((benefit, index) => {
              const Icon = benefit?.icon;
              const benefitData = (t?.benefits?.items as any)?.[benefit?.key ?? ''];
              return (
                <motion.div
                  key={benefit?.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    {Icon && <Icon className="text-white" size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefitData?.title ?? ''}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{benefitData?.description ?? ''}</p>
                </motion.div>
              );
            }) ?? null}
          </div>
        </div>
      </section>

      {/* Video Tutorial Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Veja o{' '}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                AmiStack
              </span>{' '}
              em Ação
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Tutorial completo mostrando todos os recursos da plataforma
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-500 to-red-500 p-1"
          >
            <div className="relative bg-black rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <video
                controls
                className="absolute top-0 left-0 w-full h-full"
                poster="/og-image.png"
                preload="metadata"
              >
                <source src="/AmiStack_Video_Tutorial.mp4" type="video/mp4" />
                Seu navegador não suporta a reprodução de vídeos.
              </video>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Descubra como o AmiStack pode transformar sua gestão de relacionamento com leads
            </p>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
            >
              Começar Agora
              <ArrowRight size={18} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t?.testimonials?.title ?? ''}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">{t?.testimonials?.subtitle ?? ''}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg relative"
              >
                <Quote className="absolute top-4 right-4 text-blue-500 opacity-20" size={32} />
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                    {testimonial?.avatar ?? ''}
                  </div>
                  <div>
                    <h4 className="font-bold">{testimonial?.name ?? ''}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial?.company ?? ''}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">“{testimonial?.text ?? ''}”</p>
              </motion.div>
            )) ?? null}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t?.cta?.title ?? ''}</h2>
            <p className="text-xl mb-8">{t?.cta?.subtitle ?? ''}</p>
            <motion.button
              onClick={() => setLeadModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              {t?.cta?.button ?? ''}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Lead Modal */}
      <LeadModal isOpen={leadModalOpen} onClose={() => setLeadModalOpen(false)} />
    </div>
  );
}
