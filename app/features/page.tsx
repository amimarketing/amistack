'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import {
  Building2,
  Bot,
  Layout,
  FileText,
  BarChart3,
  Zap,
  GitBranch,
  Target,
  Smartphone,
  Sparkles,
} from 'lucide-react';

export default function FeaturesPage() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Building2,
      key: 'crm',
      color: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Bot,
      key: 'chatbot',
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: Layout,
      key: 'landing',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: FileText,
      key: 'forms',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: BarChart3,
      key: 'analytics',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Zap,
      key: 'automation',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: GitBranch,
      key: 'workflow',
      color: 'from-teal-500 to-cyan-500',
    },
    {
      icon: Target,
      key: 'scoring',
      color: 'from-orange-600 to-red-500',
    },
    {
      icon: Smartphone,
      key: 'pwa',
      color: 'from-orange-600 to-red-600',
    },
    {
      icon: Sparkles,
      key: 'multicompany',
      color: 'from-yellow-600 to-orange-600',
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-orange-900 dark:to-red-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t?.nav?.features ?? ''}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t?.overview?.subtitle ?? ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {features?.map((feature, index) => {
              const Icon = feature?.icon;
              const featureData = (t?.features as any)?.[feature?.key ?? ''];
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature?.key}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-12`}
                >
                  {/* Icon Side */}
                  <div className="flex-1 flex justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className={`w-64 h-64 rounded-3xl bg-gradient-to-br ${feature?.color ?? ''} shadow-2xl flex items-center justify-center`}
                    >
                      {Icon && <Icon className="text-white" size={120} />}
                    </motion.div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 space-y-4">
                    <h2 className="text-4xl font-bold">{featureData?.title ?? ''}</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      {featureData?.description ?? ''}
                    </p>
                  </div>
                </motion.div>
              );
            }) ?? null}
          </div>
        </div>
      </section>
    </div>
  );
}
