import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: { user: true } // Include user details if available
    });
    return NextResponse.json(chats);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching chats' }, { status: 500 });
  }
}
