"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCarousel from "./HeroCarousel";

type CarData = {
  title: string;
  description: string;
  mileage: string;
  speed: string;
  year: string;
};

export default function HeroSection() {
  const router = useRouter();
  const [currentCar, setCurrentCar] = useState<CarData>({
    title: "BMW M4",
    description: "Каждое нажатие на педаль газа — это всплеск адреналина. Чистый драйверский автомобиль, сочетающий точность управления и повседневный комфорт.",
    mileage: "480",
    speed: "250",
    year: "2024"
  });

  const handleCarChange = (car: CarData) => {
    setCurrentCar(car);
  };
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [openBrand, setOpenBrand] = useState(false);
  const [openYear, setOpenYear] = useState(false);
  const brandRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (brandRef.current && !brandRef.current.contains(e.target as Node)) setOpenBrand(false);
      if (yearRef.current && !yearRef.current.contains(e.target as Node)) setOpenYear(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const onFind = () => {
    const params = new URLSearchParams();
    if (brand.trim()) params.set("brand", brand.trim());
    if (model.trim()) params.set("model", model.trim());
    if (year.trim()) { params.set("minYear", year.trim()); params.set("maxYear", year.trim()); }
    if (maxPrice.trim()) params.set("maxPrice", maxPrice.trim());
    const qs = params.toString();
    router.push(qs ? `/catalog?${qs}` : "/catalog");
  };
  return (
    <section className="relative pb-6 md:pb-10 pt-6 md:pt-8">
      {/* Filters */}
      <div className="container-page">
        <div className="hero-filters">
          {/* Brand dropdown */}
          <div ref={brandRef} className={`hero-dd hero-dd-brand ${openBrand ? 'open' : ''}`} onClick={() => setOpenBrand(!openBrand)}>
            <span className="hero-dd-label">{brand || 'Марка'}</span>
            <svg className="hero-dd-arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5l5-5z"/></svg>
            {openBrand && (
              <div className="hero-dd-menu">
                <div className="hero-dd-list">
                  {['BMW','HYUNDAI','PORSCHE','TOYOTA','LEXUS','AUDI','MERCEDES-BENZ'].map((b) => (
                    <div key={b} className={`hero-dd-item ${brand===b ? 'active' : ''}`} onClick={() => { setBrand(b); setOpenBrand(false); }}>
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="hero-filter hero-filter-model">
            <input className="hero-input" placeholder="Модель" value={model} onChange={(e) => setModel(e.target.value)} />
          </div>
          {/* Year dropdown */}
          <div ref={yearRef} className={`hero-dd hero-dd-year ${openYear ? 'open' : ''}`} onClick={() => setOpenYear(!openYear)}>
            <span className="hero-dd-label">{year || 'Год'}</span>
            <svg className="hero-dd-arrow" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5l5-5z"/></svg>
            {openYear && (
              <div className="hero-dd-menu">
                <div className="hero-dd-list">
                  {[2025,2024,2023,2022,2021].map((y) => (
                    <div key={y} className={`hero-dd-item ${String(y)===year ? 'active' : ''}`} onClick={() => { setYear(String(y)); setOpenYear(false); }}>
                      {y}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="hero-filter hero-filter-price">
            <input className="hero-input" placeholder="Цена до" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
          <button className="hero-find" onClick={onFind}>Найти</button>
        </div>
      </div>

      {/* Background caption */}
      <div className="absolute inset-0 -z-10 select-none flex items-center justify-center md:justify-start">
        <div className="container-page pointer-events-none">
          <div className="text-[18vw] leading-none font-black tracking-tight text-white/10">The M4</div>
        </div>
      </div>

      {/* Car + ellipse */}
      <div className="container-page mt-4 md:mt-6">
        <div className="relative max-w-[1200px] mx-auto">
          <HeroCarousel onCarChange={handleCarChange} />
          {/* Ellipse outline under car */}
          <svg className="absolute -bottom-4 md:-bottom-6 left-1/2 -translate-x-1/2 w-[105%] h-[140px] md:h-[180px]" viewBox="0 0 1000 180" fill="none">
            <ellipse cx="500" cy="90" rx="470" ry="70" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Bottom panel */}
      <div className="container-page mt-4 md:mt-8">
        <div className="relative hero-bottom">
          {/* Accent line */}
          <div className="hero-accent-line absolute left-0 top-4 bottom-4 w-[2px] bg-[#C8BF2F] rounded-r" />
          
          {/* Content grid */}
          <div className="pl-4 md:pl-6 grid gap-4 md:gap-6">
            {/* Header row: Title + Button */}
            <div className="hero-header-row">
              <div className="flex-1">
                <h3 className="hero-title text-xl md:text-2xl font-bold tracking-tight mb-2 md:mb-3">{currentCar.title}</h3>
                <p className="hero-desc">
                  {currentCar.description}
                </p>
              </div>
              <a 
                href="/catalog" 
                className="hero-btn"
              >
                Посмотреть
              </a>
            </div>

            {/* Metrics row */}
            <div className="metrics-grid grid grid-cols-3 gap-4 md:gap-6 pt-4 border-t border-[#2a2a2a]">
              <Metric value={currentCar.mileage} label="ПРОБЕГ" />
              <Metric value={currentCar.speed} label="КМ/Ч" />
              <Metric value={currentCar.year} label="ГОД" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="metric-item flex flex-col items-start gap-2">
      <div className="metric-icon-row flex items-center gap-2 mb-1">
        <GearIcon className="metric-icon w-4 h-4 md:w-5 md:h-5 text-white/50" />
        <div className="metric-icon-divider h-[1px] w-8 md:w-12 bg-[#C8BF2F]/40" />
      </div>
      <div className="metric-text flex flex-col gap-1">
        <span className="metric-value text-2xl md:text-3xl leading-none font-bold tracking-tight">{value}</span>
        <span className="metric-label text-[10px] md:text-xs leading-none text-white/60 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}

function GearIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/>
      <path d="M19.4 15.3l1.2 2.1-1.8 1.8-2.1-1.2a7.7 7.7 0 01-2.2.9l-.4 2.4h-2.5l-.4-2.4a7.7 7.7 0 01-2.2-.9l-2.1 1.2-1.8-1.8 1.2-2.1c-.4-.7-.7-1.4-.9-2.2l-2.4-.4v-2.5l2.4-.4c.2-.8.5-1.5.9-2.2L3.8 6.6 5.6 4.8l2.1 1.2c.7-.4 1.4-.7 2.2-.9l.4-2.4h2.5l.4 2.4c.8.2 1.5.5 2.2.9l2.1-1.2 1.8 1.8-1.2 2.1c.4.7.7 1.4.9 2.2l2.4.4v2.5l-2.4.4c-.2.8-.5 1.5-.9 2.2z" opacity=".5"/>
    </svg>
  );
}


