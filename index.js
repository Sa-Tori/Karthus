// ─── Загрузка переменных ─────────────────────────────────────────────
require('dotenv').config();
const { Client, GatewayIntentBits, Partials } = require('discord.js');
const axios = require('axios');

// ─── Подключаем наш новый логгер ─────────────────────────────────────
const { logError } = require('./utils/logger');

// ─── Фейковый сервер для Render ──────────────────────────────────────
require('./server'); // Express

const SELF_URL = 'https://content-tamiko-huigames-4d14a792.koyeb.app';

setInterval(() => {
    axios.get(SELF_URL)
        .then(() => console.log(`[KeepAlive] Pinged ${SELF_URL}`))
        .catch(err => console.error(`[KeepAlive] Error: ${err.message}`));
}, 45 * 1000);

// ─── Общие функции ───────────────────────────────────────────────────
async function sendMessageToChannel(client, channelId, messageText) {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(messageText);
        } else {
            console.error(`[Discord] Канал ${channelId} не является текстовым`);
        }
    } catch (err) {
        console.error(`[Discord] Ошибка при отправке сообщения: ${err.message}`);
    }
}

// ─── Подключение Karthus ─────────────────────────────────────────────
const karthus = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences]
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
    require('./Karthus/theult')
];

karthus.once('ready', () => {
    console.log(`Karthus logged in as ${karthus.user.tag}`);
    sendMessageToChannel(karthus, '522817871370387472', 'Приложение запущено - 1');
    require('./Karthus/dailyLog')(karthus);
});

karthus.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Karthus Pong!');
        } catch (error) {
            await logError(karthus, error, message);
        }
        return;
    }

    // ⚠️ БЕЗОПАСНЫЙ ТЕСТОВЫЙ БЛОК (обернут в try/catch)
    if (message.content === '!testerror') {
        try {
            throw new Error('Искусственная ошибка для проверки логгера!');
        } catch (error) {
            await logError(karthus, error, message); // Передаем ошибку в логгер
        }
        return;
    }

    for (const handler of karthusHandlers) {
        try {
            await handler(message, karthus);
        } catch (err) {
            await logError(karthus, err, message);
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
            await logError(merlai, error, message);
        }
        return;
    }

    try {
        await handleMerlaiAnswer(message, merlai);
    } catch (err) {
        await logError(merlai, err, message);
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
            await logError(shadian, error, message);
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
    require('./Nazgul/spy')
];

nazgul.once('ready', () => {
    console.log(`Nazgul logged in as ${nazgul.user.tag}`);
    sendMessageToChannel(nazgul, '522817871370387472', 'Приложение запущено - 4');
});

nazgul.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Nazgul Pong!');
        } catch (error) {
            await logError(nazgul, error, message);
        }
        return;
    }

    for (const handler of nazgulHandlers) {
        try {
            await handler(message, nazgul);
        } catch (err) {
            await logError(nazgul, err, message);
        }
    }
});

nazgul.login(process.env.DISCORD_TOKEN3);