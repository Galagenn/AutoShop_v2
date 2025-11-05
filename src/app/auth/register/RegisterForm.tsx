"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    role: "BUYER" as "BUYER" | "SELLER"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Необходимо согласиться с условиями использования");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`.trim() || null,
          role: formData.role,
        })
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Ошибка регистрации')
        setIsLoading(false)
        return
      }
      const { user } = await res.json()
      // auto sign-in after successful registration so session is set
      await signIn('credentials', { email: formData.email, password: formData.password, redirect: false })
      if (user?.role === 'SELLER') {
        router.push('/dashboard/seller')
      } else {
        router.push('/dashboard/buyer')
      }
    } catch (err) {
      setError("Ошибка регистрации. Попробуйте еще раз.");
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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="form-label">
            Имя *
          </label>
          <div className="input-with-icon">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="input-modern w-full"
              placeholder="Иван"
              disabled={isLoading}
            />
          </div>
        </div>
        <div>
          <label htmlFor="lastName" className="form-label">
            Фамилия *
          </label>
          <div className="input-with-icon">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="input-modern w-full"
              placeholder="Иванов"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <label htmlFor="role" className="form-label">
          Роль
        </label>
        <div className="segmented">
          <button type="button" className={`segmented-item ${formData.role==='BUYER' ? 'active' : ''}`} onClick={() => setFormData(prev=>({...prev, role:'BUYER'}))}>
            <span className="mr-2 inline-flex" aria-hidden>
              {/* Buyer: shopping cart logo */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M7 6H3V4h4l1 2Zm0 0l2.4 8.4A2 2 0 0 0 11.32 16H18a2 2 0 0 0 1.94-1.52L22 8H7Z" fill="currentColor"/>
                <circle cx="10" cy="20" r="1.8" fill="currentColor"/>
                <circle cx="18" cy="20" r="1.8" fill="currentColor"/>
              </svg>
            </span>
            Покупатель
          </button>
          <button type="button" className={`segmented-item ${formData.role==='SELLER' ? 'active' : ''}`} onClick={() => setFormData(prev=>({...prev, role:'SELLER'}))}>
            <span className="mr-2 inline-flex" aria-hidden>
              {/* Seller: storefront logo */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 4h16l1 4H3l1-4Z" fill="currentColor"/>
                <path d="M4 10h16v8H4v-8Z" fill="currentColor"/>
                <path d="M8 10v8M16 10v8" stroke="#0a0a0a" strokeWidth="1.5"/>
              </svg>
            </span>
            Продавец
          </button>
        </div>
      </div>

      <div className="pt-2">
        <label htmlFor="email" className="form-label">
          Email адрес *
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

      <div className="pt-3">
        <label htmlFor="phone" className="form-label">
          Номер телефона
        </label>
        <div className="input-with-icon">
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="input-modern w-full"
            placeholder="+7 (700) 000-00-00"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="pt-1">
        <label htmlFor="password" className="form-label">
          Пароль *
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
            placeholder="Минимум 6 символов"
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

      <div className="pt-1">
        <label htmlFor="confirmPassword" className="form-label">
          Подтвердите пароль *
        </label>
        <div className="input-with-icon">

          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="input-modern w-full pl-11 pr-11"
            placeholder="Повторите пароль"
            disabled={isLoading}
          />
          <button type="button" className="input-action" aria-label={showConfirm ? 'Скрыть пароль' : 'Показать пароль'} onClick={() => setShowConfirm(v=>!v)}>
            {showConfirm ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3l18 18M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42M9.88 5.09A10.74 10.74 0 0112 5c7 0 10 7 10 7a18.5 18.5 0 01-5.06 5.94M6.53 6.53C3.9 8.33 2 12 2 12s3 7 10 7c1.27 0 2.46-.2 3.56-.56" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 110-8 4 4 0 010 8Z" fill="currentColor"/></svg>
            )}
          </button>
        </div>
      </div>

      <div className="checkbox-row">
        <input
          id="agreeToTerms"
          name="agreeToTerms"
          type="checkbox"
          checked={formData.agreeToTerms}
          onChange={handleChange}
          className="checkbox-enhanced"
          disabled={isLoading}
        />
        <label htmlFor="agreeToTerms" className="checkbox-label">
          Я согласен с{' '}
          <Link href="/privacy" className="text-[#C8BF2F] hover:text-[#B3AA2C] transition-colors">
            условиями использования
          </Link>{' '}
          и{' '}
          <Link href="/privacy" className="text-[#C8BF2F] hover:text-[#B3AA2C] transition-colors">
            политикой конфиденциальности
          </Link>
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
            Создание аккаунта...
          </>
        ) : (
          "Создать аккаунт"
        )}
      </button>




    </form>
  );
}
