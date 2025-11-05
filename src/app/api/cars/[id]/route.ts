import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const car = await prisma.car.findUnique({ where: { id } })
  if (!car) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ car })
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.car.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = existing.ownerId === session.user.id
  // @ts-expect-error role injected
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { 
    brand, model, year, mileage, price, description, images,
    bodyType, engineVolume, engineType, transmission, drive,
    color, condition, steering, customsCleared, documents,
    modelVersion, phone, city
  } = body || {}

  const updated = await prisma.car.update({
    where: { id },
    data: {
      brand,
      model,
      year: year !== undefined ? Number(year) : undefined,
      mileage: mileage !== undefined ? Number(mileage) : undefined,
      price: price !== undefined ? Number(price) : undefined,
      description,
      images: Array.isArray(images) ? images : undefined,
      bodyType: bodyType !== undefined ? bodyType : undefined,
      engineVolume: engineVolume !== undefined ? engineVolume : undefined,
      engineType: engineType !== undefined ? engineType : undefined,
      transmission: transmission !== undefined ? transmission : undefined,
      drive: drive !== undefined ? drive : undefined,
      color: color !== undefined ? color : undefined,
      condition: condition !== undefined ? condition : undefined,
      steering: steering !== undefined ? steering : undefined,
      customsCleared: customsCleared !== undefined ? customsCleared : undefined,
      documents: documents !== undefined ? documents : undefined,
      modelVersion: modelVersion !== undefined ? modelVersion : undefined,
      phone: phone !== undefined ? phone : undefined,
      city: city !== undefined ? city : undefined,
    },
  })

  return NextResponse.json({ car: updated })
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.car.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isOwner = existing.ownerId === session.user.id
  // @ts-expect-error role injected
  const isAdmin = session.user.role === 'admin'
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await prisma.car.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
