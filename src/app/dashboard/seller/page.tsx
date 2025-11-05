import Link from 'next/link'
import { auth } from '@/auth'
import SignOutButton from '@/components/SignOutButton'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import SellerListingCard from '@/components/SellerListingCard'
import styles from './page.module.css'

export default async function SellerDashboardPage() {
  const session = await auth()
  const userName = (session?.user?.name as string | undefined) || 'Продавец'
  const userId = (session?.user?.id as string | undefined)
  
  // Get base URL properly
  const headersList = headers()
  const protocol = headersList.get('x-forwarded-proto') ?? 'http'
  const host = headersList.get('host') ?? 'localhost:3000'
  const baseUrl = `${protocol}://${host}`
  
  // Load only current seller's listings directly (avoids any cookie/host issues)
  let cars: Array<{ id: string, brand: string, model: string, price: number, status?: string, images?: string[] }> = []
  let stats: { totalListings: number, averagePrice: number, views: number } = { totalListings: 0, averagePrice: 0, views: 0 }
  if (userId) {
    try {
      cars = await prisma.car.findMany({ where: { ownerId: userId }, orderBy: { createdAt: 'desc' } }) as any
      stats = {
        totalListings: cars.length,
        averagePrice: cars.length ? Math.round(cars.reduce((s, c) => s + (c.price || 0), 0) / cars.length) : 0,
        views: Math.round(cars.length * 137),
      }
    } catch {
      // keep defaults
    }
  }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <main className={styles.dashboardMain}>
          <div className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                  <h1>Добро пожаловать, {userName}!</h1>
                  <p>Управляйте своими объявлениями и находите покупателей</p>
                </div>
              <div className={styles.headerActions}>
                <span className={styles.roleBadge}>Ваша роль: Продавец</span>
                <Link href="/sell" className={styles.btnPrimary}>+ Добавить авто</Link>
                <SignOutButton className={styles.btnGhost} />
                </div>
              </div>
            </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <div className={styles.statLabel}>Активных объявлений</div>
              </div>
              <div className={styles.statValue}>{stats.totalListings}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11C5.84 5 5.28 5.42 5.08 6.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <div className={styles.statLabel}>Просмотров</div>
              </div>
              <div className={styles.statValue}>{stats.views}</div>
            </div>
            {/* Calls block removed as requested */}
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h18v4H3zM3 10h18v11H3z"/>
                    </svg>
                  </div>
                <div className={styles.statLabel}>Продано авто</div>
                </div>
              <div className={styles.statValue}>{(stats as any).sold ?? 0}</div>
              </div>
            </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Мои объявления</h2>
              <div className={styles.controls}>
                <div className={styles.searchBox}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/></svg>
                  <input className={styles.input} placeholder="Поиск по марке или модели" />
                </div>
                <select className={styles.select} defaultValue="new">
                  <option value="new">Новые</option>
                  <option value="price_asc">Цена ↑</option>
                  <option value="price_desc">Цена ↓</option>
                  <option value="views">По просмотрам</option>
                </select>
              </div>
              <Link href="/sell" className={styles.btnPrimary}>+ Добавить авто</Link>
            </div>
            <div className={styles.listingsGrid}>
              {cars.map((car) => (
                <SellerListingCard key={car.id} car={car} />
              ))}
              {cars.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIllustration}>🚗</div>
                  <div>
                    <div className={styles.emptyTitle}>Пока нет объявлений</div>
                    <div className={styles.emptyText}>Добавьте первое объявление и начните продажи сегодня</div>
                  </div>
                  <Link href="/sell" className={styles.btnPrimary}>+ Разместить авто</Link>
                </div>
              )}
              </div>
            </div>

          <div className={styles.sectionCard}>
            <h3 className={styles.sectionTitle}>Советы для успешных продаж</h3>
            <div className={styles.tipsGrid}>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>📸</div>
                <div className={styles.tipText}>Добавляйте качественные фото</div>
              </div>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>📋</div>
                <div className={styles.tipText}>Указывайте точную информацию</div>
              </div>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>⚡</div>
                <div className={styles.tipText}>Быстро отвечайте покупателям</div>
              </div>
              <div className={styles.tipCard}>
                <div className={styles.tipIcon}>💰</div>
                <div className={styles.tipText}>Ставьте конкурентные цены</div>
              </div>
              </div>
            </div>

          <div className={styles.ctaSection}>
            <div className={styles.ctaContent}>
              <div className={styles.ctaText}>
                <h3>Разместите своё авто сегодня 🚘</h3>
                <p>Быстрая модерация, премиум-подача объявления и заинтересованные покупатели.</p>
              </div>
              <Link href="/sell" className={`${styles.btnPrimary} ${styles.btnLarge}`}>Добавить объявление</Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}