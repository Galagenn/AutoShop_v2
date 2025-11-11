import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand') || ''
    const model = searchParams.get('model') || ''
    if (!brand || !model) return NextResponse.json({ versions: [] })
    const rows = await prisma.car.findMany({
      where: { 
        brand: { equals: brand, mode: 'insensitive' } as any,
        model: { equals: model, mode: 'insensitive' } as any,
      },
      select: { modelVersion: true },
      distinct: ['modelVersion'],
      orderBy: { modelVersion: 'asc' },
    })
    const versions = rows.map(r => r.modelVersion).filter(Boolean)
    return NextResponse.json({ versions })
  } catch {
    return NextResponse.json({ versions: [] })
  }
}


