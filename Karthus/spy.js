// Nazgul/spy.js

const { EmbedBuilder } = require('discord.js');

module.exports = async function spy(message, client) {
    try {
        // Проверяем, что сообщение с нужного сервера
        if (message.guild?.id !== '466006517288665099') return;

        // Проверяем, что сообщение и автор существуют
        if (!message || !message.author) return;

        // Игнорируем сообщения от указанных пользователей
        const ignoredUsers = [
            '523116257390886954',
            '1404193755141247046',
            '776445694587306028',
            '836240368206872576',
            '898462500293578802',
            '155149108183695360'
        ];

        if (ignoredUsers.includes(message.author.id)) return;

        // Маппинг конкретных каналов
        const channelMapping = {
            '523123642293420052': '889592085747990589',  // канал 1 → лог 1
            '520907757142933505': '563752253090168863',  // канал 2 → лог 2
            '874990124482576384': '883608296664203334'   // канал 3 → лог 3
        };

        // Канал по умолчанию
        const defaultChannelId = '1476682369133183200';

        // Определяем целевой канал
        let targetChannelId = channelMapping[message.channel.id];
        const isSpecialChannel = !!targetChannelId; // true, если канал в маппинге

        if (!targetChannelId) {
            targetChannelId = defaultChannelId;
        }

        // Получаем целевой канал
        const targetChannel = await client.channels.fetch(targetChannelId);
        if (!targetChannel || !targetChannel.isTextBased()) return;

        // Получаем локальное имя участника
        let displayName = message.member?.displayName;
        if (!displayName && message.guild) {
            try {
                const member = await message.guild.members.fetch(message.author.id);
                displayName = member?.displayName;
            } catch (e) {
                // Игнорируем ошибку получения участника
            }
        }

        // Создаём базовый embed
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true, size: 256 })
            })
            .setDescription(message.content || '*Нет текстового содержимого*')
            .addFields(
                {
                    name: 'Отправитель',
                    value: `<@${message.author.id}>`,
                    inline: true
                },
                {
                    name: 'ID',
                    value: message.author.id,
                    inline: true
                },
                {
                    name: 'Ник',
                    value: displayName || 'нет',
                    inline: true
                }
            )
            .setFooter({
                text: `ID сообщения: ${message.id}`
            })
            .setTimestamp();

        // Добавляем информацию о канале ТОЛЬКО для сообщений из канала по умолчанию
        if (!isSpecialChannel) {
            embed.addFields(
                {
                    name: 'Канал',
                    value: `<#${message.channel.id}>`,
                    inline: true
                },
                {
                    name: 'Название',
                    value: message.channel.name,
                    inline: true
                },
                {
                    name: 'ID канала',
                    value: message.channel.id,
                    inline: true
                }
            );
        }

        // Если есть вложения — добавляем их в embed
        if (message.attachments.size > 0) {
            const attachmentList = [];
            message.attachments.forEach(att => {
                attachmentList.push(`[${att.name}](${att.url})`);

                // Если это изображение — добавляем первое как превью
                if (att.contentType?.startsWith('image/') && !embed.data.image) {
                    embed.setImage(att.url);
                }
            });

            embed.addFields({
                name: `Вложения (${message.attachments.size})`,
                value: attachmentList.join('\n'),
                inline: false
            });
        }

        // Отправляем embed
        await targetChannel.send({ embeds: [embed] });

    } catch (error) {
        console.error('[Spy] Ошибка при копировании сообщения:', error);

        // Фирменный стиль обработки ошибок
        try {
            const controlChannelId = '878520465856036935';
            const controlChannel = await client.channels.fetch(controlChannelId);

            if (controlChannel && controlChannel.isTextBased()) {
                const stackLine = error.stack?.split('\n').find(line => line.includes('spy.js'));
                const location = stackLine?.trim() || 'место ошибки не определено';

                const errorEmbed = new EmbedBuilder()
                    .setColor(0xff5555)
                    .setTitle('Ошибка в spy.js')
                    .setDescription(`\`\`\`${error.message || 'Неизвестная ошибка'}\`\`\``)
                    .addFields(
                        { name: 'Место', value: `\`${location}\`` },
                        { name: 'Исходный канал', value: message?.channel?.id ? `<#${message.channel.id}>` : 'неизвестно' }
                    )
                    .setTimestamp();

                await controlChannel.send({ embeds: [errorEmbed] });
            }
        } catch (reportError) {
            console.error('[Spy] Не удалось отправить отчёт об ошибке:', reportError);
        }
    }
};