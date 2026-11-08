// utils/logger.js

// ID роли, которую нужно пинговать при ошибке
const LOG_ROLE_ID = '896729031561609257';

function getFileNameFromStack(error) {
    try {
        const stackLines = error.stack.split('\n');
        for (const line of stackLines) {
            // Пропускаем внутренности Node.js и библиотек
            if (line.includes('node_modules') || line.includes('node:internal') || line.includes('node:events')) {
                continue;
            }

            // Ищем путь к файлу .js
            const match = line.match(/\(?([A-Za-z]:\\[^:]+\.js|\/[^:]+\.js):\d+:\d+\)?/);
            if (match && match[1]) {
                const fullPath = match[1].replace(/\\/g, '/');
                const parts = fullPath.split('/');
                // Возвращаем последние две части пути (например, Karthus/reaction.js)
                if (parts.length >= 2) return parts.slice(-2).join('/');
                return parts[parts.length - 1];
            }
        }
        return 'Неизвестный модуль';
    } catch (e) {
        return 'Неизвестный модуль';
    }
}

// Третий аргумент message оставлен, чтобы не ломать вызовы из index.js, но он больше НЕ ИСПОЛЬЗУЕТСЯ для отправки в чат
async function logError(client, error, message = null, channelId = '522817871370387472') {
    const fileName = getFileNameFromStack(error);
    const errorMessage = error.message || String(error);

    // 1. Выводим в консоль (для хостинга)
    console.error(`[ОШИБКА в ${fileName}]:`, error);

    // 2. Отправляем ТОЛЬКО в центральный канал для логов
    try {
        const mention = `<@&${LOG_ROLE_ID}> `;
        const shortError = errorMessage.length > 500 ? errorMessage.substring(0, 500) + '...' : errorMessage;
        const logText = `🔴 **Ошибка в модуле:** \`${fileName}\`\n**Текст:** \`${shortError}\`\n*Бот: ${client.user?.tag || 'Неизвестно'}*`;

        const channel = client.channels.cache.get(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(`${mention}\n${logText}`);
        }
    } catch (sendErr) {
        console.error('[Logger] Не удалось отправить лог в центральный канал:', sendErr.message);
    }
}

module.exports = { logError };