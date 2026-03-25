import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const user = await getUserSession();
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized: Iltimos, tizimga kiring' }, { status: 401 });

    const { paymentId } = await req.json();
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { agreement: { include: { property: true } } }
    });

    if (!payment || payment.agreement.property.landlordId !== user.id) {
       return NextResponse.json({ success: false, error: 'Forbidden: Mulk egasi bo\'lmaganingiz uchun bu amaliyotni bajara olmaysiz' }, { status: 403 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'PAID', paidAt: new Date() }
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Payment confirm error:', error);
    return NextResponse.json({ success: false, error: 'Xatolik' }, { status: 500 });
  }
}
