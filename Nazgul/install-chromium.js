const fs = require('fs');
const https = require('https');
const decompress = require('decompress');
const { execSync } = require('child_process');

const url = 'https://storage.googleapis.com/chromium-browser-snapshots/Linux_x64/1181205/chrome-linux.zip';
const zipPath = './chrome-linux.zip';

function download(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', reject);
    });
}

(async () => {
    try {
        console.log('📦 Скачиваем Chromium...');
        await download(url, zipPath);

        console.log('📂 Распаковываем...');
        await decompress(zipPath, '.');

        console.log('🔧 Выставляем права...');
        execSync('chmod +x chrome-linux/chrome');

        console.log('✅ Chromium установлен.');
    } catch (err) {
        console.error('❌ Ошибка установки Chromium:', err);
        process.exit(1);
    }
})();
