#!/bin/bash
echo "🚀 Building SniplyPro for Render..."

# Установка зависимостей для сервера
cd server
echo "📦 Installing server dependencies..."
npm install --production

# Если нужно собрать фронтенд
cd ../client
echo "🏗️  Building frontend..."
# Здесь могут быть команды сборки фронтенда (если используете React/Vue)

echo "✅ Build completed successfully!"
