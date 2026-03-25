import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    const { name, price, tenantPhone, paymentDay, deposit, discountAmount } = await req.json();

    if (!name || !price || !tenantPhone) {
      return NextResponse.json({ success: false, error: 'Barcha maydonlarni to`ldirish shart!' }, { status: 400 });
    }

    // 1. Create Property
    const property = await prisma.property.create({
      data: {
        name,
        price: parseFloat(price),
        landlordId: token
      }
    });

    // 2. Format Tenant Phone
    let formattedPhone = tenantPhone.replace(/[^0-9+]/g, '');
    if (!formattedPhone.startsWith('+')) {
       formattedPhone = '+' + formattedPhone;
    }

    // 3. Find or Create Tenant
    let tenant = await prisma.user.findUnique({ where: { phone: formattedPhone } });
    if (!tenant) {
      tenant = await prisma.user.create({
        data: { phone: formattedPhone, role: 'TENANT', name: '' }
      });
    }

    // 4. Create Agreement in PENDING status
    const agreement = await prisma.rentAgreement.create({
      data: {
        propertyId: property.id,
        tenantId: tenant.id,
        startDate: new Date(),
        monthlyAmount: parseFloat(price),
        status: 'PENDING',
        isActive: false,
        paymentDay: parseInt(paymentDay) || 1,
        deposit: deposit ? parseFloat(deposit) : null,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null
      }
    });

    if (deposit) {
       await prisma.payment.create({
         data: {
            agreementId: agreement.id,
            amount: parseFloat(deposit),
            dueDate: new Date(), // Deposit due immediately
            status: 'PENDING',
            paymentType: 'DEPOSIT',
            title: 'Zaklad (Depozit) tolovi'
         }
       });
    }

    // 5. Mock SMS/Telegram notification to tenant
    console.log(`\n🔔 [ESKIZ SMS/BOT] XABAR YUBORILDI -> ${formattedPhone} raqamiga!`);
    console.log(`"Sizga ijara to'lovi bo'yicha shartnoma yuborildi. Iltimos tizimga kirib tasdiqlang: https://ottiz.vercel.app/uz"\n`);

    return NextResponse.json({ success: true, property });
  } catch (error: any) {
    console.error('Mulk qoshishda xato:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server xatosi' }, { status: 500 });
  }
}
