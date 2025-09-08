# 📚 Примеры модальных окон в NEWADMIN - Объяснения

## 🎯 Простой пример: Обновление структур базы данных

**Что делает**: Позволяет пользователю выбрать базу данных и обновить её структуру

### HTML часть (что видит пользователь):
```html
<div class="form-grid">
    <label>Databáze (multi)</label>
    <select id="structures-multi" name="dbmulti">
        <option value="ALL">VŠE</option>
        <!-- Здесь динамически добавляются базы данных -->
    </select>

    <label>Zdroj</label>
    <select id="structures-source" name="odkud">
        <option value="OSTRA">OSTRÁ</option>
        <option value="DISTR">DISTRIBUCE</option>
    </select>

    <label>Seznam pluginů</label>
    <input id="structures-plugins" type="text" value="METADATA" />
</div>
```

### Кнопки:
```html
<button class="btn btn-secondary" onclick="closeModal('dynamic-modal')">Zrušit</button>
<button class="btn btn-primary" id="btn-structures-run">Spustit</button>
```

---

## 🚀 Более сложный пример: Firststart с условиями

**Что делает**: Имеет два режима - обычный и мультиверсионный

### Условная логика:
```javascript
if (req.query.type === 'multiverze') {
    // Показать форму для мультиверсии
    const content = `
        <div class="form-grid">
            <label>Databáze (multi)</label>
            <select name="dbmultistruktury" id="firststart-mv-multi">
                <option value="ALL">VŠECHNY</option>
                ${options} <!-- Динамически добавленные опции -->
            </select>
        </div>
    `;
} else {
    // Показать обычную форму
    const content = `
        <div class="form-grid">
            <label>Parametr verze</label>
            <select id="firststart-param">
                <option value="COMPATIBLE">COMPATIBLE</option>
                <option value="UNCOMPATIBLE">UNCOMPATIBLE</option>
            </select>
        </div>
    `;
}
```

---

## 🎨 Стили для форм

### form-grid класс:
Автоматически создает красивую сетку "подпись - поле":

```css
.form-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 16px;
    align-items: center;
}
```

### Доступные элементы:
- `<input type="text">` - текстовое поле
- `<select>` - выпадающий список
- `<input type="checkbox">` - чекбокс
- `<textarea>` - многострочное поле
- `<input type="number">` - числовое поле

---

## 🔧 JavaScript часть (логика кнопок)

### Базовый паттерн:
```javascript
export function init(host) {
    // 1. Найти кнопку
    const btn = host.querySelector('#btn-my-action');
    if (!btn || btn.dataset.bound) return;

    // 2. Добавить обработчик клика
    btn.addEventListener('click', () => {
        // 3. Получить данные из формы
        const value1 = host.querySelector('#field1').value;
        const value2 = host.querySelector('#field2').value;

        // 4. Построить команду
        const params = new URLSearchParams();
        params.set('param1', value1);
        params.set('param2', value2);

        // 5. Выполнить команду
        window.spust(`endpoint?${params.toString()}`);

        // 6. Закрыть модал
        window.closeModal?.('dynamic-modal');
    });

    // 7. Пометить кнопку как обработанную
    btn.dataset.bound = '1';
}
```

---

## 🗂️ Типичные задачи для модалов:

### 1. **Конфигурационные модалы**
- Настройка параметров системы
- Выбор опций из списка
- Включение/выключение функций

### 2. **Операционные модалы**
- Запуск процессов с параметрами
- Выбор базы данных для операции
- Подтверждение действий

### 3. **Информационные модалы**
- Показ статуса
- Отображение результатов
- Справочная информация

---

## 🎯 Ваши основные задачи:

1. **Создать HTML форму** - поля и их подписи
2. **Добавить кнопки** - что может делать пользователь
3. **Написать JavaScript** - что происходит при нажатии кнопок
4. **Обработать данные** - что делать с введенными значениями

## 🚫 Что НЕ нужно знать:

- Как работает Express/Node.js - это уже настроено
- Как работают WebSocket - используется автоматически
- Как работает база данных - есть готовые функции
- Как работает аутентификация - уже реализована
