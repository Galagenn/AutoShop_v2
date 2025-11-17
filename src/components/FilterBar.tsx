"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Filters = {
  brand: string;
  model: string;
  modelVersion: string;
  minPrice: string;
  maxPrice: string;
  minYear: string;
  maxYear: string;
  minMileage: string;
  maxMileage: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  drive: string;
  color: string;
  onlyNew: boolean;
  sort: string;
};

type FilterOptions = {
  brands: string[];
  models: string[];
  versions?: string[];
  years: number[];
  maxPriceSteps: number[];
}

export default function FilterBar({ options }: { options?: Partial<FilterOptions> }) {
  const [filters, setFilters] = useState<Filters>({
    brand: "",
    model: "",
    modelVersion: "",
    minPrice: "",
    maxPrice: "",
    minYear: "",
    maxYear: "",
    minMileage: "",
    maxMileage: "",
    fuelType: "",
    transmission: "",
    bodyType: "",
    drive: "",
    color: "",
    onlyNew: false,
    sort: "",
  });
  const [open, setOpen] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [modelOptions, setModelOptions] = useState<string[]>(() => (options?.models || []).filter(Boolean));
  const [versionOptions, setVersionOptions] = useState<string[]>(() => (options?.versions || []).filter(Boolean));
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Initialize filters from URL on mount
  useEffect(() => {
    if (!sp) return;
    setFilters((prev) => ({
      ...prev,
      brand: sp.get("brand") || "",
      model: sp.get("model") || "",
      modelVersion: sp.get("modelVersion") || "",
      minPrice: sp.get("minPrice") || "",
      maxPrice: sp.get("maxPrice") || "",
      minYear: sp.get("minYear") || "",
      maxYear: sp.get("maxYear") || "",
      minMileage: sp.get("minMileage") || "",
      maxMileage: sp.get("maxMileage") || "",
      fuelType: sp.get("fuelType") || "",
      transmission: sp.get("transmission") || "",
      bodyType: sp.get("bodyType") || "",
      drive: sp.get("drive") || "",
      color: sp.get("color") || "",
      onlyNew: sp.get("onlyNew") === "1",
      sort: sp.get("sort") || "",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setModelOptions((options?.models || []).filter(Boolean));
  }, [options?.models]);

  useEffect(() => {
    setVersionOptions((options?.versions || []).filter(Boolean));
  }, [options?.versions]);

  function buildQueryString(next: Filters): string {
    const params = new URLSearchParams((sp && sp.toString()) || "");
    const setOrDelete = (key: string, value?: string | number | boolean) => {
      const v = typeof value === "boolean" ? (value ? "1" : "") : (value ?? "");
      if (v === "" || v === undefined) {
        params.delete(key);
      } else {
        params.set(key, String(v));
      }
    };
    setOrDelete("brand", next.brand.trim());
    setOrDelete("model", next.model.trim());
    setOrDelete("modelVersion", next.modelVersion.trim());
    setOrDelete("minPrice", next.minPrice.trim());
    setOrDelete("maxPrice", next.maxPrice.trim());
    setOrDelete("minYear", next.minYear.trim());
    setOrDelete("maxYear", next.maxYear.trim());
    setOrDelete("minMileage", next.minMileage.trim());
    setOrDelete("maxMileage", next.maxMileage.trim());
    setOrDelete("fuelType", next.fuelType.trim());
    setOrDelete("transmission", next.transmission.trim());
    setOrDelete("bodyType", next.bodyType.trim());
    setOrDelete("drive", next.drive.trim());
    setOrDelete("color", next.color.trim());
    setOrDelete("onlyNew", next.onlyNew);
    setOrDelete("sort", next.sort.trim());
    return params.toString();
  }

  function applyFilters() {
    const qs = buildQueryString(filters);
    const path = pathname || "/catalog";
    router.push(qs ? `${path}?${qs}` : path);
  }

  function update<K extends keyof Filters>(key: K, value: Filters[K]) {
    const next = { ...filters, [key]: value };
    setFilters(next);
  }

  const applyAndPush = (next: Filters) => {
    setFilters(next);
    const qs = buildQueryString(next);
    const path = pathname || "/catalog";
    router.push(qs ? `${path}?${qs}` : path);
  };

  const brandOptions = useMemo(() => (options?.brands || []).filter(Boolean), [options?.brands]);
  const yearOptions = useMemo(() => (options?.years || []).filter((n) => typeof n === "number"), [options?.years]);
  const priceSteps = useMemo(() => (options?.maxPriceSteps || []), [options?.maxPriceSteps]);

  useEffect(() => {
    const brand = filters.brand.trim();
    if (!brand) {
      setModelOptions([]);
      setVersionOptions([]);
      return;
    }
    let ignore = false;
    setLoadingModels(true);
    (async () => {
      try {
        const res = await fetch(`/api/filters/models?brand=${encodeURIComponent(brand)}`, { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (ignore) return;
        setModelOptions(Array.isArray(data?.models) ? data.models : []);
      } catch {
        if (!ignore) setModelOptions([]);
      } finally {
        if (!ignore) setLoadingModels(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [filters.brand]);

  useEffect(() => {
    const brand = filters.brand.trim();
    const model = filters.model.trim();
    if (!brand || !model) {
      setVersionOptions([]);
      return;
    }
    let ignore = false;
    setLoadingVersions(true);
    (async () => {
      try {
        const url = `/api/filters/versions?brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`;
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (ignore) return;
        setVersionOptions(Array.isArray(data?.versions) ? data.versions : []);
      } catch {
        if (!ignore) setVersionOptions([]);
      } finally {
        if (!ignore) setLoadingVersions(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [filters.brand, filters.model]);

  return (
    <div className="container-page">
      <div className="glass rounded-2xl filters-padding">
        <button type="button" className="filters-toggle" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span>Фильтры</span>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5l5-5z"/></svg>
        </button>
        <div className={`filters-body ${open ? "" : "collapsed"}`}>
        <div className="grid md:grid-cols-6 gap-4 filters-grid">
          {brandOptions.length > 0 ? (
            <select
              className="input-modern col-span-6"
              value={filters.brand}
              onChange={(e) => {
                const value = e.target.value;
                setVersionOptions([]);
                const next = { ...filters, brand: value, model: "", modelVersion: "" };
                applyAndPush(next);
              }}
            >
              <option value="">{`Марка`}</option>
              {brandOptions.map((b) => (<option key={b} value={b}>{b}</option>))}
            </select>
          ) : (
            <input 
              placeholder="Бренд" 
              className="input-modern col-span-6" 
              value={filters.brand} 
              onChange={(e) => update("brand", e.target.value)} 
            />
          )}
          {modelOptions.length > 0 ? (
            <select
              className="input-modern col-span-6"
              value={filters.model}
              onChange={(e) => {
                const value = e.target.value;
                const next = { ...filters, model: value, modelVersion: "" };
                applyAndPush(next);
              }}
              disabled={!filters.brand}
            >
              <option value="">{loadingModels ? "Загрузка..." : `Модель`}</option>
              {modelOptions.map((m) => (<option key={m} value={m}>{m}</option>))}
            </select>
          ) : (
            <input 
              placeholder="Модель" 
              className="input-modern col-span-6" 
              value={filters.model} 
              onChange={(e) => update("model", e.target.value)} 
            />
          )}
          {versionOptions.length > 0 ? (
            <select
              className="input-modern col-span-6"
              value={filters.modelVersion}
              onChange={(e) => {
                const value = e.target.value;
                const next = { ...filters, modelVersion: value };
                applyAndPush(next);
              }}
              disabled={!filters.brand || !filters.model}
            >
              <option value="">{loadingVersions ? "Загрузка..." : `Версия`}</option>
              {versionOptions.map((v) => (<option key={v} value={v}>{v}</option>))}
            </select>
          ) : (
            <input
              placeholder="Версия модели"
              className="input-modern col-span-6"
              value={filters.modelVersion}
              onChange={(e) => update("modelVersion", e.target.value)}
              disabled={!filters.brand}
            />
          )}
          <div className="grid grid-cols-2 gap-4 col-span-6">
            <input 
              placeholder="Мин. цена" 
              className="input-modern" 
              value={filters.minPrice} 
              onChange={(e) => update("minPrice", e.target.value)} 
            />
            {priceSteps.length > 0 ? (
              <select
                className="input-modern"
                value={filters.maxPrice}
                onChange={(e) => { update("maxPrice", e.target.value); const next = { ...filters, maxPrice: e.target.value }; const qs = buildQueryString(next); router.push((pathname || "/catalog") + (qs ? `?${qs}` : "")); }}
              >
                <option value="">{`Цена до`}</option>
                {priceSteps.map((p) => (<option key={p} value={p}>{p.toLocaleString()} ₸</option>))}
              </select>
            ) : (
              <input 
                placeholder="Макс. цена" 
                className="input-modern" 
                value={filters.maxPrice} 
                onChange={(e) => update("maxPrice", e.target.value)} 
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-6">
            <input 
              placeholder="Год от" 
              className="input-modern" 
              value={filters.minYear} 
              onChange={(e) => update("minYear", e.target.value)} 
            />
            {yearOptions.length > 0 ? (
              <select
                className="input-modern"
                value={filters.maxYear}
                onChange={(e) => { update("maxYear", e.target.value); const next = { ...filters, maxYear: e.target.value }; const qs = buildQueryString(next); router.push((pathname || "/catalog") + (qs ? `?${qs}` : "")); }}
              >
                <option value="">{`Год`}</option>
                {yearOptions.map((y) => (<option key={y} value={y}>{y}</option>))}
              </select>
            ) : (
              <input 
                placeholder="Год до" 
                className="input-modern" 
                value={filters.maxYear} 
                onChange={(e) => update("maxYear", e.target.value)} 
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-6">
            <input 
              placeholder="Пробег от, км" 
              className="input-modern" 
              value={filters.minMileage} 
              onChange={(e) => update("minMileage", e.target.value)} 
            />
            <input 
              placeholder="Пробег до, км" 
              className="input-modern" 
              value={filters.maxMileage} 
              onChange={(e) => update("maxMileage", e.target.value)} 
            />
          </div>
          <select
            className="input-modern col-span-6"
            value={filters.fuelType}
            onChange={(e) => update("fuelType", e.target.value)}
          >
            <option value="">Топливо</option>
            <option value="petrol">Бензин</option>
            <option value="diesel">Дизель</option>
            <option value="hybrid">Гибрид</option>
            <option value="electric">Электро</option>
          </select>
          <select
            className="input-modern col-span-6"
            value={filters.transmission}
            onChange={(e) => update("transmission", e.target.value)}
          >
            <option value="">КПП</option>
            <option value="manual">Механика</option>
            <option value="automatic">Автомат</option>
            <option value="cvt">Вариатор</option>
            <option value="robot">Робот</option>
          </select>
          <select
            className="input-modern col-span-6"
            value={filters.bodyType}
            onChange={(e) => update("bodyType", e.target.value)}
          >
            <option value="">Кузов</option>
            <option value="sedan">Седан</option>
            <option value="hatchback">Хэтчбек</option>
            <option value="wagon">Универсал</option>
            <option value="crossover">Кроссовер</option>
            <option value="suv">Внедорожник</option>
            <option value="coupe">Купе</option>
          </select>
          <select
            className="input-modern col-span-6"
            value={filters.drive}
            onChange={(e) => update("drive", e.target.value)}
          >
            <option value="">Привод</option>
            <option value="fwd">Передний</option>
            <option value="rwd">Задний</option>
            <option value="awd">Полный</option>
          </select>
          <input 
            placeholder="Цвет" 
            className="input-modern col-span-6" 
            value={filters.color} 
            onChange={(e) => update("color", e.target.value)} 
          />
          <select
            className="input-modern col-span-6"
            value={filters.sort}
            onChange={(e) => update("sort", e.target.value)}
          >
            <option value="">Сортировка</option>
            <option value="price_asc">Дешевле</option>
            <option value="price_desc">Дороже</option>
            <option value="year_desc">Новее</option>
            <option value="year_asc">Старее</option>
            <option value="mileage_asc">Меньше пробег</option>
          </select>
          <label className="checkbox-row col-span-6" style={{marginTop: 0}}>
            <input
              type="checkbox"
              className="checkbox-enhanced"
              checked={filters.onlyNew}
              onChange={(e) => update("onlyNew", e.target.checked)}
            />
            <span className="checkbox-label">Только новые</span>
          </label>
        </div>
        <div className="flex justify-between items-center filters-actions-gap">
          <button 
            type="button"
            onClick={() => { setFilters({
              brand: "",
              model: "",
              modelVersion: "",
              minPrice: "",
              maxPrice: "",
              minYear: "",
              maxYear: "",
              minMileage: "",
              maxMileage: "",
              fuelType: "",
              transmission: "",
              bodyType: "",
              drive: "",
              color: "",
              onlyNew: false,
              sort: "",
            }); const path = pathname || "/catalog"; router.push(path); }}
            className="btn-ghost text-sm"
          >
            Очистить
          </button>
          <button type="button" onClick={applyFilters} className="btn-primary text-sm">
            Применить
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}


