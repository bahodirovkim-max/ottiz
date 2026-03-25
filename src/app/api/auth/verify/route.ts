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

    if (!validOtp) {
      return NextResponse.json({ success: false, error: 'Kod noto`g`ri yoki muddati tugagan' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      user = await prisma.user.create({
        data: { phone, name: 'Yangi foydalanuvchi', role: 'LANDLORD' }
      });
    }

    // Kod ishlatilganidan so'ng o'chiriladi
    await prisma.otpCode.delete({ where: { id: validOtp.id } });

    const response = NextResponse.json({ success: true, message: 'Tizimga muvaffaqiyatli kirdingiz', user });
    
    // Auth sessiyasini yaratish
    const cookieStore = await cookies();
    cookieStore.set('auth-token', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30
    });
    
    return response;
  } catch (error) {
    console.error('OTP tasdiqlash xatosi:', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
