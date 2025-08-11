const poetry = require('./poetry.json');

const page = 'reaction';

function getRandom(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;

    let point = '1';
    try {
        const content = message.content.toLowerCase();

        // 🌸 Цветочная реакция от пользователя 5191...
        if (message.author.id === '519186885331910676' && getRandom(0, 2) === 1) {
            const flowerList = poetry.flower;
            const emojiId = flowerList[getRandom(0, flowerList.length - 1)];
            const emoji = client.emojis.cache.get(emojiId);
            if (emoji) message.react(emoji);
        }

        // 👻 Реакции на "присутствия души"
        if (
            ['542663623789641729', '478669590365339649'].includes(message.author.id) &&
            content.includes('присутствия души')
        ) {
            const soulEmojis = [
                '837282717463871489',
                '837281812211433472',
                '837281979773878293',
                '526735386110722068',
                '872262702389669969',
                '526735399314391040',
                '837282591996248075'
            ];
            for (const id of soulEmojis) {
                await message.react(id);
            }
        }

        // 🎄 Новогодние реакции
        if (content.includes('нов') && content.includes('год')) {
            const sets = [
                ['909086950496018503', '909086950672203836', '909086950605082644'],
                [
                    '909086949128667137',
                    '909086950852538378',
                    '909086950416351252',
                    '909086950143721494',
                    '909086950022053958',
                    '909086950324064256'
                ],
                [
                    '909086949439070278',
                    '909086949883670528',
                    '909086949829124126',
                    '909086949845901373',
                    '909086950064025640',
                    '909086950064009246',
                    '909086950458273823'
                ],
                ['909087018838020146', '909087018838016101', '909087018791882782'],
                ['909086949468418058', '909086949560692818', '909086950030446653', '909086950022078484']
            ];
            const selected = sets[getRandom(0, sets.length - 1)];
            for (const id of selected) {
                await message.react(id);
            }
        }

        // 🔥 "зажги" или "гори"
        if (content.includes('зажги') || content.includes('гори')) {
            const ngList = poetry.ng;
            const emoji = ngList[getRandom(0, ngList.length - 1)];
            message.channel.send(emoji);
        }

        // 🥵 Ahegao реакция на пустое сообщение в определённых каналах
        const ahegaoChannels = [
            '523123642293420052',
            '804838051729637396',
            '625758087554400266',
            '816351964278292541',
            '838111748757127218',
            '838116275896713277',
            '838111662254456832'
        ];
        if (
            getRandom(0, 7) === 4 &&
            message.content.length === 0 &&
            ahegaoChannels.includes(message.channel.id)
        ) {
            const ahegaoList = poetry.ahegao;
            const emojiId = ahegaoList[getRandom(0, ahegaoList.length - 1)];
            const emoji = client.emojis.cache.get(emojiId);
            if (emoji) message.react(emoji);
        }

        // 🧨 Случайная fire реакция
        point = '2';
        if (
            ['542663623789641729', '478669590365339649'].includes(message.author.id) &&
            getRandom(0, 13) === 4 &&
            !content.includes('нов') &&
            !content.includes('год')
        ) {
            const fireList = poetry.fire;
            const emojiId = fireList[getRandom(0, fireList.length - 1)];
            const emoji = client.emojis.cache.get(emojiId);
            if (emoji) message.react(emoji);
            else console.log('Эмоджи не существует: ' + emojiId);
        }

        // 🧃 "пика"
        if (message.content === 'пика') {
            message.channel.send('<a:cda8:526723928815566848>');
        }

        // 🥴 "хлеп"
        if (content.includes('хлеп')) {
            message.channel.send('<a:g2774:760531480824512512>');
        }
    } catch (err) {
        const center = client.channels.cache.get('522817871370387472');
        center?.send(`Страница: ${page}\nПункт: ${point}\nСостояние: failed.`);
        console.error(err);
    }
};
