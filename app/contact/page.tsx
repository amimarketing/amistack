'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      if (response?.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

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
              {t?.contact?.title ?? ''}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t?.contact?.subtitle ?? ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-lg"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t?.contact?.form?.name ?? ''}
                  </label>
                  <input
                    type="text"
                    value={formData?.name ?? ''}
                    onChange={(e) => setFormData({ ...formData, name: e?.target?.value ?? '' })}
                    placeholder={t?.contact?.form?.namePlaceholder ?? ''}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t?.contact?.form?.email ?? ''}
                  </label>
                  <input
                    type="email"
                    value={formData?.email ?? ''}
                    onChange={(e) => setFormData({ ...formData, email: e?.target?.value ?? '' })}
                    placeholder={t?.contact?.form?.emailPlaceholder ?? ''}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t?.contact?.form?.company ?? ''}
                  </label>
                  <input
                    type="text"
                    value={formData?.company ?? ''}
                    onChange={(e) => setFormData({ ...formData, company: e?.target?.value ?? '' })}
                    placeholder={t?.contact?.form?.companyPlaceholder ?? ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t?.contact?.form?.phone ?? ''}
                  </label>
                  <input
                    type="tel"
                    value={formData?.phone ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e?.target?.value ?? '' })}
                    placeholder={t?.contact?.form?.phonePlaceholder ?? ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t?.contact?.form?.message ?? ''}
                  </label>
                  <textarea
                    value={formData?.message ?? ''}
                    onChange={(e) => setFormData({ ...formData, message: e?.target?.value ?? '' })}
                    placeholder={t?.contact?.form?.messagePlaceholder ?? ''}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                {status === 'success' && (
                  <div className="text-green-600 dark:text-green-400">
                    {t?.contact?.form?.success ?? ''}
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-red-600 dark:text-red-400">
                    {t?.contact?.form?.error ?? ''}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t?.contact?.form?.sending ?? ''}
                    </>
                  ) : (
                    t?.contact?.form?.submit ?? ''
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-8">{t?.contact?.info?.title ?? ''}</h2>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t?.contact?.info?.email ?? ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t?.contact?.form?.phone ?? ''}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t?.contact?.info?.phone ?? ''}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{t?.contact?.info?.address ?? ''}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{t?.contact?.info?.address ?? ''}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
