// utils/logger.js

// ID роли, которую нужно пинговать при ошибке
const LOG_ROLE_ID = '896729031561609257';

function getFileNameFromStack(error) {
    try {
        const stackLines = error.stack.split('\n');
        if (stackLines.length > 1) {
            const match = stackLines[1].match(/\(?(.*?):\d+:\d+\)?/);
            if (match && match[1]) {
                const fullPath = match[1];
                const parts = fullPath.split(/[\\/]/);
                if (parts.length >= 2) return parts.slice(-2).join('/');
                return parts[parts.length - 1];
            }
        }
        return 'Неизвестный модуль';
    } catch (e) {
        return 'Неизвестный модуль';
    }
}

async function logError(client, error, message = null, channelId = '522817871370387472') {
    const fileName = getFileNameFromStack(error);
    const errorMessage = error.message || String(error);

    // 1. Выводим в консоль (для хостинга)
    console.error(`[ОШИБКА в ${fileName}]:`, error);

    const mention = `<@&${LOG_ROLE_ID}> `;
    const shortError = errorMessage.length > 500 ? errorMessage.substring(0, 500) + '...' : errorMessage;
    const logText = `🔴 **Ошибка в модуле:** \`${fileName}\`\n**Текст:** \`${shortError}\``;

    // 2. Отправляем в тот же канал, где произошла ошибка (если есть)
    if (message && message.channel) {
        try {
            await message.channel.send(`${mention}\n${logText}`);
        } catch (err) {
            // Если бот не может ответить в этот канал (нет прав и т.д.), просто игнорируем
            console.error(`[Logger] Не удалось отправить ошибку в исходный канал: ${err.message}`);
        }
    }

    // 3. Отправляем в центральный канал для логов
    try {
        const channel = client.channels.cache.get(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(`${mention}\n${logText}\n*Бот: ${client.user?.tag || 'Неизвестно'}*`);
        }
    } catch (sendErr) {
        console.error('[Logger] Не удалось отправить лог в центральный канал:', sendErr.message);
    }
}

module.exports = { logError };