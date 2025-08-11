const poetry = require('./poetry.json');

module.exports = async function (message, client) {
    try {
        const content = message.content.toLowerCase();
        const authorId = message.author.id;

        // Умерла я
        if (
            content.includes('умерла я') &&
            (authorId === '542663623789641729' || authorId === '478669590365339649')
        ) {
            await new Promise((res) => setTimeout(res, 5000));
            return message.channel.send('Клянусь, нет её у меня!');
        }

        // Ча
        if (
            content.includes('ча') &&
            content.includes(' ча') &&
            authorId === '654810705903484949'
        ) {
            const alcohol = poetry.alcohol;
            if (Array.isArray(alcohol)) {
                const word = alcohol[Math.floor(Math.random() * alcohol.length)];
                return message.channel.send(`${word} <:mme:625115196637315124>`);
            }
        }

        // Мордекайзер
        if (
            authorId === '523116257390886954' &&
            (content.includes('мордекайзер') || content.includes('панцирь из металла'))
        ) {
            return message.channel.send(
                '```diff\n- В смерти нет смысла, Картус. Важно то, что ты делаешь после неё.```'
            );
        }

        // Сион
        if (
            authorId === '523116257390886954' &&
            (content.includes('сион') || content.includes('эхо величия'))
        ) {
            return message.channel.send('```diff\n- Даже смерть трепещет при виде меня.```');
        }

        // Обман смерти
        if (
            authorId === '523116257390886954' &&
            content.includes('долго обманываешь смерть')
        ) {
            return message.channel.send('```diff\n- Мне ещё так много нужно.. убить..```');
        }

        // Mordekaiser EN
        if (
            authorId === '523116257390886954' &&
            (content.includes('mordekaiser') || content.includes('a shell of metal'))
        ) {
            return message.channel.send(
                '```diff\n- Death has no meaning, Karthus, all that matters is one\'s purpose beyond it.```'
            );
        }
    } catch (err) {
        message.channel.send('<@542663623789641729> мам, я упал <a:hlepng:882291167948079165>');
        const control = client.channels.cache.get('878520465856036935');
        control?.send('Мама, хлеп!');
        console.error(err);
    }
};
