import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();
    if (!phone || !code) return NextResponse.json({ success: false, error: 'Ma`lumot to`liq emas' }, { status: 400 });

    const validOtp = await prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        expiresAt: { gt: new Date() }
      }
    });

    // Investor Pitch uchun istalgan serverda 00000 kodini qabul qiluvchi Bypass
    const isMasterBypass = code === '00000';
    
    if (!validOtp && !isMasterBypass) {
      return NextResponse.json({ success: false, error: 'Kod noto`g`ri yoki muddati tugagan' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    let isNew = false;
    if (!user) {
      isNew = true;
      user = await prisma.user.create({
        data: { phone, name: '', role: 'TENANT' }
      });
    }

    const hasProfile = !isNew && Boolean(user.name) && user.name !== 'Yangi foydalanuvchi';

    // Kod ishlatilganidan so'ng o'chiriladi (Universal kod bo'lmasa)
    if (validOtp) {
      await prisma.otpCode.delete({ where: { id: validOtp.id } });
    }

    const response = NextResponse.json({ success: true, message: 'Tizimga muvaffaqiyatli kirdingiz', user, hasProfile });
    
    // Auth sessiyasini yaratish
    response.cookies.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('OTP tasdiqlash xatosi:', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
