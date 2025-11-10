import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

export const runtime = 'nodejs'

const registerSchema = z.object({
  email: z.string().email().transform(v => v.trim().toLowerCase()),
  password: z.string().min(6),
  name: z.string().transform(v => v?.trim() || '').optional().nullable(),
  role: z.enum(['BUYER','SELLER','ADMIN']).default('BUYER')
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
    }
    const { email, password, name, role } = parsed.data

    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      console.error('[REGISTER_ERROR] DATABASE_URL is not configured')
      return NextResponse.json({ error: 'Проблема подключения к базе данных' }, { status: 500 })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 409 })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { email, name: name ? name : null, passwordHash, role },
      select: { id: true, email: true, name: true, role: true },
    })
    return NextResponse.json({ user }, { status: 201 })
  } catch (e: unknown) {
    // Known Prisma unique constraint
    if (typeof e === 'object' && e && 'code' in e && (e as { code?: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Email уже зарегистрирован' }, { status: 409 })
    }
    // Database connection or schema errors
    const message = typeof e === 'object' && e && 'message' in e ? String((e as { message?: string }).message) : ''
    const errorCode = typeof e === 'object' && e && 'code' in e ? String((e as { code?: string }).code) : ''
    
    console.error('[REGISTER_ERROR]', {
      message,
      code: errorCode,
      error: e
    })
    
    // Check for various database connection error patterns
    const isConnectionError = 
      message.toLowerCase().includes('connect') || 
      message.toLowerCase().includes('database') ||
      message.toLowerCase().includes('connection') ||
      message.toLowerCase().includes('timeout') ||
      message.toLowerCase().includes('refused') ||
      errorCode === 'P1001' || // Can't reach database server
      errorCode === 'P1002' || // Database server closed the connection
      errorCode === 'P1003' || // Database does not exist
      errorCode === 'P1009' || // Database already exists
      errorCode === 'P1017'    // Server has closed the connection
    
    if (isConnectionError) {
      return NextResponse.json({ error: 'Проблема подключения к базе данных' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
