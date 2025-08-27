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

| Переменная         | Пример значения                                              | Описание                                 |
|--------------------|-------------------------------------------------------------|------------------------------------------|
| NODE_ENV           | production                                                  | Режим окружения (production/development) |
| PORT               | 10000                                                       | Порт, на котором запускается сервер      |
| MONGODB_URI        | mongodb+srv://username:password@cluster.mongodb.net/sniplypro | Строка подключения к MongoDB Atlas       |
| ALLOWED_ORIGINS    | https://your-frontend.onrender.com                          | Разрешённые источники CORS               |
| SESSION_SECRET     | your-super-secret-session-key-here                          | Секрет для сессий/куки                  |

### Для Frontend (Environment Variables):

| Переменная         | Пример значения                        | Описание                                 |
|--------------------|----------------------------------------|------------------------------------------|
| REACT_APP_API_URL  | https://sniply-pro-api.onrender.com    | URL backend API для фронтенда            |
| PUBLIC_URL         | https://sniply-pro-frontend.onrender.com | Базовый URL фронтенда (если требуется)   |

> **Примечание:** Если фронтенд не использует переменные окружения (например, чистый HTML/JS), этот шаг можно пропустить. Для React/Vue/Next.js и других SPA переменные задаются через Dashboard Render или файл .env.production.

---

## Шаг 4: Настройка Custom Domains (опционально)

1. В настройках сервиса перейдите в "Custom Domains"
2. Добавьте ваш домен
3. Настройте DNS записи как указано в инструкции

## Шаг 5: Мониторинг и логи

- Используйте Render Dashboard для просмотра логов
- Настройте alerts в разделе "Settings" → "Alerts"
- Мониторинг здоровья через `/api/health` endpoint

## Troubleshooting

### common issues:
1. **MongoDB connection fails**: Проверьте whitelist IP в MongoDB Atlas
2. **Build fails**: Проверьте версию Node.js в package.json
3. **CORS errors**: Проверьте ALLOWED_ORIGINS переменную
4. **Static files not serving**: Проверьте пути в статическом сервисе

## Support

Если возникли проблемы:
1. Проверьте логи в Render Dashboard
2. Убедитесь что все environment variables установлены
3. Проверьте подключение к MongoDB

---

> **Совет:** Не публикуйте реальные секреты и пароли в публичном репозитории. Используйте `.env.example` для шаблона.

## Готово!

После деплоя проверьте `/api/health` для проверки статуса сервера.
