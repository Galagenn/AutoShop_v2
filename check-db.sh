#!/bin/bash

# Скрипт для диагностики проблем с базой данных
# Использование: ./check-db.sh

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

echo "🔍 Диагностика подключения к базе данных..."
echo ""

echo "1️⃣ Статус контейнеров:"
$DOCKER_COMPOSE ps
echo ""

echo "2️⃣ Переменная DATABASE_URL в контейнере web:"
$DOCKER_COMPOSE exec -T web env | grep DATABASE_URL || echo "❌ DATABASE_URL не найден"
echo ""

echo "3️⃣ Проверка доступности базы данных из контейнера web:"
$DOCKER_COMPOSE exec -T web sh -c "nc -zv db 5432 2>&1 || echo '❌ Не удается подключиться к db:5432'" || echo "⚠️  nc не установлен, пропускаем проверку"
echo ""

echo "4️⃣ Логи базы данных (последние 30 строк):"
$DOCKER_COMPOSE logs --tail=30 db
echo ""

echo "5️⃣ Логи приложения (последние 30 строк):"
$DOCKER_COMPOSE logs --tail=30 web
echo ""

echo "6️⃣ Попытка подключения к БД через Prisma:"
$DOCKER_COMPOSE exec -T web npx prisma db pull --force 2>&1 | head -20 || echo "❌ Ошибка подключения"
echo ""

echo "7️⃣ Проверка миграций:"
$DOCKER_COMPOSE exec -T web npx prisma migrate status 2>&1 || echo "❌ Ошибка проверки миграций"
echo ""

echo "✅ Диагностика завершена"

