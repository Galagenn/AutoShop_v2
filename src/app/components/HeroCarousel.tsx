"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type CarouselItem = {
  src: string;
  alt: string;
  title: string;
  description: string;
  mileage: string;
  speed: string;
  year: string;
};

interface HeroCarouselProps {
  onCarChange?: (car: CarouselItem) => void;
}

export default function HeroCarousel({ onCarChange }: HeroCarouselProps = {}) {
  const items: CarouselItem[] = useMemo(
    () => [
      { 
        src: "/bmw-m-series-m4-coupe-modelfinder 1.png", 
        alt: "BMW M4",
        title: "BMW M4",
        description: "Каждое нажатие на педаль газа — это всплеск адреналина. Чистый драйверский автомобиль, сочетающий точность управления и повседневный комфорт.",
        mileage: "480",
        speed: "250",
        year: "2024"
      },
      { 
        src: "/bmw-7-series-i7-m70-modelfinder.png", 
        alt: "BMW i7",
        title: "BMW i7",
        description: "Электрический флагман будущего. Мощность, элегантность и инновации в одном автомобиле для тех, кто ценит технологии и комфорт.",
        mileage: "5",
        speed: "250",
        year: "2024"
      },
      { 
        src: "/8649912b8d36474fc02a585eacc2be57863fd1ea.png", 
        alt: "Hyundai Elantra",
        title: "HYUNDAI ELANTRA",
        description: "Надежность и практичность в современном дизайне. Идеальный выбор для городских поездок и дальних путешествий с комфортом.",
        mileage: "45",
        speed: "190",
        year: "2022"
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  // Autoswitch is intentionally disabled for better UX on mobile.

  const go = (dir: -1 | 1) => {
    const newIndex = (index + dir + items.length) % items.length;
    setIndex(newIndex);
    if (onCarChange) {
      onCarChange(items[newIndex]);
    }
  };

  useEffect(() => {
    if (onCarChange) {
      onCarChange(items[index]);
    }
  }, [index, items, onCarChange]);

  return (
    <div className="relative">
      <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[16/9] w-full overflow-hidden rounded-xl">
        {items.map((item, i) => (
          <div
            key={item.src}
            className={`absolute inset-0 transition-opacity duration-500 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-contain"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[85%] h-12 sm:h-16 md:h-20 rounded-[999px] bg-white/5 blur-2xl -z-10" />
      </div>
      <div className="absolute right-3 sm:right-4 md:right-6 bottom-3 sm:bottom-4 flex items-center gap-1 sm:gap-2">
        <button
          aria-label="Previous"
          onClick={() => go(-1)}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white text-black grid place-items-center hover:bg-gray-100 transition-colors z-10 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="sm:w-4 sm:h-4">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        <button
          aria-label="Next"
          onClick={() => go(1)}
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-white text-black grid place-items-center hover:bg-gray-100 transition-colors z-10 cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="sm:w-4 sm:h-4">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </button>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-3 sm:bottom-4 flex items-center gap-1.5 sm:gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              setIndex(i);
              if (onCarChange) {
                onCarChange(items[i]);
              }
            }}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border border-white/40 transition-colors ${
              i === index ? "bg-white" : "bg-transparent"
            }`}
          />
        ))}
      </div>
    </div>
  );
}


