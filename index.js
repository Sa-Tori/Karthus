require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
require('./server'); // Express

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const axios = require('axios');
const SELF_URL = 'https://karthus.onrender.com';

setInterval(() => {
    axios.get(SELF_URL)
        .then(() => console.log(`[KeepAlive] Pinged ${SELF_URL}`))
        .catch(err => console.error(`[KeepAlive] Error: ${err.message}`));
}, 14 * 60 * 1000); // каждые 14 минут

async function sendMessageToChannel(client, channelId, messageText) {
    try {
        const channel = await client.channels.fetch(channelId);

        if (channel && channel.isTextBased()) {
            await channel.send(messageText);
            console.log(`[Discord] Сообщение отправлено в канал ${channelId}`);
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
            await channel.send(` Ошибка: \`\`\`${error.message || error}\`\`\``);
        }
    } catch (err) {
        console.error('Не удалось отправить ошибку в Discord:', err);
    }
}

client.once('ready', () => {
    //console.log("DISCORD_TOKEN:", process.env.DISCORD_TOKEN);
    console.log(` Logged in as ${client.user.tag}`);
    sendMessageToChannel(client, '522817871370387472', 'Приложение запущено - 1');
});

client.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        try {
            await message.reply('Pong!');
        } catch (error) {
            console.error('Ошибка при обработке !ping:', error);
            reportErrorToDiscord(client, error);
        }
    }
});


client.login(process.env.DISCORD_TOKEN);
