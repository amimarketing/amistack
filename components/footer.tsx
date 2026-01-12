'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/language-context';

export function Footer() {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
              AmiStack
            </h3>
            <p className="text-gray-400 mb-4">{t?.footer?.description ?? ''}</p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t?.footer?.product ?? ''}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/features" className="hover:text-orange-400 transition-colors">
                  {t?.nav?.features ?? ''}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-orange-400 transition-colors">
                  {t?.nav?.pricing ?? ''}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">{t?.footer?.company ?? ''}</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">
                  {t?.nav?.about ?? ''}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">
                  {t?.nav?.contact ?? ''}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {currentYear} Amimarketing. {t?.footer?.rights ?? ''}
          </p>
        </div>
      </div>
    </footer>
  );
}
