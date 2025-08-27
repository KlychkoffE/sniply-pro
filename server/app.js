require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const path = require('path');

// Импорт маршрутов
const linkRoutes = require('./routes/links');
const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
      scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));

app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS || [
    'http://localhost:3000',
    'https://sniply-pro-frontend.onrender.com'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Лимит запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sniplypro';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// Статические файлы (для разработки)
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../client')));
}

// Маршруты API
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

// Главная страница (редирект на фронтенд в production)
app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    res.redirect(process.env.FRONTEND_URL || 'https://sniply-pro-frontend.onrender.com');
  } else {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  }
});

// Обработка коротких ссылок
app.get('/s/:shortCode', async (req, res) => {
  try {
    const Link = require('./models/Link');
    const link = await Link.findOne({ shortCode: req.params.shortCode });
    
    if (!link) {
      return res.status(404).send('Ссылка не найдена');
    }

    link.clicks++;
    await link.save();
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Обработка ошибок 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close();
    console.log('Process terminated');
  });
});

module.exports = app;
