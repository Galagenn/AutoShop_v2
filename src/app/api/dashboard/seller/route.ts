import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  // @ts-ignore
  const role = session?.user?.role as string | undefined
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (role !== 'SELLER' && role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const cars = await prisma.car.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: 'desc' },
  })

  // Dummy stats for now; can be computed from related models
  const stats = {
    totalListings: cars.length,
    averagePrice: cars.length ? Math.round(cars.reduce((s, c) => s + c.price, 0) / cars.length) : 0,
    views: Math.round(cars.length * 137),
  }

  return NextResponse.json({ cars, stats })
}

