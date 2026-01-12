import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();
    const { name, email, company, phone, interest, language } = body ?? {};

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    const lead = await prisma?.lead?.create?.({
      data: {
        name: name ?? '',
        email: email ?? '',
        company: company ?? null,
        phone: phone ?? null,
        interest: interest ?? null,
        language: language ?? 'pt',
      },
    });

    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
