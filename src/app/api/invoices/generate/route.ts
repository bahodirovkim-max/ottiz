import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Barcha faol shartnomalarni topish
    const activeAgreements = await prisma.rentAgreement.findMany({
      where: { isActive: true }
    });

    let generatedCount = 0;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    for (const agreement of activeAgreements) {
      // 2. Ushbu oy uchun to'lov kvitansiyasi mavjudligini tekshirish
      const existingPayment = await prisma.payment.findFirst({
        where: {
          agreementId: agreement.id,
          dueDate: {
            gte: new Date(currentYear, currentMonth, 1),
            lt: new Date(currentYear, currentMonth + 1, 1),
          }
        }
      });

      // 3. Agar mavjud bo'lmasa, yangi to'lov (kvitansiya) yaratish
      if (!existingPayment) {
        // To'lov sanasini shartnoma tuzilgan sanaga qarab belgilash
        const dueDate = new Date(currentYear, currentMonth, agreement.startDate.getDate());
        
        await prisma.payment.create({
          data: {
            agreementId: agreement.id,
            amount: agreement.monthlyAmount,
            currency: agreement.currency,
            status: 'PENDING',
            dueDate: dueDate,
          }
        });
        generatedCount++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `${generatedCount} ta yangi to'lov kvitansiyasi (invoice) yaratildi.`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Kvitansiya generatsiyasida xatolik' }, { status: 500 });
  }
}
