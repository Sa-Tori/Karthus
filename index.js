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

client.once('ready', () => {
    //console.log("DISCORD_TOKEN:", process.env.DISCORD_TOKEN);
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('messageCreate', (message) => {
    if (message.content === '!ping') {
        message.reply('Pong!');
    }
});

client.login(process.env.DISCORD_TOKEN);
