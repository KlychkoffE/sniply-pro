const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

// Получение аналитики по ссылке
router.get('/:linkId', async (req, res) => {
  try {
    const link = await Link.findById(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Ссылка не найдена' });
    }

    // Здесь можно добавить более детальную аналитику
    res.json({
      totalClicks: link.clicks,
      createdAt: link.createdAt,
      lastClick: link.updatedAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получение аналитики за период
router.get('/:linkId/period', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    // Логика для получения аналитики за период
    res.json({ message: 'Аналитика за период' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
