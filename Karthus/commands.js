function isFinded2(s, list) {
    return list.some((word) => s.toLowerCase().includes(word));
}

async function say(message, client) {
    try {
        const numbers = [' 1', ' 2', ' 3', ' 4', ' 5', ' 6', ' 7', ' 8', ' 9', ' 0'];
        const p1 = message.content.indexOf(' ');
        let text = message.content.substring(p1 + 1);

        if (!isFinded2(message.content, numbers)) {
            await message.channel.send(text);
        } else {
            const p2 = text.indexOf(' ');
            const ch_id = text.substring(0, p2);
            text = text.substring(p2 + 1);
            const targetChannel = client.channels.cache.get(ch_id);
            if (targetChannel) await targetChannel.send(text);
        }

        await message.delete();
    } catch {
        message.reply('ERROR!!');
    }
}

async function del(message, client) {
    try {
        const p1 = message.content.indexOf(' ');
        const mes_id = message.content.substring(p1 + 1);
        const channel = client.channels.cache.get(message.channel.id);
        const targetMessage = channel.messages.cache.get(mes_id);
        if (targetMessage) await targetMessage.delete();
        await message.delete();
    } catch {
        message.reply('ERROR!!');
    }
}

module.exports = async function (message, client) {
    const isAdmin =
        message.author.id === '542663623789641729' ||
        message.author.id === '478669590365339649';

    const args = message.content.split(' ').slice(1);
    const amount = args.join(' ');

    // Команда массового удаления
    if (message.content.startsWith('delete') && isAdmin) {
        if (!amount) return message.channel.send('Вы не указали, сколько сообщений нужно удалить!');
        if (isNaN(amount)) return message.channel.send('Это не число!');
        if (amount > 100) return message.channel.send('Вы не можете удалить более 100 сообщений!');
        if (amount < 1) return message.channel.send('Введите число больше 1!');

        try {
            const messages = await message.channel.messages.fetch({ limit: amount });
            await message.channel.bulkDelete(messages);
            message.channel.send(`Удалено ${amount} сообщений!`);
        } catch (err) {
            console.error(err);
            message.channel.send('Ошибка при удалении сообщений.');
        }
    }

    // Команда отправки сообщения
    if (message.content.startsWith('ksay') && isAdmin) {
        await say(message, client);
    }

    // Команда удаления по ID
    if (message.content.startsWith('К!удали') && isAdmin) {
        await del(message, client);
    }
};
