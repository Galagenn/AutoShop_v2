import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await auth()
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { carId } = await req.json()
  if (!carId) return NextResponse.json({ error: 'carId required' }, { status: 400 })
  const fav = await prisma.favorite.upsert({
    where: { userId_carId: { userId, carId } },
    update: {},
    create: { userId, carId },
  })
  return NextResponse.json({ favorite: fav }, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await auth()
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { carId } = await req.json()
  if (!carId) return NextResponse.json({ error: 'carId required' }, { status: 400 })
  await prisma.favorite.delete({ where: { userId_carId: { userId, carId } } })
  return NextResponse.json({ ok: true })
}

