import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand') || ''
    if (!brand) return NextResponse.json({ models: [] })
    const rows = await prisma.car.findMany({
      where: { brand: { equals: brand, mode: 'insensitive' } as any },
      select: { model: true },
      distinct: ['model'],
      orderBy: { model: 'asc' },
    })
    const models = rows.map(r => r.model).filter(Boolean)
    return NextResponse.json({ models })
  } catch {
    return NextResponse.json({ models: [] })
  }
}


