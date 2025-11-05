export default function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-[#2a2a2a] py-16">
      <div className="container-page">
        <div className="flex flex-col items-center gap-8 max-w-[1100px] mx-auto text-center">
          <h2 className="font-extrabold leading-[0.95] tracking-tight mx-auto text-[10vw] md:text-[82px]">
            Найдите или продайте
            <br className="hidden md:block" />
            свой автомобиль уже сегодня
          </h2>
          <p className="text-center mt-6 text-[#bdbdbd] text-base md:text-xl max-w-3xl mx-auto">
            Тысячи предложений. Мгновенная подача объявлений. Сделка без посредников.
          </p>
          <div className="mt-10">
            <a href="/catalog" className="inline-flex items-center gap-2 h-12 px-7 rounded-xl bg-[rgba(200,191,47,1)] text-[#0a0a0a] font-medium shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.2)] hover:bg-[#b5ab2a]" style={{ padding: '11px 30px', backgroundColor: 'rgba(200,191,47,1)', color: '#0a0a0a', borderRadius: '10px'}}>
              Начать сейчас
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M7 17l7-7" stroke="black" strokeWidth="2" strokeLinecap="round"/><path d="M10 7h8v8" stroke="black" strokeWidth="2" strokeLinecap="round"/></svg>
            </a>
          </div>

          <div className="mt-10 h-px bg-[#2a2a2a]" />

          <nav className="mt-8 flex items-center justify-center gap-8 text-[#cfcfcf]">
            <a href="/catalog" className="hover:text-white">Каталог</a>
            <a href="/sell" className="hover:text-white">Продавцам</a>
            <a href="/about" className="hover:text-white">О нас</a>
            <a href="/contact" className="hover:text-white">Контакты</a>
          </nav>

          <div className="mt-8 text-[#9a9a9a] text-sm">2025 AutoShop. Все права защищены.</div>
        </div>
      </div>
    </footer>
  );
}


