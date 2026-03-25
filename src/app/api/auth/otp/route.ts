import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();
    if (!phone) return NextResponse.json({ success: false, error: 'Telefon raqam kiritilishi shart' }, { status: 400 });

    // 5 xonali sodda tasdiqlash kodi
    const code = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 daqiqadan so'ng kuyadi

    await prisma.otpCode.create({
      data: { phone, code, expiresAt }
    });

    // Eskiz.uz yoki boshqa SMS xizmat qismi (Hozir mock tarzda konsolga chiqaramiz)
    console.log(`\n💬 [SMS OTP MOCK] Telefon: ${phone} -> Kod: ${code}\n`);

    return NextResponse.json({ success: true, message: 'SMS tasdiqlash kodi yuborildi' });
  } catch (error) {
    console.error('OTP yaratishda xato:', error);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
