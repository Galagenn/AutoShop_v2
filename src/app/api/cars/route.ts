import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const brand = searchParams.get('brand') || undefined
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const minYear = searchParams.get('minYear')
  const maxYear = searchParams.get('maxYear')

  const cars = await prisma.car.findMany({
    where: {
      brand: brand ? { contains: brand, mode: 'insensitive' } : undefined,
      price: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined,
      },
      year: {
        gte: minYear ? Number(minYear) : undefined,
        lte: maxYear ? Number(maxYear) : undefined,
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ cars })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { 
    brand, model, year, mileage, price, description, images,
    bodyType, engineVolume, engineType, power, transmission, drive,
    color, condition, steering, customsCleared, documents,
    modelVersion, phone, city
  } = body || {}

  if (!brand || !model || !year || !price) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const car = await prisma.car.create({
    data: {
      brand,
      model,
      year: Number(year),
      mileage: Number(mileage ?? 0),
      price: Number(price),
      description: description ?? '',
      images: Array.isArray(images) ? images : [],
      bodyType: bodyType || null,
      engineVolume: engineVolume || null,
      engineType: engineType || null,
      power: power || null,
      transmission: transmission || null,
      drive: drive || null,
      color: color || null,
      condition: condition || null,
      steering: steering || null,
      customsCleared: customsCleared || null,
      documents: documents || null,
      modelVersion: modelVersion || null,
      phone: phone || null,
      city: city || null,
      ownerId: session.user.id,
    },
  })

  return NextResponse.json({ car }, { status: 201 })
}
