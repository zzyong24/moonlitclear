/**
 * 生成月亮图标的 SVG 并转换为各尺寸 PNG / ICO
 *
 * 依赖: sharp (已在项目 next.config 中使用)
 * 运行: node scripts/generate-favicons.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// 月牙 SVG — 与 MoonIcon.tsx 相同的 path，填充 lime 绿色
function createMoonSvg(size, { withBackground = false, bgRadius = 0 } = {}) {
  const padding = withBackground ? size * 0.17 : size * 0.08
  const iconSize = size - padding * 2

  let bg = ''
  if (withBackground) {
    bg = `<rect width="${size}" height="${size}" rx="${bgRadius}" fill="url(#bg)"/>
    <defs><linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0c0a09"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient></defs>`
  }

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  ${bg}
  <g transform="translate(${padding}, ${padding}) scale(${iconSize / 24})">
    <path d="M21 13.9066C19.805 14.6253 18.4055 15.0386 16.9095 15.0386C12.5198 15.0386 8.9612 11.4801 8.9612 7.09034C8.9612 5.59439 9.37447 4.19496 10.0931 3C6.03221 3.91866 3 7.5491 3 11.8878C3 16.9203 7.07968 21 12.1122 21C16.451 21 20.0815 17.9676 21 13.9066Z"
      fill="#a3e635" stroke="#65a30d" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`
}

// 简易 ICO 生成（BMP 格式封装，兼容所有浏览器）
// 因为不想引入额外依赖，用纯 SVG 方式写入 favicon.ico
// 实际上现代浏览器支持 SVG favicon，但为了最大兼容，我们写 SVG 到 favicon.svg
// 同时保留 favicon.ico 由 sharp 生成

async function main() {
  let sharp
  try {
    sharp = (await import('sharp')).default
  } catch {
    console.error('⚠️  sharp not found. Install it first: pnpm add -D sharp')
    console.log('Generating SVG files only...')
    sharp = null
  }

  // 1. 生成各尺寸 SVG
  const sizes = [
    { name: 'favicon-16x16.png', size: 16, dir: 'public' },
    { name: 'android-chrome-192x192.png', size: 192, dir: 'public', withBg: true, bgRadius: 40 },
    { name: 'android-chrome-512x512.png', size: 512, dir: 'public', withBg: true, bgRadius: 100 },
    { name: 'mstile-150x150.png', size: 150, dir: 'public', withBg: true, bgRadius: 0 },
  ]

  if (sharp) {
    for (const { name, size, dir, withBg, bgRadius } of sizes) {
      const svg = createMoonSvg(size, { withBackground: withBg, bgRadius: bgRadius || 0 })
      const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer()
      const outPath = join(ROOT, dir, name)
      writeFileSync(outPath, pngBuffer)
      console.log(`✅ ${dir}/${name} (${size}x${size})`)
    }

    // 2. 生成 favicon.ico (32x32 PNG 封装为 ICO)
    const faviconSvg = createMoonSvg(32)
    const favicon32 = await sharp(Buffer.from(faviconSvg)).png().toBuffer()

    // ICO 文件格式: header(6) + entry(16) + PNG data
    const icoHeader = Buffer.alloc(6)
    icoHeader.writeUInt16LE(0, 0)    // Reserved
    icoHeader.writeUInt16LE(1, 2)    // Type: 1 = ICO
    icoHeader.writeUInt16LE(1, 4)    // Number of images

    const icoEntry = Buffer.alloc(16)
    icoEntry.writeUInt8(32, 0)       // Width
    icoEntry.writeUInt8(32, 1)       // Height
    icoEntry.writeUInt8(0, 2)        // Color palette
    icoEntry.writeUInt8(0, 3)        // Reserved
    icoEntry.writeUInt16LE(1, 4)     // Color planes
    icoEntry.writeUInt16LE(32, 6)    // Bits per pixel
    icoEntry.writeUInt32LE(favicon32.length, 8)  // Image size
    icoEntry.writeUInt32LE(22, 12)   // Offset (6 + 16 = 22)

    const ico = Buffer.concat([icoHeader, icoEntry, favicon32])
    writeFileSync(join(ROOT, 'app', 'favicon.ico'), ico)
    console.log('✅ app/favicon.ico (32x32)')
  }

  // 3. 同时生成一个 SVG favicon（现代浏览器优先使用）
  const svgFavicon = createMoonSvg(32)
  writeFileSync(join(ROOT, 'public', 'favicon.svg'), svgFavicon)
  console.log('✅ public/favicon.svg')

  console.log('\n🌙 所有月亮图标已生成！')
}

main().catch(console.error)
