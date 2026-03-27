import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return NextResponse.json({ success: false, error: 'Unauthorized: Iltimos, oldin tizimga kiring' }, { status: 401 });

    const tenant = await prisma.user.findUnique({ where: { id: token } });
    if (!tenant) return NextResponse.json({ success: false, error: 'User not found' }, { status: 401 });

    const { landlordPhone, propertyName, address, monthlyAmount, paymentDay } = await req.json();

    if (!landlordPhone || !propertyName || !monthlyAmount) {
       return NextResponse.json({ success: false, error: 'Barcha ma`lumotlarni to`ldiring' }, { status: 400 });
    }

    const formattedPhone = `998${landlordPhone}`;

    // 1. Check if Landlord already exists, if not create Unverified (GHOST)
    let landlord = await prisma.user.findUnique({ where: { phone: formattedPhone } });
    if (!landlord) {
      landlord = await prisma.user.create({
        data: {
          phone: formattedPhone,
          name: 'Tasdiqlanmagan Uy Egasi',
          role: 'LANDLORD'
        }
      });
    }

    // 2. Create the Property under Landlord
    const property = await prisma.property.create({
      data: {
        name: propertyName,
        address: address || 'Manzil ko`rsatilmagan',
        price: parseFloat(monthlyAmount),
        landlordId: landlord.id
      }
    });

    // 3. Create the RentAgreement between Tenant and Landlord (PENDING)
    const agreement = await prisma.rentAgreement.create({
      data: {
         propertyId: property.id,
         tenantId: tenant.id,
         monthlyAmount: parseFloat(monthlyAmount),
         paymentDay: parseInt(paymentDay) || 1,
         status: 'PENDING',
         isActive: true
      }
    });

    // 4. SMS Mock Sending logic for Viral Loop
    const mockSmsText = `RentPay.uz - Sizning ijarachingiz ${tenant.name || tenant.phone} sizga ${parseFloat(monthlyAmount).toLocaleString()} UZS ijara to'lashga tayyor. Pulingizni olish uchun tizimga kiring: rentpay.uz/login`;
    console.log('\n💬 [VIRAL SMS MOCK TO LANDLORD]', formattedPhone, '->', mockSmsText, '\n');

    return NextResponse.json({ success: true, agreement });

  } catch (err) {
    console.error('Ghost Create error:', err);
    return NextResponse.json({ success: false, error: 'Server xatosi' }, { status: 500 });
  }
}
