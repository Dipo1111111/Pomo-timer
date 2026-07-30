const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const ASSETS = path.resolve(__dirname, '..', 'assets')

/* ─── SVG generators ─── */

function foregroundSvg(size, color = '#632228') {
  const c = size / 2
  const outerR = size * 0.4
  const innerR = size * 0.32
  const textSize = Math.round(size * 0.22)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${c}" cy="${c}" r="${outerR}" fill="none" stroke="${color}" stroke-width="${Math.round(size * 0.045)}"/>
    <circle cx="${c}" cy="${c}" r="${innerR}" fill="none" stroke="${color}" stroke-width="${Math.round(size * 0.025)}" opacity="0.2"/>
    <text x="${c}" y="${c}" text-anchor="middle" dominant-baseline="central"
          font-family="Georgia, 'Times New Roman', serif" font-size="${textSize}" font-weight="700" fill="${color}">25</text>
  </svg>`
}

function backgroundSvg(size, bgColor = '#F2EDE4') {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="${bgColor}"/>
  </svg>`
}

/* ─── Icon with cream bg + timer ring (like web favicon) ─── */

function faviconStyleSvg(size) {
  const c = size / 2
  const r = size * 0.425
  const innerR = size * 0.34
  const strokeW = Math.round(size * 0.065)
  const textSize = Math.round(size * 0.3)
  const dotR = Math.round(size * 0.035)
  const rx = Math.round(size * 0.2)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" rx="${rx}" fill="#F2EDE4"/>
    <circle cx="${c}" cy="${c}" r="${r}" stroke="#632228" stroke-width="${strokeW}" fill="none" opacity="0.12"/>
    <circle cx="${c}" cy="${c}" r="${innerR}" stroke="#632228" stroke-width="${strokeW}" fill="none"
      stroke-dasharray="${Math.round(2 * Math.PI * innerR)}" stroke-dashoffset="${Math.round(2 * Math.PI * innerR * 0.25)}"
      stroke-linecap="round" transform="rotate(-90 ${c} ${c})"/>
    <circle cx="${c}" cy="${c}" r="${dotR}" fill="#632228" opacity="0.35"/>
    <text x="${c}" y="${c + textSize * 0.2}" text-anchor="middle" fill="#632228"
          font-family="Georgia, 'Times New Roman', serif" font-size="${textSize}" font-weight="700">25</text>
  </svg>`
}

async function generate() {
  // ── Android adaptive icon (foreground on transparent) ──
  const fg = Buffer.from(foregroundSvg(432))
  await sharp(fg).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-foreground.png'))
  console.log('✓ android-icon-foreground.png 432×432')

  // ── Android adaptive icon (cream background) ──
  const bg = Buffer.from(backgroundSvg(432))
  await sharp(bg).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-background.png'))
  console.log('✓ android-icon-background.png 432×432')

  // ── Android monochrome (light-on-dark ring) ──
  const mono = Buffer.from(foregroundSvg(432, '#F2EDE4'))
  await sharp(mono).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-monochrome.png'))
  console.log('✓ android-icon-monochrome.png 432×432')

  // ── App icon (192×192, used for notifications etc.) ──
  const appIcon = Buffer.from(faviconStyleSvg(192))
  await sharp(appIcon).resize(192, 192).png().toFile(path.join(ASSETS, 'icon.png'))
  console.log('✓ icon.png 192×192')

  // ── Splash screen icon (centered on cream bg) ──
  const splash = Buffer.from(faviconStyleSvg(256))
  await sharp(splash).resize(256, 256).png().toFile(path.join(ASSETS, 'splash-icon.png'))
  console.log('✓ splash-icon.png 256×256')

  // ── Favicon (48×48) ──
  const favicon = Buffer.from(faviconStyleSvg(48))
  await sharp(favicon).resize(48, 48).png().toFile(path.join(ASSETS, 'favicon.png'))
  console.log('✓ favicon.png 48×48')

  console.log('\nAll icons regenerated.')
}

generate().catch(err => { console.error(err); process.exit(1) })
