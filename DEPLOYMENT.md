# 🚀 Развертывание SniplyPro на Render

## Предварительные требования

1. Аккаунт на [Render.com](https://render.com)
2. Аккаунт на [MongoDB Atlas](https://www.mongodb.com/atlas) (для production)
3. GitHub репозиторий с кодом

## Шаг 1: Подготовка MongoDB Atlas

1. Создайте кластер в MongoDB Atlas
2. Получите connection string
3. Добавьте IP адреса Render в whitelist:
   - `0.0.0.0/0` (для всех) или
   - Конкретные IP адреса Render

## Шаг 2: Настройка на Render

### Вариант A: Использование render.yaml (рекомендуется)

1. Сделайте fork репозитория
2. В Render Dashboard выберите "New" → "Blueprint"
3. Укажите ссылку на ваш репозиторий
4. Render автоматически определит конфигурацию

### Вариант B: Ручное создание сервисов

#### Backend Service (Web Service)
- **Name**: `sniply-pro-api`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && node app.js`
- **Plan**: `Free` или `Starter`

#### Frontend Service (Static Site)
- **Name**: `sniply-pro-frontend`
- **Environment**: `Static Site`
- **Build Command**: `echo "No build needed"`
- **Publish Directory**: `client`
- **Plan**: `Free`

#### Database (MongoDB)
- **Name**: `sniply-pro-mongodb`
- **Plan**: `Free` (или выше для production)

## Шаг 3: Настройка Environment Variables

Добавьте в Dashboard каждого сервиса:

### Для Backend (Web Service):
