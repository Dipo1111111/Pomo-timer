const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const ASSETS = path.resolve(__dirname, '..', 'assets')

// Recreate the SVG inline to avoid reading issues
function foregroundSvg(size) {
  const c = size / 2
  const innerR = size * 0.32
  const outerR = size * 0.4
  const textSize = Math.round(size * 0.22)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${c}" cy="${c}" r="${outerR}" fill="none" stroke="#632228" stroke-width="${Math.round(size * 0.045)}"/>
    <circle cx="${c}" cy="${c}" r="${innerR}" fill="none" stroke="#632228" stroke-width="${Math.round(size * 0.025)}" opacity="0.2"/>
    <text x="${c}" y="${c}" text-anchor="middle" dominant-baseline="central"
          font-family="serif" font-size="${textSize}" font-weight="700" fill="#632228">25</text>
  </svg>`
}

function backgroundSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="#F2EDE4"/>
  </svg>`
}

async function generate() {
  // Foreground: 432x432 for adaptive icon (Android uses 108dp x 108dp with 72dp crop zone)
  const fg = Buffer.from(foregroundSvg(432))
  await sharp(fg).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-foreground.png'))
  console.log('✓ android-icon-foreground.png 432×432')

  // Background: solid warm ivory
  const bg = Buffer.from(backgroundSvg(432))
  await sharp(bg).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-background.png'))
  console.log('✓ android-icon-background.png 432×432')

  // Monochrome (oxblood silhouette of the ring)
  const mono = Buffer.from(foregroundSvg(432).replace('#632228', '#F2EDE4'))
  await sharp(mono).resize(432, 432).png().toFile(path.join(ASSETS, 'android-icon-monochrome.png'))
  console.log('✓ android-icon-monochrome.png 432×432')

  // App icon (108dp standard, used for notification icon etc.)
  const appIcon = Buffer.from(foregroundSvg(192))
  await sharp(appIcon).resize(192, 192).png().toFile(path.join(ASSETS, 'icon.png'))
  console.log('✓ icon.png 192×192')
}

generate().catch(err => { console.error(err); process.exit(1) })
