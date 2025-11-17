"use client";
import { useState, useTransition, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  carId: string;
  initialFavorite?: boolean;
  variant?: "button" | "icon";
  className?: string;
  isOwner?: boolean;
  userRole?: string;
};

export default function FavoriteButton({ carId, initialFavorite = false, variant = "button", className, isOwner = false, userRole }: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Скрываем кнопку для продавцов
  if (userRole === "SELLER") {
    return null;
  }
  
  if (isOwner) {
    if (variant === "icon") {
      return null;
    }
    return (
      <span className={`btn-ghost text-white/60 cursor-not-allowed ${className || ""}`}>
        Это ваше объявление
      </span>
    );
  }
  const [isFavorite, setIsFavorite] = useState(!!initialFavorite);
  const [isPending, startTransition] = useTransition();

  const toggleFavorite = (e?: MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Если пользователь не авторизован, перенаправляем на регистрацию
    if (!session) {
      router.push("/auth/register");
      return;
    }
    
    startTransition(async () => {
      try {
        if (!isFavorite) {
          const res = await fetch("/api/favorites", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId }) });
          if (!res.ok) throw new Error("Failed to favorite");
          setIsFavorite(true);
        } else {
          const res = await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ carId }) });
          if (!res.ok) throw new Error("Failed to unfavorite");
          setIsFavorite(false);
        }
      } catch {
        // keep previous UI state on error
      }
    });
  };

  if (variant === "icon") {
    return (
      <button
        aria-label={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
        onClick={toggleFavorite}
        disabled={isPending}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border backdrop-blur bg-black/60 border-white/15 text-white hover:bg-black/70 transition ${isFavorite ? "text-[#C8BF2F] border-[#C8BF2F]/40" : ""} ${className || ""}`}
      >
        {/* Heart icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61c-1.54-1.34-3.97-1.34-5.5 0L12 7.17 8.66 4.61c-1.54-1.34-3.97-1.34-5.5 0-1.82 1.58-1.89 4.34-.16 6l2.53 2.4L12 21l6.47-7.99 2.53-2.4c1.73-1.66 1.66-4.42-.16-6z" />
        </svg>
      </button>
    );
  }

  return (
    <button onClick={toggleFavorite} disabled={isPending} className={`btn-ghost ${isFavorite ? "text-[#C8BF2F] border-[#C8BF2F]/30" : ""} ${className || ""}`}>
      {isFavorite ? "В избранном" : "Добавить в избранное"}
    </button>
  );
}



