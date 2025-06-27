// scripts/build-icomoon-zip.js
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';

const sourceDir = path.resolve('./src/icons/cleaned');
const zipPath = path.resolve('./icomoon-upload.zip');

const output = fs.createWriteStream(zipPath);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () =>
  console.log(`✅ 打包完成：${zipPath}（${archive.pointer()} bytes）`)
);

archive.on('error', (err) => {
  throw err;
});

archive.pipe(output);
archive.directory(sourceDir, 'svg');
archive.finalize();
