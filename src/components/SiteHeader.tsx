import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-4 z-50">
      <div className="container-page">
        <div className="mx-auto max-w-[1200px] w-full h-12 rounded-full bg-[#d1d5db] text-[#0a0a0a] border border-white/10 px-4 flex items-center justify-between shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08)]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[#0a0a0a] grid place-items-center">
              <span className="w-2 h-2 rounded-full bg-[#d6ff00]" />
            </div>
            <span className="font-semibold">AutoShop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm opacity-90">
            <Link href="/catalog" className="font-medium">Каталог</Link>
            <Link href="/sell">Продавцам</Link>
            <Link href="/about">О нас</Link>
            <Link href="/contact">Контакты</Link>
          </nav>
          <Link href="/sell" className="max-w-[128px] w-full h-[42px] flex flex-row justify-center items-center px-[51px] py-[14px] rounded-[10px] bg-[rgba(200,191,47,1)] text-black text-sm font-semibold">Разместить</Link>
        </div>
      </div>
    </header>
  );
}


