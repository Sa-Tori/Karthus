const quotesData = require('./quotes.json');

function getRandom(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

function getRandomWord(text) {
    const words = text.match(/[а-яА-ЯёЁa-zA-Z]{3,}/g);
    if (!words || words.length === 0) return null;
    return words[Math.floor(Math.random() * words.length)];
}

module.exports = async function (message, client) {
    if (!message.content || message.author.bot) return;

    const isTestCommand = message.content.startsWith('!цитата');
    if (!isTestCommand && getRandom(1, 21) !== 2) return;

    const cleanText = isTestCommand ? message.content.replace('!цитата', '').trim() : message.content;
    const keyword = getRandomWord(cleanText);

    if (!keyword) {
        if (isTestCommand) message.reply('Напиши слово после команды. Например: `!цитата дракон`');
        return;
    }

    const allQuotes = quotesData.quotes || quotesData;

    // Ищем цитаты с нужным словом
    const matches = allQuotes.filter(q => {
        const text = typeof q === 'string' ? q : q.text;
        return text && text.toLowerCase().includes(keyword.toLowerCase());
    });

    if (matches.length === 0) {
        if (isTestCommand) message.reply(`В базе нет цитат со словом "${keyword}".`);
        return;
    }

    // Берем случайную цитату из найденных
    const randomMatch = matches[Math.floor(Math.random() * matches.length)];
    const quoteText = (typeof randomMatch === 'string' ? randomMatch : randomMatch.text).trim();

    // Разбиваем текст на предложения по точкам, восклицательным и вопросительным знакам
    const sentences = quoteText.match(/[^.!?]+[.!?]+/g) || [quoteText];

    // Выбираем ОДНО случайное предложение
    const finalSentence = sentences[Math.floor(Math.random() * sentences.length)].trim();

    // Отправляем просто как обычный текст, без блоков и кавычек
    return message.channel.send(finalSentence);
};