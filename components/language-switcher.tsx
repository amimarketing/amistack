'use client';

import { useLanguage } from '@/lib/i18n/language-context';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'pt' as const, flag: '🇧🇷', name: 'Português' },
    { code: 'en' as const, flag: '🇺🇸', name: 'English' },
    { code: 'es' as const, flag: '🇪🇸', name: 'Español' },
  ];

  return (
    <div className="flex items-center gap-2">
      {languages?.map((lang) => (
        <motion.button
          key={lang?.code}
          onClick={() => setLanguage(lang?.code ?? 'pt')}
          className={`text-2xl transition-all hover:scale-110 ${
            language === lang?.code ? 'opacity-100 scale-110' : 'opacity-50'
          }`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          title={lang?.name ?? ''}
        >
          {lang?.flag ?? ''}
        </motion.button>
      )) ?? null}
    </div>
  );
}
