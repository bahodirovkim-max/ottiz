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
      include: { agreement: true }
    });

    if (!payment || payment.agreement.tenantId !== user.id) {
      return NextResponse.json({ success: false, error: 'Forbidden: To\'lov sizga tegishli emas' }, { status: 403 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'UNDER_REVIEW' }
    });
    
    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (error) {
    console.error('Payment review error:', error);
    return NextResponse.json({ success: false, error: 'Xatolik' }, { status: 500 });
  }
}
