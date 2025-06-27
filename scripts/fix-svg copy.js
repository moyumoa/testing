import fs from 'fs'
import path from 'path'

const svgDir = path.resolve('./src/icons') // ✅ 你的 SVG 根目录
const ATTR_REGEX = /(fill|stroke)=["'](?!none|currentColor)[^"']*["']/gi

function processSvgFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8')
  const original = content

  content = content.replace(ATTR_REGEX, (_, attr) => `${attr}="currentColor"`)

  if (content !== original) {
    // ✅ 备份路径：当前文件所在目录下的 baks 文件夹
    const dir = path.dirname(filePath)
    const filename = path.basename(filePath)
    const backupDir = path.join(dir, 'baks')

    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir)
    }

    const backupPath = path.join(backupDir, filename + '.bak')
    fs.copyFileSync(filePath, backupPath)

    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`✅ 替换完成: ${filePath}`)
  }
}

function walkDir(dir) {
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
console.log('🎉 所有 SVG 颜色替换完成！')
