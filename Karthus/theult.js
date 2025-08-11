const page = 'theult';
let cmdLimiter = -1;

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;

    try {
        const now = Date.now();
        const content = message.content;

        const isTrigger =
            content.startsWith('Картус ультуй') ||
            content.startsWith('Картус где ганги');

        if (!isTrigger) return;

        if (cmdLimiter > now) {
            const remaining = Math.round((cmdLimiter - now) / 1000);
            return message.channel.send(`[R] - ${remaining} сек.`);
        } else {
            message.channel.send('R');
            cmdLimiter = now + 200 * 1000; // 200 секунд
        }
    } catch (err) {
        message.channel.send('<@542663623789641729> мам, я упал <a:hlepng:882291167948079165>');
        const control = client.channels.cache.get('878520465856036935');
        control?.send('Мама, хлеп!');
        console.error(err);
    }
};
