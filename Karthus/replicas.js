const poetry = require('./poetry.json');
const league = require('./league.json');

const page = 'replicas';

function getRandom(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

function lowerCase(s) {
    return s
        .replace(/Ё/g, 'е')
        .replace(/ё/g, 'е')
        .split('')
        .map((c) => {
            const code = c.charCodeAt(0);
            if (code >= 1040 && code <= 1071) return String.fromCharCode(code + 32);
            return c;
        })
        .join('');
}

function isLetter(c) {
    const code = c.charCodeAt(0);
    return (
        (code >= 97 && code <= 122) || // a-z
        (code >= 1072 && code <= 1103) // а-я
    );
}

function randWord(s) {
    const words = [];
    s = lowerCase(s);
    let i = 0;
    while (i < s.length) {
        while (i < s.length && !isLetter(s[i])) i++;
        let word = '';
        while (i < s.length && isLetter(s[i])) word += s[i++];
        if (word) words.push(word);
    }
    if (words.length === 0) return null;
    return words[getRandom(0, words.length - 1)];
}

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;

    let point = '1';
    try {
        const allowedGuilds = [
            '683107614589976657',
            '532954366571708427',
            '622954155077533696',
            '466006517288665099',
            '611111608219074570'
        ];

        if (
            (allowedGuilds.includes(message.guild?.id) || message.content.startsWith('ds')) &&
            message.author.id !== '523116257390886954'
        ) {
            let content = message.content;
            let force = false;

            if (content.startsWith('ds')) {
                content = content.slice(2).trim();
                force = true;
            }

            const keyword = randWord(content);
            if (!keyword) return;

            const matches = league.voice.filter((line) =>
                lowerCase(line).includes(keyword)
            );

            if (matches.length > 0 && (getRandom(0, 20) === 7 || force)) {
                const selected = matches[getRandom(0, matches.length - 1)];
                message.channel.send('```' + selected + '```');
            } else if (force && matches.length === 0) {
                message.channel.send('Прошу простить, меня ждут крипы.');
            }
        }
    } catch (err) {
        const center = client.channels.cache.get('522817871370387472');
        center?.send(`Страница: ${page}\nПункт: ${point}\nСостояние: failed.`);
        console.error(err);
    }

    // ─── Хокку ─────────────────────────────────────────────
    if (message.author.id === '542663623789641729') return;

    const hokku = poetry.hokku;
    const word = hokku[getRandom(0, hokku.length - 1)];
    const rng = getRandom(0, 1021);

    const delays = {
        222: 22,
        444: 4,
        777: 15,
        13: 13
    };

    if (delays[rng]) {
        point = String(rng);
        try {
            const delay = async (ms) => new Promise((res) => setTimeout(res, ms));
            await delay(delays[rng] * 3600 * 1000);
            message.channel.send(`\`\`\`xl\n'${word}'\`\`\``);
        } catch (err) {
            message.channel.send('<@542663623789641729> мам, я упал <a:hlepng:882291167948079165>');
            const center = client.channels.cache.get('522817871370387472');
            center?.send(`Страница: ${page}\nПункт: ${point}\nСостояние: failed.`);
            console.error(err);
        }
    }
};
