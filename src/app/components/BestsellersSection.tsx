import Image from "next/image";

export default function BestsellersSection() {
  const cards = [
    {
      title: "PORSCHE",
      subtitle: "Coupe Carrera 4 GTS",
      image: "f23f9915b06267a38f4315f8bf8fde9d023a8a5d.png",
      specs: "2021 · автомат\n4 места · бензин",
      price: "65 000 000 т",
    },
    {
      title: "HYUNDAI ELANTRA",
      subtitle: "Sedan [20-25]",
      image: "86d1dca4bca8d229f8860b1ac81e7d8e3de8f1af.png",
      specs: "2022 · автомат\n5 мест · бензин",
      price: "14 900 000 т",
    },
    {
      title: "BMW",
      subtitle: "X5 (G05)",
      image: "2fcf25eef7cde9764c28648e8d3f75100458b73d.png",
      specs: "2022 · автомат\n5 мест · дизель",
      price: "59 500 000 ₸",
    },
  ];

  return (
    <section className="pt-10 sm:pt-12 md:pt-14 pb-12 md:pb-24">
      <div className="container-page">
        <div
          className="grid gap-6 items-start lg:[grid-template-columns:minmax(240px,42.6%)_minmax(640px,54.1%)]"
        >
          {/* Left large image */}
          <div className="rounded-2xl overflow-hidden order-1 lg:order-none">
            <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4]">
              <Image
                src="/40b2966f53590843ba55767d1aef7307e3f221c1.png"
                alt="Promo"
                fill
                className="object-cover hits-photo"
                priority
              />
            </div>
          </div>

          {/* Right content */}
          <div className="flex flex-col justify-between h-full gap-5 order-0 lg:order-none">
            <h2 className="text-2xl sm:text-3xl md:text-[42px] leading-tight font-extrabold">
              ХИТЫ ПРОДАЖА - АВТО, КОТОРЫЕ ПОКУПАЮТ ПЕРВЫМИ!
            </h2>
            <p className="text-sm sm:text-[15px] text-[#bcbcbc] max-w-2xl">
              Популярные авто, которые пользуются наибольшим спросом среди наших клиентов. Их
              покупают в первую очередь за комфорт, надёжность и стиль.
            </p>

            

            <div className="flex justify-between gap-3 sm:gap-4">
              {cards.map((c, i) => (
                <div key={i} className="bestseller-card rounded-2xl bg-white text-black p-3 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.12)] flex-1">
                    <div className="text-center">
                      <div className="text-xs sm:text-sm md:text-base font-extrabold">{c.title}</div>
                      <div className="text-[10px] sm:text-[11px] md:text-xs text-black/60">{c.subtitle}</div>
                    </div>
                    <div className="bestseller-card__media relative mt-2 rounded-lg overflow-hidden bg-white h-full w-full">
                      <Image 
                        src={`/${c.image}`} 
                        alt={c.title} 
                        fill 
                        className={`object-contain sm:object-contain md:object-contain ${
                          // на очень узких экранах делаем более «узкое» покрытие, чтобы картинка казалась короче
                          ''
                        } ${c.title === 'HYUNDAI ELANTRA' || c.title === 'BMW' ? 'p-1' : 'p-2'} md:p-2`}
                      />
                    </div>
                    <div className="mt-2 text-[10px] sm:text-[11px] text-black/70 whitespace-pre-line pl-1">
                      {c.specs}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-[13px] sm:text-[14px] md:text-[15px] font-extrabold pl-1">{c.price}</div>
                      <a href="/catalog" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-black text-white grid place-items-center text-xs sm:text-sm" aria-label="Перейти в каталог">↗</a>
                    </div>
                  </div>
              ))}
            </div>

            {/* CTA below grid, right aligned */}
            <div className="flex justify-end">
              <a
                className="inline-flex h-10 px-6 items-center rounded-full bg-[rgba(200,191,47,1)] text-black font-semibold shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.12)]"
                style={{ backgroundColor: 'rgba(200,191,47,1)', color: '#000000', padding: '11px 30px', borderRadius: '10px' }}
                href="#catalog"
              >
                Посмотреть все
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


