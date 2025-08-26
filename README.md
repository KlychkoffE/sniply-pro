# SniplyPro - Продвинутый конструктор CTA

SniplyPro - это мощное веб-приложение для создания призывов к действию (CTA) на любых веб-страницах с расширенными возможностями маскировки ссылок.

## Возможности

- 📝 Создание кастомных CTA с текстом, изображениями и кнопками
- 🎨 Расширенные настройки стилей (цвета, шрифты, тени, скругления)
- 🔗 Маскировка ссылок с поддержкой пользовательских доменов и путей
- 📊 Предпросмотр в реальном времени
- 🖱️ Перетаскивание элементов интерфейса
- 📱 Адаптивный дизайн

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/KlychkoffE/sniply-pro.git
```
Откройте index.html в браузере или разместите на веб-сервере.

## Использование
Введите целевой URL в соответствующее поле

Настройте внешний вид CTA с помощью панели свойств

Настройте маскировку ссылки при необходимости

Сгенерируйте ссылку и скопируйте ее

## API Endpoints

| Метод   | Endpoint                | Описание                              |
|---------|-------------------------|---------------------------------------|
| POST    | /api/links/create       | Создание новой ссылки с CTA           |
| GET     | /api/links/:linkId      | Получение информации о ссылке         |
| PUT     | /api/links/:linkId      | Обновление ссылки                     |
| DELETE  | /api/links/:linkId      | Удаление ссылки                       |
| GET     | /api/analytics/:linkId  | Получение аналитики                   |

## Пример работы с API через класс

```js
// API функции
class SniplyAPI {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }

  async createLink(linkData) {
    const response = await fetch(`${this.baseUrl}/links/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(linkData)
    });
    return response.json();
  }

  async getLink(linkId) {
    const response = await fetch(`${this.baseUrl}/links/${linkId}`);
    return response.json();
  }

  async getAnalytics(linkId) {
    const response = await fetch(`${this.baseUrl}/analytics/${linkId}`);
    return response.json();
  }
}

// Инициализация API
const api = new SniplyAPI();
```

## Технологии
HTML5, CSS3, JavaScript (ES6+)

Font Awesome для иконок

CSS Grid и Flexbox для布局

## Лицензия
Этот проект распространяется под лицензией MIT. Подробнее см. в файле LICENSE.

## Вклад в проект
Мы приветствуем вклад в развитие проекта! Пожалуйста, ознакомьтесь с руководством по внесению изменений.

## Обратная связь
Если у вас есть вопросы или предложения, создайте issue в репозитории проекта.
