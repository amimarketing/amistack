'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');

  return (
    <div className="w-full min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-green-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle2 className="text-white" size={64} />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            {t?.contact?.form?.success ?? 'Success!'}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Sua assinatura foi processada com sucesso! Em breve você receberá um email com as
            instruções de acesso.
          </p>

          {sessionId && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              ID da Sessão: {sessionId}
            </p>
          )}

          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {t?.nav?.home ?? 'Home'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
