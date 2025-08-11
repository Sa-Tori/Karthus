const { EmbedBuilder } = require('discord.js');
const poetry = require('./poetry.json');

const page = 'embeds';
let point = '';

function isFinded(s, list1, list2) {
    return [...list1, ...list2].some((word) => s.toLowerCase().includes(word));
}

module.exports = async function (message, client) {
    if (!message.content) return;

    point = '1';
    try {
        const { morning, amorning, dragon, utra, drutra, nihua, teafire } = poetry;
        const control = client.channels.cache.get('878520465856036935');
        const us = client.users.cache.get('523116257390886954');
        const UserTag = message.author.tag;
        const content = message.content.toLowerCase();

        // ─── Приветствие ────────────────────────────────
        if (message.content === 'Привет' && message.author.id !== '542663623789641729') {
            const embed = new EmbedBuilder()
                .setTitle('Приветствие')
                .setColor(0x368ba2)
                .setDescription('Досвидания, мне неприятно');
            message.channel.send({ embeds: [embed] });
        }

        // ─── Мех ────────────────────────────────────────
        if (message.content === 'мех') {
            const isOwner = message.author.id === '542663623789641729';
            const embed = new EmbedBuilder()
                .setTitle(isOwner ? 'Мех' : 'Ты кто??')
                .setColor(0x368ba2)
                .setDescription(isOwner ? null : 'Досвидания, мне неприятно')
                .setImage(
                    isOwner
                        ? 'http://bestanimations.com/media/dragons/1758478091dragon-animated-gif-69.gif'
                        : null
                );
            message.channel.send({ embeds: [embed] });
        }

        // ─── Одиночество ────────────────────────────────
        if (message.content === 'Одиночество') {
            const isSpecial = message.author.id === '405109483396661268';
            const embed = new EmbedBuilder()
                .setTitle(isSpecial ? 'Всегда рядом' : 'Да что ты знаешь об одиночестве??')
                .setDescription(message.author.toString())
                .setColor(0x368ba2)
                .setImage(
                    isSpecial
                        ? 'https://media1.tenor.com/images/a5a88dd6f4b00b44361ec7ef55b85dd4/tenor.gif?itemid=7636561'
                        : 'https://i.imgur.com/XWSzl8R.gif'
                );
            message.channel.send({ embeds: [embed] });
        }

        // ─── Спокойной ночи ─────────────────────────────
        if (content === 'спокойной ночи') {
            const isSpecial = message.author.id === '405109483396661268';
            const embed = new EmbedBuilder()
                .setTitle(
                    isSpecial
                        ? 'И тебе, мой сладкий) <:1Rem:684121137386487833>'
                        : 'Я пока не знаю что тебе ответить...'
                )
                .setDescription(message.author.toString())
                .setColor(0x368ba2)
                .setImage(
                    isSpecial
                        ? 'https://tenor.com/view/sleeping-kiss-hug-anime-gif-15619689'
                        : null
                );
            message.channel.send({ embeds: [embed] });
        }

        // ─── Доброе утро ────────────────────────────────
        if (message.content === 'доброе утро') {
            const embed = new EmbedBuilder()
                .setTitle('Ооооо, Утро')
                .setDescription('Ну уж нет, я еще посплю')
                .setColor(0x368ba2)
                .setImage('https://i.gifer.com/Kzlh.gif');
            message.channel.send({ embeds: [embed] });
        }

        // ─── Покажи ─────────────────────────────────────
        if (message.content === 'покажи') {
            const embed = new EmbedBuilder()
                .setTitle('Пошел нахуй')
                .setDescription('меня заебала твоя ссылка')
                .setColor(0x368ba2)
                .setImage('https://media1.tenor.com/images/25ec03203265dee174003d8557e7c668/tenor.gif');
            message.channel.send({ embeds: [embed] });
        }

        // ─── Утра ───────────────────────────────────────
        if (message.content === 'Утра') {
            const rtf = teafire[Math.floor(Math.random() * teafire.length)];
            const utras = utra[Math.floor(Math.random() * utra.length)];
            const drutras = drutra[Math.floor(Math.random() * drutra.length)];

            const embed = new EmbedBuilder()
                .setTitle(`${rtf} И тебе, ${utras}.`)
                .setAuthor({ name: UserTag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setThumbnail('https://i.ibb.co/ctR84n3/torch11.gif')
                .setColor(0x368ba2)
                .setImage(drutras)
                .setTimestamp()
                .setFooter({ text: 'Это не клиновый листок, это ДРАКОН!', iconURL: us?.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
            control?.send({ embeds: [embed] });
            control?.send(`\`\`\`${drutras}\`\`\``);
        }

        // ─── Утренние триггеры ──────────────────────────
        if (
            isFinded(message.content, morning, amorning) &&
            message.content !== 'доброе утро' &&
            message.content !== 'Утра' &&
            message.author.id !== '297089757651927040' &&
            message.content.length < 30
        ) {
            const morn = morning[Math.floor(Math.random() * morning.length)];
            const drag = dragon[Math.floor(Math.random() * dragon.length)];

            const embed = new EmbedBuilder()
                .setTitle(`<a:firea:872262702389669969>И тебе ${morn} <:dragwu:838458320531619930>`)
                .setAuthor({ name: UserTag, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setThumbnail('https://i.ibb.co/ctR84n3/torch11.gif')
                .setColor(0x368ba2)
                .setImage(drag)
                .setTimestamp()
                .setFooter({ text: 'Утро тогда, когда проснулся.', iconURL: us?.displayAvatarURL({ dynamic: true }) });

            message.channel.send({ embeds: [embed] });
            control?.send({ embeds: [embed] });
            control?.send(`\`\`\`${drag}\`\`\``);
        }

        // ─── Нихуя ──────────────────────────────────────
        if (content.includes('нихуя')) {
            const word = nihua[Math.floor(Math.random() * nihua.length)];
            const embed = new EmbedBuilder().setColor(0x368ba2).setImage(word);
            message.channel.send({ embeds: [embed] });
            control?.send({ embeds: [embed] });
            control?.send(`\`\`\`${word}\`\`\``);
        }
    } catch (err) {
        const center = client.channels.cache.get('522817871370387472');
        center?.send(`Страница: ${page}\nПункт: ${point}\nСостояние: failed.`);
        console.error(err);
    }
};
