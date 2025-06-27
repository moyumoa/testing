import fs from 'fs'
import path from 'path'
import { optimize } from 'svgo'

const svgDir = path.resolve('./src/assets/svg')

const ATTR_REGEX = /(fill|stroke)=["'](?!none|currentColor)[^"']*["']/gi

// ✅ SVGO 配置：清理多余属性、统一尺寸
const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    'convertShapeToPath',
    'sortAttrs',
    // 🚫 不再使用 removeAttrs
  ],
};

function processSvgFile (filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Step 1: 替换已有 fill/stroke 为 currentColor
  content = content.replace(ATTR_REGEX, (_, attr) => `${attr}="currentColor"`);

  // ✅ Step 2: 给没有 fill 的图形补上 currentColor
  const ADD_FILL_REGEX = /<(path|circle|rect|polygon|ellipse|line)\b([^>]*?)(\/?)>/gi;
  content = content.replace(ADD_FILL_REGEX, (match, tag, attrs, selfClose) => {
    if (/fill=/.test(attrs)) return match;
    return `<${tag}${attrs} fill="currentColor"${selfClose}>`;
  });

  // Step 3: 优化
  const result = optimize(content, { path: filePath, ...svgoConfig });
  const finalContent = result.data;

  // Step 4: 备份 & 写入
  if (finalContent !== content) {
    const dir = path.dirname(filePath);
    const filename = path.basename(filePath);
    const parentDir = path.resolve(dir, '..'); // svg 上一级目录
    const backupDir = path.join(parentDir, 'baks');

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir);
    }

    const backupPath = path.join(backupDir, filename + '.bak');
    fs.copyFileSync(filePath, backupPath);

    fs.writeFileSync(filePath, finalContent, 'utf-8');
    console.log(`✅ 优化完成: ${filePath}`);
  }
}


function walkDir (dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      walkDir(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.svg')) {
      processSvgFile(fullPath)
    }
  }
}

walkDir(svgDir)
console.log('🎉 所有 SVG 优化完成（颜色 + 尺寸 + 清理）！')
