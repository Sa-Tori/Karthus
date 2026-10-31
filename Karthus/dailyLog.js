module.exports = (client) => {
    setInterval(() => {
        const now = new Date();
        // Время по Москве (UTC+3)
        const mskTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Moscow' }));

        if (mskTime.getHours() === 3 && mskTime.getMinutes() === 0) {
            const LOG_CHANNEL_ID = '522817871370387472';
            const channel = client.channels.cache.get(LOG_CHANNEL_ID);

            if (channel) {
                channel.send('🕒 **3:00 МСК**: Бот Картус успешно пропинговал сам себя и работает в штатном режиме.')
                    .catch(err => console.error('Ошибка отправки лога:', err));
            }
        }
    }, 60 * 1000); // Проверка раз в минуту
};