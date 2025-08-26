const axios = require('axios');

const HF_API_KEY = process.env.HF_API_KEY;
const MODEL_ID = 'HuggingFaceH4/zephyr-7b-beta';

async function isModelAvailable(modelId) {
    try {
        const response = await axios.get(`https://huggingface.co/api/models/${modelId}`, {
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`
            }
        });

        const { disabled, gated, private: isPrivate } = response.data;
        return !disabled && !gated && !isPrivate;
    } catch (error) {
        console.error('[AI] Не удалось проверить модель:', error.message);
        return false;
    }
}

async function getAIReply(prompt) {
    const available = await isModelAvailable(MODEL_ID);
    if (!available) {
        console.error('[AI] Модель недоступна для Inference API');
        return null;
    }

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                inputs: `Ты обычный пользователь Discord. Отвечай кратко, неформально, без лишней вежливости.\n\nПользователь: ${prompt}`,
                parameters: {
                    max_new_tokens: 50,
                    temperature: 0.7
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const output = response.data;
        if (Array.isArray(output) && output[0]?.generated_text) {
            return output[0].generated_text.replace(/^Ты обычный пользователь Discord.*?\n\n/, '').trim();
        }

        console.error('[AI] Неожиданный формат ответа:', output);
        return null;
    } catch (error) {
        console.error('[AI] Ошибка запроса к HuggingFace:', error.message);
        return null;
    }
}

module.exports = async function (message, client) {
    if (message.author.bot || message.content.startsWith('!')) return;
    if (message.channel.name !== '🔎ну_посмотрим🔧') return;

    const reply = await getAIReply(message.content);
    if (reply) {
        await message.reply(reply);
    }
};
