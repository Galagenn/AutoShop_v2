# Быстрое исправление на сервере

База данных уже создана. Выполните следующие команды на сервере:

```bash
# Определяем команду docker compose
DOCKER_COMPOSE="docker compose"

# Запускаем web контейнер (если не запущен)
$DOCKER_COMPOSE up -d web

# Ждем запуска
sleep 5

# Применяем миграции Prisma
$DOCKER_COMPOSE exec -T web npx prisma migrate deploy

# Генерируем Prisma Client (если нужно)
$DOCKER_COMPOSE exec -T web npx prisma generate

# Проверяем статус
$DOCKER_COMPOSE ps

# Проверяем переменную DATABASE_URL
$DOCKER_COMPOSE exec -T web env | grep DATABASE_URL

# Смотрим логи приложения
$DOCKER_COMPOSE logs --tail=50 web
```

Если контейнер web не запускается, пересоберите его:

```bash
$DOCKER_COMPOSE build web
$DOCKER_COMPOSE up -d web
```

