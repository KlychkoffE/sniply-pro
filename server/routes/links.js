const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const validUrl = require('valid-url');
const puppeteer = require('puppeteer');

// Создание новой ссылки с CTA
router.post('/create', async (req, res) => {
  try {
    const { originalUrl, ctaData, masking, customCode } = req.body;

    // Валидация URL
    if (!validUrl.isWebUri(originalUrl)) {
      return res.status(400).json({ error: 'Некорректный URL' });
    }

    // Проверка на существующий customCode
    if (customCode) {
      const existingLink = await Link.findOne({ customCode });
      if (existingLink) {
        return res.status(400).json({ error: 'Этот код уже используется' });
      }
    }

    // Создание новой ссылки
    const link = new Link({
      originalUrl,
      ctaData,
      masking,
      customCode
    });

    await link.save();

    // Генерация короткой ссылки
    const shortUrl = `${req.protocol}://${req.get('host')}/s/${link.shortCode}`;
    const maskedUrl = generateMaskedUrl(link, req);

    res.json({
      success: true,
      shortUrl,
      maskedUrl,
      linkId: link._id
    });

  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании ссылки' });
  }
});

// Получение информации о ссылке
router.get('/:linkId', async (req, res) => {
  try {
    const link = await Link.findById(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Ссылка не найдена' });
    }

    res.json({
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      ctaData: link.ctaData,
      clicks: link.clicks,
      createdAt: link.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновление ссылки
router.put('/:linkId', async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.linkId,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      link
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении' });
  }
});

// Удаление ссылки
router.delete('/:linkId', async (req, res) => {
  try {
    await Link.findByIdAndDelete(req.params.linkId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении' });
  }
});

// Генерация маскированной ссылки
function generateMaskedUrl(link, req) {
  if (link.masking.enabled) {
    if (link.masking.customDomain) {
      return `https://${link.masking.customDomain}${link.masking.customPath || ''}`;
    }
    return `${req.protocol}://${req.get('host')}${link.masking.customPath || '/s/' + link.shortCode}`;
  }
  return `${req.protocol}://${req.get('host')}/s/${link.shortCode}`;
}

module.exports = router;
