import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchModelsForBrand } from '@/lib/carData'

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
    if (!brand) return NextResponse.json({ models: [] })

    let catalogModels: string[] = []
    try {
      catalogModels = await fetchModelsForBrand(brand)
    } catch {
      catalogModels = []
    }

    let dbModels: string[] = []
    try {
      const rows = await prisma.car.findMany({
        where: { brand: { equals: brand, mode: 'insensitive' } as any },
        select: { model: true },
        distinct: ['model'],
        orderBy: { model: 'asc' },
      })
      dbModels = rows.map(r => r.model).filter(Boolean) as string[]
    } catch {
      dbModels = []
    }

    const models = mergeUnique(catalogModels, dbModels)
    return NextResponse.json({ models })
  } catch {
    return NextResponse.json({ models: [] })
  }
}

