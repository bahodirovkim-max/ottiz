import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('auth-token')?.value;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Avtorizatsiya mavjud emas' }, { status: 401 });
    }

    const properties = await prisma.property.findMany({
      where: { landlordId: userId },
      include: {
        agreements: {
          include: { tenant: true }
        }
      }
    });
    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bazaga ulanishda xato' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const landlordId = cookieStore.get('auth-token')?.value;

    if (!landlordId) {
      return NextResponse.json({ success: false, error: 'Avtorizatsiya mavjud emas' }, { status: 401 });
    }

    const body = await request.json();
    const { name, address, price, currency } = body;

    const property = await prisma.property.create({
      data: {
        name,
        address,
        price: Number(price),
        currency: currency || 'UZS',
        landlordId, 
      }
    });

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Mulk qoshib bolmadi' }, { status: 500 });
  }
}
