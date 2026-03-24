import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendTelegramMessage } from '@/services/telegram';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId, amount, status, provider } = body;

    // Simulate Payme/Click Server-to-Server Webhook 
    // Haqiqiy holatda webhooklarni xavfsizlik (signature) orgali tekshiramiz
    if (status === 'SUCCESS') {
      const payment = await prisma.payment.update({
        where: { id: invoiceId },
        data: { 
          status: 'PAID',
          paidAt: new Date(),
          paymentMethod: provider
        },
        include: { agreement: { include: { tenant: true, property: true } } }
      });

      // Avtomatik Telegram xabarnoma jo'natish (Kvitansiya - Elektron chek)
      await sendTelegramMessage(
        payment.agreement.tenant.phone, 
        `✅ To'lov muvaffaqiyatli qabul qilindi!\n\nMulk: ${payment.agreement.property.name}\nSumma: ${payment.amount} ${payment.currency}`
      );

      return NextResponse.json({ success: true, message: 'Payment confirmed and receipt sent.' });
    }

    return NextResponse.json({ success: false, error: 'Payment not successful' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Webhook processing failed' }, { status: 500 });
  }
}
