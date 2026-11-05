const { EmbedBuilder } = require('discord.js');
const poetry = require('./poetry.json');

module.exports = async function (messageOrEvent, client) {
    try {
        // ─── Обработка входящих сообщений ────────────────────────────────
        if (messageOrEvent.content) {
            const msg = messageOrEvent;
            if (msg.guild?.id !== '622954155077533696') return;

            const UserTag = msg.author.tag;
            const descr = msg.channel.id === '666143344417570816'
                ? msg.content
                : `${msg.content}\n**Канал:** ${msg.channel.name}\n**id канала:** ${msg.channel.id}\n**id:** ${msg.id}`;

            const embed = new EmbedBuilder()
                .setAuthor({ name: UserTag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                .setColor(0x368ba2)
                .setDescription(descr)
                .setTimestamp();

            const targetChannelId = msg.channel.id === '666143344417570816' ? '563752253090168863' : '883608296664203334';
            const palish = client.channels.cache.get(targetChannelId);
            if (palish) palish.send({ embeds: [embed] });
        }

        // ─── Обработка удаления сообщений ────────────────────────────────
        if (messageOrEvent.partial || messageOrEvent.deletedTimestamp) {
            const msg = messageOrEvent;

            if (msg.author?.id === '523116257390886954' && msg.guild) {
                const control = client.channels.cache.get('878520465856036935');
                const fetchedLogs = await msg.guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
                const deletionLog = fetchedLogs.entries.first();

                if (!deletionLog) {
                    control?.send(`Сообщение от ${msg.author.tag} было удалено, но журнал аудита не найден.`);
                    return;
                }

                const { executor, target } = deletionLog;
                if (target.id === msg.author.id && !poetry.owners.includes(executor.id)) {
                    control?.send(`Сообщение от ${msg.author.tag} было удалено ${executor.tag}.`);
                    msg.channel.send(`Какой-то пидор удалил мое сообщение. <:mme:625115196637315124>\nА, постойте, это же ${executor.tag} <:096:592420847017263134>`);
                } else {
                    control?.send(`Сообщение от ${msg.author.tag} было удалено, но мы не знаем, кем.`);
                }
            }

            const deletin = client.channels.cache.get('878081921601642506');
            const UserTag = msg.author?.tag || 'Неизвестно';

            const embed = new EmbedBuilder()
                .setAuthor({ name: UserTag, iconURL: msg.author?.displayAvatarURL({ dynamic: true }) })
                .setDescription(`**Текст:** \`${msg.content}\``)
                .addFields({ name: 'Данные', value: `**Канал:** \`${msg.channel.name}\`\n**id автора:** \`${msg.author}\`` })
                .setColor(0xb60808);

            deletin?.send({ embeds: [embed] });
        }
    } catch (err) {
        const center = client.channels.cache.get('522817871370387472');
        center?.send(`Страница: control\nСостояние: failed.`);
        console.error(err);
    }
};