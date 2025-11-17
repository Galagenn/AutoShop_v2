import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchVersionsForBrandModel } from '@/lib/carData'

const mergeUnique = (...sources: (string | null | undefined)[][]): string[] => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const source of sources) {
    for (const value of source) {
      if (!value) continue
      const trimmed = value.trim()
      if (!trimmed) continue
      const key = trimmed.toLowerCase()
      if (seen.has(key)) continue
      seen.add(key)
      result.push(trimmed)
    }
  }
  return result.sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const brand = searchParams.get('brand') || ''
    const model = searchParams.get('model') || ''
    if (!brand || !model) return NextResponse.json({ versions: [] })

    let catalogVersions: string[] = []
    try {
      catalogVersions = await fetchVersionsForBrandModel(brand, model)
    } catch {
      catalogVersions = []
    }

    let dbVersions: string[] = []
    try {
      const rows = await prisma.car.findMany({
        where: { 
          brand: { equals: brand, mode: 'insensitive' } as any,
          model: { equals: model, mode: 'insensitive' } as any,
        },
        select: { modelVersion: true },
        distinct: ['modelVersion'],
        orderBy: { modelVersion: 'asc' },
      })
      dbVersions = rows.map(r => r.modelVersion).filter(Boolean) as string[]
    } catch {
      dbVersions = []
    }

    const versions = mergeUnique(catalogVersions, dbVersions)
    return NextResponse.json({ versions })
  } catch {
    return NextResponse.json({ versions: [] })
  }
}

