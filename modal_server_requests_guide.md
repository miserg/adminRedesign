// Пример реального модала для управления базой данных
module.exports = {
    get: async function (req, res) {
        try {
            // ЧАСТЬ 1: HTML интерфейс модала
            if (req.query?.ui === '1') {
                // Получаем список доступных баз данных с сервера
                let databaseOptions = '';
                if (global.multiVerze && Array.isArray(global.multiVerze)) {
                    for (const db of global.multiVerze) {
                        databaseOptions += `<option value="${db.connection}">${db.name}</option>`;
                    }
                }

                const content = `
                    <div class="form-grid">
                        <label>Выберите базу данных</label>
                        <select id="database-select" required>
                            <option value="">-- Выберите базу --</option>
                            ${databaseOptions}
                        </select>

                        <label>Действие</label>
                        <select id="action-select" required>
                            <option value="backup">Создать бэкап</option>
                            <option value="restore">Восстановить из бэкапа</option>
                            <option value="optimize">Оптимизировать</option>
                            <option value="check">Проверить целостность</option>
                        </select>

                        <label>Комментарий (необязательно)</label>
                        <textarea id="comment-field" rows="3" placeholder="Опишите цель операции..."></textarea>

                        <label>Создать лог операции</label>
                        <input type="checkbox" id="create-log" checked />
                    </div>
                `;

                const buttons = `
                    <button class="btn btn-secondary" onclick="closeModal('dynamic-modal')">Отмена</button>
                    <button class="btn btn-primary" id="btn-database-action">Выполнить</button>
                `;

                return res.json({
                    title: 'Управление базой данных',
                    content,
                    buttons
                });
            }

            // ЧАСТЬ 2: JavaScript код для кнопок
            if (req.query?.script === '1') {
                const module = `
                    export function init(host) {
                        const btn = host.querySelector('#btn-database-action');
                        if (!btn || btn.dataset.bound) return;

                        btn.addEventListener('click', () => {
                            // Получаем данные из формы
                            const database = host.querySelector('#database-select').value;
                            const action = host.querySelector('#action-select').value;
                            const comment = host.querySelector('#comment-field').value;
                            const createLog = host.querySelector('#create-log').checked;

                            // Проверяем обязательные поля
                            if (!database) {
                                alert('Пожалуйста, выберите базу данных');
                                return;
                            }

                            if (!action) {
                                alert('Пожалуйста, выберите действие');
                                return;
                            }

                            // Строим параметры запроса
                            const params = new URLSearchParams();
                            params.set('database', database);
                            params.set('action', action);
                            if (comment) params.set('comment', comment);
                            params.set('create_log', createLog);

                            // Отправляем запрос на сервер
                            const command = \`database_manager?\${params.toString()}\`;
                            window.spust(command);

                            // Закрываем модал
                            window.closeModal?.('dynamic-modal');
                        });

                        btn.dataset.bound = '1';
                    }
                `;

                return res.json({ module });
            }

            // ЧАСТЬ 3: РЕАЛЬНОЕ ВЫПОЛНЕНИЕ ОПЕРАЦИИ
            // Сюда попадаем, когда пользователь нажал "Выполнить"

            const database = req.query.database;
            const action = req.query.action;
            const comment = req.query.comment || '';
            const createLog = req.query.create_log === 'true';

            // Логируем начало операции
            console.log(`Начинаем операцию: ${action} для базы: ${database}`);
            if (comment) {
                console.log(`Комментарий: ${comment}`);
            }

            // Выполняем операцию в зависимости от выбранного действия
            let result;
            switch (action) {
                case 'backup':
                    result = await performBackup(database, comment);
                    break;

                case 'restore':
                    result = await performRestore(database, comment);
                    break;

                case 'optimize':
                    result = await performOptimize(database);
                    break;

                case 'check':
                    result = await performCheck(database);
                    break;

                default:
                    throw new Error(`Неизвестное действие: ${action}`);
            }

            // Создаем лог операции, если нужно
            if (createLog) {
                await createOperationLog(database, action, comment, result);
            }

            // Возвращаем результат
            res.json({
                success: true,
                message: `Операция ${action} выполнена успешно`,
                result: result
            });

        } catch (error) {
            console.error('Ошибка в database_manager:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ваша бизнес-логика)

async function performBackup(database, comment) {
    // Здесь реальная логика создания бэкапа
    console.log(`Создаем бэкап базы данных: ${database}`);

    // Пример: вызов внешней команды или работа с API
    const { execSync } = require('child_process');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = \`backup_\${database}_\${timestamp}.bak\`;

    // Здесь был бы реальный код создания бэкапа
    // execSync(\`sqlcmd -S server -Q "BACKUP DATABASE [\${database}] TO DISK='\${backupName}'"\`);

    return {
        backupName: backupName,
        size: '150 MB',
        duration: '2 минуты'
    };
}

async function performRestore(database, comment) {
    console.log(`Восстанавливаем базу данных: ${database}`);

    // Здесь была бы реальная логика восстановления
    return {
        restoredFrom: 'backup_20231201.bak',
        duration: '5 минут'
    };
}

async function performOptimize(database) {
    console.log(`Оптимизируем базу данных: ${database}`);

    // Здесь была бы реальная логика оптимизации
    return {
        tablesOptimized: 25,
        indexesRebuilt: 12,
        spaceSaved: '50 MB'
    };
}

async function performCheck(database) {
    console.log(`Проверяем целостность базы данных: ${database}`);

    // Здесь была бы реальная логика проверки
    return {
        status: 'OK',
        errorsFound: 0,
        warningsFound: 2
    };
}

async function createOperationLog(database, action, comment, result) {
    console.log(`Создаем лог операции: ${action} для ${database}`);

    // Здесь можно сохранить лог в файл или базу данных
    const logEntry = {
        timestamp: new Date().toISOString(),
        database: database,
        action: action,
        comment: comment,
        result: result,
        user: 'admin' // можно получить из req.session
    };

    // Например, сохранить в файл
    const fs = require('fs');
    const logFile = 'database_operations.log';
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
}
