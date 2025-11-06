"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type Car = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  price: string;
  city?: string;
  year?: number;
  mileageKm?: number;
  transmission?: string;
  drive?: string;
  engine?: string;
  isFavorited?: boolean;
};

import FavoriteButton from "./FavoriteButton";

export default function CarCard({ car }: { car: Car }) {
  const router = useRouter();
  const numericPrice = Number(String(car.price).replace(/[^0-9]/g, ""));
  const monthly = Number.isFinite(numericPrice) && numericPrice > 0
    ? Math.round(numericPrice / 36).toLocaleString()
    : undefined;
  const capitalizeFirst = (s: string | null | undefined) => {
    if (!s) return s as any;
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const cityMap: Record<string, string> = {
    almaty: 'Алматы',
    astana: 'Астана',
    shymkent: 'Шымкент',
    aktobe: 'Актобе',
    karaganda: 'Караганда',
    taraz: 'Тараз',
    pavlodar: 'Павлодар',
    semey: 'Семей',
    uralsk: 'Уральск',
    kostanay: 'Костанай',
    kyzylorda: 'Кызылорда',
    petropavl: 'Петропавловск',
    atyrau: 'Атырау',
    aktau: 'Актау',
  };
  const formatCity = (value?: string) => {
    if (!value) return undefined;
    const key = String(value).toLowerCase();
    return cityMap[key] || capitalizeFirst(value);
  };
  return (
    <div
      className="list-card hover-lift group cursor-pointer"
      aria-label={`${car.title}`}
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/car/${car.id}`)}
      onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/car/${car.id}`); }}
    > 
      <div className="list-thumb">
        <Image src={car.image} alt={car.title} fill className="object-cover" />
        <div className="absolute top-2 right-2 z-10">
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton variant="icon" carId={car.id} initialFavorite={!!car.isFavorited} />
          </div>
        </div>
      </div>
      <div className="list-row">
        <div className="list-content">
          <h3 className="list-title">{car.title}</h3>
          {car.subtitle && <div className="list-sub">{car.subtitle}</div>}
          {(car.engine || car.transmission || car.drive) && (
            <div className="spec-line">
              {car.engine && <span>{car.engine}</span>}
              {car.transmission && <span> • {car.transmission}</span>}
              {car.drive && <span> • {car.drive}</span>}
            </div>
          )}
          <div className="list-meta">
            {formatCity(car.city) && <span>{formatCity(car.city)}</span>}
            {typeof car.year === 'number' && <span>{car.year}</span>}
            {typeof car.mileageKm === 'number' && <span>{car.mileageKm.toLocaleString()} км</span>}
          </div>
        </div>
        <div className="list-right">
          <div className="price-lg">{car.price}</div>
          {monthly && <div className="pill pill-accent">{monthly} ₸/мес</div>}
        </div>
      </div>
    </div>
  );
}


