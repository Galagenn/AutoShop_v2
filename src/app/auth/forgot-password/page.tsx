import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Восстановление пароля — AutoShop",
  description: "Восстановите доступ к своему аккаунту AutoShop. Введите email для получения инструкций по сбросу пароля.",
  keywords: "восстановление пароля, сброс пароля, AutoShop, забыли пароль",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative isolate py-10 lg:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_0%,#1a1a1a_0%,transparent_60%),radial-gradient(60%_60%_at_100%_100%,#0f0f0f_0%,transparent_60%)]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C8BF2F]/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#C8BF2F]/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-auto px-6 min-h-[70vh] flex items-center">
        <div className="w-full">
          <div className="text-left mb-8">
            <h1 className="text-3xl font-extrabold mb-2">Забыли пароль?</h1>
            <p className="text-white/70">Введите email для восстановления доступа</p>
          </div>

          {/* Forgot Password Form */}
          <div className="glass rounded-2xl p-12 animate-fade-in-up shadow-xl shadow-black/30 space-y-10">
            <ForgotPasswordForm />
          </div>

          {/* Footer Links */}
          <div className="text-center mt-10 space-y-4">
            <p className="text-white/60 text-sm">
              Вспомнили пароль?{' '}
              <Link href="/auth/login" className="text-[#C8BF2F] hover:text-[#B3AA2C] font-medium transition-colors">
                Войти
              </Link>
            </p>
            <div className="flex justify-center space-x-4 text-sm">
              <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
                Политика конфиденциальности
              </Link>
              <span className="text-white/30">•</span>
              <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
                Поддержка
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
