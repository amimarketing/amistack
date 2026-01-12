import { NextRequest, NextResponse } from 'next/server';
import { stripe, PRICE_CONFIG } from '@/lib/stripe';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();
    const { planType, language, customerEmail } = body ?? {};

    if (!planType || !language) {
      return NextResponse.json(
        { error: 'Plan type and language are required' },
        { status: 400 }
      );
    }

    const priceConfig = (PRICE_CONFIG as any)?.[planType]?.[language] ?? PRICE_CONFIG?.basic?.pt;
    const origin = request?.headers?.get('origin') ?? 'http://localhost:3000';

    // Create or get customer
    let customer;
    if (customerEmail) {
      const existingCustomers = await stripe?.customers?.list?.({ email: customerEmail, limit: 1 });
      if (existingCustomers?.data?.length ?? 0 > 0) {
        customer = existingCustomers?.data?.[0];
      } else {
        customer = await stripe?.customers?.create?.({
          email: customerEmail,
          metadata: {
            language: language ?? 'pt',
            planType: planType ?? 'basic',
          },
        });
      }
    }

    // Create checkout session
    const session = await stripe?.checkout?.sessions?.create?.({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer?.id,
      customer_email: !customer ? customerEmail : undefined,
      line_items: [
        {
          price_data: {
            currency: priceConfig?.currency ?? 'usd',
            product_data: {
              name: `AmiStack ${priceConfig?.name ?? 'Plan'}`,
              description: `AmiStack ${priceConfig?.name ?? 'Plan'} - Monthly Subscription`,
            },
            unit_amount: priceConfig?.amount ?? 2900,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing?canceled=true`,
      metadata: {
        planType: planType ?? 'basic',
        language: language ?? 'pt',
      },
      subscription_data: {
        metadata: {
          planType: planType ?? 'basic',
          language: language ?? 'pt',
        },
      },
    });

    // Save to database
    if (session?.id && customer?.id) {
      await prisma?.subscription?.create?.({
        data: {
          stripeCustomerId: customer?.id ?? '',
          stripeCheckoutId: session?.id ?? '',
          stripePriceId: session?.line_items?.data?.[0]?.price?.id ?? '',
          status: 'incomplete',
          planName: priceConfig?.name ?? 'Basic',
          customerEmail: customerEmail ?? '',
        },
      });
    }

    return NextResponse.json({ sessionId: session?.id, url: session?.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
