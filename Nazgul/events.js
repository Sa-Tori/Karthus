const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = function setupEvents(client) {
    //удаление сообщения
    client.on('messageDelete', async (message) => {
        if (!message.guild || message.guild.id !== '1195522221901369455') return;

        const logChannel = message.guild.channels.cache.get('1407055227240190093');
        if (!logChannel || !logChannel.isTextBased()) return;

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MessageDelete
        });

        const deletionLog = fetchedLogs.entries.first();
        let executor = 'Неизвестно';

        if (deletionLog && deletionLog.target?.id === message.author?.id) {
            executor = deletionLog.executor?.tag || 'Неизвестно';
        }
        const executorId = deletionLog?.executor?.id;
        const embed = new EmbedBuilder()
            .setColor(0xff5555)
            .setAuthor({
                name: message.author?.tag || 'Неизвестно',
                iconURL: message.author?.displayAvatarURL({ dynamic: true })
            })
            .addFields(
                { name: 'Автор', value: `<@${message.author?.id || 'неизвестно'}>`, inline: true },
                { name: 'Удалил', value: executorId ? `<@${executorId}>` : 'Неизвестно', inline: true },
                { name: 'Канал', value: `<#${message.channel.id}>`, inline: true },
                { name: 'Содержимое', value: message.content?.slice(0, 1024) || '*(пусто)*' }
        )
            .setFooter({ text: `Msg_ID: ${message.id || 'неизвестно'}` })
            .setTimestamp();

        if (message.attachments.size > 0) {
            const attachmentUrls = message.attachments.map(att => att.url).join('\n');
            embed.addFields({ name: '📎 Вложения', value: attachmentUrls });
        }

        logChannel.send({ embeds: [embed] });
    });

    //изменение сообщения
    client.on('messageUpdate', async (oldMessage, newMessage) => {
    if (!newMessage.guild || newMessage.guild.id !== '1195522221901369455') return;
    if (oldMessage.content === newMessage.content) return;

    const logChannel = newMessage.guild.channels.cache.get('1407055227240190093');
    if (!logChannel || !logChannel.isTextBased()) return;

    const messageLink = `https://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}`;

    const embed = new EmbedBuilder()
        .setTitle(`Сообщение изменено в <#${newMessage.channel.id}>`)
        .setURL(messageLink)
        .setColor(0x55aaff)
        .setAuthor({
            name: newMessage.author?.tag || 'Неизвестно',
            iconURL: newMessage.author?.displayAvatarURL({ dynamic: true })
        })
        .addFields(
            { name: 'До', value: oldMessage.content?.slice(0, 1024) || '*(недоступно)*' },
            { name: 'После', value: newMessage.content?.slice(0, 1024) || '*(пусто)*' }
        )
        .setFooter({ text: `ID: ${newMessage.author?.id || 'неизвестно'}` })
        .setTimestamp();

        logChannel.send({ embeds: [embed] });
    });

    // выход с сервера 

    client.on('guildMemberRemove', async (member) => {
        console.log(`[DEBUG] Участник вышел: ${member.user.tag} (${member.id})`);
        if (member.guild.id !== '1195522221901369455') return;
        const guild = member.guild;
        const logChannel = guild.channels.cache.get('1273059498864676885');
        if (!logChannel || !logChannel.isTextBased()) return;

        let action = 'вышел сам';

        try {
            const logs = await guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberKick
            });

            const kickLog = logs.entries.find(entry =>
                entry.target.id === member.id &&
                Date.now() - entry.createdTimestamp < 5000 // 5 секунд
            );

            if (kickLog) {
                action = `кикнул <@${kickLog.executor.id}>`;
            } else {
                const banLogs = await guild.fetchAuditLogs({
                    limit: 1,
                    type: AuditLogEvent.MemberBanAdd
                });

                const banLog = banLogs.entries.find(entry =>
                    entry.target.id === member.id &&
                    Date.now() - entry.createdTimestamp < 5000
                );

                if (banLog) {
                    action = `забанил <@${banLog.executor.id}>`;
                }
            }
        } catch (err) {
            console.error('Ошибка при получении аудит-логов:', err);
        }

        const embed = new EmbedBuilder()
            .setTitle('🚪 Участник покинул сервер')
            .setColor(0xffaa00)
            .setAuthor({
                name: member.user.tag,
                iconURL: member.user.displayAvatarURL({ dynamic: true })
            })
            .addFields(
                { name: 'Участник', value: `<@${member.id}>`, inline: true },
                { name: 'Действие', value: action, inline: true },
                { name: 'Дата входа', value: member.joinedAt ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>` : 'неизвестно', inline: true }
            )
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    });



};
