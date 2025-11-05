import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) {
    return (
      <div className="container-page py-12 text-white">
        <h1 className="text-2xl font-bold">Требуется вход</h1>
        <p className="text-white/70">Пожалуйста, войдите в систему.</p>
      </div>
    )
  }

  const cars = await prisma.car.findMany({ where: { ownerId: session.user.id }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="container-page py-12 text-white">
      <h1 className="text-3xl font-extrabold mb-6">Мои автомобили</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cars.map((c) => (
          <div key={c.id} className="p-4 border border-[#2a2a2a] rounded-lg">
            <div className="font-semibold">{c.brand} {c.model} • {c.year}</div>
            <div className="text-white/70">{c.price.toLocaleString()} ₸</div>
            <Link href={`/car/${c.id}`} className="text-[#C8BF2F] mt-2 inline-block">Открыть</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
