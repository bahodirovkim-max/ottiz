import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return NextResponse.json({ success: false, error: 'Telefon raqam yoki parol kiritilmadi' }, { status: 400 });
    }

    // MVP uchun oddiy tekshiruv (Haqiqiy loyihada crypt parollar Prisma orqali tekshiriladi)
    const dbUser = await prisma.user.findUnique({ where: { phone } });

    // Agar User mavjud bo'lmasa, uni yaratib davom etamiz (Faqat MVP uchun, oson kirish)
    const user = dbUser || await prisma.user.create({
      data: { phone, name: 'Yangi foydalanuvchi', role: 'LANDLORD' }
    });

    const response = NextResponse.json({ success: true, message: 'Tizimga muvaffaqiyatli kirdingiz', user });
    
    // Cookie orqali avtorizatsiya sessiyasini yaratish (JWT o'rniga oddiy belgi)
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 kun
    });
    
    return response;
  } catch (error) {
    console.error("Login API xato:", error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
