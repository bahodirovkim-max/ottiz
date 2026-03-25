import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { agreementId, type, amount, dueDate } = await req.json();

    if (!agreementId || !type || !amount || !dueDate) {
      return NextResponse.json({ success: false, error: 'Barcha maydonlarni to`ldiring' }, { status: 400 });
    }

    const payment = await prisma.payment.create({
      data: {
        agreementId,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: 'PENDING',
        paymentType: 'UTILITY',
        title: type
      }
    });

    console.log(`\n🔔 [ESKIZ SMS/BOT] Ijarachi telefoniga SMS yuborildi: Uy egasi galdagi ${type} to'lovini jo'natdi!\n`);

    return NextResponse.json({ success: true, payment });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
