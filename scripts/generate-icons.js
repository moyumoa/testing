// scripts/generate-icons.js
import fs from 'fs';
import path from 'path';

// const ICONS_DIR = path.resolve('./src/icons/svg');
// const OUTPUT_FILE = path.resolve(ICONS_DIR, '..', 'index.jsx');

const ICONS_DIR = path.resolve('./src/assets/svg');         // 读取 SVG 的目录
const OUTPUT_FILE = path.resolve('./src/icons/index.jsx');  // 输出到 icons 目录


const files = fs
  .readdirSync(ICONS_DIR)
  .filter(file => file.endsWith('.svg'));

const lines = files.map(file => {
  const name = path.basename(file, '.svg');
  return `export { ReactComponent as ${name} } from '@/assets/svg/${file}';`;
});

const output = lines.join('\n') + '\n';

fs.writeFileSync(OUTPUT_FILE, output);

console.log(`✅ 成功生成 ${files.length} 个图标到 ${OUTPUT_FILE}`);
