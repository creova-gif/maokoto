#!/usr/bin/env node
// Pure Node.js PNG generator — no external deps
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function writePNG(filepath, width, height, pixelFn) {
  const rowSize = width * 4;
  const rawSize = (rowSize + 1) * height;
  const raw = Buffer.alloc(rawSize);
  for (let y = 0; y < height; y++) {
    raw[y * (rowSize + 1)] = 0; // filter type
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = pixelFn(x, y, width, height);
      const i = y * (rowSize + 1) + 1 + x * 4;
      raw[i] = r; raw[i+1] = g; raw[i+2] = b; raw[i+3] = a;
    }
  }
  const compressed = zlib.deflateSync(raw, { level: 6 });

  const crc32 = (() => {
    const t = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return (buf) => {
      let c = 0xffffffff;
      for (const b of buf) c = t[(c ^ b) & 0xff] ^ (c >>> 8);
      return (c ^ 0xffffffff) >>> 0;
    };
  })();

  const chunk = (type, data) => {
    const t = Buffer.from(type);
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
    return Buffer.concat([len, t, data, crcBuf]);
  };

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0); ihdr.writeUInt32BE(height, 4);
  ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0;

  const out = Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, out);
  console.log('wrote', filepath, `(${width}x${height})`);
}

// Helpers
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo=0, hi=255) => Math.max(lo, Math.min(hi, v));
const dist = (x, y, cx, cy) => Math.sqrt((x-cx)**2 + (y-cy)**2);

// Icon pixel function: emerald gradient bg + gold coin + $ sign
function iconPixel(x, y, w, h) {
  const nx = x / w, ny = y / h;
  const r = Math.min(w, h) * 0.22;
  const cx = w / 2, cy = h / 2;
  const dx = x - cx, dy = y - cy;
  const corner = Math.max(Math.abs(dx) - (w/2 - r), 0)**2 + Math.max(Math.abs(dy) - (h/2 - r), 0)**2;
  if (corner > r * r) return [0,0,0,0]; // outside rounded rect

  // Gradient bg: emerald to teal
  const bgR = clamp(lerp(5, 13, nx + ny * 0.3));
  const bgG = clamp(lerp(150, 148, nx));
  const bgB = clamp(lerp(105, 136, ny));

  // Coin circle
  const coinR = w * 0.28;
  const coinDist = dist(x, y, cx, cy * 0.92);
  if (coinDist < coinR) {
    const t = coinDist / coinR;
    const cr = clamp(lerp(251, 245, t));
    const cg = clamp(lerp(191, 158, t));
    const cb = clamp(lerp(36, 11, t));
    // Dollar sign via simple mask
    const sy = (y - cy * 0.92) / coinR;
    const sx = (x - cx) / coinR;
    // vertical bar of $
    const inBar = Math.abs(sx) < 0.1 && Math.abs(sy) < 0.62;
    // S curves - simplified as two semicircle arcs
    const topArcDist = dist(sx, sy, 0.0, 0.28);
    const botArcDist = dist(sx, sy, 0.0, -0.28);
    const inTopArc = topArcDist > 0.22 && topArcDist < 0.38 && sx < 0.04 && sy > 0.05;
    const inBotArc = botArcDist > 0.22 && botArcDist < 0.38 && sx > -0.04 && sy < -0.05;
    if (inBar || inTopArc || inBotArc) {
      return [146, 64, 14, 255]; // brown $
    }
    return [cr, cg, cb, 255];
  }

  return [bgR, bgG, bgB, 255];
}

// Splash: dark bg + centered coin + text rows
function splashPixel(x, y, w, h) {
  // dark bg
  const bgR = 3, bgG = 7, bgB = 18;
  const cx = w / 2, cy = h * 0.42;
  const coinR = Math.min(w, h) * 0.14;
  const d = dist(x, y, cx, cy);
  if (d < coinR) {
    const t = d / coinR;
    return [clamp(lerp(251,245,t)), clamp(lerp(191,158,t)), clamp(lerp(36,11,t)), 255];
  }
  // subtle glow
  if (d < coinR * 1.6) {
    const a = clamp((1 - (d - coinR)/(coinR * 0.6)) * 30);
    return [5 + a, 150, 105, 255];
  }
  return [bgR, bgG, bgB, 255];
}

const assetsDir = path.join(__dirname, 'assets');
writePNG(path.join(assetsDir, 'icon.png'), 1024, 1024, iconPixel);
writePNG(path.join(assetsDir, 'adaptive-icon.png'), 1024, 1024, iconPixel);
writePNG(path.join(assetsDir, 'splash.png'), 1242, 2688, splashPixel);
writePNG(path.join(assetsDir, 'favicon.png'), 64, 64, iconPixel);
console.log('Done!');
