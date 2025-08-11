const poetry = require('./poetry.json');

const page = 'greeting';
let point = '';

function getRandom(l, r) {
    return Math.floor(Math.random() * (r - l + 1)) + l;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = async function (event, client) {
    try {
        // ─── Участник зашёл ────────────────────────────────
        if (event.user && event.guild) {
            const member = event;
            const defaultChannel =
                member.guild.channels.cache.find(
                    (ch) =>
                        ch.name === '🍓врата' ||
                        ch.name === '🤖ваш-покорный-слуга' ||
                        ch.name === '🛋welcome'
                ) ||
                member.guild.channels.cache.get('532954367100452866') ||
                member.guild.channels.cache.get('1122856220567539752');

            if (!defaultChannel) return;

            await delay(5000);

            const idStr = member.id.toString();
            const lastDigit = idStr.charAt(idStr.length - 1);
            let greetSet = poetry.greet;
            let fl = 0;

            if (['3', '5', '9'].includes(lastDigit) && getRandom(1, 2) === 2) {
                greetSet = poetry.greet2;
                fl = 1;
            }

            const greeting = greetSet[Math.floor(Math.random() * greetSet.length)];
            const message = fl === 1 ? `${member} ${greeting}` : greeting;

            defaultChannel.send(message);
            return;
        }

        // ─── Участник вышел ────────────────────────────────
        if (event.user && !event.joinedTimestamp) {
            const member = event;
            const channel =
                member.guild.channels.cache.find(
                    (ch) =>
                        ch.name === '🍓врата' ||
                        ch.name === '🤖ваш-покорный-слуга' ||
                        ch.name === '🛋welcome'
                );
            if (!channel) return;
            channel.send('Разбиты окна,\nМеркнет свет..\nНа голову надет пакет.');
            return;
        }

        // ─── Ответы на сообщения ───────────────────────────
        if (event.content) {
            const msg = event;
            await delay(10000);

            const merlai = '776445694587306028';
            const baristan = '836240368206872576';

            const responses = [
                {
                    id: merlai,
                    triggers: [
                        ['смотри, кто тут у нас', 'Ещё один призрак <:ezgif:840338961275813909>'],
                        ['этого мы будем встречать', 'Думаю, нет. Он уже уходит.'],
                        ['деревья, цветы завяли,', 'А теперь от него одни огрызки остались <:059:592420289921548312>'],
                        ['я могу предложить тебе бухло.', 'У нас его нет <:084:592420618084024320>'],
                        ['дед, ты опять забыл принять', 'Я хочу золото!!!'],
                        ['только оленей не корми, у', 'Мог бы и повежливее говорить про админа.'],
                        ['артус, тебя заклинило', 'хорошо'],
                        ['вторая ошибка женщины', `<@${merlai}>, ты пьян?`],
                        ['оброго времени уток', 'Может "суток"?'],
                        ['орячие чебуреки', `<@${merlai}> у нас тут что, чебуречная??`],
                        ['я надеюсь, ты принес моё', 'Откуда у мертвецов золото???']
                    ]
                },
                {
                    id: baristan,
                    triggers: [
                        ['пришел сюда посмотреть на драконов?', 'Нет их сейчас, они в спячке.'],
                        ['вы наш новый электрик', 'Баристан, мне кажется, ты что-то путаешь...'],
                        ['олько вчера о тебе думал', `<@${baristan}> ты что, маньяк какой-то?`],
                        ['то не кот, это наш', 'Не поминай админа'],
                        ['тус, неси лопату', 'Может давай просто его утопим?'],
                        ['чего нет у живых', 'Загробный чай, прямиком из склепа!']
                    ]
                }
            ];

            for (const user of responses) {
                if (msg.author.id === user.id) {
                    for (const [trigger, reply] of user.triggers) {
                        if (msg.content.toLowerCase().includes(trigger.toLowerCase())) {
                            msg.channel.send(reply);
                            break;
                        }
                    }
                }
            }

            if (msg.content.startsWith('Ниче не меркнет!') && msg.author.id === merlai) {
                msg.channel.send('Скатертью дорожка <:mme:625115196637315124>');
            }
        }
    } catch (err) {
        const control = client.channels.cache.get('878520465856036935');
        control?.send('Мама, хлеп!');
        console.error(err);
    }
};
