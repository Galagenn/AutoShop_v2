import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
  },
  providers: [
    Credentials({
      name: 'Email and password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw)
        if (!parsed.success) return null
        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return null
        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null
        return { id: user.id, email: user.email, name: user.name ?? undefined, role: user.role }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // @ts-expect-error augment token with role and id
        token.role = (user as { role?: string }).role || 'BUYER'
        // @ts-expect-error augment token with id
        token.id = (user as { id: string }).id
      }
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        // @ts-expect-error add id to session user
        session.user.id = (token as unknown as { id: string }).id
        // @ts-expect-error add role to session user
        session.user.role = (token as unknown as { role?: string }).role || 'BUYER'
      }
      return session
    },
  },
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
})
