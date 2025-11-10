#!/bin/bash

# Скрипт для инициализации базы данных
# Использование: ./init-db.sh

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

echo "🔍 Проверяем статус контейнеров..."
$DOCKER_COMPOSE ps

echo ""
echo "🐳 Запускаем контейнер БД (если не запущен)..."
$DOCKER_COMPOSE up -d db

echo "⏳ Ждем запуска базы данных..."
sleep 10

echo "🔍 Проверяем доступность БД..."
$DOCKER_COMPOSE exec -T db pg_isready -U postgres || {
    echo "❌ База данных не готова"
    exit 1
}

echo "📊 Проверяем существование базы данных autoshop..."
DB_EXISTS=$($DOCKER_COMPOSE exec -T db psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='autoshop'")

if [ -z "$DB_EXISTS" ]; then
    echo "📝 База данных autoshop не существует, создаем..."
    $DOCKER_COMPOSE exec -T db psql -U postgres -c "CREATE DATABASE autoshop;"
    echo "✅ База данных autoshop создана"
else
    echo "✅ База данных autoshop уже существует"
fi

echo ""
echo "📊 Применяем миграции Prisma..."
$DOCKER_COMPOSE exec -T web npx prisma migrate deploy || {
    echo "⚠️  Ошибка при применении миграций"
    echo "Пробуем запустить контейнер web сначала..."
    $DOCKER_COMPOSE up -d web
    sleep 5
    $DOCKER_COMPOSE exec -T web npx prisma migrate deploy || {
        echo "❌ Критическая ошибка при применении миграций"
        exit 1
    }
}

echo "🔄 Генерируем Prisma Client..."
$DOCKER_COMPOSE exec -T web npx prisma generate || echo "⚠️  Ошибка при генерации Prisma Client"

echo ""
echo "✅ Инициализация завершена!"
echo "📋 Статус контейнеров:"
$DOCKER_COMPOSE ps

