#!/bin/bash

# Скрипт для обновления приложения на сервере
# Использование: ./deploy.sh

set -e  # Остановка при ошибке

# Определяем команду docker compose (новая версия) или docker-compose (старая)
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
else
    echo "❌ Docker Compose не найден. Установите docker-compose или используйте новую версию Docker с docker compose"
    exit 1
fi

echo "🚀 Начинаем обновление приложения..."
echo "📦 Используем команду: $DOCKER_COMPOSE"

# Переходим в директорию проекта
cd /opt/AutoShop_v2 || cd /opt/AutoShop_v3 || { echo "❌ Директория проекта не найдена"; exit 1; }

echo "📥 Получаем обновления из git..."
git pull origin main || git pull origin master || { echo "❌ Ошибка при git pull"; exit 1; }

echo "🔍 Проверяем статус git..."
git status

echo "🐳 Останавливаем контейнеры..."
$DOCKER_COMPOSE down || { echo "⚠️  Контейнеры уже остановлены или не запущены"; }

echo "🔨 Пересобираем контейнеры..."
$DOCKER_COMPOSE build --no-cache web || { echo "❌ Ошибка при сборке"; exit 1; }

echo "🚀 Запускаем контейнеры..."
$DOCKER_COMPOSE up -d || { echo "❌ Ошибка при запуске"; exit 1; }

echo "⏳ Ждем запуска базы данных..."
sleep 10

echo "🔍 Проверяем статус контейнеров..."
$DOCKER_COMPOSE ps

echo "🔍 Проверяем подключение к базе данных..."
$DOCKER_COMPOSE exec -T db pg_isready -U postgres || { 
    echo "⚠️  База данных еще не готова, ждем еще 5 секунд...";
    sleep 5;
}

echo "📊 Применяем миграции Prisma..."
$DOCKER_COMPOSE exec -T web npx prisma migrate deploy || { 
    echo "⚠️  Ошибка при применении миграций, пробуем альтернативный способ...";
    $DOCKER_COMPOSE exec -T web npm run prisma:deploy || {
        echo "❌ Критическая ошибка при применении миграций";
        exit 1;
    }
}

echo "🔄 Генерируем Prisma Client..."
$DOCKER_COMPOSE exec -T web npx prisma generate || { echo "⚠️  Ошибка при генерации Prisma Client"; }

echo "🔍 Проверяем переменные окружения в контейнере web..."
$DOCKER_COMPOSE exec -T web env | grep DATABASE_URL || echo "⚠️  DATABASE_URL не найден в переменных окружения"

echo "✅ Обновление завершено!"
echo "📋 Статус контейнеров:"
$DOCKER_COMPOSE ps

echo "📝 Логи приложения (последние 50 строк):"
$DOCKER_COMPOSE logs --tail=50 web

echo ""
echo "🔍 Для диагностики проблем с БД выполните:"
echo "  $DOCKER_COMPOSE logs db"
echo "  $DOCKER_COMPOSE exec web env | grep DATABASE_URL"
echo "  $DOCKER_COMPOSE exec web npx prisma db pull"

