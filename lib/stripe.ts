import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover' as any,
  typescript: true,
});

// Price IDs - These should be created in Stripe Dashboard
// For now, we'll create them dynamically in the checkout session
export const PRICE_CONFIG = {
  basic: {
    pt: { amount: 9700, currency: 'brl', name: 'Básico' },
    en: { amount: 2900, currency: 'usd', name: 'Basic' },
    es: { amount: 2700, currency: 'eur', name: 'Básico' },
  },
  professional: {
    pt: { amount: 29700, currency: 'brl', name: 'Profissional' },
    en: { amount: 8900, currency: 'usd', name: 'Professional' },
    es: { amount: 7900, currency: 'eur', name: 'Profesional' },
  },
  enterprise: {
    pt: { amount: 99700, currency: 'brl', name: 'Enterprise' },
    en: { amount: 29900, currency: 'usd', name: 'Enterprise' },
    es: { amount: 26900, currency: 'eur', name: 'Enterprise' },
  },
};
