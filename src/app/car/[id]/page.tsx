import { prisma } from '@/lib/prisma'
import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import CarCard, { type Car as UiCar } from '@/components/CarCard'
import ListingCard from '@/components/ListingCard'
import CarGallery from '@/components/CarGallery'
import CtaBanner from '../../../components/CtaBanner'
import FavoriteButton from '@/components/FavoriteButton'
import { auth } from '@/auth'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  let car = null as null | Awaited<ReturnType<typeof prisma.car.findUnique>>
  try {
    car = await prisma.car.findUnique({ where: { id } })
  } catch {
    car = null
  }
  if (!car) return { title: 'Авто не найдено — AutoShop' }
  const title = `${car.brand} ${car.model} ${car.year} — AutoShop`
  const description = `${car.brand} ${car.model} ${car.year}, пробег ${car.mileage.toLocaleString()} км. Цена ${car.price.toLocaleString()} ₸.`
  const images = (car.images ?? []).map((src) => ({ url: src }))
  return {
    title,
    description,
    openGraph: { title, description, images },
    twitter: { card: 'summary_large_image', title, description, images },
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  const session = await auth()
  const userId = (session?.user as unknown as { id?: string } | undefined)?.id
  let car = null as null | Awaited<ReturnType<typeof prisma.car.findUnique>>
  try {
    car = await prisma.car.findUnique({ where: { id }, include: { owner: true, favoritedBy: userId ? { where: { userId } } : false as any } as any })
  } catch {
    car = null
  }
  if (!car) {
    return (
      <div className="container-page py-12 text-white">
        <h1 className="text-2xl font-bold">Автомобиль не найден</h1>
      </div>
    )
  }

  const galleryImages = Array.isArray(car.images) && car.images.length > 0 ? car.images : []
  const isFavorited = Array.isArray((car as any).favoritedBy) && (car as any).favoritedBy.length > 0
  let similarCars = [] as Awaited<ReturnType<typeof prisma.car.findMany>>
  try {
    similarCars = await prisma.car.findMany({
      where: {
        id: { not: car.id },
        brand: car.brand,
      },
      orderBy: { createdAt: 'desc' },
      take: 4,
    })
  } catch {
    similarCars = []
  }

  const similar: UiCar[] = similarCars.map((c) => ({
    id: c.id,
    title: `${c.brand} ${c.model}`,
    subtitle: `${c.year} • ${c.mileage.toLocaleString()} км`,
    image: (Array.isArray(c.images) && c.images[0]) ? c.images[0] : '/file.svg',
    price: `${c.price.toLocaleString()} ₸`,
  }))

  // Helpers: capitalization and translations
  const capitalizeFirst = (s: string | null | undefined) => {
    if (!s) return s
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  const colorMap: Record<string, string> = {
    white: 'Белый',
    black: 'Чёрный',
    silver: 'Серебристый',
    gray: 'Серый',
    red: 'Красный',
    blue: 'Синий',
    green: 'Зелёный',
    yellow: 'Жёлтый',
    brown: 'Коричневый',
    orange: 'Оранжевый',
    purple: 'Фиолетовый',
  }

  const translateColor = (value?: string | null) => {
    if (!value) return '—'
    const key = String(value).toLowerCase()
    return colorMap[key] || capitalizeFirst(value)
  }

  const conditionMap: Record<string, string> = {
    new: 'Новая',
    used: 'С пробегом',
    damaged: 'После аварии',
  }
  const translateCondition = (value?: string | null) => {
    if (!value) return '—'
    const key = String(value).toLowerCase()
    return conditionMap[key] || capitalizeFirst(value)
  }

  const translateSteering = (value?: string | null) => {
    if (!value) return '—'
    return capitalizeFirst(value)
  }

  const translateCustoms = (value?: string | null) => {
    if (!value) return '—'
    const key = String(value).toLowerCase()
    if (key === 'yes' || key === 'true') return 'Да'
    if (key === 'no' || key === 'false') return 'Нет'
    return capitalizeFirst(value)
  }

  const cityMap: Record<string, string> = {
    almaty: 'Алматы',
    astana: 'Астана',
    shymkent: 'Шымкент',
    aktobe: 'Актобе',
    karaganda: 'Караганда',
    taraz: 'Тараз',
    pavlodar: 'Павлодар',
    semey: 'Семей',
    uralsk: 'Уральск',
    kostanay: 'Костанай',
    kyzylorda: 'Кызылорда',
    petropavl: 'Петропавловск',
    atyrau: 'Атырау',
    aktau: 'Актау',
  }
  const translateCity = (value?: string | null) => {
    if (!value) return '—'
    const key = String(value).toLowerCase()
    return cityMap[key] || capitalizeFirst(value)
  }

  const normalizePhoneForTel = (value?: string | null) => {
    if (!value) return undefined
    const trimmed = String(value).trim()
    const hasPlus = trimmed.startsWith('+')
    const digits = trimmed.replace(/[^\d]/g, '')
    if (!digits) return undefined
    return hasPlus ? `+${digits}` : digits
  }

  // Format engine display
  const specEngine = car.engineVolume && car.engineType 
    ? `${car.engineVolume} • ${capitalizeFirst(car.engineType)}`
    : (capitalizeFirst(car.engineType || '') || '—')

  const specBody = capitalizeFirst(car.bodyType || '') || '—'
  const specTransmission = capitalizeFirst(car.transmission || '') || '—'
  const specDrive = capitalizeFirst(car.drive || '') || '—'
  const specColor = translateColor(car.color)
  const specPower = car.power ? capitalizeFirst(car.power) : '—'

  const specs: { label: string; value: string }[] = [
    { label: 'Двигатель', value: specEngine },
    { label: 'Трансмиссия', value: specTransmission },
    { label: 'Привод', value: specDrive },
    { label: 'Цвет', value: specColor },
    { label: 'Кузов', value: specBody },
    { label: 'Мощность', value: specPower },
    { label: 'Состояние', value: translateCondition(car.condition) },
    { label: 'Руль', value: translateSteering(car.steering) },
    { label: 'Растаможен', value: translateCustoms(car.customsCleared) },
    { label: 'Документы', value: car.documents ? capitalizeFirst(car.documents) : '—' },
    { label: 'Версия', value: car.modelVersion || '—' },
    { label: 'Город', value: translateCity(car.city) },
  ]

  const telPhone = normalizePhoneForTel(car.phone)
  const telHref = telPhone ? `tel:${telPhone}` : '#contact'

  return (
    <div className="car-detail">
      <div className="container-page car-header">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Каталог', href: '/catalog' }, { label: `${car.brand} ${car.model}` }]} />
      </div>

      <section className="py-8">
        <div className="container-page">
          <div className="car-layout">
            <div className="car-left animate-slide-in-left">
              <div className="car-topbar">
                <div>
                  <h1 className="car-title">{car.brand} {car.model}</h1>
                  <p className="car-subtitle">{car.year} • {car.mileage.toLocaleString()} км</p>
                </div>
                <div className="verified-badge">Проверено AutoShop ✅</div>
              </div>

              <div className="price-box">
                <div className="price">{car.price.toLocaleString()} ₸</div>
              </div>
              <div className="actions-row">
                <a href={telHref} className="btn-primary">Связаться с продавцом</a>
                <FavoriteButton carId={car.id} initialFavorite={isFavorited} />
              </div>

              <aside className="car-specs">
                <div className="specs-title">Характеристики</div>
                <div className="specs-list">
                  {specs.filter(s => s.value !== '—').map((s, i) => (
                    <div key={i} className="spec-row">
                      <div className="spec-label">{s.label}</div>
                      <div className="spec-value">{s.value}</div>
                    </div>
                  ))}
                </div>
              </aside>

            </div>

            <div className="car-right animate-slide-in-right">
              <CarGallery images={galleryImages} title={`${car.brand} ${car.model}`} />

              <div className="card-block">
                <h3 className="section-heading">Описание</h3>
                <p className="muted-text">{car.description}</p>
              </div>

              <div id="contact" className="card-block">
                <h3 className="section-heading">Контакты продавца</h3>
                <div className="muted-text" style={{ display: 'grid', gap: '4px' }}>
                  <div>Имя: {car.owner?.name ?? 'Продавец'}</div>
                  <div>Телефон: {telPhone ? <a className="text-[#C8BF2F]" href={telHref}>{car.phone}</a> : '—'}</div>
                  <div>Email: {car.owner?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 similar-section relative overflow-hidden">
        <div className="container-page relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-8 gradient-text text-center">Похожие автомобили</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
            {similar.map((c, i) => (
              <div key={c.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <ListingCard compact id={c.id} title={c.title} image={c.image} price={c.price} onViewHref={`/car/${c.id}`} />
              </div>
            ))}
          </div>
          <CtaBanner />
        </div>
      </section>
    </div>
  )
}


