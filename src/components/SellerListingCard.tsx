"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "../app/dashboard/seller/page.module.css";

type Car = {
  id: string;
  brand: string;
  model: string;
  price: number;
  status?: string;
  images?: string[];
};

export default function SellerListingCard({ car }: { car: Car }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Удалить объявление "${car.brand} ${car.model}"?`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/cars/${car.id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Ошибка при удалении");
      }
    } catch {
      alert("Ошибка при удалении");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.listingCard}>
      <div className={styles.listingImage}>
        <img 
          src={(car.images && car.images[0]) ? car.images[0] : '/file.svg'} 
          alt={`${car.brand} ${car.model}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/file.svg';
          }}
        />
      </div>
      <div className={styles.listingContent}>
        <div className={styles.listingHeader}>
          <h3 className={styles.listingTitle}>{car.brand} {car.model}</h3>
          <span className={`${styles.statusBadge} ${car.status === 'Активно' || !car.status ? styles.active : styles.sold}`}>
            {car.status || 'Активно'}
          </span>
        </div>
        <div className={styles.listingPrice}>{car.price.toLocaleString()} ₸</div>
        <div className={styles.listingActions}>
          <Link href={`/sell/edit/${car.id}`} className={styles.btnGhost}>Редактировать</Link>
          <Link href={`/car/${car.id}`} className={styles.btnGhost}>Посмотреть</Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`${styles.btnGhost} ${styles.btnDelete}`}
          >
            {isDeleting ? "Удаление..." : "Удалить"}
          </button>
        </div>
      </div>
    </div>
  );
}

