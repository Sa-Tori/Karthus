const poetry = require('./poetry.json');
const { tea, ptea, teafire, notea, atea } = poetry;

const page = 'coffee';
let point = '';

function isFinded(s, list) {
    return list.some((word) => s.toLowerCase().includes(word));
}

function teareact(message) {
    try {
        const p1 = message.content.indexOf(':');
        let text = message.content.substring(p1 + 1);
        const p2 = text.indexOf('>');
        const emojiId = text.substring(7, p2);
        message.react(emojiId);
    } catch {
        message.reply('**ERROR!!**');
    }
}

module.exports = async function (message, client) {
    point = '1';

    if (isFinded(message.content, notea)) return;

    try {
        const guildsAllowed = [
            '532954366571708427',
            '466006517288665099',
            '884726247182184468',
            '622954155077533696'
        ];

        const isTeaTrigger =
            (isFinded(message.content, atea) &&
                message.author.id !== '523116257390886954' &&
                guildsAllowed.includes(message.guild?.id)) ||
            (message.author.id !== '523116257390886954' &&
                message.author.id !== '654810705903484949' &&
                (message.content.startsWith('чaй') || message.content.startsWith('Чaй')) &&
                message.guild?.id === '622954155077533696');

        if (isTeaTrigger) {
            const flot = tea[Math.floor(Math.random() * tea.length)];
            const rtf = teafire[Math.floor(Math.random() * teafire.length)];
            const word = ptea[Math.floor(Math.random() * ptea.length)];

            await message.channel.send(`${rtf} ${word}`);
            await message.channel.send(flot);
        }

        if (
            message.content === '<:tea002:796066261565833226>' &&
            message.author.id === '523116257390886954'
        ) {
            return message.channel.send('Приятно пожевать <:096:592420847017263134>');
        }

        if (
            message.content.startsWith('<:tea0') &&
            message.author.id === '523116257390886954'
        ) {
            return teareact(message);
        }
    } catch (err) {
        message.channel.send(
            '<@542663623789641729> мама, я упал <a:hlepng:882291167948079165>'
        );
        const center = client.channels.cache.get('522817871370387472');
        center?.send(`Страница: ${page}\nПункт: ${point}\nСостояние: failed.`);
        console.error(err);
    }
};
