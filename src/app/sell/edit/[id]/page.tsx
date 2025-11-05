import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import SellForm from '@/app/sell/SellForm'

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) redirect('/auth/login')

  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) redirect('/dashboard/seller')

  // Check ownership
  if (car.ownerId !== session.user.id) {
    // @ts-ignore
    if (session.user.role !== 'ADMIN') redirect('/dashboard/seller')
  }

  // Pre-fill form data
  const initialData = {
    title: `${car.brand} ${car.model}`,
    brand: car.brand || '',
    model: car.model || '',
    modelVersion: (car.modelVersion as string) || '',
    year: String(car.year || ''),
    mileage: String(car.mileage || ''),
    bodyType: (car.bodyType as string) || '',
    engineVolume: (car.engineVolume as string) || '',
    engineType: (car.engineType as string) || 'бензин',
    transmission: (car.transmission as string) || 'автомат',
    drive: (car.drive as string) || 'передний',
    color: (car.color as string) || '',
    condition: (car.condition as string) || '',
    steering: (car.steering as string) || 'левый',
    customsCleared: (car.customsCleared as string) || '',
    documents: (car.documents as string) || 'ПТС',
    price: String(car.price || ''),
    description: car.description || '',
    contactName: session.user?.name || '',
    city: (car.city as string) || '',
    phone: (car.phone as string) || '',
    email: session.user?.email || '',
    images: car.images || []
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center">
      <section className="py-8 w-full">
        <div className="container-page">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center">Редактировать объявление</h1>
          <SellForm carId={id} initialData={initialData} />
        </div>
      </section>
    </div>
  )
}

