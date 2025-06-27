// scripts/watch-icons.js
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

const ICONS_DIR = path.resolve('./src/icons');
const OUTPUT_FILE = path.resolve(ICONS_DIR, 'index.js');

function generate() {
  const files = fs
    .readdirSync(ICONS_DIR)
    .filter(file => file.endsWith('.svg'));

  const lines = files.map(file => {
    const name = path.basename(file, '.svg');
    return `export { ReactComponent as ${name} } from './${file}';`;
  });

  const output = lines.join('\n') + '\n';
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`✅ [iconfont] 已生成 ${files.length} 个图标`);
}

console.log('👀 正在监听 /src/icons 目录变化...');
generate(); // 初次运行
chokidar.watch(ICONS_DIR).on('all', (event, path) => {
  if (path.endsWith('.svg')) {
    generate();
  }
});
