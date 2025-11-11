import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import CarCard, { type Car as UiCar } from '@/components/CarCard'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Избранное — AutoShop',
  description: 'Сохранённые избранные автомобили покупателя.',
}

export default async function Page() {
  const session = await auth()
  // @ts-ignore
  const userId = session?.user?.id as string | undefined

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
        <section className="relative py-6 md:py-8 overflow-hidden">
          <div className="absolute inset-0 bg-[#0a0a0a]" />
          <div className="container-page relative" style={{ gap: '0 !important' }}>
            <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Избранное' }]} />
            <div className="text-center mb-6 center-to-text">
              <h1 className="text-responsive-xl font-extrabold mb-4">Избранное</h1>
              <p className="text-white/70">Требуется вход в систему.</p>
              <div className="mt-6 flex justify-center">
                <Link href="/auth/login" className="btn-primary hover-glow">Войти</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  let favorites: Array<{ id: string; car: any }> = []
  try {
    const favs = await prisma.favorite.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { createdAt: 'desc' },
    })
    favorites = favs as any
  } catch {
    favorites = []
  }

  const cars: UiCar[] = (favorites as any).map((f: any): UiCar => {
    const c = f.car
    return {
      id: c.id,
      title: `${c.brand} ${c.model}`,
      subtitle: `${c.year} • ${Number(c.mileage || 0).toLocaleString()} км`,
      image: Array.isArray(c.images) && c.images.length > 0 ? c.images[0] : '/next.svg',
      price: `${Number(c.price || 0).toLocaleString()} ₸`,
      city: c.city || undefined,
      year: c.year || undefined,
      mileageKm: c.mileage || undefined,
      transmission: c.transmission || undefined,
      drive: c.drive || undefined,
      engine: c.engineVolume && c.engineType ? `${c.engineVolume} • ${c.engineType}` : (c.engineType || undefined),
      isFavorited: true,
    }
  })

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <section className="relative py-6 md:py-8 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="container-page relative" style={{ gap: '0 !important' }}>
          <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Избранное' }]} />
          <div className="text-center mb-6 center-to-text">
            <h1 className="text-responsive-xl font-extrabold mb-4">Избранное</h1>
            <p className="text-white/70">Ваши сохранённые автомобили</p>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-page">
          {cars.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/70 mb-6">Список избранного пуст.</p>
              <Link href="/catalog" className="btn-primary hover-glow">Перейти в каталог</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mb-6 md:mb-8">
              {cars.map((car, i) => (
                <div key={car.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}


