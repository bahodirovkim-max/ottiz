import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: 'Tizimga kirmagansiz! Oldin /uz/login orqali kiring.' }, { status: 401 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: token },
      data: { role: 'ADMIN' }
    });

    const url = new URL(req.url);
    const origin = `${url.protocol}//${url.host}`;
    
    return NextResponse.redirect(`${origin}/uz/admin`);
  } catch (error) {
    console.error('Make admin error:', error);
    return NextResponse.json({ success: false, error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
