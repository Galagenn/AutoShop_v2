import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "../../components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Контакты AutoShop — Свяжитесь с нами | Телефон, адрес, форма обратной связи",
  description: "Свяжитесь с AutoShop: телефон +7 (700) 000-00-00, адрес в Астане, email. Форма обратной связи, карта проезда, режим работы.",
  keywords: "контакты AutoShop, телефон, адрес, Астана, обратная связь, поддержка",
};

const contactMethods = [
  {
    title: "Телефон",
    value: "+7 (700) 000-00-00",
    description: "Звонки принимаются круглосуточно",
    icon: "📞",
    action: "tel:+77000000000"
  },
  {
    title: "WhatsApp",
    value: "+7 (700) 000-00-00",
    description: "Быстрые ответы в мессенджере",
    icon: "💬",
    action: "https://wa.me/77000000000"
  },
  {
    title: "Email",
    value: "hello@autoshop.kz",
    description: "Ответим в течение 2 часов",
    icon: "✉️",
    action: "mailto:hello@autoshop.kz"
  },
  {
    title: "Telegram",
    value: "@autoshop_kz",
    description: "Поддержка в Telegram",
    icon: "📱",
    action: "https://t.me/autoshop_kz"
  }
];

const offices = [
  {
    city: "Астана",
    address: "пр. Мира, 10, офис 205",
    phone: "+7 (700) 000-00-00",
    hours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
    image: "/Frame 1321314524.png"
  },
  {
    city: "Алматы",
    address: "ул. Абая, 150, ТЦ Мега",
    phone: "+7 (727) 000-00-00",
    hours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
    image: "/Sportsmanship Mode.png"
  }
];

const faq = [
  {
    question: "Как быстро вы отвечаете на заявки?",
    answer: "Мы отвечаем на все заявки в течение 2 часов в рабочее время и в течение 4 часов в выходные дни."
  },
  {
    question: "Можно ли приехать в офис без записи?",
    answer: "Да, вы можете приехать в любой из наших офисов в рабочее время. Но для экономии времени рекомендуем предварительно записаться."
  },
  {
    question: "Предоставляете ли вы консультации по телефону?",
    answer: "Конечно! Наши специалисты готовы проконсультировать вас по любым вопросам, связанным с покупкой или продажей автомобилей."
  },
  {
    question: "Есть ли у вас выездная оценка автомобилей?",
    answer: "Да, мы предоставляем услугу выездной оценки автомобилей в Астане и Алматы. Стоимость услуги уточняйте у менеджера."
  }
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        
        <div className="container-page relative">
          <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
          
          <div className="text-center mb-12 center-to-text">
            <h1 className="text-4xl md:text-7xl font-extrabold mb-6">
              Контакты
            </h1>
            <p className="text-white/70 text-lg md:text-xl max-w-3xl mx-auto text-center">
              Свяжитесь с нами любым удобным способом. Мы всегда готовы помочь вам найти идеальный автомобиль или продать ваш.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Способы связи
            </h2>
            <p className="text-white/70 text-lg">
              Выберите наиболее удобный для вас способ связи
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactMethods.map((method, i) => (
              <div key={i} className="card text-center hover:border-[#C8BF2F] transition-colors">
                <div className="text-4xl mb-4">{method.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{method.title}</h3>
                <a 
                  href={method.action}
                  className="text-[#C8BF2F] font-semibold mb-2 block hover:text-[#B3AA2C] transition-colors"
                >
                  {method.value}
                </a>
                <p className="text-white/60 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-[#111] border-y border-[#2a2a2a]">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
                Напишите нам
              </h2>
              <p className="text-white/70 mb-8">
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </p>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя *</label>
                    <input 
                      required
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#2a2a2a] focus:border-[#C8BF2F] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон *</label>
                    <input 
                      required
                      type="tel"
                      placeholder="+7 (700) 000-00-00"
                      className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#2a2a2a] focus:border-[#C8BF2F] focus:outline-none"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#2a2a2a] focus:border-[#C8BF2F] focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Тема обращения</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#2a2a2a] focus:border-[#C8BF2F] focus:outline-none">
                    <option>Покупка автомобиля</option>
                    <option>Продажа автомобиля</option>
                    <option>Техническая поддержка</option>
                    <option>Партнерство</option>
                    <option>Другое</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение *</label>
                  <textarea 
                    required
                    placeholder="Опишите ваш вопрос или пожелание..."
                    className="w-full px-4 py-3 rounded-lg bg-transparent border border-[#2a2a2a] focus:border-[#C8BF2F] focus:outline-none min-h-[120px] resize-none"
                  />
                </div>
                
                <button type="submit" className="btn-primary w-full text-lg py-4">
                  Отправить сообщение
                </button>
              </form>
            </div>

            {/* Map & Office Info */}
            <div className="space-y-6">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#0a0a0a] border border-[#2a2a2a] flex items-center justify-center">
                <button className="px-6 py-3 bg-[#C8BF2F] text-black font-semibold rounded-lg hover:bg-[#B3AA2C] transition-colors">
                  Открыть карту
                </button>
              </div>
              
        <div className="card">
                <h3 className="text-xl font-semibold mb-4">Главный офис в Астане</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C8BF2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>пр. Мира, 10, офис 205</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C8BF2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+7 (700) 000-00-00</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C8BF2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-16">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Наши офисы
            </h2>
            <p className="text-white/70 text-lg">
              Приезжайте к нам в офис для личной консультации
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {offices.map((office, i) => (
              <div key={i} className="card">
                <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden mb-6">
                  <Image src={office.image} alt={`Офис в ${office.city}`} fill className="object-cover" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Офис в {office.city}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C8BF2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#C8BF2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{office.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-[#d6ff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#111] border-y border-[#2a2a2a]">
        <div className="container-page center-to-text">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Часто задаваемые вопросы
            </h2>
            <p className="text-white/70 text-lg">
              Ответы на популярные вопросы о нашей работе
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faq.map((item, i) => (
              <div key={i} className="card">
                <h3 className="text-lg font-semibold mb-3">{item.question}</h3>
                <p className="text-white/70">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
              Готовы начать?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto text-center">
              Свяжитесь с нами прямо сейчас, и мы поможем вам найти идеальный автомобиль или продать ваш
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/catalog" className="btn-primary text-lg px-8 py-4">
                Посмотреть каталог
              </Link>
              <Link href="/sell" className="btn-secondary text-lg px-8 py-4">
                Продать автомобиль
              </Link>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}


