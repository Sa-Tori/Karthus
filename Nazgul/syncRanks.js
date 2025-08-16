const axios = require('axios');

const rankRoles = {
    //2: '1406293586148065461',
    //3: '1406293679349436605',
    //4: '1406293653390889020',
    //5: '1406296405932380201',
    //6: '1406296436240420914',
    //7: '1406293703714144289',
    //8: '1406296459732582601'
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
        const members = await guild.members.list({ limit: 1000 });

        const response = await axios.get('https://sirus.su/api/base/57/guild/8685', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        const data = response.data;

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
            if (rankId === 0 || rankId === 1) continue;

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
