'use client';

import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ isOpen, onClose }: LeadModalProps) {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: 'all',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault?.();
    setStatus('loading');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, language }),
      });

      if (response?.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', company: '', phone: '', interest: 'all' });
        setTimeout(() => {
          onClose?.();
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                {t?.leadForm?.title ?? ''}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{t?.leadForm?.subtitle ?? ''}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData?.name ?? ''}
                    onChange={(e) => setFormData({ ...formData, name: e?.target?.value ?? '' })}
                    placeholder={t?.leadForm?.form?.name ?? ''}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={formData?.email ?? ''}
                    onChange={(e) => setFormData({ ...formData, email: e?.target?.value ?? '' })}
                    placeholder={t?.leadForm?.form?.email ?? ''}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={formData?.company ?? ''}
                    onChange={(e) => setFormData({ ...formData, company: e?.target?.value ?? '' })}
                    placeholder={t?.leadForm?.form?.company ?? ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={formData?.phone ?? ''}
                    onChange={(e) => setFormData({ ...formData, phone: e?.target?.value ?? '' })}
                    placeholder={t?.leadForm?.form?.phone ?? ''}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <select
                    value={formData?.interest ?? 'all'}
                    onChange={(e) => setFormData({ ...formData, interest: e?.target?.value ?? 'all' })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="all">{t?.leadForm?.interests?.all ?? ''}</option>
                    <option value="crm">{t?.leadForm?.interests?.crm ?? ''}</option>
                    <option value="chatbot">{t?.leadForm?.interests?.chatbot ?? ''}</option>
                    <option value="automation">{t?.leadForm?.interests?.automation ?? ''}</option>
                  </select>
                </div>

                {status === 'success' && (
                  <div className="text-green-600 dark:text-green-400 text-sm">
                    {t?.leadForm?.form?.success ?? ''}
                  </div>
                )}

                {status === 'error' && (
                  <div className="text-red-600 dark:text-red-400 text-sm">
                    {t?.leadForm?.form?.error ?? ''}
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
                      {t?.leadForm?.form?.sending ?? ''}
                    </>
                  ) : (
                    t?.leadForm?.form?.submit ?? ''
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
