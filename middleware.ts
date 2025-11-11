import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

export default auth(async (req: NextRequest) => {
  const { nextUrl } = req
  const isAdminRoute = nextUrl.pathname.startsWith('/admin')
  const isDashboardRoute = nextUrl.pathname.startsWith('/dashboard')
  const isProfileRoute = nextUrl.pathname.startsWith('/profile')
  const isFavoritesRoute = nextUrl.pathname.startsWith('/favorites')
  const isSellRoute = nextUrl.pathname.startsWith('/sell')
  const isCarsMutation = nextUrl.pathname.startsWith('/api/cars') && ['POST','PUT','DELETE'].includes(req.method)

  // @ts-ignore user may be undefined
  const role = req.auth?.user?.role
  const isLoggedIn = !!req.auth

  if ((isProfileRoute || isFavoritesRoute || isCarsMutation) && !isLoggedIn) {
    const url = new URL('/auth/login', nextUrl)
    url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
    return NextResponse.redirect(url)
  }

  if (isFavoritesRoute && role !== 'BUYER') {
    return NextResponse.redirect(new URL(role === 'SELLER' ? '/dashboard/seller' : '/', nextUrl))
  }

  if (isSellRoute) {
    if (!isLoggedIn) {
      const url = new URL('/auth/login', nextUrl)
      url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(url)
    }
    if (role !== 'SELLER') {
      return NextResponse.redirect(new URL(role === 'BUYER' ? '/dashboard/buyer' : '/', nextUrl))
    }
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      const url = new URL('/auth/login', nextUrl)
      url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(url)
    }
    if (role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', nextUrl))
    }
  }

  if (isDashboardRoute) {
    if (!isLoggedIn) {
      const url = new URL('/auth/login', nextUrl)
      url.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
      return NextResponse.redirect(url)
    }
    if (nextUrl.pathname.startsWith('/dashboard/seller') && role !== 'SELLER') {
      return NextResponse.redirect(new URL('/dashboard/buyer', nextUrl))
    }
    if (nextUrl.pathname.startsWith('/dashboard/buyer') && role !== 'BUYER') {
      return NextResponse.redirect(new URL('/dashboard/seller', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
    '/favorites/:path*',
    '/sell/:path*',
    '/api/cars/:path*',
  ],
}
