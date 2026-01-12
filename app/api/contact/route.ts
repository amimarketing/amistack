import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request?.json?.();
    const { name, email, company, phone, message, language } = body ?? {};

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const contactMessage = await prisma?.contactMessage?.create?.({
      data: {
        name: name ?? '',
        email: email ?? '',
        company: company ?? null,
        phone: phone ?? null,
        message: message ?? '',
        language: language ?? 'pt',
      },
    });

    return NextResponse.json({ success: true, contactMessage }, { status: 201 });
  } catch (error) {
    console.error('Error creating contact message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
