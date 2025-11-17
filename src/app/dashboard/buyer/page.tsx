import Link from 'next/link'
import { auth } from '@/auth'
import FavoriteButton from '@/components/FavoriteButton'
import { prisma } from '@/lib/prisma'
import styles from './page.module.css'

export default async function BuyerDashboardPage() {
  const session = await auth()
  const userName = (session?.user?.name as string | undefined) || 'Покупатель'

  // Load data directly using Prisma to ensure session cookies are respected
  // @ts-ignore
  const userId = session?.user?.id as string | undefined
  let favorites: Array<{ id: string, car: any }> = []
  let recommendations: Array<any> = []
  try {
    if (userId) {
      const favs = await prisma.favorite.findMany({ where: { userId }, include: { car: true }, orderBy: { createdAt: 'desc' } })
      favorites = favs as any
      const favoriteCarIds = favs.map(f => f.carId)
      recommendations = await prisma.car.findMany({ where: { id: { notIn: favoriteCarIds } }, orderBy: { createdAt: 'desc' }, take: 6 }) as any
    }
  } catch {
    favorites = []
    recommendations = []
  }
  const favoriteCarIdSet = new Set<string>(favorites.map((f: any) => f.car?.id).filter(Boolean))
  const activity = { viewedThisWeek: 0, favoritesCount: favorites.length, viewedCount: 0, contactedCount: 0, daysOnSite: 0 }

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.dashboardContainer}>
        <main className={styles.dashboardMain}>
          <div className={styles.dashboardHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerText}>
                <h1>Добро пожаловать, {userName}</h1>
                <p>Личная панель покупателя</p>
              </div>
              <div className={styles.headerActions}>
                <Link href="/catalog" className={styles.btnPrimary}>Найти авто</Link>
                <Link href="/favorites" className={styles.btnGhost}>Избранное</Link>
              </div>
            </div>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 5h18v2H3zm0 6h12v2H3zm0 6h8v2H3z"/></svg>
                </div>
                <div className={styles.statLabel}>Просмотренных авто</div>
              </div>
              <div className={styles.statValue}>{activity.viewedCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.22 2.5C11.09 5.01 12.76 4 14.5 4 17 4 19 6 19 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <div className={styles.statLabel}>В избранном</div>
              </div>
              <div className={styles.statValue}>{activity.favoritesCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21 6h-2V3H5v3H3v2h2v8H3v2h2v3h14v-3h2v-2h-2V8h2zM7 5h10v14H7V5z"/></svg>
                </div>
                <div className={styles.statLabel}>Связались с продавцами</div>
              </div>
              <div className={styles.statValue}>{activity.contactedCount}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6h6v-2h-4V7z"/></svg>
                </div>
                <div className={styles.statLabel}>Дней на сайте</div>
              </div>
              <div className={styles.statValue}>{activity.daysOnSite}</div>
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Сохраненные объявления</h2>
              <Link href="/catalog" className={styles.btnLink}>Перейти в каталог</Link>
            </div>
            <div className={styles.listingsGrid}>
              {favorites.map((f: any) => (
                <div key={f.id} className={styles.listingCard}>
                  <div className={styles.listingImage}>
                    <img src={(f.car.images && f.car.images[0]) ? f.car.images[0] : '/file.svg'} alt={f.car.brand + ' ' + f.car.model} />
                  </div>
                  <div className={styles.listingContent}>
                    <div className={styles.listingHeader}>
                      <h3 className={styles.listingTitle}>{f.car.brand} {f.car.model}</h3>
                    </div>
                    <div className={styles.listingPrice}>{(typeof f.car.price === 'number' ? f.car.price.toLocaleString() : f.car.price)} ₸</div>
                    <div className={styles.listingActions}>
                      <Link href={'/car/' + f.car.id} className={styles.btnGhost}>Посмотреть</Link>
                      <FavoriteButton carId={f.car.id} initialFavorite={true} isOwner={f.car?.ownerId === userId} />
                    </div>
                  </div>
                </div>
              ))}
              {favorites.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIllustration}>⭐</div>
                  <div>
                    <div className={styles.emptyTitle}>Нет избранных автомобилей</div>
                    <div className={styles.emptyText}>Добавляйте понравившиеся авто — быстро вернётесь к ним позже</div>
                  </div>
                  <Link href="/catalog" className={styles.btnPrimary}>Найти авто</Link>
                </div>
              )}
            </div>
          </div>

          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Рекомендуемые автомобили</h2>
              <Link href="/catalog" className={styles.btnLink}>Показать больше</Link>
            </div>
            <div className={styles.listingsGrid}>
              {recommendations.map((c: any) => (
                <div key={c.id} className={styles.listingCard}>
                  <div className={styles.listingImage}>
                    <img src={(c.images && c.images[0]) ? c.images[0] : '/file.svg'} alt={c.brand + ' ' + c.model} />
                  </div>
                  <div className={styles.listingContent}>
                    <div className={styles.listingHeader}>
                      <h3 className={styles.listingTitle}>{c.brand} {c.model}</h3>
                    </div>
                    <div className={styles.listingPrice}>{(typeof c.price === 'number' ? c.price.toLocaleString() : c.price)} ₸</div>
                    <div className={styles.listingActions}>
                      <Link href={'/car/' + c.id} className={styles.btnGhost}>Посмотреть</Link>
                      <FavoriteButton carId={c.id} initialFavorite={favoriteCarIdSet.has(c.id)} isOwner={c.ownerId === userId} />
                    </div>
                  </div>
                </div>
              ))}
              {recommendations.length === 0 && (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIllustration}>✨</div>
                  <div>
                    <div className={styles.emptyTitle}>Пока нет рекомендаций</div>
                    <div className={styles.emptyText}>Заполните профиль и посмотрите пару авто — появятся рекомендации</div>
                  </div>
                  <Link href="/catalog" className={styles.btnPrimary}>Перейти в каталог</Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}


