const axios = require('axios');

const PROVIDER = process.env.AI_PROVIDER || 'openrouter'; // 'huggingface' или 'openrouter'
const HF_API_KEY = process.env.HF_API_KEY;
const OR_API_KEY = process.env.OR_API_KEY;
const MODEL_ID = process.env.AI_MODEL || 'deepseek/deepseek-chat-v3.1:free';

// =======================
// HuggingFace
// =======================
async function isHFModelAvailable(modelId) {
    try {
        const response = await axios.get(`https://huggingface.co/api/models/${modelId}`, {
            headers: { Authorization: `Bearer ${HF_API_KEY}` }
        });
        const { disabled, gated, private: isPrivate } = response.data;
        return !disabled && !gated && !isPrivate;
    } catch (error) {
        console.error('[AI] Не удалось проверить модель HF:', error.message);
        return false;
    }
}

async function getHFReply(prompt) {
    const available = await isHFModelAvailable(MODEL_ID);
    if (!available) {
        console.error('[AI] Модель HF недоступна');
        return null;
    }

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL_ID}`,
            {
                inputs: `Ты обычный пользователь Discord. Отвечай кратко, неформально.\n\nПользователь: ${prompt}`,
                parameters: { max_new_tokens: 80, temperature: 0.7 }
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
        return null;
    } catch (error) {
        console.error('[AI] Ошибка HF:', error.message);
        return null;
    }
}

// =======================
// OpenRouter
// =======================
async function getORReply(prompt) {
    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: MODEL_ID,
                messages: [
                    { role: 'system', content: 'Ты необычный пользователь Discord, ты игровой персонаж Картус из лиги легенд. Отвечай кратко, неформально. ' },
                    { role: 'user', content: prompt }
                ],
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    Authorization: `Bearer ${OR_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
        console.error('[AI] Ошибка OpenRouter:', error.message);
        return null;
    }
}

// =======================
// Универсальная функция
// =======================
async function getAIReply(prompt) {
    if (PROVIDER === 'huggingface') {
        return await getHFReply(prompt);
    } else if (PROVIDER === 'openrouter') {
        return await getORReply(prompt);
    } else {
        console.error('[AI] Неизвестный провайдер:', PROVIDER);
        return null;
    }
}

// =======================
// Экспорт для Discord-бота
// =======================
module.exports = async function (message, client) {
    if (message.author.bot) return;

    // Проверяем, начинается ли сообщение с "Скажи Картус" (без учёта регистра)
    if (!message.content.toLowerCase().startsWith('милый картус')) return;

    // Убираем триггерную фразу и берём остальной текст
    const prompt = message.content.slice(12).trim();
    if (!prompt) return;

    const reply = await getAIReply(prompt);
    if (reply) {
        await message.reply(reply);
    }
};
