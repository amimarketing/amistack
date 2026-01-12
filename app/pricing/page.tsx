'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';

export default function PricingPage() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: t?.pricing?.basic?.name ?? '',
      price: t?.pricing?.basic?.price ?? '',
      period: t?.pricing?.basic?.period ?? '',
      description: t?.pricing?.basic?.description ?? '',
      features: t?.pricing?.basic?.features ?? [],
      popular: false,
    },
    {
      id: 'professional',
      name: t?.pricing?.professional?.name ?? '',
      price: t?.pricing?.professional?.price ?? '',
      period: t?.pricing?.professional?.period ?? '',
      description: t?.pricing?.professional?.description ?? '',
      features: t?.pricing?.professional?.features ?? [],
      popular: true,
    },
    {
      id: 'enterprise',
      name: t?.pricing?.enterprise?.name ?? '',
      price: t?.pricing?.enterprise?.price ?? '',
      period: t?.pricing?.enterprise?.period ?? '',
      description: t?.pricing?.enterprise?.description ?? '',
      features: t?.pricing?.enterprise?.features ?? [],
      popular: false,
    },
  ];

  const handleSubscribe = async (planType: string) => {
    setSelectedPlan(planType);
    setShowEmailModal(true);
  };

  const handleEmailSubmit = async () => {
    if (!email || !selectedPlan) return;

    setLoading(selectedPlan);
    setShowEmailModal(false);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: selectedPlan,
          language,
          customerEmail: email,
        }),
      });

      const data = await response?.json?.();

      if (data?.url) {
        window.location.href = data?.url ?? '';
      } else {
        console.error('No checkout URL returned');
        setLoading(null);
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoading(null);
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
              {t?.pricing?.title ?? ''}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
              {t?.pricing?.subtitle ?? ''}
            </p>
            <p className="text-lg text-blue-600 dark:text-blue-400 font-semibold">
              14 {t?.pricing?.freeTrial ?? ''}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans?.map((plan, index) => (
              <motion.div
                key={plan?.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className={`relative p-8 rounded-2xl shadow-xl transition-all ${
                  plan?.popular
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white scale-105'
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900'
                }`}
              >
                {plan?.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                    {t?.pricing?.popular ?? ''}
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{plan?.name ?? ''}</h3>
                <p
                  className={`mb-6 ${
                    plan?.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {plan?.description ?? ''}
                </p>

                <div className="mb-6">
                  <span className="text-5xl font-bold">{plan?.price ?? ''}</span>
                  <span
                    className={`text-xl ${
                      plan?.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {plan?.period ?? ''}
                  </span>
                </div>

                <button
                  onClick={() => handleSubscribe(plan?.id ?? 'basic')}
                  disabled={loading === plan?.id}
                  className={`w-full py-3 rounded-lg font-semibold transition-all mb-6 flex items-center justify-center gap-2 ${
                    plan?.popular
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-lg'
                  } disabled:opacity-50`}
                >
                  {loading === plan?.id ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {t?.pricing?.subscribe ?? ''}
                    </>
                  ) : (
                    t?.pricing?.subscribe ?? ''
                  )}
                </button>

                <ul className="space-y-3">
                  {plan?.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check
                        size={20}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan?.popular ? 'text-white' : 'text-blue-600'
                        }`}
                      />
                      <span className={plan?.popular ? 'text-blue-100' : ''}>{feature ?? ''}</span>
                    </li>
                  )) ?? null}
                </ul>
              </motion.div>
            )) ?? null}
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold mb-4">{t?.contact?.form?.email ?? ''}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t?.contact?.form?.emailPlaceholder ?? ''}
            </p>
            <input
              type="email"
              value={email ?? ''}
              onChange={(e) => setEmail(e?.target?.value ?? '')}
              placeholder={t?.contact?.form?.emailPlaceholder ?? ''}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleEmailSubmit}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                {t?.pricing?.subscribe ?? ''}
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                {t?.nav?.home ?? 'Cancel'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
