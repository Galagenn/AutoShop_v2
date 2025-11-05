"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton({ className = "btn-ghost" }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className={className}
    >
      Выйти
    </button>
  );
}



