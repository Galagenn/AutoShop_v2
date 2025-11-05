"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";

export default function ModernHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as unknown as { role?: string })?.role || undefined;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-[#2a2a2a]/50">
      <div className="container-page">
        <div className="mx-auto max-w-[1200px] w-full h-14 md:h-16 rounded-xl md:rounded-2xl bg-[#1a1a1a]/80 backdrop-blur-xl text-white border border-[#2a2a2a]/50 header-inner flex items-center justify-between shadow-2xl">
          {/* Logo */}
          <Link 
            href={session ? (role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer') : '/'} 
            className="flex items-center gap-2 md:gap-3 group" 
            aria-label="На главную"
          >
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-[#C8BF2F] to-[#B3AA2C] grid place-items-center shadow-lg group-hover:shadow-[#C8BF2F]/30 transition-all duration-300">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
              </svg>
            </div>
            <span className="text-lg md:text-xl font-bold text-white">AutoShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href={session ? (role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer') : '/'} 
              className="text-white/80 hover:text-[#C8BF2F] font-medium transition-all duration-300 hover:scale-105"
            >
              Главная
            </Link>
            <Link href="/catalog" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-all duration-300 hover:scale-105">Каталог</Link>
            <Link href="/contact" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-all duration-300 hover:scale-105">Контакты</Link>
            {session && role === 'SELLER' && (
              <>
                <Link href="/sell" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-all duration-300 hover:scale-105">Добавить авто</Link>
              </>
            )}
            {role === 'ADMIN' && (
              <Link href="/admin" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-all duration-300 hover:scale-105">Админ-панель</Link>
            )}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {!session && (
              <Link 
                href="/auth/login" 
                className="btn-primary text-sm px-4 py-2 hover-glow"
              >
                Войти
              </Link>
            )}
            {session && (
              <>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-ghost text-sm px-4 py-2">Выйти</button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 rounded-xl bg-[#1a1a1a]/95 backdrop-blur-xl border border-[#2a2a2a]/50 animate-fade-in-up" style={{ padding: '5px 15px 5px' }}>
            <nav className="flex flex-col gap-3 mb-4">
              <Link 
                href={session ? (role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer') : '/'} 
                className="text-white/80 hover:text-[#C8BF2F] font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5" 
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link href="/catalog" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Каталог</Link>
              <Link href="/contact" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Контакты</Link>
              {session && role === 'SELLER' && (
                <Link href="/sell" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Добавить авто</Link>
              )}
              {role === 'ADMIN' && (
                <Link href="/admin" className="text-white/80 hover:text-[#C8BF2F] font-medium transition-colors py-2 px-3 rounded-lg hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Админ-панель</Link>
              )}
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-[#2a2a2a]">
              {!session ? (
                <Link 
                  href="/auth/login" 
                  className="btn-primary text-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Войти
                </Link>
              ) : null}
              {session && (
                <button onClick={() => { setIsMenuOpen(false); signOut({ callbackUrl: '/' }) }} className="btn-ghost text-sm">Выйти</button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
