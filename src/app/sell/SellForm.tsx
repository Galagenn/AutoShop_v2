"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./SellForm.module.css";

type FormData = {
  title: string;
  brand: string;
  model: string;
  modelVersion: string;
  year: string;
  mileage: string;
  bodyType: string;
  engineVolume: string;
  engineType: string;
  transmission: string;
  drive: string;
  color: string;
  condition: string;
  steering: string;
  customsCleared: string;
  documents: string;
  price: string;
  description: string;
  contactName: string;
  city: string;
  phone: string;
  email: string;
  images?: string[];
};

export default function SellForm({ carId, initialData }: { carId?: string; initialData?: Partial<FormData> }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    brand: "",
    model: "",
    modelVersion: "",
    year: "",
    mileage: "",
    bodyType: "",
    engineVolume: "",
    engineType: "бензин",
    transmission: "автомат",
    drive: "передний",
    color: "",
    condition: "",
    steering: "левый",
    customsCleared: "",
    documents: "ПТС",
    price: "",
    description: "",
    contactName: "",
    city: "",
    phone: "",
    email: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [descriptionMinLeft, setDescriptionMinLeft] = useState(50);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => {
        const updated = { ...prev, ...initialData };
        // Remove images from formData as it's handled separately
        delete (updated as any).images;
        return updated;
      });
      
      // Load existing images if editing
      if (initialData.images && Array.isArray(initialData.images) && initialData.images.length > 0) {
        setImagePreviews(initialData.images);
        setExistingImages(initialData.images);
      }
      
      // Update description counter
      if (initialData.description) {
        const length = initialData.description.length;
        setDescriptionMinLeft(Math.max(0, 50 - length));
      }
      
      // Auto-agree terms when editing (user already agreed when creating)
      if (carId) {
        setAgreeTerms(true);
      }
    }
  }, [initialData, carId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!session?.user) {
      router.push('/auth/login');
      return;
    }
    try {
      setIsLoading(true);
      
      // Upload images first (if any)
      let uploadedUrls: string[] = [];
      if (imageFiles.length > 0) {
        const uploads = imageFiles.map(async (file) => {
          const form = new FormData();
          form.append('file', file);
          form.append('folder', 'autoshop/cars');
          const r = await fetch('/api/upload', { method: 'POST', body: form });
          if (!r.ok) {
            // Try parse JSON error first for clearer reason
            let reason = '';
            try {
              const j = await r.json();
              reason = j?.error || '';
            } catch {
              reason = await r.text().catch(() => '');
            }
            throw new Error(reason || `upload failed: ${r.status}`);
          }
          const j = await r.json();
          return j.url as string;
        });
        const results = await Promise.allSettled(uploads);
        uploadedUrls = results.filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled').map(r => r.value);
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length === results.length) {
          const firstError = (failed[0] as PromiseRejectedResult)?.reason?.message || 'Не удалось загрузить фото. Объявление не отправлено.';
          setError(firstError);
          return;
        } else if (failed.length > 0) {
          const firstError = (failed[0] as PromiseRejectedResult)?.reason?.message;
          setError(`Не все фото загружены (${failed.length}/${results.length}). ${firstError ? 'Причина: ' + firstError : ''}`);
        }
      }

      const url = carId ? `/api/cars/${carId}` : '/api/cars';
      const method = carId ? 'PUT' : 'POST';
      
      // Combine existing images (that weren't removed) with newly uploaded ones
      const finalImages = [...existingImages, ...uploadedUrls];
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: formData.brand,
          model: formData.model,
          year: Number(formData.year),
          mileage: Number(formData.mileage || 0),
          price: Number(formData.price),
          description: formData.description || '',
          images: finalImages.length > 0 ? finalImages : undefined,
          bodyType: formData.bodyType,
          engineVolume: formData.engineVolume,
          engineType: formData.engineType,
          transmission: formData.transmission,
          drive: formData.drive,
          color: formData.color,
          condition: formData.condition,
          steering: formData.steering,
          customsCleared: formData.customsCleared,
          documents: formData.documents,
          modelVersion: formData.modelVersion,
          phone: formData.phone,
          city: formData.city,
        })
      });
      if (!res.ok) {
        let serverMsg = carId ? 'Не удалось обновить объявление' : 'Не удалось создать объявление';
        try {
          const data = await res.json();
          if (data?.error) serverMsg = data.error;
        } catch {
          const txt = await res.text().catch(() => '');
          if (txt) serverMsg = txt;
        }
        setError(serverMsg);
        return;
      }
      const data = await res.json();
      setSubmitted(true);
      // Redirect after edit or create
      if (carId) {
        router.push('/dashboard/seller');
      } else {
        router.push(`/car/${data.car.id}`);
      }
    } catch (err) {
      setError('Ошибка. Попробуйте ещё раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'description') {
      const length = value.length;
      setDescriptionMinLeft(Math.max(0, 50 - length));
    }
  };

  const handlePhotosSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Calculate how many new images we can add (max 10 total)
    const currentTotal = imagePreviews.length;
    const maxNew = Math.max(0, 10 - currentTotal);
    const newFiles = Array.from(files).slice(0, maxNew);
    
    if (newFiles.length === 0) {
      setError('Максимум 10 фотографий');
      return;
    }
    
    // Add new files to existing ones
    const combinedFiles = [...imageFiles, ...newFiles];
    setImageFiles(combinedFiles);
    
    // Create blob URLs for new files and combine with existing previews
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    // Clear the input
    e.target.value = '';
  };

  const removePreview = (url: string) => {
    // Check if it's an existing image (URL) or a new file (blob URL)
    const isExistingImage = existingImages.includes(url);
    
    // Remove from previews
    setImagePreviews(prev => prev.filter(u => u !== url));
    
    // If it's a new file, we need to find and remove it from imageFiles
    // We need to track which file corresponds to which blob URL
    if (!isExistingImage) {
      // Find the index in imagePreviews before removal to match with imageFiles
      const previewIndex = imagePreviews.indexOf(url);
      if (previewIndex !== -1) {
        // Count how many existing images are before this index
        let existingBeforeCount = 0;
        for (let i = 0; i < previewIndex; i++) {
          if (existingImages.includes(imagePreviews[i])) {
            existingBeforeCount++;
          }
        }
        // The file index is previewIndex minus existing images before it
        const fileIndex = previewIndex - existingBeforeCount;
        setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
      }
    } else {
      // Remove from existing images
      setExistingImages(prev => prev.filter(u => u !== url));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16 animate-fade-in-up">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-[#C8BF2F] flex items-center justify-center animate-glow">
          <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold mb-3 gradient-text">Объявление опубликовано</h2>
        <p className="text-white/70">После проверки появится в каталоге</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {error && (
          <div className={styles.error}>{error}</div>
        )}
        <form onSubmit={handleSubmit} className={styles.form} id="add-car-form">
          <div>
            <h3 className={styles.sectionTitle}>Основная информация</h3>
            <div className={styles.gridTwo}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className={styles.label}>Заголовок объявления *</label>
                <input name="title" required placeholder="Например: Toyota Camry 50 2020 года" className={styles.input} value={formData.title} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Марка *</label>
                <select name="brand" required className={styles.select} value={formData.brand} onChange={handleChange}>
                  <option value="">Выберите марку</option>
                  <option value="Toyota">Toyota</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                  <option value="Volkswagen">Volkswagen</option>
                  <option value="Honda">Honda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Lexus">Lexus</option>
                  <option value="Infiniti">Infiniti</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Модель *</label>
                <input name="model" required placeholder="Например: Camry" className={styles.input} value={formData.model} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Версия модели</label>
                <input name="modelVersion" placeholder="Например: 2.5 AT Comfort" className={styles.input} value={formData.modelVersion} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Цена (₸) *</label>
                <input name="price" required type="number" placeholder="8500000" className={styles.input} value={formData.price} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Год выпуска *</label>
                <input name="year" required type="number" placeholder="2020" min={1900} max={2025} className={styles.input} value={formData.year} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Пробег (км)</label>
                <input name="mileage" type="number" placeholder="45000" className={styles.input} value={formData.mileage} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Топливо</label>
                <select name="engineType" className={styles.select} value={formData.engineType} onChange={handleChange}>
                  <option value="">Выберите топливо</option>
                  <option value="бензин">Бензин</option>
                  <option value="дизель">Дизель</option>
                  <option value="электро">Электро</option>
                  <option value="гибрид">Гибрид</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Коробка передач *</label>
                <select name="transmission" required className={styles.select} value={formData.transmission} onChange={handleChange}>
                  <option value="">Выберите коробку</option>
                  <option value="механика">Механика</option>
                  <option value="автомат">Автомат</option>
                  <option value="вариатор">Вариатор</option>
                  <option value="робот">Робот</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Руль *</label>
                <select name="steering" required className={styles.select} value={formData.steering} onChange={handleChange}>
                  <option value="">Выберите руль</option>
                  <option value="левый">Левый</option>
                  <option value="правый">Правый</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Состояние авто *</label>
                <select name="condition" required className={styles.select} value={formData.condition} onChange={handleChange}>
                  <option value="">Выберите состояние</option>
                  <option value="new">Новая</option>
                  <option value="used">С пробегом</option>
                  <option value="damaged">После аварии</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Растаможен в Казахстане *</label>
                <select name="customsCleared" required className={styles.select} value={formData.customsCleared} onChange={handleChange}>
                  <option value="">Выберите</option>
                  <option value="yes">Да</option>
                  <option value="no">Нет</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Цвет машины</label>
                <select name="color" className={styles.select} value={formData.color} onChange={handleChange}>
                  <option value="">Выберите цвет</option>
                  <option value="white">Белый</option>
                  <option value="black">Черный</option>
                  <option value="silver">Серебристый</option>
                  <option value="gray">Серый</option>
                  <option value="red">Красный</option>
                  <option value="blue">Синий</option>
                  <option value="green">Зеленый</option>
                  <option value="yellow">Желтый</option>
                  <option value="brown">Коричневый</option>
                  <option value="orange">Оранжевый</option>
                  <option value="purple">Фиолетовый</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Местоположение и контакты</h3>
            <div className={styles.gridTwo}>
              <div>
                <label className={styles.label}>Город *</label>
                <select name="city" required className={styles.select} value={formData.city} onChange={handleChange}>
                  <option value="">Выберите город</option>
                  <option value="almaty">Алматы</option>
                  <option value="astana">Астана</option>
                  <option value="shymkent">Шымкент</option>
                  <option value="aktobe">Актобе</option>
                  <option value="karaganda">Караганда</option>
                  <option value="taraz">Тараз</option>
                  <option value="pavlodar">Павлодар</option>
                  <option value="semey">Семей</option>
                  <option value="uralsk">Уральск</option>
                  <option value="kostanay">Костанай</option>
                  <option value="kyzylorda">Кызылорда</option>
                  <option value="petropavl">Петропавловск</option>
                  <option value="atyrau">Атырау</option>
                  <option value="aktau">Актау</option>
                </select>
              </div>

              <div>
                <label className={styles.label}>Email</label>
                <input name="email" type="email" placeholder="example@email.com" className={styles.input} value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Объем двигателя (л)</label>
                <input name="engineVolume" placeholder="Например: 2.0" className={styles.input} value={formData.engineVolume} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Тип кузова</label>
                <select name="bodyType" className={styles.select} value={formData.bodyType} onChange={handleChange}>
                  <option value="">Выберите кузов</option>
                  <option value="седан">Седан</option>
                  <option value="хэтчбек">Хэтчбек</option>
                  <option value="купе">Купе</option>
                  <option value="универсал">Универсал</option>
                  <option value="кроссовер">Кроссовер</option>
                  <option value="внедорожник">Внедорожник</option>
                  <option value="минивен">Минивен</option>
                  <option value="пикап">Пикап</option>
                  <option value="кабриолет">Кабриолет</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Привод</label>
                <select name="drive" className={styles.select} value={formData.drive} onChange={handleChange}>
                  <option value="">Выберите привод</option>
                  <option value="передний">Передний</option>
                  <option value="задний">Задний</option>
                  <option value="полный">Полный</option>
                </select>
              </div>
              <div>
                <label className={styles.label}>Документы</label>
                <select name="documents" className={styles.select} value={formData.documents} onChange={handleChange}>
                  <option value="ПТС">ПТС</option>
                  <option value="ЭПТС">ЭПТС</option>
                  <option value="Договор купли-продажи">Договор купли-продажи</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Описание</h3>
            <label className={styles.label}>Описание автомобиля *</label>
            <textarea name="description" rows={6} required placeholder="Опишите состояние автомобиля, комплектацию, историю обслуживания и другие важные детали..." className={styles.textarea} value={formData.description} onChange={handleChange} />
            <div className={styles.hint}>Минимум 50 символов. Осталось: <span>{descriptionMinLeft}</span></div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Фотографии</h3>
            <div className={styles.uploadBox}>
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Загрузите фотографии автомобиля</p>
              <p style={{ color: '#cfcfcf', marginBottom: 16 }}>Можно загрузить до 10 фотографий (JPG, PNG). Выбирайте файлы по одному или несколько сразу.</p>
              <input id="photo-upload" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handlePhotosSelected} />
              <button type="button" onClick={() => document.getElementById('photo-upload')?.click()} className={styles.btnSecondary}>
                Выбрать файлы
              </button>
              <p className={styles.hint}>Предпросмотр появится ниже. Нажмите × для удаления фотографии</p>
            </div>
            <div className={styles.previewGrid} id="photo-preview">
              {imagePreviews.map(url => (
                <div key={url} className={styles.previewItem}>
                  <img src={url} alt="preview" />
                  <button type="button" onClick={() => removePreview(url)} className={styles.removeBtn}>×</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={styles.sectionTitle}>Контактная информация</h3>
            <div className={styles.gridTwo}>
              <div>
                <label className={styles.label}>Имя *</label>
                <input name="contactName" required placeholder="Ваше имя" className={styles.input} value={formData.contactName} onChange={handleChange} />
              </div>
              <div>
                <label className={styles.label}>Телефон *</label>
                <input name="contactPhone" required type="tel" placeholder="+7 (777) 123-45-67" className={styles.input} value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1 / -1' }} />
            </div>
          </div>

          <div className={styles.checkboxRow}>
            <input id="agree-terms" type="checkbox" required style={{ marginTop: 4, width: 16, height: 16 }} checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <label htmlFor="agree-terms" style={{ fontSize: 14, color: '#e5e5e5' }}>
              Я согласен с <a href="#" className="text-[#C8BF2F] underline">условиями использования</a> и <a href="#" className="text-[#C8BF2F] underline">политикой конфиденциальности</a> AutoMarket
            </label>
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnSecondary} onClick={() => console.log('Сохранён черновик', formData)}>
              Сохранить черновик
            </button>
            <button type="submit" disabled={isLoading || !agreeTerms} className={styles.btnPrimary}>
              {isLoading ? 'Публикуем...' : 'Разместить объявление'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
