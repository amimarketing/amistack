'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { Lightbulb, Target, Eye, Award } from 'lucide-react';

export default function AboutPage() {
  const { t } = useLanguage();

  const values = [
    { icon: Lightbulb, key: 'innovation' },
    { icon: Target, key: 'customer' },
    { icon: Eye, key: 'transparency' },
    { icon: Award, key: 'excellence' },
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
              {t?.about?.title ?? ''}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t?.about?.subtitle ?? ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story, Mission, Vision */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-blue-400">
              {t?.about?.story?.title ?? ''}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t?.about?.story?.content ?? ''}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400">
              {t?.about?.mission?.title ?? ''}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t?.about?.mission?.content ?? ''}
            </p>
          </motion.div>

          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-gradient-to-br from-yellow-50 to-red-50 dark:from-gray-800 dark:to-gray-900 shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-4 text-pink-600 dark:text-pink-400">
              {t?.about?.vision?.title ?? ''}
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {t?.about?.vision?.content ?? ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t?.about?.values?.title ?? ''}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values?.map((value, index) => {
              const Icon = value?.icon;
              const titleKey = value?.key ?? '';
              const descKey = `${value?.key ?? ''}Desc`;
              return (
                <motion.div
                  key={value?.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-lg text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                    {Icon && <Icon className="text-white" size={32} />}
                  </div>
                  <h3 className="text-xl font-bold mb-2">
                    {(t?.about?.values as any)?.[titleKey] ?? ''}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(t?.about?.values as any)?.[descKey] ?? ''}
                  </p>
                </motion.div>
              );
            }) ?? null}
          </div>
        </div>
      </section>
    </div>
  );
}
