const { AuditLogEvent, EmbedBuilder } = require('discord.js');

module.exports = function setupEvents(client) {
    //удаление сообщения
    client.on('messageDelete', async (message) => {
        if (!message.guild || message.guild.id !== '1195522221901369455') return;

        // Если сообщение частичное — пробуем получить его полностью
        if (message.partial) {
            try {
                await message.fetch();
            } catch (err) {
                console.error('[Nazgul] Не удалось получить удалённое сообщение:', err);
                return;
            }
        }

        const isNazgulMessage = message.author?.id === '1404193755141247046';

        // Получаем каналы
        const localLogChannel = message.guild.channels.cache.get('1407055227240190093');
        const remoteGuild = await client.guilds.fetch('466006517288665099');
        const remoteLogChannel = await remoteGuild.channels.fetch('878081921601642506');

        if (!remoteLogChannel || !remoteLogChannel.isTextBased()) return;

        // Получаем лог удаления
        let executor = 'Неизвестно';
        let executorId = null;

        try {
            const fetchedLogs = await message.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MessageDelete
            });

            const deletionLog = fetchedLogs.entries.first();
            if (deletionLog && deletionLog.target?.id === message.author?.id) {
                executor = deletionLog.executor?.tag || 'Неизвестно';
                executorId = deletionLog.executor?.id;
            }
        } catch (err) {
            console.warn('[Nazgul] Не удалось получить audit log:', err);
        }

        // Формируем embed
        const embed = new EmbedBuilder()
            .setColor(0xff5555)
            .setAuthor({
                name: message.author?.tag || 'Неизвестно',
                iconURL: message.author?.displayAvatarURL({ dynamic: true })
            })
            .addFields(
                { name: 'Автор', value: `<@${message.author?.id || 'неизвестно'}>`, inline: true },
                { name: 'Удалил', value: executorId ? `<@${executorId}>` : 'Неизвестно', inline: true },
                { name: 'Канал', value: `<#${message.channel.id}>`, inline: true }
            )
            .setFooter({ text: `Msg_ID: ${message.id || 'неизвестно'}` })
            .setTimestamp();

        // Добавляем содержимое
        if (message.content) {
            embed.addFields({ name: 'Содержимое', value: message.content.slice(0, 1024) });
        }

        // Добавляем вложения
        if (message.attachments?.size > 0) {
            const attachmentUrls = message.attachments.map(att => att.url).join('\n');
            embed.addFields({ name: '📎 Вложения', value: attachmentUrls });
        }

        // Если это сообщение от Nazgul — добавляем содержимое embed
        if (isNazgulMessage && message.embeds?.length > 0) {
            const originalEmbed = message.embeds[0];
            const embedText = [];

            if (originalEmbed.title) embedText.push(`**Заголовок:** ${originalEmbed.title}`);
            if (originalEmbed.description) embedText.push(`**Описание:** ${originalEmbed.description}`);
            if (originalEmbed.fields?.length > 0) {
                originalEmbed.fields.forEach(field => {
                    embedText.push(`**${field.name}:** ${field.value}`);
                });
            }

            const combined = embedText.join('\n').slice(0, 1024);
            embed.addFields({ name: '🧾 Содержимое Embed', value: combined || '*(embed пуст)*' });
        }

        try {
            // Отправка в основной лог, если это не сообщение от Nazgul
            if (!isNazgulMessage && localLogChannel?.isTextBased()) {
                await localLogChannel.send({ embeds: [embed] });
            }

            // Всегда отправляем в удалённый лог
            if (isNazgulMessage) {
                await remoteLogChannel.send('<@478669590365339649> Меня обижают! <a:hlepng:882291167948079165>');
            }

            await remoteLogChannel.send({ embeds: [embed] });
        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании удаления сообщения.\n\`${location}\``);
            console.error('[Nazgul] Ошибка при отправке embed:', err);
        }
    });

    //изменение сообщения
    client.on('messageUpdate', async (oldMessage, newMessage) => {
        if (!newMessage.guild || newMessage.guild.id !== '1195522221901369455') return;
        if (oldMessage.content === newMessage.content) return;

        try {
            // Проверка на partial
            if (newMessage.partial) {
                try {
                    await newMessage.fetch();
                } catch (err) {
                    console.warn('[Nazgul] Не удалось получить новое сообщение:', err);
                    return;
                }
            }

            const logChannel = newMessage.guild.channels.cache.get('1407055227240190093');
            const remoteGuild = await client.guilds.fetch('466006517288665099');
            const logChannel2 = await remoteGuild.channels.fetch('878081921601642506');

            if (!logChannel?.isTextBased() || !logChannel2?.isTextBased()) return;

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
                .setFooter({ text: `Msg_ID: ${newMessage.id || 'неизвестно'}` })
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
            await logChannel2.send({ embeds: [embed] });
        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании изменения сообщения.\n\`${location}\``);
            console.error('[Nazgul] Ошибка в обработке messageUpdate:', err);
        }
    });

    // выход с сервера 
    client.on('guildMemberRemove', async (member) => {
        if (member.guild.id !== '1195522221901369455') return;

        try {
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
                    Date.now() - entry.createdTimestamp < 5000
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
            } catch (auditErr) {
                console.error('[Nazgul] Ошибка при получении аудит-логов:', auditErr);
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
                    { name: 'Действие', value: action, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании ухода участника.\n\`${location}\``);
            console.error('[Nazgul] Ошибка в guildMemberRemove:', err);
        }
    });


    //снятие-выдача роли и смена никнейма
    client.on('guildMemberUpdate', async (oldMember, newMember) => {
        if (newMember.guild.id !== '1195522221901369455') return;

        try {
            const logChannel = newMember.guild.channels.cache.get('1407373230892908586');
            if (!logChannel || !logChannel.isTextBased()) return;

            // 🔹 Смена никнейма
            const oldNick = oldMember.nickname;
            const newNick = newMember.nickname;

            if (oldNick !== newNick) {
                const auditLogs = await newMember.guild.fetchAuditLogs({
                    limit: 10,
                    type: AuditLogEvent.MemberUpdate
                });

                const relevantLog = auditLogs.entries.find(entry =>
                    entry.target.id === newMember.id &&
                    entry.changes.some(change => change.key === 'nick') &&
                    Date.now() - entry.createdTimestamp < 5000
                );

                const executorMention = relevantLog?.executor
                    ? `<@${relevantLog.executor.id}>`
                    : 'Неизвестно';

                const embed = new EmbedBuilder()
                    .setColor(0x3399ff)
                    .setTitle('✏️ Смена никнейма')
                    .addFields(
                        { name: 'Участник', value: `<@${newMember.id}>`, inline: true },
                        { name: 'Изменил', value: executorMention, inline: true },
                        { name: 'Было', value: oldNick || 'не было', inline: false },
                        { name: 'Стало', value: newNick || 'удалён', inline: false }
                        
                    )
                    .setTimestamp();

                await logChannel.send({ embeds: [embed] });
            }

            // 🔹 Смена ролей
            const oldRoles = new Set(oldMember.roles.cache.keys());
            const newRoles = new Set(newMember.roles.cache.keys());

            const addedRoles = [...newRoles].filter(roleId => !oldRoles.has(roleId));
            const removedRoles = [...oldRoles].filter(roleId => !newRoles.has(roleId));

            if (addedRoles.length > 0 || removedRoles.length > 0) {
                const auditLogs = await newMember.guild.fetchAuditLogs({
                    limit: 10,
                    type: AuditLogEvent.MemberRoleUpdate
                });

                const relevantLog = auditLogs.entries.find(entry =>
                    entry.target.id === newMember.id &&
                    Date.now() - entry.createdTimestamp < 5000
                );

                const executorMention = relevantLog?.executor
                    ? `<@${relevantLog.executor.id}>`
                    : 'Неизвестно';

                for (const roleId of addedRoles) {
                    const embed = new EmbedBuilder()
                        .setColor(0x00cc66)
                        .setTitle('✅ Роль выдана')
                        .addFields(
                            { name: 'Участник', value: `<@${newMember.id}>`, inline: true },
                            { name: 'Роль', value: `<@&${roleId}>`, inline: true },
                            { name: 'Выдал', value: executorMention, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: `Role_ID: ${roleId}` });

                    await logChannel.send({ embeds: [embed] });
                }

                for (const roleId of removedRoles) {
                    const embed = new EmbedBuilder()
                        .setColor(0xcc3300)
                        .setTitle('❌ Роль снята')
                        .addFields(
                            { name: 'Участник', value: `<@${newMember.id}>`, inline: true },
                            { name: 'Роль', value: `<@&${roleId}>`, inline: true },
                            { name: 'Снял', value: executorMention, inline: true }
                        )
                        .setTimestamp()
                        .setFooter({ text: `Role_ID: ${roleId}` });

                    await logChannel.send({ embeds: [embed] });
                }
            }

        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании обновления участника.\n\`${location}\``);
            console.error('[Nazgul] Ошибка в обработке guildMemberUpdate:', err);
        }
    });

    //разбан игрока    
    client.on('guildBanRemove', async (ban) => {
        if (ban.guild.id !== '1195522221901369455') return;

        try {
            const logChannel = ban.guild.channels.cache.get('1273059498864676885');
            if (!logChannel || !logChannel.isTextBased()) return;

            let executorMention = 'Неизвестно';

            try {
                const logs = await ban.guild.fetchAuditLogs({
                    limit: 5,
                    type: AuditLogEvent.MemberBanRemove
                });

                const unbanLog = logs.entries.find(entry =>
                    entry.target.id === ban.user.id &&
                    Date.now() - entry.createdTimestamp < 5000
                );

                if (unbanLog?.executor) {
                    executorMention = `<@${unbanLog.executor.id}>`;
                }
            } catch (err) {
                console.error('[UnbanLog] Ошибка при получении аудит-логов:', err);
            }

            const embed = new EmbedBuilder()
                .setTitle('🔓 Участник разбанен')
                .setColor(0x33cc99)
                .setAuthor({
                    name: ban.user.tag,
                    iconURL: ban.user.displayAvatarURL({ dynamic: true })
                })
                .addFields(
                    { name: 'Пользователь', value: `<@${ban.user.id}>`, inline: true },
                    { name: 'Разбанил', value: executorMention, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });
        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании разбана.\n\`${location}\``);
            console.error('[Nazgul] Ошибка в обработке guildBanRemove:', err);
        }
    });

    //перемещение по голосовым каналам
    /*client.on('voiceStateUpdate', async (oldState, newState) => {
        if (newState.guild.id !== '1195522221901369455') return;
        console.log(`[DEBUG] voiceStateUpdate: ${oldState.id} → ${newState.id}`);

        try {
            const logChannel = newState.guild.channels.cache.get('1407373230892908586');
            if (!logChannel || !logChannel.isTextBased()) return;

            const fromChannel = oldState.channel;
            const toChannel = newState.channel;

            if (!fromChannel || !toChannel || fromChannel.id === toChannel.id) return;

            // Ждём 1 секунду, чтобы Discord успел записать аудит
            await new Promise(resolve => setTimeout(resolve, 1000));

            let executorMention = 'Неизвестно';

            try {
                const auditLogs = await newState.guild.fetchAuditLogs({
                    limit: 10,
                    type: AuditLogEvent.MemberMove
                });

                const relevantLog = auditLogs.entries.find(entry =>
                    entry?.target?.id === newState.id ||
                    entry?.target?.username === newState.member?.user?.username
                );

                if (relevantLog) {
                    const executorId = relevantLog.executor?.id;
                    const targetId = relevantLog.target?.id;

                    console.log(`[DEBUG] Найден лог: executor=${executorId}, target=${targetId}`);

                    if (executorId && executorId !== targetId) {
                        executorMention = `<@${executorId}>`;
                    }
                } else {
                    console.log('[DEBUG] Не найдено подходящей записи в журнале аудита');
                }
            } catch (auditError) {
                console.warn('[Nazgul] Ошибка при получении журнала аудита:', auditError);
            }

            const embed = new EmbedBuilder()
                .setColor(0x9933ff)
                .setTitle('🔄 Перемещение в голосовом канале')
                .addFields(
                    { name: 'Участник', value: `<@${newState.id}>`, inline: true },
                    { name: 'Переместил', value: executorMention, inline: true },
                    { name: 'Из канала', value: fromChannel.name, inline: false },
                    { name: 'В канал', value: toChannel.name, inline: true }
                )
                .setTimestamp();

            await logChannel.send({ embeds: [embed] });

        } catch (err) {
            const control = client.channels.cache.get('878520465856036935');
            const stackLine = err.stack?.split('\n').find(line => line.includes('Nazgul/events.js'));
            const location = stackLine?.trim() || 'место ошибки не определено';

            control?.send(`Мама, хлеп! Ошибка при логировании перемещения в голосовом.\n\`${location}\``);
            console.error('[Nazgul] Ошибка в voiceStateUpdate (перемещение):', err);
        }
    });*/


};