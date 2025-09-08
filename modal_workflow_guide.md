# 🛠️ Пошаговое руководство: Как создать модальное окно

## Шаг 1: Определите, что должен делать модал
**Вопросы для себя:**
- Какую задачу решает? (например: "настроить подключение к базе")
- Какие поля нужны пользователю? (текст, списки, чекбоксы)
- Что происходит при нажатии "Выполнить"?

## Шаг 2: Создайте файл модала
```bash
# Создайте файл в папке NEWADMIN/
# Имя: ваша_функция.js (например: database_config.js)
```

## Шаг 3: Скопируйте шаблон
```javascript
// Используйте готовый шаблон из modal_template_example.js
// Измените только содержимое внутри
```

## Шаг 4: Настройте HTML форму

### 4.1 Заголовок:
```javascript
const title = 'Ваш заголовок';  // Что видит пользователь вверху
```

### 4.2 Содержимое:
```javascript
const content = `
    <div class="form-grid">
        <!-- Ваши поля здесь -->
    </div>
`;
```

### 4.3 Доступные типы полей:

#### Текстовое поле:
```html
<label>Название поля</label>
<input type="text" id="my-field" value="значение по умолчанию" />
```

#### Выпадающий список:
```html
<label>Выберите опцию</label>
<select id="my-select">
    <option value="val1">Вариант 1</option>
    <option value="val2" selected>Вариант 2 (выбран по умолчанию)</option>
</select>
```

#### Чекбокс:
```html
<label>Включить функцию</label>
<input type="checkbox" id="my-checkbox" checked />
```

#### Числовое поле:
```html
<label>Количество</label>
<input type="number" id="my-number" value="10" min="1" max="100" />
```

#### Многострочное поле:
```html
<label>Описание</label>
<textarea id="my-textarea" rows="3">Текст по умолчанию</textarea>
```

## Шаг 5: Добавьте кнопки
```javascript
const buttons = `
    <button class="btn btn-secondary" onclick="closeModal('dynamic-modal')">Отмена</button>
    <button class="btn btn-primary" id="btn-my-action">Выполнить</button>
`;
```

## Шаг 6: Настройте JavaScript логику

### 6.1 Базовая структура:
```javascript
export function init(host) {
    const btn = host.querySelector('#btn-my-action');
    if (!btn || btn.dataset.bound) return;

    btn.addEventListener('click', () => {
        // Ваша логика здесь
    });

    btn.dataset.bound = '1';
}
```

### 6.2 Получение данных из полей:
```javascript
// Текстовое поле
const textValue = host.querySelector('#my-field').value;

// Выпадающий список
const selectValue = host.querySelector('#my-select').value;

// Чекбокс
const checkboxValue = host.querySelector('#my-checkbox').checked; // true/false

// Числовое поле
const numberValue = parseInt(host.querySelector('#my-number').value);
```

### 6.3 Отправка команды на сервер:
```javascript
// Построить параметры
const params = new URLSearchParams();
params.set('param1', textValue);
params.set('param2', selectValue);
params.set('param3', checkboxValue);

// Выполнить команду (замените 'your_endpoint' на реальное имя)
const command = `your_endpoint?${params.toString()}`;
window.spust(command);

// Закрыть модал
window.closeModal?.('dynamic-modal');
```

## Шаг 7: Добавьте кнопку в интерфейс

### 7.1 Откройте файл newadmin.html
### 7.2 Найдите подходящую секцию (например, "Vývojářské nástroje")
### 7.3 Добавьте новую кнопку:

```html
<div class="section-item" onclick="openModal('ваш_модал-modal')" data-module-name="ваш_модал">
    <div class="item-icon"><i class="mdi mdi-cog"></i></div>
    <div class="item-name">Название вашего модала</div>
</div>
```

## Шаг 8: Зарегистрируйте маршрут

### 8.1 Откройте файл router.js
### 8.2 Добавьте строку:

```javascript
router.get('/ваш_модал', (req, res) => require2('NEWADMIN/ваш_модал.js').get(req, res));
```

## Шаг 9: Тестирование

1. **Запустите сервер**
2. **Откройте админ панель**
3. **Нажмите на вашу кнопку**
4. **Проверьте, что модал открывается**
5. **Заполните поля и нажмите "Выполнить"**

## 🎯 Чек-лист готовности:

- [ ] Файл модала создан в папке NEWADMIN/
- [ ] HTML форма с полями настроена
- [ ] Кнопки добавлены
- [ ] JavaScript логика написана
- [ ] Кнопка добавлена в newadmin.html
- [ ] Маршрут зарегистрирован в router.js
- [ ] Модал тестируется и работает

## 🚫 Частые ошибки:

1. **Забыли добавить id к полям** - без id нельзя получить значение
2. **Неправильное имя endpoint'а** - должно совпадать с именем файла
3. **Забыли закрыть модал** - пользователь не поймет, что действие выполнено
4. **Не проверили, что кнопка уже обработана** - может привести к дублированию событий

## 💡 Полезные советы:

- **Копируйте существующие модалы** - не изобретайте велосипед
- **Используйте понятные id** - `config-database`, а не `field1`
- **Добавляйте валидацию** - проверяйте, что поля заполнены
- **Тестируйте на разных данных** - пустые поля, большие значения и т.д.
