import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    
    // SECURITY FIX: Agar serverda CRON_SECRET o'rnatilmagan bo'lsa yoki token xato bo'lsa, bypass bo'lishini oldini olamiz
    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      return NextResponse.json({ success: false, error: 'Unauthorized: CRON_SECRET noto`g`ri yoki yo`q' }, { status: 401 });
    }

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const activeAgreements = await prisma.rentAgreement.findMany({
      where: { isActive: true, status: 'ACTIVE' },
      include: { payments: true }
    });

    let createdCount = 0;

    for (const agreement of activeAgreements) {
      const hasPaymentThisMonth = agreement.payments.some(p => {
        const d = new Date(p.dueDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      if (!hasPaymentThisMonth) {
        // Compute due date for the current month.
        // If paymentDay is 5, due date will be the 5th of this month.
        const dueDate = new Date(currentYear, currentMonth, agreement.paymentDay || 1);
        
        await prisma.payment.create({
          data: {
            agreementId: agreement.id,
            amount: agreement.monthlyAmount,
            dueDate: dueDate,
            status: 'PENDING',
            paymentType: 'RENT',
            title: 'Oylik Ijara'
          }
        });
        createdCount++;
      }
    }

    return NextResponse.json({ success: true, createdCount, message: 'Monthly payments generated' });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ success: false, error: 'Xatolik yuz berdi' }, { status: 500 });
  }
}
