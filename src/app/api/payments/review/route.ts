import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    
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
