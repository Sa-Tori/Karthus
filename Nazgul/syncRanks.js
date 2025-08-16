const puppeteer = require('puppeteer');

const rankRoles = {
    //2: '1355442048743899197', // Зам. ГМ
    //3: '1201879091507384380', // Старший офицер
    //4: '1252297467899154443', // Офицер
    //5: '1273703852515921930', // Статик
    //6: '1406290532807868550', // Легенды
    //7: '1249200708054679553', // Рядовой
    //8: '1273061745753194557'  // Новичок
    2: '1406293586148065461', // Зам. ГМ
    3: '1406293679349436605', // Старший офицер
    4: '1406293653390889020', // Офицер
    5: '1406296405932380201', // Статик 
    6: '1406296436240420914', // Легенды 
    7: '1406293703714144289', // Рядовой
    8: '1406296459732582601'  // Новичок 
};

const IGNORED_USER_ID = '1051920919171436624';

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;
    if (!message.content.startsWith('!синхророли')) return;

    try {
        const guild = await client.guilds.fetch(message.guildId);

        // Загружаем участников по частям, чтобы избежать GuildMembersTimeout
        const members = await guild.members.list({ limit: 1000 });

        const browser = await puppeteer.launch({
            executablePath: '/opt/render/.cache/puppeteer/chrome/linux-139.0.7258.68/chrome-linux64/chrome',
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await page.goto('https://sirus.su/guild/8685', { waitUntil: 'networkidle2' });

        const data = await page.evaluate(async () => {
            try {
                const res = await fetch('https://sirus.su/api/base/57/guild/8685');
                if (!res.ok) return null;
                return await res.json();
            } catch (e) {
                return null;
            }
        });

        await browser.close();

        if (!data || !Array.isArray(data.members)) {
            return message.channel.send('Не удалось получить список гильдии.');
        }

        const guildMembers = data.members;
        const rankMap = Object.fromEntries(data.ranks.map(r => [r.rid, r.rname]));
        const roleIdsToCheck = Object.values(rankRoles);

        let updated = 0;
        let skipped = 0;

        for (const member of members.values()) {
            if (member.user.id === IGNORED_USER_ID) continue;

            const nickname = member.displayName.split('╏')[0]?.trim();
            if (!nickname) continue;

            const guildEntry = guildMembers.find(g => g.name === nickname);
            const currentRoles = member.roles.cache;

            if (!guildEntry) {
                // Участник не найден — снимаем все роли, кроме "Новичок"
                for (const roleId of roleIdsToCheck) {
                    if (roleId !== rankRoles[8] && currentRoles.has(roleId)) {
                        await member.roles.remove(roleId);
                        console.log(`❌ ${member.displayName} — не найден, снята роль ${roleId}`);
                        updated++;
                    }
                }
                skipped++;
                continue;
            }

            const rankId = guildEntry.rank;
            if (rankId === 0 || rankId === 1) continue; // Мастер гильдии

            const correctRoleId = rankRoles[rankId];
            if (!correctRoleId) continue;

            const needsUpdate = !currentRoles.has(correctRoleId);

            if (needsUpdate) {
                for (const roleId of roleIdsToCheck) {
                    if (roleId !== correctRoleId && currentRoles.has(roleId)) {
                        await member.roles.remove(roleId);
                    }
                }
                await member.roles.add(correctRoleId);
                console.log(`✅ ${member.displayName} → ${rankMap[rankId]}`);
                updated++;
            }
        }

        return message.channel.send(`✅ Синхронизация завершена. Обновлено: ${updated}, пропущено: ${skipped}`);
    } catch (err) {
        message.channel.send('<@542663623789641729> ошибка при синхронизации ролей.');
        console.error('[SyncRanks] Ошибка:', err);
    }
};
