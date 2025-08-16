const puppeteer = require('puppeteer');
const cache = new Map();
let cmdLimiter = -1;

const classMap = {
    1: 'Воин',
    2: 'Паладин',
    3: 'Охотник',
    4: 'Разбойник',
    5: 'Жрец',
    6: 'Рыцарь смерти',
    7: 'Шаман',
    8: 'Маг',
    9: 'Чернокнижник',
    11: 'Друид'
};

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;

    const now = Date.now();
    const content = message.content.trim();

    if (!content.startsWith('!гильдия')) return;

    if (cmdLimiter > now) {
        const remaining = Math.round((cmdLimiter - now) / 1000);
        return message.channel.send(`[Sirus] — подожди ${remaining} сек.`);
    }

    const guildId = content.split(' ')[1] || '8685';
    const cacheKey = `guild_${guildId}`;

    if (cache.has(cacheKey)) {
        return message.channel.send(cache.get(cacheKey));
    }

    try {
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.goto(`https://sirus.su/guild/${guildId}`, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(async (guildId) => {
            try {
                const res = await fetch(`https://sirus.su/api/base/57/guild/${guildId}`);
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        }, guildId);

        await browser.close();

        if (!data || !Array.isArray(data.members) || !Array.isArray(data.ranks)) {
            return message.channel.send(`[Sirus] — не удалось получить участников гильдии ${guildId}.`);
        }

        const rankMap = Object.fromEntries(data.ranks.map(r => [r.rid, r.rname]));

        const formatted = data.members
            .slice(0, 10)
            .map(m => {
                const className = classMap[m.class] || `Класс ${m.class}`;
                const rankName = rankMap[m.rank] || `Звание ${m.rank}`;
                const ilvl = m.ilvl || '?';
                return `**${m.name}** — ${className}, ${ilvl}, ${rankName}`;
            })
            .join('\n');


        const result = `🛡️ Гильдия **${data.name || 'Без названия'}** (${guildId}):\n${formatted}`;
        cache.set(cacheKey, result);
        cmdLimiter = now + 60 * 1000;

        return message.channel.send(result);
    } catch (err) {
        message.channel.send('<@542663623789641729> Сирус упал <a:hlepng:882291167948079165>');
        const control = client.channels.cache.get('878520465856036935');
        control?.send(`[Sirus] — ошибка при парсинге: ${err.message}`);
        console.error(`[Sirus] — ошибка:`, err);
    }
};
