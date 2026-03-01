// ─── Загрузка переменных ─────────────────────────────────────────────
require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');

// ─── Фейковый сервер для Render ──────────────────────────────────────
require('./server'); // Express

const SELF_URL = 'https://content-tamiko-karthus.koyeb.app';

setInterval(() => {
    axios.get(SELF_URL)
        .then(() => console.log(`[KeepAlive] Pinged ${SELF_URL}`))
        .catch(err => console.error(`[KeepAlive] Error: ${err.message}`));
}, 45 * 1000); // каждую 1 минуту

// ─── Общие функции ───────────────────────────────────────────────────
async function sendMessageToChannel(client, channelId, messageText) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(messageText);
            //console.log(`[Discord] Сообщение отправлено в канал ${channelId}`);
        } else {
            console.error(`[Discord] Канал ${channelId} не является текстовым`);
        }
    } catch (err) {
        console.error(`[Discord] Ошибка при отправке сообщения: ${err.message}`);
    }
}

async function reportErrorToDiscord(client, error) {
    try {
        const guild = await client.guilds.fetch('466006517288665099');
        const channel = await guild.channels.fetch('522817871370387472');
        if (channel && channel.isTextBased()) {
            await channel.send(`Ошибка от ${client.user?.tag || 'неизвестного'}: \`\`\`${error.message || error}\`\`\``);
        }
    } catch (err) {
        console.error('Не удалось отправить ошибку в Discord:', err);
    }
}

// ─── Подключение Karthus ─────────────────────────────────────────────


const karthus = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
    presence: {
        status: 'invisible'
    }
});
karthus.setMaxListeners(30);

const karthusHandlers = [
    //require('./Karthus/spy'),
    require('./Karthus/answer'),
    require('./Karthus/antinitro'),
    require('./Karthus/coffee'),
    require('./Karthus/commands'),
    require('./Karthus/control'),
    require('./Karthus/embeds'),
    require('./Karthus/greeting'),
    require('./Karthus/reaction'),
    require('./Karthus/replicas'),
    require('./Karthus/theult'),
    require('./Karthus/ai')
];

karthus.once('ready', () => {
    console.log(`Karthus logged in as ${karthus.user.tag}`);
    sendMessageToChannel(karthus, '522817871370387472', 'Приложение запущено - 1');
});

karthus.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Karthus Pong!');
        } catch (error) {
            console.error('Ошибка в Karthus:', error);
            reportErrorToDiscord(karthus, error);
        }
        return;
    }

    for (const handler of karthusHandlers) {
        try {
            await handler(message, karthus);
        } catch (err) {
            console.error('Ошибка в обработчике Karthus:', err);
        }
    }
});

karthus.login(process.env.DISCORD_TOKEN);

// ─── Подключение Merlai ──────────────────────────────────────────────
const merlai = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
merlai.setMaxListeners(10);

const handleMerlaiAnswer = require('./Merlai/answer');

merlai.once('ready', () => {
    console.log(`Merlai logged in as ${merlai.user.tag}`);
    sendMessageToChannel(merlai, '522817871370387472', 'Приложение запущено - 2');
});

merlai.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Merlai Pong!');
        } catch (error) {
            console.error('Ошибка в Merlai:', error);
            reportErrorToDiscord(merlai, error);
        }
        return;
    }

    try {
        await handleMerlaiAnswer(message, merlai);
    } catch (err) {
        console.error('Ошибка в обработчике Merlai:', err);
        reportErrorToDiscord(merlai, err);
    }
});

merlai.login(process.env.DISCORD_TOKEN1);

// ─── Подключение Shadian ─────────────────────────────────────────────
const shadian = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

shadian.once('ready', () => {
    console.log(`Shadian logged in as ${shadian.user.tag}`);
    sendMessageToChannel(shadian, '522817871370387472', 'Приложение запущено - 3');
});

shadian.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Shadian Pong!');
        } catch (error) {
            console.error('Ошибка в Shadian:', error);
            reportErrorToDiscord(shadian, error);
        }
    }
});

shadian.login(process.env.DISCORD_TOKEN2);

// ─── Подключение Nazgul ──────────────────────────────────────────────
const nazgul = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers 
    ],
    partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User],
    presence: {
        status: 'invisible'
    }
});

const nazgulHandlers = [
    require('./Nazgul/spy'),
    //require('./Nazgul/syncRanks'),
    // другие обработчики...
];

//const setupEvents = require('./Nazgul/events');
//setupEvents(nazgul);


// В обработчике ready для Nazgul:
//nazgul.once('ready', async () => {
//    console.log(`Nazgul logged in as ${nazgul.user.tag}`);

//    // Вызов функции для логирования каналов
//    try {
//        const listChannels = require('./Nazgul/spy');
//        await listChannels(nazgul);
//    } catch (err) {
//        console.error('Не удалось выполнить listChannels:', err);
//    }

//    sendMessageToChannel(nazgul, '522817871370387472', 'Приложение запущено - 4');
//});

nazgul.once('ready', () => {
    console.log(`Nazgul logged in as ${nazgul.user.tag}`);
    sendMessageToChannel(nazgul, '522817871370387472', 'Приложение запущено - 4');
});

nazgul.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Nazgul Pong!');
        } catch (error) {
            console.error('Ошибка в Nazgul:', error);
            reportErrorToDiscord(nazgul, error);
        }
        return;
    }

    for (const handler of nazgulHandlers) {
        try {
            await handler(message, nazgul);
        } catch (err) {
            console.error('Ошибка в обработчике Nazgul:', err);
        }
    }
});

nazgul.login(process.env.DISCORD_TOKEN3);
