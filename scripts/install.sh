#!/bin/bash

# SniplyPro Installation Script for Ubuntu 20.04+

echo "Установка SniplyPro на Linux сервер..."

# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Установка MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Установка Nginx
sudo apt install -y nginx

# Установка PM2
sudo npm install -g pm2

# Клонирование репозитория
cd /opt
sudo git clone https://github.com/your-username/sniply-pro.git
sudo chown -R $USER:$USER sniply-pro

# Установка зависимостей
cd sniply-pro/server
npm install

# Настройка Nginx
sudo cp ../nginx/sniply-pro.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/sniply-pro.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Запуск приложения
pm2 start app.js --name "sniply-pro"
pm2 startup
pm2 save

echo "Установка завершена!"
echo "Приложение доступно по адресу: http://your-server-ip"
