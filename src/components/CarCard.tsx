import Image from "next/image";
import Link from "next/link";

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
  const numericPrice = Number(String(car.price).replace(/[^0-9]/g, ""));
  const monthly = Number.isFinite(numericPrice) && numericPrice > 0
    ? Math.round(numericPrice / 36).toLocaleString()
    : undefined;
  return (
    <div className="list-card hover-lift group cursor-pointer" aria-label={`${car.title}`}> 
      <div className="list-thumb">
        <Image src={car.image} alt={car.title} fill className="object-cover" />
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton variant="icon" carId={car.id} initialFavorite={!!car.isFavorited} />
        </div>
        <Link href={`/car/${car.id}`} className="absolute inset-0" aria-label={car.title} />
      </div>
      <div className="list-row">
        <div className="list-content">
          <h3 className="list-title"><Link href={`/car/${car.id}`}>{car.title}</Link></h3>
          {car.subtitle && <div className="list-sub">{car.subtitle}</div>}
          {(car.engine || car.transmission || car.drive) && (
            <div className="spec-line">
              {car.engine && <span>{car.engine}</span>}
              {car.transmission && <span> • {car.transmission}</span>}
              {car.drive && <span> • {car.drive}</span>}
            </div>
          )}
          <div className="list-meta">
            {car.city && <span>{car.city}</span>}
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


