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
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Лимит запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // максимум 100 запросов с одного IP
});
app.use('/api/', limiter);

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sniplypro', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Статические файлы
app.use(express.static(path.join(__dirname, '../client')));

// Маршруты API
app.use('/api/links', linkRoutes);
app.use('/api/analytics', analyticsRoutes);

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Обработка коротких ссылок
app.get('/s/:shortCode', async (req, res) => {
  try {
    const Link = require('./models/Link');
    const link = await Link.findOne({ shortCode: req.params.shortCode });
    
    if (!link) {
      return res.status(404).send('Ссылка не найдена');
    }

    // Увеличиваем счетчик кликов
    link.clicks++;
    await link.save();

    // Здесь будет логика с Puppeteer для модификации страницы
    res.redirect(link.originalUrl);
  } catch (error) {
    res.status(500).send('Ошибка сервера');
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так!');
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
