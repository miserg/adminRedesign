// Шаблон для создания модального окна в NEWADMIN
// Копируйте этот файл и меняйте содержимое

module.exports = {
    get: async function (req, res) {
        try {
            // Если запрос с ?ui=1 - верни HTML для модала
            if (req.query?.ui === '1') {

                // 📝 ЗАГОЛОВОК - что видит пользователь вверху окна
                const title = 'Название вашего модала';

                // 🎨 СОДЕРЖИМОЕ - форма с полями
                const content = `
                    <div class="form-grid">
                        <label>Название поля</label>
                        <input type="text" id="my-input" value="Значение по умолчанию" />

                        <label>Выпадающий список</label>
                        <select id="my-select">
                            <option value="option1">Вариант 1</option>
                            <option value="option2">Вариант 2</option>
                        </select>

                        <label>Чекбокс</label>
                        <input type="checkbox" id="my-checkbox" checked />
                    </div>
                `;

                // 🔘 КНОПКИ - действия внизу окна
                const buttons = `
                    <button class="btn btn-secondary" onclick="closeModal('dynamic-modal')">Отмена</button>
                    <button class="btn btn-primary" id="btn-my-action">Выполнить</button>
                `;

                // Вернуть JSON с данными для модала
                return res.status(200).json({ title, content, buttons });
            }

            // Если запрос с ?script=1 - верни JavaScript код для кнопок
            if (req.query?.script === '1') {
                const module = `
                    export function init(host) {
                        // Найти кнопку "Выполнить" и добавить обработчик
                        const btn = host.querySelector('#btn-my-action');
                        if (!btn || btn.dataset.bound) return;

                        btn.addEventListener('click', () => {
                            // Получить значения из полей
                            const inputValue = host.querySelector('#my-input').value;
                            const selectValue = host.querySelector('#my-select').value;
                            const checkboxValue = host.querySelector('#my-checkbox').checked;

                            // Построить команду для сервера
                            const params = new URLSearchParams();
                            params.set('input', inputValue);
                            params.set('select', selectValue);
                            params.set('checkbox', checkboxValue);

                            const command = \`your_endpoint?\${params.toString()}\`;

                            // Выполнить команду
                            window.spust(command);

                            // Закрыть модал
                            window.closeModal?.('dynamic-modal');
                        });

                        btn.dataset.bound = '1';
                    }
                `;

                return res.status(200).json({ module });
            }

            // Если обычный запрос - выполнить действие
            // Здесь ваша бизнес-логика (работа с базой данных и т.д.)
            const inputParam = req.query.input;
            const selectParam = req.query.select;
            const checkboxParam = req.query.checkbox === 'true';

            // Выполнить действие...
            console.log('Выполняем действие с параметрами:', { inputParam, selectParam, checkboxParam });

            res.status(200).json({ success: true, message: 'Действие выполнено успешно' });

        } catch (error) {
            console.error('Ошибка в модале:', error);
            res.status(500).json({ error: 'Внутренняя ошибка сервера' });
        }
    }
};
