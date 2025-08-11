const { EmbedBuilder } = require('discord.js');
const poetry = require('./poetry.json');

module.exports = async function (message, client) {
    try {
        const allowedIds = ['542663623789641729', '478669590365339649'];
        if (!allowedIds.includes(message.author.id)) return;

        const triggers = {
            кс1: '<:karthus:826580320044056576>',
            кс2: '<:karthus2:826584480311279656>',
            кх2: '<:kh2:827959675881652256>',
            кф1: '<:karthusf:827539023660449823>',
            кф2: '<:karthusf2:827569155292921926>',
            кф3: '<:karthusf3:827903691432394762>',
            кф4: '<:karthusf4:828269145501991032>',
            кекв: '<:kekv:821891736687214662>',
            кевк: '<:kekw:821053309087383633>',
            хзи: '<:hzi:506113320848457768>',
            либа: '<:liba:508639165433249802>',
            спнч: '<:089:592420693992538167>',
            килл: '<:087:592420677114396684>',
            сетт: '<:085:592420647812988930>',
            хаск: '<:079:592420490870521856>',
            ппср: '<:078:592420468397572106>',
            спот: '<:072:592420330480599041>',
            мчб: '<:071:592420309768863754>',
            ват: '<:048:592420210359795712>',
            фпл: '<:049:592420229213061121>',
            прсв: '<:040:592419753776251002>',
            кффи: '<:009:592419660113117248>',
            дид: '<:047:684120725325742098>',
            кет: '<a:dancecat:882291050700488816>'
        };

        const content = message.content.toLowerCase();

        if (triggers[content]) {
            await message.delete();
            return message.channel.send(triggers[content]);
        }

        if (content === 'напомни') {
            const embed = new EmbedBuilder()
                .setTitle('напоминание глупому оленю')
                .setColor(0x0d004d)
                .setDescription(poetry.ebd);
            return message.channel.send({ embeds: [embed] });
        }
    } catch (err) {
        message.reply('ERROR!!');
        console.error(err);
    }
};
