import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  // @ts-expect-error role injected
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { banned } = await req.json()
  const user = await prisma.user.update({ where: { id }, data: { banned: !!banned } })
  return NextResponse.json({ user })
}
