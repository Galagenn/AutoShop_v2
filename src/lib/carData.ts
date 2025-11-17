const CARQUERY_BASE_URL = 'https://www.carqueryapi.com/api/0.3/'

type CacheEntry = { data: string[]; expiresAt: number }

const MODEL_CACHE = new Map<string, CacheEntry>()
const VERSION_CACHE = new Map<string, CacheEntry>()
const CACHE_TTL_MS = 1000 * 60 * 60 * 12 // 12 hours

const sanitize = (value: string) => value.trim().toLowerCase()

const toCacheKey = (prefix: string, parts: string[]) => `${prefix}:${parts.map((p) => sanitize(p)).join('|')}`

const normalizeMake = (brand: string) => {
  const normalized = brand.trim().toLowerCase()
  if (!normalized) return ''
  return normalized
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const normalizeModelParam = (model: string) => model.trim()

const parseCarQueryResponse = (raw: string) => {
  const trimmed = raw.trim()
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start !== -1 && end !== -1 && end > start) {
      const sliced = trimmed.slice(start, end + 1)
      return JSON.parse(sliced)
    }
    throw new Error('Invalid CarQuery response')
  }
}

const requestCarQuery = async <T>(cmd: string, params: Record<string, string>): Promise<T | null> => {
  const url = new URL(CARQUERY_BASE_URL)
  url.searchParams.set('cmd', cmd)
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value)
    }
  }
  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': 'Autoshop/1.0 (+https://autoshop.example)' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const text = await res.text()
    return parseCarQueryResponse(text) as T
  } catch {
    return null
  }
}

const mergeUnique = (values: (string | null | undefined)[]) => {
  const seen = new Set<string>()
  const result: string[] = []
  for (const value of values) {
    if (!value) continue
    const trimmed = value.trim()
    if (!trimmed) continue
    const key = trimmed.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(trimmed)
  }
  return result
}

const getCached = (map: Map<string, CacheEntry>, key: string) => {
  const cached = map.get(key)
  if (!cached) return undefined
  if (Date.now() > cached.expiresAt) {
    map.delete(key)
    return undefined
  }
  return cached.data
}

const setCached = (map: Map<string, CacheEntry>, key: string, data: string[]) => {
  map.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS })
}

export async function fetchModelsForBrand(brand: string): Promise<string[]> {
  const make = normalizeMake(brand)
  if (!make) return []
  const cacheKey = toCacheKey('models', [make])
  const cached = getCached(MODEL_CACHE, cacheKey)
  if (cached) return cached

  const response = await requestCarQuery<{ Models?: any[] }>('getModels', { make })
  const models = mergeUnique(
    (response?.Models || []).map((item) => item?.model_name || item?.model)
  ).sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))

  setCached(MODEL_CACHE, cacheKey, models)
  return models
}

export async function fetchVersionsForBrandModel(brand: string, model: string): Promise<string[]> {
  const make = normalizeMake(brand)
  const modelParam = normalizeModelParam(model)
  if (!make || !modelParam) return []
  const cacheKey = toCacheKey('versions', [make, modelParam])
  const cached = getCached(VERSION_CACHE, cacheKey)
  if (cached) return cached

  const response = await requestCarQuery<{ Trims?: any[] }>('getTrims', { make, model: modelParam })
  const versions = mergeUnique(
    (response?.Trims || []).map((item) => item?.model_trim || item?.model_name || item?.model)
  ).sort((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'base' }))

  setCached(VERSION_CACHE, cacheKey, versions)
  return versions
}


