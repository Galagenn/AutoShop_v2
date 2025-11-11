import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { KNOWN_BRANDS } from '@/data/brands'

export async function GET() {
  try {
    const brandRows = await prisma.car.findMany({
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })
    const brandsFromDb = brandRows.map(r => r.brand).filter(Boolean)
    const merged = Array.from(new Set([...KNOWN_BRANDS, ...brandsFromDb]))
    merged.sort((a, b) => a.localeCompare(b, 'ru'))

    const yearAgg = await prisma.car.aggregate({
      _min: { year: true },
      _max: { year: true },
    })
    const yMin = yearAgg._min.year ?? 1990
    const yMax = yearAgg._max.year ?? new Date().getFullYear()
    const from = Math.min(yMin, yMax)
    const to = Math.max(yMin, yMax)
    const years = Array.from({ length: (to - from + 1) }, (_, i) => to - i) // descending

    return NextResponse.json({ brands: merged, years })
  } catch (e) {
    return NextResponse.json({ brands: [], years: [] })
  }
}


