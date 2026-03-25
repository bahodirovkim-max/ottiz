import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, role, cardNumber } = await req.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, error: 'Ismni kiritish majburiy!' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: token },
      data: {
        name,
        role: role === 'LANDLORD' ? 'LANDLORD' : 'TENANT',
        cardNumber: cardNumber || null
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Profili tahrirlashda xato:', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
