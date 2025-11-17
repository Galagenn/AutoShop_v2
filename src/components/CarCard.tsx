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
  isOwner?: boolean;
};

import FavoriteButton from "./FavoriteButton";

export default function CarCard({ car, userRole }: { car: Car; userRole?: string }) {
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
    atyrau: 'Атырау',
    aktau: 'Актау',
    akkol: 'Акколь',
    aksay: 'Аксай',
    aksu: 'Аксу',
    arkalyk: 'Аркалык',
    arys: 'Арыс',
    ayagoz: 'Аягоз',
    balhash: 'Балхаш',
    zhanaozhen: 'Жанаозен',
    zhezkazgan: 'Жезказган',
    zaysan: 'Зайсан',
    zhanatas: 'Жанатас',
    zharkent: 'Жаркент',
    zhetybay: 'Жетыбай',
    zhitikara: 'Житикара',
    kandyagash: 'Кандыагаш',
    kapshagay: 'Капшагай',
    karaganda: 'Караганда',
    karazhal: 'Каражал',
    karatau: 'Каратау',
    karkaralinsk: 'Каркаралинск',
    kaspiysk: 'Каспийск',
    kentau: 'Кентау',
    kokchetav: 'Кокшетау',
    kostanay: 'Костанай',
    kulsary: 'Кульсары',
    kyzylorda: 'Кызылорда',
    leninogorsk: 'Лениногорск',
    lisakovsk: 'Лисаковск',
    makinsk: 'Макинск',
    mamlyutka: 'Мамлютка',
    pavlodar: 'Павлодар',
    petropavl: 'Петропавловск',
    priozersk: 'Приозерск',
    ridder: 'Риддер',
    rudnyy: 'Рудный',
    saran: 'Саран',
    saryagash: 'Сарыагаш',
    satpayev: 'Сатпаев',
    semey: 'Семей',
    sergeevka: 'Сергеевка',
    serebryansk: 'Серебрянск',
    shakhtinsk: 'Шахтинск',
    shchuchinsk: 'Щучинск',
    shardara: 'Шардара',
    stepnogorsk: 'Степногорск',
    stepnyak: 'Степняк',
    taldikorgan: 'Талдыкорган',
    taraz: 'Тараз',
    temirtau: 'Темиртау',
    tobol: 'Тобол',
    turkestan: 'Туркестан',
    uchalinsk: 'Учалинск',
    uralsk: 'Уральск',
    'ust-kamenogorsk': 'Усть-Каменогорск',
    esil: 'Есиль',
    ekibastuz: 'Экибастуз',
    emba: 'Эмба',
    shalqar: 'Шалкар',
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
            <FavoriteButton variant="icon" carId={car.id} initialFavorite={!!car.isFavorited} isOwner={!!car.isOwner} userRole={userRole} />
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


