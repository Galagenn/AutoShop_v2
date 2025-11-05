"use client";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  id: string;
  title: string;
  image?: string;
  price: string;
  status?: string;
  onEditHref?: string;
  onViewHref?: string;
  onDelete?: () => void;
  compact?: boolean;
};

export default function ListingCard({ id, title, image = "/next.svg", price, status, onEditHref, onViewHref, onDelete, compact }: Props) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} className="group overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#0f0f0f]">
      <div className={compact ? "aspect-[1/1] sm:aspect-[4/3] overflow-hidden" : "aspect-[16/9] overflow-hidden"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
      </div>
      <div className={compact ? "p-2.5 sm:p-3 space-y-1 sm:space-y-1.5" : "p-5 space-y-2"}>
        <div className="flex items-center justify-between gap-3">
          <h3 className={compact ? "text-xs sm:text-sm font-semibold truncate" : "text-lg font-semibold truncate"}>{title}</h3>
          {status && <span className="text-xs rounded-full border border-[#2a2a2a] px-2 py-0.5 text-white/70">{status}</span>}
        </div>
        <div className={compact ? "text-[#C8BF2F] font-extrabold text-sm sm:text-base" : "text-[#C8BF2F] font-extrabold text-xl"}>{price}</div>
        <div className={compact ? "flex flex-wrap gap-1 pt-1" : "flex flex-wrap gap-2 pt-2"}>
          {onEditHref && <Link href={onEditHref} className="btn-ghost">Редактировать</Link>}
          {onViewHref && <Link href={onViewHref} className="btn-ghost">Посмотреть</Link>}
          {onDelete && <button onClick={onDelete} className="btn-secondary">Удалить</button>}
        </div>
      </div>
    </motion.div>
  );
}


