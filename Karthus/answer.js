const poetry = require('./poetry.json');
const { noprefix, shprefix, fear } = poetry;

module.exports = async function (message, client) {
    const content = message.content;
    const lower = content.toLowerCase();
    const authorId = message.author.id;

    if (content === 'pong' && authorId === '519186885331910676') return message.channel.send('ping');
    if (content.startsWith('картус где ганги')) return message.channel.send('Никакого уважения..');
    if (content.startsWith('Картус привет')) return message.channel.send('Привет, а ты кто?');
    if (content === 'Ghbdtn') return message.reply(' я тебя не понял, но привет');
    if (content === 'одиночество') return message.channel.send('loneliness');
    if (content.startsWith('я тут подумал')) return message.channel.send('Не говори вслух, ты понижаешь IQ всего сервера');
    if (content.startsWith('Допустим')) return message.channel.send('???');
    if (content.startsWith('Мери')) return message.channel.send('Где он??');
    if (content.startsWith(noprefix)) return message.channel.send('Ты за кого меня принимаешь??');
    if (content.startsWith(shprefix)) return message.channel.send('Не повышай на меня шрифт!');

    if (lower.includes('твой папочка вернулся') && poetry.owners.includes(authorId)) {
        return message.channel.send('Мог бы и не возвращаться <:084:592420618084024320>');
    }

    if (content.startsWith('kds')) return message.channel.send('<a:fire_green:768469897398190081>'.repeat(5));

    if (lower.includes('картафилиус') && !['172002275412279296', '276060004262477825'].includes(authorId)) {
        if (poetry.owners.includes(authorId)) return message.channel.send('Самовлюбленность..');
        else return message.channel.send('Время не стоит, \nЗло ли ты таишь в себе..\nНе поминай в суе.');
    }

    if (lower === 'лень') return message.channel.send('Олень');
    if (content === 'Олень' && authorId === '523116257390886954') return message.channel.send('Тюлень');
    if (content === 'Тюлень' && authorId === '523116257390886954') return message.channel.send('Пельмень');
    if (content.startsWith('MEH')) return message.channel.send('```diff\n- Тебе расчесать?```');

    if ((lower.includes('523116257390886954') || lower.includes('картус') || message.channel.id === '591607946107158538') && content.includes('?')) {
        const q = ['да', 'нет', 'не знаю', 'наверное да', 'наверное нет'];
        return message.channel.send(q[Math.floor(Math.random() * q.length)]);
    }
    if ((lower.includes('523116257390886954') || lower.includes('картус')) && (lower.includes('страшн') || lower.includes('волн'))) {
        return message.channel.send(fear[Math.floor(Math.random() * fear.length)]);
    }
};