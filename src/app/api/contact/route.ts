import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resendKey = process.env.RESEND_API_KEY
const emailFrom = process.env.EMAIL_FROM || 'no-reply@example.com'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body || {}
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const saved = await prisma.message.create({
      data: { name, email, subject: subject ?? null, message },
    })

    if (resendKey) {
      const resend = new Resend(resendKey)
      await resend.emails.send({
        from: emailFrom,
        to: email,
        subject: subject || 'Ваше сообщение получено — AutoShop',
        text: `Спасибо за обращение, ${name}! Мы получили ваше сообщение: \n\n${message}`,
      })
    }

    return NextResponse.json({ ok: true, message: saved }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
