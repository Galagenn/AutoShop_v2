#!/bin/bash

# Скрипт для быстрого исправления проблемы с БД
# Использование: ./fix-db.sh

# Определяем команду docker compose
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден"
    exit 1
fi

cd /opt/AutoShop_v2 || cd /opt/AutoShop_v3 || { echo "❌ Директория проекта не найдена"; exit 1; }

echo "🔧 Исправление проблемы с базой данных..."
echo ""

echo "1️⃣ Запускаем контейнер БД..."
$DOCKER_COMPOSE up -d db
sleep 5

echo "2️⃣ Проверяем доступность БД..."
$DOCKER_COMPOSE exec -T db pg_isready -U postgres || {
    echo "❌ База данных не готова, ждем еще 5 секунд..."
    sleep 5
}

echo "3️⃣ Проверяем существование базы данных autoshop..."
DB_EXISTS=$($DOCKER_COMPOSE exec -T db psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='autoshop'" 2>/dev/null || echo "")

if [ -z "$DB_EXISTS" ]; then
    echo "📝 База данных autoshop не существует, создаем..."
    $DOCKER_COMPOSE exec -T db psql -U postgres -c "CREATE DATABASE autoshop;" || {
        echo "❌ Ошибка при создании базы данных"
        exit 1
    }
    echo "✅ База данных autoshop создана"
else
    echo "✅ База данных autoshop уже существует"
fi

echo "4️⃣ Запускаем контейнер web..."
$DOCKER_COMPOSE up -d web
sleep 5

echo "5️⃣ Применяем миграции Prisma..."
$DOCKER_COMPOSE exec -T web npx prisma migrate deploy || {
    echo "⚠️  Ошибка при применении миграций, пробуем еще раз..."
    sleep 3
    $DOCKER_COMPOSE exec -T web npx prisma migrate deploy || {
        echo "❌ Критическая ошибка при применении миграций"
        echo "Проверьте логи: $DOCKER_COMPOSE logs web"
        exit 1
    }
}

echo "6️⃣ Генерируем Prisma Client..."
$DOCKER_COMPOSE exec -T web npx prisma generate || echo "⚠️  Ошибка при генерации Prisma Client"

echo ""
echo "✅ Исправление завершено!"
echo ""
echo "📋 Статус контейнеров:"
$DOCKER_COMPOSE ps

echo ""
echo "🔍 Проверка подключения:"
$DOCKER_COMPOSE exec -T web env | grep DATABASE_URL || echo "⚠️  DATABASE_URL не найден"

