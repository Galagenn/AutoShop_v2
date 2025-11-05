import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await auth()
  // @ts-expect-error role added in session
  const isAdmin = session?.user?.role === 'admin'
  if (!isAdmin) {
    return (
      <div className="container-page py-12 text-white">
        <h1 className="text-3xl font-bold mb-4">Доступ запрещён</h1>
        <p>Недостаточно прав.</p>
      </div>
    )
  }

  const [users, cars] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.car.findMany({ orderBy: { createdAt: 'desc' } }),
  ])

  return (
    <div className="container-page py-12 text-white">
      <h1 className="text-3xl font-extrabold mb-8">Админ-панель</h1>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Пользователи ({users.length})</h2>
        <div className="overflow-x-auto border border-[#2a2a2a] rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#111]">
                <th className="p-3">Email</th>
                <th className="p-3">Имя</th>
                <th className="p-3">Роль</th>
                <th className="p-3">Забанен</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-[#2a2a2a]">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.name ?? '-'}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.banned ? 'Да' : 'Нет'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Объявления ({cars.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cars.map((c) => (
            <div key={c.id} className="p-4 border border-[#2a2a2a] rounded-lg">
              <div className="font-semibold">{c.brand} {c.model} • {c.year}</div>
              <div className="text-white/70">{c.price.toLocaleString()} ₸</div>
              <Link href={`/car/${c.id}`} className="text-[#C8BF2F] mt-2 inline-block">Открыть</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
