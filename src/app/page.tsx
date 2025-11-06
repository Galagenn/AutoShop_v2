import Image from "next/image";
import Link from "next/link";
import HeroSection from "./components/HeroSection";
import BestsellersSection from "./components/BestsellersSection";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    const role = (session.user as unknown as { role?: string })?.role || 'BUYER';
    redirect(role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer');
  }
  return (
    <div className="font-sans min-h-screen bg-[#0a0a0a] text-white flex flex-col home">

      <HeroSection />

      <div style={{ marginTop: '3rem' }}>
        <BestsellersSection />
      </div>

      {/* About Us Section */}
      <section className="py-24 relative overflow-hidden home" style={{ marginTop: '1rem' }}>
        {/* Vertical grid lines overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="container-page h-full">
            <div className="grid grid-cols-6 h-full">
              <div className="border-l border-[#2a2a2a]" />
              <div className="border-l border-[#2a2a2a]" />
              <div className="border-l border-[#2a2a2a]" />
              <div className="border-l border-[#2a2a2a]" />
              <div className="border-l border-[#2a2a2a]" />
              <div className="border-l border-[#2a2a2a]" />
            </div>
          </div>
        </div>

        <div className="container-page flex flex-col gap-16 relative">
          <div className="mb-12 md:mb-16 max-w-3xl">
            <h2 className="text-[32px] md:text-[40px] font-extrabолd leading-tight">
              AutoShop - это не просто продажа
              премиальных автомобилей.
            </h2>
            <p className="mt-5 text-gray-400 text-base md:text-lg max-w-2xl">
              Для нас «премиум» - это не только статус, но и сервис, продуманный до мелочей. Каждый клиент - VIP персона. С AutoShop вы получаете не просто ключи от машины, а эмоции и комфорт, которые запоминаются надолго.
            </p>
          </div>

          {/* Feature grid, staggered to lines */}
          <div className="grid grid-cols-6 gap-y-20 md:gap-y-24">
            {/* Row 1 */}
            <div className="col-start-1">
              <h3 className="text-sm font-semibold uppercase">Честность
                и прозрачность</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[240px]">Никаких скрытых платежей. Все условия и гарантии в открытом договоре.</p>
            </div>
            <div className="col-start-3">
              <h3 className="text-sm font-semibold uppercase">Автопарк
                без компромиссов</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[260px]">Только автомобили не старше 3 лет, в идеальном техническом состоянии и с безупречным салоном.</p>
            </div>
            <div className="col-start-5">
              <h3 className="text-sm font-semibold uppercase">Оформление
                за час</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[260px]">От звонка до ключей — меньше 60 минут, без лишних формальностей.</p>
            </div>

            {/* Row 2 (stagger) */}
            <div className="col-start-2 mt-8">
              <h3 className="text-sm font-semibold uppercase">Ваши данные
                под защитой</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[260px]">Сохраняем конфиденциальность. Ваши данные и детали сделки защищены и закреплены юридически.</p>
            </div>
            <div className="col-start-4 mt-8">
              <h3 className="text-sm font-semibold uppercase">Индивидуальный
                подход</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[260px]">Настраиваем условия под вас: нестандартные запросы, особые события, уникальные решения.</p>
            </div>
            <div className="col-start-6 mt-8">
              <h3 className="text-sm font-semibold uppercase">Доставка
                в любое место</h3>
              <p className="mt-2 text-xs text-gray-400 max-w-[260px]">Привезем авто по Астане и области в удобное для вас время и точку.</p>
            </div>
          </div>

          {/* Bottom arrow (centered, in flow) */}
          <div className="w-full flex justify-center select-none pointer-events-none mt-6 md:mt-8">
            <Image src="/Wrapper_mask-group.png" alt="Scroll down" width={90} height={120} />
          </div>
        </div>
      </section>

      {/* Statistics Section (image only) */}
      <section className="py-10 md:py-16">
        <div className="container-page">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-xl">
            <Image src="/Sportsmanship Mode.png" alt="Dashboard stats" fill className="object-contain" />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16" style={{ marginTop: '1rem' }}>
        <div className="container-page flex flex-col gap-16">
          <div className="text-center mb-8">
            <a href="/about" className="h-10 px-5 inline-flex items-center justify-center rounded-lg border border-[#3a3a3a] text-sm hover:bg-[#2a2a2a] transition-colors">
              Отзывы клиентов
            </a>
          </div>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Нам доверяют тысячи автолюбителей</h2>
            <p className="text-gray-400 text-base md:text-lg">Читайте, что говорят наши пользователи — и убедитесь сами.</p>
          </div>

          <div className="relative">
            {/* Vertical dividers between 3 columns */}
            <div className="hidden md:block absolute inset-y-0 left-1/3 -translate-x-1/2 w-px bg-[#2a2a2a]" />
            <div className="hidden md:block absolute inset-y-0 left-2/3 -translate-x-1/2 w-px bg-[#2a2a2a]" />

            <div className="grid md:grid-cols-3 gap-10 md:gap-12">
              {[
                {
                  name: "Арман",
                  role: "купил Kia Sportage",
                  review:
                    "Нашёл авто мечты по цене ниже рынка. Удобный поиск, вся история машины сразу на экране. Однозначно рекомендую!",
                },
                {
                  name: "Егор",
                  role: "менеджер по логистике",
                  review:
                    "Нашёл машину за день и сразу забронировал. Всё прозрачно: фото, история, документы — ни одного сюрприза. Покупка была лёгкой",
                },
                {
                  name: "Николай",
                  role: "владелец Hyundai Solaris",
                  review:
                    "Цены ниже, чем на других сайтах. Машину доставили прямо ко мне, всё по договору. Очень доволен сервисом!",
                },
              ].map((t, i) => (
                <div key={i} className="text-center px-2 md:px-8">
                  <div className="flex justify-center text-[#fbbf24] text-xl mb-4">★★★★★</div>
                  <p className="text-gray-300 text-base leading-7 md:text-lg md:leading-8">{t.review}</p>
                  <div className="mt-6">
                    <div className="text-lg font-semibold">{t.name}</div>
                    <div className="text-gray-400 text-sm">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Seller Benefits Section */}
      <section className="py-16 bg-[#111111]" id="sellers">
        <div className="container-page">
          <div className="flex flex-col items-center gap-10 text-center mb-10 md:mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-3 md:mb-4">Почему продавцы выбирают нас каждый день?</h2>
            <p className="text-[#a8a8a8] text-base md:text-lg max-w-4xl mx-auto text-center">
              Продавайте авто быстро, безопасно и без комиссии. Всё просто — вы подаёте объявление, мы приводим покупателей.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8">
            {[
              {
                key: "no_fee",
                title: "БЕЗ КОМИССИИ",
                desc:
                  "Оставляйте объявления бесплатно\nМы не берём проценты за размещение или успешную продажу. Ваш заработок — только ваш.",
                variant: "dark",
              },
              {
                key: "fast_publish",
                title: "ПУБЛИКАЦИЯ ЗА 2 МИНУТЫ",
                desc:
                  "Максимально просто\nЗаполните короткую форму, добавьте фото — и ваше авто уже видно потенциальным покупателям.",
                variant: "white",
              },
              {
                key: "direct",
                title: "ПРЯМАЯ СВЯЗЬ",
                desc:
                  "Без посредников\nПокупатели связываются с вами напрямую — по телефону, через чат или почту.",
                variant: "dark-tire",
              },
              {
                key: "audience",
                title: "ШИРОКАЯ АУДИТОРИЯ",
                desc:
                  "Ваше объявление увидят те, кто реально ищет авто. Мы продвигаем объявления в поиске.",
                variant: "white-steering",
              },
              {
                key: "support",
                title: "ПОДДЕРЖКА 24/7",
                desc:
                  "Техническая поддержка и автоэксперты помогут вам на любом этапе — от загрузки фото до оформления сделки.",
                variant: "gradient-support",
              },
              {
                key: "flex",
                title: "ГИБКИЕ УСЛОВИЯ",
                desc:
                  "Вы сами выбираете условия продажи, цену, способ связи. Полная свобода.",
                variant: "white",
              },
            ].map((card) => {
              const base = "relative rounded-2xl p-6 md:p-7 overflow-hidden min-h-[220px] md:min-h-[260px]";
              const isWhite = card.variant === "white" || card.variant === "white-steering";
              const isTire = card.variant === "dark-tire";
              const isSteering = card.variant === "white-steering";
              const isSupport = card.variant === "gradient-support";

              const classes = isWhite
                ? `${base} bg-white text-black`
                : isSupport
                ? `${base} text-white`
                : `${base} bg-black text-white`;

              return (
                <div key={card.key} className={classes} style={{ padding: '55px 35px' }}>
                  {isTire && (
                    <div className="absolute inset-0 pointer-events-none">
                      <Image
                        src="/5499de375f58973f2fa599fe6e8935601cd20621.png"
                        alt="wheel"
                        width={280}
                        height={280}
                        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 md:w-56 h-auto opacity-90"
                      />
                    </div>
                  )}
                  {isSteering && (
                    <div className="absolute inset-0 pointer-events-none">
                      <Image
                        src="/5a75f667bc2a9be7b02c2966a15b1ec49432c34c.png"
                        alt="steering"
                        width={320}
                        height={320}
                        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-40 md:w-56 h-auto"
                      />
                    </div>
                  )}
                  {isSupport && (
                    <div className="absolute inset-0 z-0">
                      <Image
                        src="/77a527864baf09393232c645ae99260f51026c94.png"
                        alt="support background"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <h3 className="text-[18px] font-extrabold mb-2 tracking-tight relative z-10">{card.title}</h3>
                  <p className={`${isWhite ? "text-black/70" : "text-white/70"} text-sm whitespace-pre-line relative z-10`}>{card.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/sell" className="btn-primary hover-glow">
              Создать объявление
            </Link>
          </div>
        </div>
      </section>

      
    </div>
  );
}
