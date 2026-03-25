import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function getUserSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) return null;

    const user = await prisma.user.findUnique({
      where: { id: token }
    });

    return user;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}
