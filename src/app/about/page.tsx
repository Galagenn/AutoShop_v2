import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "О компании AutoShop — Честная продажа автомобилей в Казахстане",
  description: "AutoShop — ведущий маркетплейс автомобилей в Казахстане. Более 10,000 объявлений, честные сделки, поддержка 24/7. Узнайте нашу историю и преимущества.",
  keywords: "AutoShop, о компании, продажа авто, маркетплейс, Казахстан, честные сделки",
};

const team = [
  {
    name: "Алексей Петров",
    position: "Основатель и CEO",
    experience: "15+ лет в автобизнесе",
    image: "/40b2966f53590843ba55767d1aef7307e3f221c1.png"
  },
  {
    name: "Мария Козлова",
    position: "Директор по продажам",
    experience: "12+ лет в продажах",
    image: "/77a527864baf09393232c645ae99260f51026c94.png"
  },
  {
    name: "Дмитрий Смирнов",
    position: "Технический директор",
    experience: "10+ лет в IT",
    image: "/5a75f667bc2a9be7b02c2966a15b1ec49432c34c.png"
  },
  {
    name: "Анна Иванова",
    position: "Руководитель клиентского сервиса",
    experience: "8+ лет в сервисе",
    image: "/5499de375f58973f2fa599fe6e8935601cd20621.png"
  }
];

const achievements = [
  { number: "10,000+", label: "Успешных сделок", icon: "🚗" },
  { number: "50,000+", label: "Довольных клиентов", icon: "😊" },
  { number: "5 лет", label: "На рынке", icon: "⭐" },
  { number: "24/7", label: "Поддержка", icon: "🛡️" }
];

const values = [
  {
    title: "Честность и прозрачность",
    description: "Никаких скрытых платежей. Все условия и гарантии в открытом договоре. Мы верим, что честность — основа долгосрочных отношений.",
    icon: "🤝"
  },
  {
    title: "Качество без компромиссов",
    description: "Только проверенные автомобили с полной историей. Каждая машина проходит техническую экспертизу перед размещением.",
    icon: "✨"
  },
  {
    title: "Скорость и удобство",
    description: "От звонка до ключей — меньше 60 минут. Максимально упрощенные процедуры без лишних формальностей.",
    icon: "⚡"
  },
  {
    title: "Индивидуальный подход",
    description: "Каждый клиент уникален. Мы настраиваем условия под ваши потребности и находим оптимальные решения.",
    icon: "🎯"
  }
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        <div className="container-page relative">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "О нас" }]} />
          
          <div className="text-center mb-12 center-to-text">
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6 ">
              О компании AutoShop
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-4xl mx-auto">
              Мы создаём лучший опыт покупки и продажи автомобилей в Казахстане. 
              Честные условия, прозрачность и высокий уровень сервиса — это наша философия.
            </p>
          </div>

          {/* Achievements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {achievements.map((achievement, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="text-4xl mb-3 animate-float">{achievement.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold text-[#C8BF2F] mb-1">
                  {achievement.number}
                </div>
                <div className="text-white/60 text-sm">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-6 gradient-text center-to-text">
                Наша миссия
              </h2>
              <div className="space-y-6">
                <p className="text-white/80 text-lg leading-relaxed">
                  Сделать покупку и продажу автомобилей максимально простой, безопасной и выгодной для всех. 
                  Мы стремимся к тому, чтобы каждый клиент получил именно тот автомобиль, который ищет, 
                  по справедливой цене и с полной уверенностью в качестве.
                </p>
                <p className="text-white/80 text-lg leading-relaxed">
                  AutoShop — это не просто платформа для размещения объявлений. 
                  Это сообщество автолюбителей, где каждый может найти свой идеальный автомобиль 
                  или продать свой с максимальной выгодой.
                </p>
                <div className="flex items-center gap-4 pt-4">
                  <div className="w-12 h-12 rounded-full bg-[#C8BF2F] flex items-center justify-center">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-[#C8BF2F]">Сердце нашей работы</div>
                    <div className="text-white/60 text-sm">Каждый клиент — это наша приоритет</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden animate-slide-in-right">
              <Image src="/Sportsmanship Mode.png" alt="Наша команда" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-[#111] border-y border-[#2a2a2a] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8BF2F] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-float"></div>
        </div>
        <div className="container-page relative z-10">
          <div className="text-center mb-12 center-to-text">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 gradient-text">
              Наши ценности
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Принципы, которыми мы руководствуемся в работе с клиентами и партнерами
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, i) => (
              <div key={i} className="card-modern hover-lift animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl animate-float">{value.icon}</div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3 text-[#C8BF2F]">{value.title}</h3>
                    <p className="text-white/70 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12 center-to-text">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 gradient-text">
              Наша команда
            </h2>
            <p className="text-white/70 text-lg max-w-3xl mx-auto">
              Профессионалы с многолетним опытом в автобизнесе, которые помогут вам найти идеальный автомобиль
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="text-center animate-fade-in-up center-to-text" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-[#C8BF2F]/20 hover:ring-[#C8BF2F]/40 transition-all duration-300 hover:scale-105" style={{margin: '12px 0'}}>
                  <Image src={member.image} alt={member.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-[#C8BF2F] text-sm mb-2 font-medium">{member.position}</p>
                <p className="text-white/60 text-xs">{member.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16 bg-[#111] border-y border-[#2a2a2a]">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              История компании
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#C8BF2F] mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2019 — Начало пути</h3>
                  <p className="text-white/70">
                    AutoShop был основан с простой идеей — сделать покупку автомобилей прозрачной и удобной. 
                    Начинали с небольшой команды и нескольких десятков объявлений.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#C8BF2F] mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2020 — Первые 1000 сделок</h3>
                  <p className="text-white/70">
                    За первый год работы мы помогли совершить более 1000 успешных сделок. 
                    Наша репутация честного и надежного партнера начала расти.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#C8BF2F] mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2022 — Лидер рынка</h3>
                  <p className="text-white/70">
                    Стали крупнейшей платформой по продаже автомобилей в Казахстане. 
                    Запустили мобильное приложение и расширили команду до 50+ специалистов.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-4 h-4 rounded-full bg-[#C8BF2F] mt-2"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">2024 — Будущее</h3>
                  <p className="text-white/70">
                    Продолжаем развиваться и внедрять новые технологии. 
                    Наша цель — стать лучшей автомобильной платформой в Центральной Азии.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-page text-center center-to-text">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Присоединяйтесь к AutoShop

          </h2>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Станьте частью нашего сообщества автолюбителей. Найдите свой идеальный автомобиль или продайте свой с максимальной выгодой.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="btn-primary text-lg px-8 py-4">
              Найти автомобиль
            </Link>
            <Link href="/sell" className="btn-secondary text-lg px-8 py-4">
              Продать автомобиль
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}


