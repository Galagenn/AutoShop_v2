import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '../../components/Breadcrumbs'
import FilterBar from '../../components/FilterBar'
import CarCard, { type Car as UiCar } from '../../components/CarCard'
import { prisma } from '@/lib/prisma'
import type { Car as DbCar } from '@prisma/client'
import { auth } from '@/auth'
import { fetchModelsForBrand, fetchVersionsForBrandModel } from '@/lib/carData'
import { KNOWN_BRANDS } from '@/data/brands'

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

export const metadata: Metadata = {
  title: 'Каталог автомобилей — AutoShop',
  description: 'Каталог автомобилей AutoShop с фильтрами по бренду, цене и году.',
}

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await auth()
  const role = (session?.user as unknown as { role?: string })?.role || undefined
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  const sp = await searchParams
  const brand = (sp?.brand as string) || undefined
  const model = (sp?.model as string) || undefined
  const modelVersion = (sp?.modelVersion as string) || undefined
  const minPrice = sp?.minPrice ? Number(sp.minPrice) : undefined
  const maxPrice = sp?.maxPrice ? Number(sp.maxPrice) : undefined
  const minYear = sp?.minYear ? Number(sp.minYear) : undefined
  const maxYear = sp?.maxYear ? Number(sp.maxYear) : undefined
  const minMileage = sp?.minMileage ? Number(sp.minMileage) : undefined
  const maxMileage = sp?.maxMileage ? Number(sp.maxMileage) : undefined
  const fuelType = (sp?.fuelType as string) || undefined // maps to engineType
  const transmission = (sp?.transmission as string) || undefined
  const bodyType = (sp?.bodyType as string) || undefined
  const drive = (sp?.drive as string) || undefined
  const color = (sp?.color as string) || undefined
  const onlyNew = sp?.onlyNew === '1'
  const sort = (sp?.sort as string) || undefined

  let carsDb: DbCar[] = []
  try {
    carsDb = await prisma.car.findMany({
      where: {
        brand: brand ? { contains: brand, mode: 'insensitive' } : undefined,
        model: model ? { contains: model, mode: 'insensitive' } : undefined,
        modelVersion: modelVersion ? { contains: modelVersion, mode: 'insensitive' } : undefined,
        price: { gte: minPrice, lte: maxPrice },
        year: { gte: minYear, lte: maxYear },
        mileage: { gte: minMileage, lte: maxMileage },
        engineType: fuelType ? { equals: fuelType, mode: 'insensitive' } as any : undefined,
        transmission: transmission ? { equals: transmission, mode: 'insensitive' } as any : undefined,
        bodyType: bodyType ? { equals: bodyType, mode: 'insensitive' } as any : undefined,
        drive: drive ? { equals: drive, mode: 'insensitive' } as any : undefined,
        color: color ? { contains: color, mode: 'insensitive' } : undefined,
        // onlyNew: if no field exists, approximate by year >= current-1
        ...(onlyNew ? { year: { gte: new Date().getFullYear() - 1 } } : {}),
      },
      orderBy: (
        sort === 'price_asc' ? { price: 'asc' } :
        sort === 'price_desc' ? { price: 'desc' } :
        sort === 'year_desc' ? { year: 'desc' } :
        sort === 'year_asc' ? { year: 'asc' } :
        sort === 'mileage_asc' ? { mileage: 'asc' } :
        { createdAt: 'desc' }
      ),
      take: 60,
      include: userId ? { favoritedBy: { where: { userId } } } as any : undefined,
    })
  } catch {
    carsDb = []
  }

  // Build filter options
  let brands: string[] = []
  let models: string[] = []
  let versions: string[] = []
  let years: number[] = []
  let maxPriceSteps: number[] = []
  try {
    const brandRows = await prisma.car.findMany({ select: { brand: true }, distinct: ['brand'], orderBy: { brand: 'asc' } })
    const dbBrands = brandRows.map(r => r.brand).filter(Boolean)
    brands = mergeUnique(KNOWN_BRANDS, dbBrands)
    const [catalogModels, modelRows, catalogVersions, versionRows] = await Promise.all([
      brand ? fetchModelsForBrand(brand).catch(() => []) : Promise.resolve([]),
      brand ? prisma.car.findMany({ where: { brand: { equals: brand, mode: 'insensitive' } as any }, select: { model: true }, distinct: ['model'], orderBy: { model: 'asc' } }) : Promise.resolve([]),
      brand && model ? fetchVersionsForBrandModel(brand, model).catch(() => []) : Promise.resolve([]),
      brand && model ? prisma.car.findMany({
        where: {
          brand: { equals: brand, mode: 'insensitive' } as any,
          model: { equals: model, mode: 'insensitive' } as any,
        },
        select: { modelVersion: true },
        distinct: ['modelVersion'],
        orderBy: { modelVersion: 'asc' },
      }) : Promise.resolve([]),
    ])
    const dbModels = (modelRows as { model: string | null }[]).map(r => r.model).filter(Boolean) as string[]
    models = mergeUnique(catalogModels, dbModels)
    const dbVersions = (versionRows as { modelVersion: string | null }[]).map(r => r.modelVersion).filter(Boolean) as string[]
    versions = mergeUnique(catalogVersions, dbVersions)
    const yearAgg = await prisma.car.aggregate({ _min: { year: true }, _max: { year: true } })
    const yMin = yearAgg._min.year ?? 1990
    const yMax = yearAgg._max.year ?? new Date().getFullYear()
    const from = Math.min(yMin, yMax)
    const to = Math.max(yMin, yMax)
    years = Array.from({ length: (to - from + 1) }, (_, i) => to - i) // desc
    const priceAgg = await prisma.car.aggregate({ _max: { price: true } })
    const pMax = priceAgg._max.price ?? 0
    const ceilTo = (n: number, step: number) => Math.ceil(n / step) * step
    const upper = ceilTo(pMax, 1_000_000)
    const presets = [1_000_000, 2_000_000, 5_000_000, 10_000_000, 20_000_000]
    maxPriceSteps = [...new Set([...presets, upper].filter(n => n > 0 && n <= Math.max(upper, 1_000_000)))]
    maxPriceSteps.sort((a,b) => a - b)
  } catch {
    // keep defaults
  }

  const cars: UiCar[] = (carsDb as any).map((c: any): UiCar => ({
    id: c.id,
    title: `${c.brand} ${c.model}`,
    subtitle: `${c.year} • ${c.mileage.toLocaleString()} км`,
    image: c.images[0] ?? '/next.svg',
    price: `${c.price.toLocaleString()} ₸`,
    city: c.city || undefined,
    year: c.year || undefined,
    mileageKm: c.mileage || undefined,
    transmission: c.transmission || undefined,
    drive: c.drive || undefined,
    engine: c.engineVolume && c.engineType ? `${c.engineVolume} • ${c.engineType}` : (c.engineType || undefined),
    isFavorited: Array.isArray(c.favoritedBy) && c.favoritedBy.length > 0,
    isOwner: userId ? c.ownerId === userId : false,
  }))

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <section className="relative py-6 md:py-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="container-page relative" style={{ gap: '0 !important' }}>
          <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог' }]} />
          <div className="text-center mb-6 center-to-text">
            <h1 className="text-responsive-xl font-extrabold mb-4">Каталог автомобилей</h1>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 bg-[#111] border-y border-[#2a2a2a]">
        <div className="container-page">
            <FilterBar options={{ brands, models, versions, years, maxPriceSteps }} />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-page">
          <main className="flex-1" style={{ paddingTop: '0 !important' }}>
            <div className="flex justify-between items-center gap-4 mb-4 md:mb-6">
              <div className="text-white/60">Найдено: <span className="text-white font-semibold text-[#C8BF2F]">{cars.length} автомобилей</span></div>
              </div>

              <div className="grid grid-cols-1 gap-6 mb-6 md:mb-8">
                {cars.map((car, i) => (
                <div key={car.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <CarCard car={car} userRole={role} />
                  </div>
                ))}
              </div>

              <div className="flex justify-center items-center gap-2 mt-6 md:mt-8 mb-4 md:mb-6"
              style={{ marginTop: '20px' }}>
              <Link href="?" className="btn-ghost px-4 py-2 text-sm ">Обновить</Link>
              </div>
            </main>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-[#111] border-y border-[#2a2a2a] relative overflow-hidden">
        <div className="container-page text-center relative z-10 center-to-text">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 md:mb-6 gradient-text">Не нашли подходящий автомобиль?</h2>
          <p className="text-white/70 text-lg mb-6 md:mb-8 max-w-2xl mx-auto">Оставьте заявку, и мы подберём для вас варианты</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4 md:mb-6">
            <Link href="/contact" className="btn-primary hover-glow">Оставить заявку</Link>
            {role === 'SELLER' && (
              <Link href="/sell" className="btn-secondary hover-glow">Продать автомобиль</Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}


