"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, accept any email
      if (email) {
        setIsSubmitted(true);
      } else {
        setError("Пожалуйста, введите email адрес");
      }
    } catch (err) {
      setError("Ошибка отправки. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-[#C8BF2F] rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2">Письмо отправлено!</h3>
          <p className="text-white/70 text-sm">
            Мы отправили инструкции по восстановлению пароля на адрес{' '}
            <span className="text-[#C8BF2F] font-medium">{email}</span>
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-white/60 text-xs">
            Не получили письмо? Проверьте папку &quot;Спам&quot; или попробуйте ещё раз
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail("");
            }}
            className="btn-secondary w-full"
          >
            Отправить еще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm animate-fade-in-up">
          {error}
        </div>
      )}

      <div className="pt-2">
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email адрес
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-modern w-full"
          placeholder="your@email.com"
          disabled={isLoading}
        />
        <p className="text-white/60 text-xs mt-2">
          Мы отправим ссылку для восстановления пароля на этот адрес
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            Отправка...
          </>
        ) : (
          "Отправить инструкции"
        )}
      </button>

      <div className="text-center pt-4">
        <Link 
          href="/auth/login" 
          className="text-sm text-[#C8BF2F] hover:text-[#B3AA2C] transition-colors"
        >
          ← Вернуться к входу
        </Link>
      </div>
    </form>
  );
}
