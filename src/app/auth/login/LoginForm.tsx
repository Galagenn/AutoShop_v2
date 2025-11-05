"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.email || !formData.password) {
        setError("Пожалуйста, заполните все поля");
        return;
      }
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (res?.error) {
        setError("Неверный email или пароль");
        return;
      }
      // After successful sign-in, go to dashboard; buyer by default
      router.push("/dashboard/buyer");
    } catch (err) {
      setError("Ошибка входа. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {error && (
        <div className="error-enhanced">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div>
          <label htmlFor="email" className="form-label">
            Email адрес
          </label>
          <div className="input-with-icon">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-modern w-full"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="pt-2">
          <label htmlFor="password" className="form-label">
            Пароль
          </label>
          <div className="input-with-icon">

            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="input-modern w-full pl-11 pr-11"
              placeholder="Введите пароль"
              disabled={isLoading}
            />
            <button type="button" className="input-action" aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'} onClick={() => setShowPassword(v=>!v)}>
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A10.74 10.74 0 0112 5c7 0 10 7 10 7a18.5 18.5 0 01-5.06 5.94M6.53 6.53C3.9 8.33 2 12 2 12s3 7 10 7c1.27 0 2.46-.2 3.56-.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 110-8 4 4 0 010 8Z" fill="currentColor"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        <label className="checkbox-row compact">
          <input
            name="remember"
            type="checkbox"
            checked={formData.remember}
            onChange={handleChange}
            className="checkbox-enhanced"
            disabled={isLoading}
          />
          <span className="checkbox-label">Запомнить меня</span>
        </label>

      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary-enhanced"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
            Вход...
          </>
        ) : (
          "Войти в аккаунт"
        )}
      </button>

      


    </form>
  );
}
