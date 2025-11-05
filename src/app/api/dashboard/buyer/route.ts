import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { car: true },
    orderBy: { createdAt: 'desc' },
  })

  // Placeholder recommendations: latest cars not already favorited
  const favoriteCarIds = favorites.map(f => f.carId)
  const recommendations = await prisma.car.findMany({
    where: { id: { notIn: favoriteCarIds } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  })

  return NextResponse.json({ favorites, recommendations })
}

