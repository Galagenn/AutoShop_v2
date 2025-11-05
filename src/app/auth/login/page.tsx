import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Вход в аккаунт — AutoShop | Авторизация",
  description: "Войдите в свой аккаунт AutoShop для доступа к персональным функциям, избранным автомобилям и управлению объявлениями.",
  keywords: "вход, авторизация, аккаунт, AutoShop, личный кабинет",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="relative isolate">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_0%,#1a1a1a_0%,transparent_60%),radial-gradient(60%_60%_at_100%_100%,#0f0f0f_0%,transparent_60%)]" />
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#C8BF2F]/10 blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-[#C8BF2F]/10 blur-3xl" />

        <div className="relative container-page min-h-screen flex items-center justify-center py-24">
          <div className="max-w-md w-full mx-auto">
            <div className="text-center mb-8">
              <h2 className="form-title">Вход в аккаунт</h2>
              <p className="form-subtitle">Рады вас видеть снова</p>
            </div>

            <div className="form-container">
              <LoginForm />

              <div className="text-center space-y-4">
                <p className="text-white/60 text-sm">
                  Нет аккаунта?{' '}
                  <Link href="/auth/register" className="text-[#C8BF2F] hover:text-[#B3AA2C] font-medium transition-colors">
                    Зарегистрироваться
                  </Link>
                </p>
                <div className="text-xs text-white/40">Нажимая «Войти», вы соглашаетесь с политикой конфиденциальности</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
