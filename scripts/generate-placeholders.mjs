#!/usr/bin/env node
/**
 * Draws the illustrated PLACEHOLDER photos of the two demo clients
 * (src/assets/images/tasca-do-largo/ and src/assets/images/pastelaria-sol/).
 *
 * You do NOT need this for real clients: replace the image files with the
 * client's real photos instead. It is kept so the demo images can be re-created.
 *
 * Run:  node scripts/generate-placeholders.mjs            (all images)
 *       node scripts/generate-placeholders.mjs nata hero  (only files whose name contains "nata" or "hero")
 */
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const OUT = fileURLToPath(new URL('../src/assets/images/', import.meta.url));

/* ───────────────────────── Drawing toolkit ───────────────────────── */

function makeRandom(seed) {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  next.range = (a, b) => a + next() * (b - a);
  next.pick = (list) => list[Math.floor(next() * list.length)];
  return next;
}

const n = (v) => Math.round(v * 10) / 10;
let uid = 0;
const id = (name) => `${name}${++uid}`;

function smoothClosed(points) {
  const len = points.length;
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 0; i < len; i++) {
    const p0 = points[(i - 1 + len) % len];
    const p1 = points[i];
    const p2 = points[(i + 1) % len];
    const p3 = points[(i + 2) % len];
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${n(p2[0])} ${n(p2[1])}`;
  }
  return `${d}Z`;
}

function smoothOpen(points) {
  const pts = [points[0], ...points, points[points.length - 1]];
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 1; i < pts.length - 2; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1], pts[i], pts[i + 1], pts[i + 2]];
    d += `C${n(p1[0] + (p2[0] - p0[0]) / 6)} ${n(p1[1] + (p2[1] - p0[1]) / 6)} ${n(p2[0] - (p3[0] - p1[0]) / 6)} ${n(
      p2[1] - (p3[1] - p1[1]) / 6,
    )} ${n(p2[0])} ${n(p2[1])}`;
  }
  return d;
}

/** Irregular round shape. */
function blob(r, cx, cy, rx, ry, jitter = 0.12, count = 10, rotation = r() * Math.PI * 2) {
  const pts = [];
  for (let i = 0; i < count; i++) {
    const a = rotation + (i / count) * Math.PI * 2;
    const k = 1 + (r() * 2 - 1) * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smoothClosed(pts);
}

function inEllipse(r, cx, cy, rx, ry) {
  const a = r() * Math.PI * 2;
  const d = Math.sqrt(r());
  return [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d];
}

const shadow = (cx, cy, rx, ry, opacity = 0.32, blur = 'blur-m') =>
  `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="#000" opacity="${opacity}" filter="url(#${blur})"/>`;

function radial(stops, { cx = '45%', cy = '40%', r = '65%' } = {}) {
  const gid = id('rg');
  const def = `<radialGradient id="${gid}" cx="${cx}" cy="${cy}" r="${r}">${stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join('')}</radialGradient>`;
  return { def, url: `url(#${gid})` };
}

function linear(stops, [x1, y1, x2, y2] = ['0%', '0%', '0%', '100%']) {
  const gid = id('lg');
  const def = `<linearGradient id="${gid}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`)
    .join('')}</linearGradient>`;
  return { def, url: `url(#${gid})` };
}

const FILTERS = `
<filter id="blur-xs" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
<filter id="blur-s" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="blur-m" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
<filter id="blur-l" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="38"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="11" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;

function svg(w, h, body, { vignette = 0.42, light = 0.14, grain = 0.07 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>${FILTERS}
<radialGradient id="vig" cx="50%" cy="46%" r="75%"><stop offset="52%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${vignette}"/></radialGradient>
<radialGradient id="light" cx="20%" cy="10%" r="90%"><stop offset="0%" stop-color="#fff6e0" stop-opacity="${light}"/><stop offset="65%" stop-color="#fff6e0" stop-opacity="0"/></radialGradient>
</defs>
${body}
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grain}"/>
<rect width="${w}" height="${h}" fill="url(#light)"/>
<rect width="${w}" height="${h}" fill="url(#vig)"/>
</svg>`;
}

/* ───────────────────────── Surfaces ───────────────────────── */

function wood(r, w, h, { base = '#6B4A32', dark = '#3A271A', light = '#946B4B', planks = 4 } = {}) {
  let s = `<rect width="${w}" height="${h}" fill="${base}"/>`;
  const ph = h / planks;
  for (let i = 0; i < planks; i++) {
    const y0 = i * ph;
    s += `<rect y="${n(y0)}" width="${w}" height="${n(ph)}" fill="${r() > 0.5 ? light : dark}" opacity="${n(0.06 + r() * 0.16)}"/>`;
    const lines = Math.round(ph / 6);
    for (let j = 0; j < lines; j++) {
      const y = y0 + r() * ph;
      let d = `M-30 ${n(y)}`;
      const segs = 6;
      for (let k = 1; k <= segs; k++) {
        const x = (k / segs) * (w + 60) - 30;
        d += ` S${n(x - w / segs / 2)} ${n(y + (r() - 0.5) * 18)} ${n(x)} ${n(y + (r() - 0.5) * 8)}`;
      }
      s += `<path d="${d}" fill="none" stroke="${r() > 0.3 ? dark : light}" stroke-width="${n(0.8 + r() * 2.6)}" opacity="${n(
        0.06 + r() * 0.2,
      )}"/>`;
    }
    if (r() > 0.4) {
      const kx = r() * w;
      const ky = y0 + ph * (0.3 + r() * 0.4);
      for (let k = 0; k < 4; k++)
        s += `<ellipse cx="${n(kx)}" cy="${n(ky)}" rx="${n(18 + k * 16)}" ry="${n(5 + k * 5)}" fill="none" stroke="${dark}" stroke-width="2" opacity="${n(
          0.25 - k * 0.05,
        )}"/>`;
    }
    s += `<rect y="${n(y0 + ph - 2)}" width="${w}" height="4" fill="#000" opacity=".38"/>`;
  }
  return s;
}

function gingham(w, h, { base = '#F5F0E6', color = '#2C5EA8', size = 56, opacity = 0.4, angle = -6 } = {}) {
  const pid = id('gingham');
  let s = `<defs><pattern id="${pid}" width="${size * 2}" height="${size * 2}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})">
<rect width="${size * 2}" height="${size * 2}" fill="${base}"/>
<rect width="${size}" height="${size * 2}" fill="${color}" opacity="${opacity}"/>
<rect width="${size * 2}" height="${size}" fill="${color}" opacity="${opacity}"/>
</pattern></defs><rect width="${w}" height="${h}" fill="url(#${pid})"/>`;
  // soft fabric folds
  s += `<path d="M${-w * 0.1} ${h * 0.25} C ${w * 0.3} ${h * 0.15}, ${w * 0.6} ${h * 0.45}, ${w * 1.1} ${h * 0.3}" stroke="#fff" stroke-width="${n(h * 0.08)}" opacity=".12" fill="none" filter="url(#blur-l)"/>`;
  s += `<path d="M${-w * 0.1} ${h * 0.75} C ${w * 0.35} ${h * 0.6}, ${w * 0.7} ${h * 0.95}, ${w * 1.1} ${h * 0.7}" stroke="#000" stroke-width="${n(h * 0.07)}" opacity=".08" fill="none" filter="url(#blur-l)"/>`;
  return s;
}

function linen(r, w, h, { base = '#E6DDCC', thread = '#CDBFA6' } = {}) {
  let s = `<rect width="${w}" height="${h}" fill="${base}"/>`;
  for (let y = 0; y < h; y += 5) s += `<rect y="${y}" width="${w}" height="1.4" fill="${thread}" opacity="${n(0.12 + r() * 0.2)}"/>`;
  for (let x = 0; x < w; x += 5) s += `<rect x="${x}" width="1.4" height="${h}" fill="${thread}" opacity="${n(0.1 + r() * 0.16)}"/>`;
  return s;
}

function marble(r, w, h, { base = '#EEEBE6', vein = '#A9A49C' } = {}) {
  let s = `<rect width="${w}" height="${h}" fill="${base}"/>`;
  for (let i = 0; i < 7; i++) {
    s += `<ellipse cx="${n(r() * w)}" cy="${n(r() * h)}" rx="${n(w * (0.15 + r() * 0.25))}" ry="${n(h * (0.1 + r() * 0.2))}" fill="${r() > 0.5 ? '#fff' : vein}" opacity="${n(
      0.1 + r() * 0.12,
    )}" filter="url(#blur-l)"/>`;
  }
  for (let i = 0; i < 9; i++) {
    let x = r() * w;
    let y = r() * h;
    let a = r() * Math.PI * 2;
    const pts = [[x, y]];
    for (let k = 0; k < 14; k++) {
      a += (r() - 0.5) * 0.9;
      x += Math.cos(a) * (w * 0.05);
      y += Math.sin(a) * (w * 0.05);
      pts.push([x, y]);
    }
    s += `<path d="${smoothOpen(pts)}" fill="none" stroke="${vein}" stroke-width="${n(1 + r() * 4)}" opacity="${n(
      0.25 + r() * 0.35,
    )}" filter="url(#blur-xs)"/>`;
  }
  return s;
}

/* ───────────────────────── Objects ───────────────────────── */

function plate(_r, cx, cy, R, { body = '#F8F4ED', well = '#F0EAE0', rim = null, shadowOpacity = 0.34 } = {}) {
  let s = shadow(cx + R * 0.05, cy + R * 0.09, R, R * 0.98, shadowOpacity);
  const g = radial([['0%', body], ['85%', body], ['100%', '#DDD5C8']], { cx: '42%', cy: '38%', r: '62%' });
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${g.url}"/>`;
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.975)}" fill="none" stroke="#fff" stroke-width="${n(R * 0.022)}" opacity=".8"/>`;
  if (rim) {
    s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.93)}" fill="none" stroke="${rim}" stroke-width="${n(R * 0.014)}"/>`;
    s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.79)}" fill="none" stroke="${rim}" stroke-width="${n(R * 0.01)}"/>`;
    const count = 22;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const x = cx + Math.cos(a) * R * 0.86;
      const y = cy + Math.sin(a) * R * 0.86;
      const k = R * 0.028;
      s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n((a * 180) / Math.PI)})" fill="${rim}"><ellipse rx="${n(k * 1.6)}" ry="${n(
        k * 0.55,
      )}"/><ellipse rx="${n(k * 0.55)}" ry="${n(k * 1.6)}"/></g>`;
      const a2 = a + Math.PI / count;
      s += `<circle cx="${n(cx + Math.cos(a2) * R * 0.86)}" cy="${n(cy + Math.sin(a2) * R * 0.86)}" r="${n(R * 0.011)}" fill="${rim}"/>`;
    }
  }
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.74)}" fill="${well}"/>`;
  s += `<circle cx="${n(cx + R * 0.01)}" cy="${n(cy + R * 0.02)}" r="${n(R * 0.73)}" fill="none" stroke="#000" stroke-opacity=".09" stroke-width="${n(
    R * 0.04,
  )}" filter="url(#blur-s)"/>`;
  return s;
}

function bowl(_r, cx, cy, R, { outer = '#B05E3C', lip = '#C9805C', inner = '#8E472B', shadowOpacity = 0.36 } = {}) {
  let s = shadow(cx + R * 0.06, cy + R * 0.1, R * 1.02, R, shadowOpacity);
  const g = radial([['0%', lip], ['70%', outer], ['100%', inner]], { cx: '40%', cy: '35%', r: '70%' });
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${g.url}"/>`;
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.86)}" fill="none" stroke="#fff" stroke-width="${n(R * 0.02)}" opacity=".25"/>`;
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.84)}" fill="${inner}"/>`;
  return s;
}

function olive(r, x, y, k, color = '#2C2420') {
  const a = r() * 180;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(a)})"><ellipse rx="${n(k * 1.25)}" ry="${n(k)}" fill="${color}"/><ellipse cx="${n(
    -k * 0.35,
  )}" cy="${n(-k * 0.35)}" rx="${n(k * 0.45)}" ry="${n(k * 0.22)}" fill="#fff" opacity=".35"/></g>`;
}

function parsley(r, cx, cy, rx, ry, count, size) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const [x, y] = inEllipse(r, cx, cy, rx, ry);
    s += `<path d="${blob(r, x, y, size * r.range(0.7, 1.3), size * r.range(0.5, 0.9), 0.45, 5)}" fill="${r.pick([
      '#3F7A2E',
      '#5A9440',
      '#2F6623',
      '#6FA84E',
    ])}"/>`;
  }
  return s;
}

function chourico(r, x, y, k) {
  let s = `<circle cx="${n(x + k * 0.08)}" cy="${n(y + k * 0.12)}" r="${n(k)}" fill="#000" opacity=".3" filter="url(#blur-s)"/>`;
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="#8A2A22" stroke="#5B1712" stroke-width="${n(k * 0.12)}"/>`;
  for (let i = 0; i < 9; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.75, k * 0.75);
    s += `<path d="${blob(r, px, py, k * r.range(0.07, 0.15), k * r.range(0.05, 0.12), 0.4, 6)}" fill="${r.pick([
      '#E7B49D',
      '#F0CDBA',
      '#B4473B',
    ])}"/>`;
  }
  s += `<ellipse cx="${n(x - k * 0.3)}" cy="${n(y - k * 0.35)}" rx="${n(k * 0.35)}" ry="${n(k * 0.14)}" fill="#fff" opacity=".22"/>`;
  return s;
}

function potato(r, x, y, k, { color = '#DDB774', skin = '#B98A45' } = {}) {
  const g = radial([['0%', '#F1D9A0'], ['55%', color], ['100%', skin]], { cx: '40%', cy: '35%', r: '70%' });
  let s = `<defs>${g.def}</defs>`;
  s += `<path d="${blob(r, x + k * 0.1, y + k * 0.15, k, k * 0.85, 0.18, 9)}" fill="#000" opacity=".28" filter="url(#blur-s)"/>`;
  s += `<path d="${blob(r, x, y, k, k * 0.85, 0.18, 9)}" fill="${g.url}"/>`;
  for (let i = 0; i < 3; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.7, k * 0.6);
    s += `<path d="${blob(r, px, py, k * 0.22, k * 0.12, 0.4, 6)}" fill="${skin}" opacity=".45"/>`;
  }
  return s;
}

function bread(r, x, y, k) {
  const g = radial([['0%', '#D9AA5E'], ['60%', '#B57D35'], ['100%', '#7E521F']], { cx: '42%', cy: '38%', r: '68%' });
  let s = `<defs>${g.def}</defs>`;
  s += shadow(x + k * 0.08, y + k * 0.12, k * 1.02, k * 0.95, 0.4);
  s += `<path d="${blob(r, x, y, k, k * 0.92, 0.07, 12)}" fill="${g.url}"/>`;
  // Cracked, floury crust (broa de milho): short jagged cracks with a light edge
  for (let i = 0; i < 16; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.68, k * 0.62);
    const pts = [[px, py]];
    let ang = r() * Math.PI * 2;
    for (let j = 0; j < 3; j++) {
      ang += (r() - 0.5) * 1.6;
      pts.push([pts[j][0] + Math.cos(ang) * k * 0.07, pts[j][1] + Math.sin(ang) * k * 0.07]);
    }
    const d = `M${pts.map(([cxp, cyp]) => `${n(cxp)} ${n(cyp)}`).join(' L')}`;
    s += `<path d="${d}" fill="none" stroke="#F3DDB0" stroke-width="${n(k * 0.03)}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(${n(
      -k * 0.012,
    )} ${n(-k * 0.012)})"/>`;
    s += `<path d="${d}" fill="none" stroke="#6A4114" stroke-width="${n(k * 0.016)}" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.6, k * 0.55);
    s += `<path d="${blob(r, px, py, k * r.range(0.12, 0.22), k * r.range(0.08, 0.16), 0.4, 8)}" fill="#fff" opacity=".22" filter="url(#blur-s)"/>`;
  }
  for (let i = 0; i < 260; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.95, k * 0.88);
    s += `<circle cx="${n(px)}" cy="${n(py)}" r="${n(r.range(0.8, 2.8))}" fill="#fff" opacity="${n(r.range(0.25, 0.7))}"/>`;
  }
  return s;
}

function wineGlass(_r, x, y, k, wine = '#6A1222') {
  const g = radial([['0%', '#9A2638'], ['65%', wine], ['100%', '#3A0812']], { cx: '45%', cy: '42%', r: '60%' });
  let s = `<defs>${g.def}</defs>`;
  s += shadow(x + k * 0.25, y + k * 0.3, k * 0.95, k * 0.9, 0.22);
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="#fff" opacity=".08" stroke="#fff" stroke-opacity=".35" stroke-width="${n(k * 0.03)}"/>`;
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 0.66)}" fill="${g.url}"/>`;
  s += `<path d="M${n(x - k * 0.55)} ${n(y - k * 0.2)} A${n(k * 0.6)} ${n(k * 0.6)} 0 0 1 ${n(x - k * 0.1)} ${n(
    y - k * 0.58,
  )}" fill="none" stroke="#fff" stroke-width="${n(k * 0.06)}" stroke-linecap="round" opacity=".55"/>`;
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 0.92)}" fill="none" stroke="#fff" stroke-width="${n(k * 0.015)}" opacity=".3"/>`;
  return s;
}

function knife(x, y, len, angle) {
  const w = len * 0.07;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
<rect x="${n(-len / 2 + len * 0.02)}" y="${n(-w / 2 + len * 0.025)}" width="${n(len)}" height="${n(w)}" rx="${n(w / 2)}" fill="#000" opacity=".3" filter="url(#blur-s)"/>
<rect x="${n(-len / 2)}" y="${n(-w / 2)}" width="${n(len * 0.42)}" height="${n(w)}" rx="${n(w / 2)}" fill="#C9C7C2"/>
<path d="M${n(-len / 2 + len * 0.42)} ${n(-w * 0.42)} L${n(len * 0.42)} ${n(-w * 0.42)} Q${n(len / 2)} ${n(-w * 0.4)} ${n(len / 2)} ${n(
    w * 0.15,
  )} L${n(-len / 2 + len * 0.42)} ${n(w * 0.42)} Z" fill="#E4E2DE"/>
<rect x="${n(-len / 2 + w * 0.3)}" y="${n(-w * 0.25)}" width="${n(len * 0.36)}" height="${n(w * 0.16)}" rx="${n(w * 0.08)}" fill="#fff" opacity=".6"/>
</g>`;
}

function fork(x, y, len, angle) {
  const w = len * 0.075;
  let tines = '';
  for (let i = 0; i < 4; i++) {
    const ty = -w * 0.95 + i * ((w * 1.9) / 3);
    tines += `<rect x="${n(len * 0.22)}" y="${n(ty - w * 0.09)}" width="${n(len * 0.28)}" height="${n(w * 0.18)}" rx="${n(w * 0.09)}" fill="#E4E2DE"/>`;
  }
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
<rect x="${n(-len / 2 + len * 0.02)}" y="${n(-w / 2 + len * 0.025)}" width="${n(len)}" height="${n(w * 1.4)}" rx="${n(w / 2)}" fill="#000" opacity=".28" filter="url(#blur-s)"/>
<rect x="${n(-len / 2)}" y="${n(-w / 2)}" width="${n(len * 0.55)}" height="${n(w)}" rx="${n(w / 2)}" fill="#C9C7C2"/>
<path d="M${n(len * 0.05)} ${n(-w * 0.35)} Q${n(len * 0.16)} ${n(-w * 1.05)} ${n(len * 0.24)} ${n(-w * 1.05)} L${n(len * 0.24)} ${n(
    w * 1.05,
  )} Q${n(len * 0.16)} ${n(w * 1.05)} ${n(len * 0.05)} ${n(w * 0.35)} Z" fill="#E4E2DE"/>
${tines}
</g>`;
}

function spoon(x, y, len, angle, { color = '#E4E2DE', handle = '#C9C7C2' } = {}) {
  const w = len * 0.07;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
<rect x="${n(-len / 2 + len * 0.02)}" y="${n(-w / 2 + len * 0.025)}" width="${n(len)}" height="${n(w * 2.4)}" rx="${n(w)}" fill="#000" opacity=".26" filter="url(#blur-s)"/>
<rect x="${n(-len / 2)}" y="${n(-w / 2)}" width="${n(len * 0.62)}" height="${n(w)}" rx="${n(w / 2)}" fill="${handle}"/>
<ellipse cx="${n(len * 0.32)}" cy="0" rx="${n(len * 0.2)}" ry="${n(w * 1.6)}" fill="${color}"/>
<ellipse cx="${n(len * 0.28)}" cy="${n(-w * 0.5)}" rx="${n(len * 0.1)}" ry="${n(w * 0.45)}" fill="#fff" opacity=".55"/>
</g>`;
}

function napkin(x, y, w, h, angle, { color = '#F3EEE4', stripe = '#2C5EA8' } = {}) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
<rect x="${n(-w / 2 + 10)}" y="${n(-h / 2 + 16)}" width="${n(w)}" height="${n(h)}" rx="10" fill="#000" opacity=".28" filter="url(#blur-m)"/>
<rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h)}" rx="8" fill="${color}"/>
<rect x="${n(-w / 2)}" y="${n(-h / 2 + h * 0.1)}" width="${n(w)}" height="${n(h * 0.05)}" fill="${stripe}" opacity=".85"/>
<rect x="${n(-w / 2)}" y="${n(-h / 2 + h * 0.18)}" width="${n(w)}" height="${n(h * 0.018)}" fill="${stripe}" opacity=".85"/>
<line x1="${n(-w / 2)}" y1="${n(h * 0.12)}" x2="${n(w / 2)}" y2="${n(h * 0.1)}" stroke="#000" stroke-opacity=".08" stroke-width="3"/>
</g>`;
}

function leaf(x, y, len, angle, color = '#5F7D3B') {
  const w = len * 0.32;
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
<path d="M${n(-len / 2)} 0 Q0 ${n(-w)} ${n(len / 2)} 0 Q0 ${n(w)} ${n(-len / 2)} 0Z" fill="${color}"/>
<path d="M${n(-len / 2)} 0 L${n(len / 2)} 0" stroke="#000" stroke-opacity=".25" stroke-width="${n(len * 0.02)}"/>
<path d="M${n(-len / 2)} 0 Q0 ${n(-w)} ${n(len / 2)} 0" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="${n(len * 0.03)}"/>
</g>`;
}

function steam(r, cx, cy, R) {
  let s = '';
  for (let i = 0; i < 5; i++) {
    const [x, y] = inEllipse(r, cx, cy - R * 0.2, R * 0.6, R * 0.4);
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R * r.range(0.25, 0.45))}" ry="${n(R * r.range(0.12, 0.22))}" fill="#fff" opacity="${n(
      r.range(0.06, 0.12),
    )}" filter="url(#blur-l)"/>`;
  }
  return s;
}

/* ───────────────────────── Dishes: Tasca do Largo ───────────────────────── */

function bacalhauABras(r, cx, cy, R) {
  let s = plate(r, cx, cy, R, { rim: '#2B5DA6' });
  const fr = R * 0.6;
  s += `<path d="${blob(r, cx + R * 0.03, cy + R * 0.05, fr, fr * 0.95, 0.1, 12)}" fill="#000" opacity=".22" filter="url(#blur-s)"/>`;
  s += `<path d="${blob(r, cx, cy, fr, fr * 0.95, 0.1, 12)}" fill="#E2B955"/>`;
  s += `<path d="${blob(r, cx + fr * 0.15, cy + fr * 0.18, fr * 0.8, fr * 0.7, 0.15, 10)}" fill="#B9862F" opacity=".35" filter="url(#blur-s)"/>`;
  const colors = ['#F7DD8C', '#EEC768', '#FAE8AC', '#D9A944', '#E8B955', '#F3D27A'];
  for (let i = 0; i < 560; i++) {
    const [x, y] = inEllipse(r, cx, cy, fr * 0.96, fr * 0.92);
    const len = r.range(R * 0.04, R * 0.095);
    const a = r() * Math.PI;
    s += `<line x1="${n(x)}" y1="${n(y)}" x2="${n(x + Math.cos(a) * len)}" y2="${n(y + Math.sin(a) * len)}" stroke="${r.pick(
      colors,
    )}" stroke-width="${n(R * 0.013 + r() * R * 0.008)}" stroke-linecap="round"/>`;
  }
  for (let i = 0; i < 50; i++) {
    const [x, y] = inEllipse(r, cx, cy, fr * 0.85, fr * 0.8);
    s += `<path d="${blob(r, x, y, R * 0.04, R * 0.022, 0.3, 6)}" fill="#F8F2E4" stroke="#E2D3B6" stroke-width="1.5"/>`;
  }
  for (let i = 0; i < 26; i++) {
    const [x, y] = inEllipse(r, cx, cy, fr * 0.85, fr * 0.8);
    const a = r() * Math.PI * 2;
    s += `<path d="M${n(x)} ${n(y)} q${n(Math.cos(a) * R * 0.05)} ${n(Math.sin(a) * R * 0.05)} ${n(Math.cos(a + 0.8) * R * 0.1)} ${n(
      Math.sin(a + 0.8) * R * 0.1,
    )}" fill="none" stroke="#F6EBC9" stroke-width="${n(R * 0.01)}" opacity=".8"/>`;
  }
  for (let i = 0; i < 7; i++) {
    const [x, y] = inEllipse(r, cx, cy, fr * 0.72, fr * 0.68);
    s += olive(r, x, y, R * 0.045);
  }
  s += parsley(r, cx, cy, fr * 0.85, fr * 0.8, 110, R * 0.013);
  return s;
}

function caldoVerde(r, cx, cy, R) {
  let s = bowl(r, cx, cy, R, { outer: '#A9573A', lip: '#C9805C', inner: '#8E472D' });
  const sr = R * 0.8;
  const g = radial([['0%', '#D6DC9F'], ['75%', '#BCC67F'], ['100%', '#8E9A54']]);
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(sr)}" fill="${g.url}"/>`;
  for (let i = 0; i < 190; i++) {
    const [x, y] = inEllipse(r, cx, cy, sr * 0.92, sr * 0.92);
    const a = r() * Math.PI * 2;
    const len = r.range(R * 0.07, R * 0.15);
    s += `<path d="M${n(x)} ${n(y)} q${n(Math.cos(a) * len * 0.6 + (r() - 0.5) * len * 0.5)} ${n(Math.sin(a) * len * 0.6 + (r() - 0.5) * len * 0.5)} ${n(
      Math.cos(a) * len,
    )} ${n(Math.sin(a) * len)}" fill="none" stroke="${r.pick(['#3E6B2A', '#2E5620', '#557F35', '#4A7A30', '#6D9645'])}" stroke-width="${n(
      R * r.range(0.01, 0.018),
    )}" stroke-linecap="round" opacity=".92"/>`;
  }
  s += chourico(r, cx - R * 0.12, cy - R * 0.05, R * 0.13);
  s += chourico(r, cx + R * 0.16, cy + R * 0.08, R * 0.12);
  s += chourico(r, cx + R * 0.02, cy + R * 0.25, R * 0.11);
  for (let i = 0; i < 12; i++) {
    const [x, y] = inEllipse(r, cx, cy, sr * 0.7, sr * 0.7);
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R * r.range(0.02, 0.05))}" ry="${n(R * r.range(0.015, 0.035))}" fill="#E8B940" opacity=".55"/>`;
  }
  return s;
}

function tentacle(_r, x0, y0, angle, length, width, curl) {
  const steps = 48;
  const left = [];
  const right = [];
  const centers = [];
  let a = angle;
  let x = x0;
  let y = y0;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const w = width * (1 - t * 0.9);
    const nx = Math.cos(a + Math.PI / 2);
    const ny = Math.sin(a + Math.PI / 2);
    centers.push([x, y, a, w]);
    left.push([x + (nx * w) / 2, y + (ny * w) / 2]);
    right.push([x - (nx * w) / 2, y - (ny * w) / 2]);
    x += Math.cos(a) * (length / steps);
    y += Math.sin(a) * (length / steps);
    a += curl * t * t * 0.1;
  }
  const outline = `M${left.map(([px, py]) => `${n(px)} ${n(py)}`).join(' L')} L${right
    .reverse()
    .map(([px, py]) => `${n(px)} ${n(py)}`)
    .join(' L')}Z`;
  let s = `<path d="${outline}" fill="#000" opacity=".28" transform="translate(${n(width * 0.12)} ${n(width * 0.2)})" filter="url(#blur-s)"/>`;
  s += `<path d="${outline}" fill="#8A2F3D"/>`;
  s += `<path d="${smoothOpen(centers.map(([px, py]) => [px, py]))}" fill="none" stroke="#B9505B" stroke-width="${n(width * 0.4)}" stroke-linecap="round" opacity=".55" filter="url(#blur-xs)"/>`;
  for (let i = 3; i < centers.length - 3; i += 3) {
    const [px, py, pa, w] = centers[i];
    const nx = Math.cos(pa - Math.PI / 2);
    const ny = Math.sin(pa - Math.PI / 2);
    s += `<circle cx="${n(px + nx * w * 0.28)}" cy="${n(py + ny * w * 0.28)}" r="${n(w * 0.17)}" fill="#F3D0C1" stroke="#C88E85" stroke-width="${n(
      Math.max(1, w * 0.04),
    )}"/>`;
  }
  s += `<path d="${smoothOpen(left.reverse().slice(2, -8))}" fill="none" stroke="#fff" stroke-width="${n(width * 0.06)}" opacity=".3"/>`;
  return s;
}

function polvo(r, cx, cy, R) {
  let s = plate(r, cx, cy, R);
  s += `<path d="${blob(r, cx, cy, R * 0.66, R * 0.62, 0.12, 10)}" fill="#E3BD4A" opacity=".32"/>`;
  const potatoes = [
    [-0.5, 0.3],
    [-0.38, -0.45],
    [0.46, 0.38],
    [0.55, -0.28],
    [0.05, 0.58],
    [-0.6, -0.08],
  ];
  for (const [px, py] of potatoes) s += potato(r, cx + px * R, cy + py * R, R * r.range(0.11, 0.13));
  // An octopus leg arrangement: thick legs radiating from the centre and curling at the tips
  const legs = [
    [-2.5, 2.4],
    [-1.25, 2.6],
    [-0.1, 2.3],
    [1.0, 2.7],
    [2.15, 2.5],
  ];
  for (const [angle, curl] of legs) {
    s += tentacle(r, cx + Math.cos(angle) * R * 0.05, cy + Math.sin(angle) * R * 0.05, angle, R * 0.62, R * 0.2, curl);
  }
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.11)}" fill="#7A2633"/><ellipse cx="${n(cx - R * 0.03)}" cy="${n(cy - R * 0.04)}" rx="${n(
    R * 0.05,
  )}" ry="${n(R * 0.025)}" fill="#fff" opacity=".25"/>`;
  for (let i = 0; i < 7; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.55, R * 0.5);
    s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(r() * 360)})"><path d="M0 ${n(-R * 0.035)} Q${n(R * 0.03)} 0 0 ${n(R * 0.035)} Q${n(
      -R * 0.012,
    )} 0 0 ${n(-R * 0.035)}Z" fill="#F6EEDD" stroke="#D9C9A8" stroke-width="1.5"/></g>`;
  }
  s += parsley(r, cx, cy, R * 0.55, R * 0.5, 80, R * 0.012);
  return s;
}

function chanfana(r, cx, cy, R) {
  let s = shadow(cx + R * 0.07, cy + R * 0.12, R * 1.15, R * 1.05, 0.45);
  for (const side of [-1, 1]) {
    s += `<rect x="${n(cx + side * R * 0.95 - R * 0.14)}" y="${n(cy - R * 0.12)}" width="${n(R * 0.28)}" height="${n(R * 0.24)}" rx="${n(
      R * 0.08,
    )}" fill="#2B2524"/>`;
  }
  const g = radial([['0%', '#4E4440'], ['80%', '#2F2826'], ['100%', '#1C1716']]);
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R)}" fill="${g.url}"/>`;
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.9)}" fill="none" stroke="#6A5D57" stroke-width="${n(R * 0.025)}" opacity=".7"/>`;
  const stew = radial([['0%', '#6A2A20'], ['70%', '#4C1D16'], ['100%', '#2A0E0A']]);
  s += `<defs>${stew.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.84)}" fill="${stew.url}"/>`;
  for (let i = 0; i < 12; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.62, R * 0.62);
    const k = R * r.range(0.1, 0.16);
    s += `<path d="${blob(r, x + k * 0.1, y + k * 0.15, k, k * 0.8, 0.25, 8)}" fill="#000" opacity=".35" filter="url(#blur-s)"/>`;
    s += `<path d="${blob(r, x, y, k, k * 0.8, 0.25, 8)}" fill="${r.pick(['#6B2620', '#7A3024', '#5C1F1A', '#843A2B'])}"/>`;
    s += `<ellipse cx="${n(x - k * 0.25)}" cy="${n(y - k * 0.3)}" rx="${n(k * 0.35)}" ry="${n(k * 0.15)}" fill="#fff" opacity=".18"/>`;
  }
  for (let i = 0; i < 5; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.6, R * 0.6);
    s += potato(r, x, y, R * r.range(0.1, 0.13), { color: '#D6A869', skin: '#9E6A30' });
  }
  s += leaf(cx - R * 0.2, cy - R * 0.45, R * 0.32, -25);
  s += leaf(cx + R * 0.35, cy + R * 0.1, R * 0.3, 60, '#6B8645');
  for (let i = 0; i < 24; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.75, R * 0.75);
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(R * 0.014)}" fill="#1A1312"/>`;
  }
  for (let i = 0; i < 6; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.6, R * 0.6);
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R * 0.06)}" ry="${n(R * 0.02)}" fill="#fff" opacity=".16" filter="url(#blur-xs)"/>`;
  }
  return s;
}

function leitao(r, cx, cy, R) {
  let s = shadow(cx + R * 0.06, cy + R * 0.1, R * 1.3, R * 0.95, 0.34);
  s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(R * 1.28)}" ry="${n(R * 0.92)}" fill="#F8F4ED"/>`;
  s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(R * 1.1)}" ry="${n(R * 0.76)}" fill="#EFE8DC"/>`;
  s += `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(R * 1.24)}" ry="${n(R * 0.88)}" fill="none" stroke="#fff" stroke-width="${n(R * 0.02)}" opacity=".8"/>`;
  // lettuce
  for (const [lx, ly] of [
    [0.75, -0.35],
    [0.85, 0.15],
  ]) {
    s += `<path d="${blob(r, cx + lx * R, cy + ly * R, R * 0.24, R * 0.2, 0.3, 14)}" fill="#6EA548"/>`;
    s += `<path d="${blob(r, cx + lx * R - R * 0.03, cy + ly * R - R * 0.03, R * 0.16, R * 0.13, 0.3, 12)}" fill="#8BC25E"/>`;
  }
  // potato rounds
  for (let i = 0; i < 16; i++) {
    const [x, y] = inEllipse(r, cx - R * 0.55, cy + R * 0.25, R * 0.35, R * 0.3);
    const k = R * r.range(0.08, 0.1);
    s += `<ellipse cx="${n(x + 3)}" cy="${n(y + 5)}" rx="${n(k)}" ry="${n(k * 0.9)}" fill="#000" opacity=".2" filter="url(#blur-xs)"/>`;
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(k)}" ry="${n(k * 0.9)}" fill="#EDC76B" stroke="#C99840" stroke-width="${n(k * 0.12)}"/>`;
  }
  // slices of roast pork
  for (let i = 0; i < 5; i++) {
    const x = cx - R * 0.35 + i * R * 0.2;
    const y = cy - R * 0.18 + (i % 2) * R * 0.05;
    const w = R * 0.34;
    const h = R * 0.52;
    s += `<g transform="translate(${n(x)} ${n(y)}) rotate(${n(-12 + i * 4)})">
<rect x="${n(-w / 2 + 6)}" y="${n(-h / 2 + 10)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.25)}" fill="#000" opacity=".3" filter="url(#blur-s)"/>
<rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(w * 0.25)}" fill="#E9C3A0"/>
<rect x="${n(-w / 2)}" y="${n(-h / 2)}" width="${n(w)}" height="${n(h * 0.34)}" rx="${n(w * 0.22)}" fill="#9A4716"/>
<rect x="${n(-w / 2 + w * 0.05)}" y="${n(-h / 2 + h * 0.03)}" width="${n(w * 0.9)}" height="${n(h * 0.2)}" rx="${n(w * 0.15)}" fill="#C26A27"/>
${Array.from({ length: 9 }, () => `<circle cx="${n((r() - 0.5) * w * 0.8)}" cy="${n(-h / 2 + h * (0.06 + r() * 0.18))}" r="${n(w * r.range(0.02, 0.045))}" fill="#E39A4E" opacity=".8"/>`).join('')}
<rect x="${n(-w / 2)}" y="${n(-h / 2 + h * 0.3)}" width="${n(w)}" height="${n(h * 0.07)}" fill="#F7E7D3"/>
<rect x="${n(-w / 2 + w * 0.12)}" y="${n(-h / 2 + h * 0.05)}" width="${n(w * 0.6)}" height="${n(h * 0.03)}" rx="4" fill="#fff" opacity=".4"/>
${[0.15, 0.28, 0.4].map((f) => `<path d="M${n(-w * 0.35)} ${n(h * f)} Q0 ${n(h * (f - 0.04))} ${n(w * 0.35)} ${n(h * (f + 0.02))}" stroke="#CF9A7A" stroke-width="2.5" fill="none" opacity=".6"/>`).join('')}
</g>`;
  }
  // orange wedges
  for (const [ox, oy, rot] of [
    [-0.85, -0.3, 30],
    [0.55, 0.55, -20],
  ]) {
    s += `<g transform="translate(${n(cx + ox * R)} ${n(cy + oy * R)}) rotate(${rot})">
<path d="M${n(-R * 0.2)} 0 A${n(R * 0.2)} ${n(R * 0.2)} 0 0 0 ${n(R * 0.2)} 0Z" fill="#E8851E"/>
<path d="M${n(-R * 0.17)} 0 A${n(R * 0.17)} ${n(R * 0.17)} 0 0 0 ${n(R * 0.17)} 0Z" fill="#F7B34B"/>
<path d="M0 0 L${n(-R * 0.1)} ${n(R * 0.13)} M0 0 L${n(R * 0.1)} ${n(R * 0.13)} M0 0 L0 ${n(R * 0.16)}" stroke="#FCE0A8" stroke-width="2"/>
</g>`;
  }
  return s;
}

function arrozDePato(r, cx, cy, W, H) {
  let s = `<rect x="${n(cx - W / 2 + 14)}" y="${n(cy - H / 2 + 26)}" width="${n(W)}" height="${n(H)}" rx="${n(H * 0.12)}" fill="#000" opacity=".4" filter="url(#blur-m)"/>`;
  for (const side of [-1, 1])
    s += `<rect x="${n(cx + side * W * 0.52 - W * 0.06)}" y="${n(cy - H * 0.14)}" width="${n(W * 0.12)}" height="${n(H * 0.28)}" rx="${n(
      H * 0.08,
    )}" fill="#9E4F30"/>`;
  s += `<rect x="${n(cx - W / 2)}" y="${n(cy - H / 2)}" width="${n(W)}" height="${n(H)}" rx="${n(H * 0.12)}" fill="#B9653F"/>`;
  s += `<rect x="${n(cx - W / 2 + W * 0.04)}" y="${n(cy - H / 2 + H * 0.06)}" width="${n(W * 0.92)}" height="${n(H * 0.88)}" rx="${n(
    H * 0.08,
  )}" fill="#C8873F"/>`;
  const iw = W * 0.88;
  const ih = H * 0.82;
  const cid = id('clip');
  s += `<defs><clipPath id="${cid}"><rect x="${n(cx - iw / 2)}" y="${n(cy - ih / 2)}" width="${n(iw)}" height="${n(ih)}" rx="${n(H * 0.06)}"/></clipPath></defs><g clip-path="url(#${cid})">`;
  s += `<rect x="${n(cx - iw / 2)}" y="${n(cy - ih / 2)}" width="${n(iw)}" height="${n(ih)}" fill="#D7A35A"/>`;
  for (let i = 0; i < 1500; i++) {
    const x = cx - iw / 2 + r() * iw;
    const y = cy - ih / 2 + r() * ih;
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(H * 0.012)}" ry="${n(H * 0.0055)}" transform="rotate(${n(r() * 180)} ${n(x)} ${n(y)})" fill="${r.pick([
      '#E9C07A',
      '#C98F45',
      '#F2D193',
      '#B87A39',
      '#DDA75E',
    ])}"/>`;
  }
  for (let i = 0; i < 14; i++) {
    s += `<ellipse cx="${n(cx - iw / 2 + r() * iw)}" cy="${n(cy - ih / 2 + r() * ih)}" rx="${n(H * r.range(0.04, 0.09))}" ry="${n(
      H * r.range(0.03, 0.06),
    )}" fill="#7A4A1E" opacity=".35" filter="url(#blur-s)"/>`;
  }
  for (let i = 0; i < 18; i++) {
    const x = cx - iw / 2 + r() * iw;
    const y = cy - ih / 2 + r() * ih;
    s += `<path d="M${n(x)} ${n(y)} q${n(H * 0.03)} ${n(H * 0.02)} ${n(H * 0.07)} ${n(-H * 0.01)}" stroke="#8E5B36" stroke-width="${n(
      H * 0.015,
    )}" stroke-linecap="round" fill="none"/>`;
  }
  const cols = 5;
  const rows = 3;
  for (let i = 0; i < cols; i++)
    for (let j = 0; j < rows; j++)
      s += chourico(r, cx - iw * 0.38 + (i * iw * 0.76) / (cols - 1) + (r() - 0.5) * 14, cy - ih * 0.3 + (j * ih * 0.6) / (rows - 1) + (r() - 0.5) * 14, H * 0.085);
  s += `</g>`;
  s += parsley(r, cx, cy, iw * 0.4, ih * 0.38, 50, H * 0.012);
  return s;
}

function arrozDoce(r, cx, cy, R) {
  let s = plate(r, cx, cy, R, { rim: '#2B5DA6' });
  const pr = R * 0.7;
  const g = radial([['0%', '#F7E6B5'], ['80%', '#EFD594'], ['100%', '#D9B66C']]);
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(pr)}" fill="${g.url}"/>`;
  for (let i = 0; i < 300; i++) {
    const [x, y] = inEllipse(r, cx, cy, pr * 0.95, pr * 0.95);
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R * 0.012)}" ry="${n(R * 0.006)}" transform="rotate(${n(r() * 180)} ${n(x)} ${n(y)})" fill="#FFF6DB" opacity=".7"/>`;
  }
  const cid = id('clip');
  s += `<defs><clipPath id="${cid}"><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(pr * 0.93)}"/></clipPath></defs><g clip-path="url(#${cid})">`;
  const gap = R * 0.24;
  for (let k = -7; k <= 7; k++) {
    for (const dir of [1, -1]) {
      const x1 = cx + k * gap - pr * dir;
      const y1 = cy - pr;
      const x2 = cx + k * gap + pr * dir;
      const y2 = cy + pr;
      s += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="#A86B3A" stroke-width="${n(R * 0.04)}" opacity=".35" filter="url(#blur-s)"/>`;
      s += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="#8A5530" stroke-width="${n(R * 0.016)}" opacity=".8" filter="url(#blur-xs)"/>`;
    }
  }
  s += `</g>`;
  for (let i = 0; i < 4; i++) {
    const [x, y] = inEllipse(r, cx, cy, pr * 0.5, pr * 0.5);
    s += `<path d="M${n(x)} ${n(y)} q${n(R * 0.04)} ${n(-R * 0.04)} ${n(R * 0.09)} ${n(R * 0.01)}" fill="none" stroke="#F2CF3A" stroke-width="${n(R * 0.016)}" stroke-linecap="round"/>`;
  }
  return s;
}

function cheese(r, cx, cy, R) {
  let s = plate(r, cx, cy, R, { body: '#EDE6DA', well: '#E6DDCF' });
  s += `<path d="${blob(r, cx, cy, R * 0.55, R * 0.5, 0.05, 12)}" fill="#D8B266"/>`;
  s += `<path d="${blob(r, cx, cy, R * 0.47, R * 0.43, 0.05, 12)}" fill="#F3E2A9"/>`;
  s += `<path d="${blob(r, cx + R * 0.05, cy - R * 0.05, R * 0.3, R * 0.25, 0.2, 10)}" fill="#FBF0C8"/>`;
  s += `<path d="M${n(cx)} ${n(cy)} L${n(cx + R * 0.55)} ${n(cy - R * 0.15)} L${n(cx + R * 0.5)} ${n(cy + R * 0.25)} Z" fill="#F7EBC0" stroke="#D3AD5F" stroke-width="4"/>`;
  s += spoon(cx - R * 0.15, cy + R * 0.35, R * 0.8, -20);
  return s;
}

/* ───────────────────────── Compositions: Tasca do Largo ───────────────────────── */

const tasca = {
  'hero-mesa-petiscos.jpg': [
    2400,
    1600,
    (r) => {
      let s = wood(r, 2400, 1600, { planks: 5 });
      s += napkin(1960, 980, 420, 300, -14);
      s += knife(1980, 960, 380, 76);
      s += fork(1900, 1000, 360, 80);
      s += bread(r, 470, 420, 230);
      s += cheese(r, 880, 280, 190);
      s += caldoVerde(r, 520, 1120, 250);
      s += bacalhauABras(r, 1320, 780, 440);
      s += wineGlass(r, 1980, 380, 125);
      s += wineGlass(r, 2190, 610, 112);
      const ob = bowl(r, 2080, 1360, 140, { outer: '#2E5E9E', lip: '#5A86C2', inner: '#F2EDE4' });
      s += ob;
      for (let i = 0; i < 14; i++) {
        const [x, y] = inEllipse(r, 2080, 1360, 90, 90);
        s += olive(r, x, y, 26, r.pick(['#2C2420', '#3B3A1E', '#4A3F24']));
      }
      for (let i = 0; i < 40; i++) s += `<circle cx="${n(r() * 2400)}" cy="${n(r() * 1600)}" r="${n(r.range(2, 5))}" fill="#D9B27A" opacity=".5"/>`;
      return s;
    },
  ],
  'sobre-tachos-ao-lume.jpg': [
    1200,
    1500,
    (r) => {
      let s = `<rect width="1200" height="1500" fill="#262220"/>`;
      for (let i = 0; i < 6; i++) s += `<rect x="${i * 220 - 40}" y="0" width="34" height="1500" fill="#141110" opacity=".9"/>`;
      for (let j = 0; j < 7; j++) s += `<rect x="0" y="${j * 230 + 60}" width="1200" height="30" fill="#141110" opacity=".9"/>`;
      for (const [x, y] of [
        [560, 520],
        [330, 1140],
        [900, 1170],
      ])
        s += `<circle cx="${x}" cy="${y}" r="${x === 560 ? 300 : 230}" fill="#E8742C" opacity=".22" filter="url(#blur-l)"/>`;
      s += chanfana(r, 590, 520, 330);
      s += caldoVerde(r, 330, 1150, 240);
      s += bowl(r, 910, 1170, 205, { outer: '#2F2B29', lip: '#55504C', inner: '#3A1A12' });
      for (let i = 0; i < 70; i++) {
        const [x, y] = inEllipse(r, 910, 1170, 165, 165);
        s += `<path d="${blob(r, x, y, r.range(10, 22), r.range(7, 14), 0.3, 7)}" fill="${r.pick(['#7E2A1C', '#A23C24', '#5A1B12', '#C2562F'])}"/>`;
      }
      s += steam(r, 590, 520, 330);
      s += steam(r, 330, 1150, 240);
      s += spoon(980, 760, 520, 125, { color: '#A47448', handle: '#8E6239' });
      return s;
    },
  ],
  'sobre-pao-azeite-vinho.jpg': [
    1200,
    900,
    (r) => {
      let s = linen(r, 1200, 900);
      s += `<rect x="96" y="130" width="640" height="640" rx="60" fill="#000" opacity=".35" filter="url(#blur-m)"/>`;
      s += `<rect x="80" y="110" width="640" height="640" rx="60" fill="#B78452"/>`;
      for (let i = 0; i < 40; i++) s += `<rect x="80" y="${110 + i * 16}" width="640" height="${n(r.range(1, 3))}" fill="#7E5530" opacity="${n(r.range(0.1, 0.3))}"/>`;
      s += bread(r, 400, 430, 245);
      const oil = bowl(r, 900, 240, 120, { outer: '#F2EDE4', lip: '#FFFFFF', inner: '#E2C13F' });
      s += oil;
      s += `<circle cx="900" cy="240" r="85" fill="#C9A321" opacity=".5"/><ellipse cx="875" cy="215" rx="30" ry="12" fill="#fff" opacity=".5"/>`;
      s += wineGlass(r, 930, 620, 150);
      for (let i = 0; i < 8; i++) {
        const [x, y] = inEllipse(r, 820, 420, 60, 40);
        s += olive(r, x, y, 20, r.pick(['#3B3A1E', '#2C2420']));
      }
      return s;
    },
  ],
  'sobre-mesa-posta.jpg': [
    1200,
    900,
    (r) => {
      let s = gingham(1200, 900, { color: '#2C5EA8', size: 46, opacity: 0.38 });
      s += plate(r, 360, 470, 250, { rim: '#2B5DA6' });
      s += plate(r, 900, 420, 230, { rim: '#2B5DA6' });
      s += fork(360, 790, 300, 0);
      s += knife(880, 760, 320, 0);
      s += wineGlass(r, 640, 160, 95);
      s += wineGlass(r, 1110, 760, 90);
      s += napkin(140, 150, 230, 160, -20, { stripe: '#A9442E' });
      return s;
    },
  ],
  'prato-caldo-verde.jpg': [1200, 900, (r) => linen(r, 1200, 900, { base: '#E3D8C6' }) + bread(r, 1000, 200, 150) + caldoVerde(r, 560, 470, 340) + spoon(990, 690, 380, -60)],
  'prato-bacalhau-a-bras.jpg': [
    1200,
    900,
    (r) => wood(r, 1200, 900, { planks: 3 }) + napkin(1040, 520, 250, 200, -8) + fork(1030, 520, 300, 84) + bacalhauABras(r, 540, 450, 390),
  ],
  'prato-polvo-a-lagareiro.jpg': [1200, 900, (r) => gingham(1200, 900, { color: '#2C5EA8', size: 40, opacity: 0.32 }) + polvo(r, 600, 450, 390)],
  'prato-chanfana.jpg': [1200, 900, (r) => wood(r, 1200, 900, { planks: 3, base: '#5E4130' }) + bread(r, 1030, 190, 130) + chanfana(r, 560, 460, 330)],
  'prato-leitao-a-bairrada.jpg': [1200, 900, (r) => linen(r, 1200, 900, { base: '#E9E2D5' }) + leitao(r, 600, 450, 330)],
  'prato-arroz-de-pato.jpg': [1200, 900, (r) => wood(r, 1200, 900, { planks: 3, base: '#6E4E36' }) + arrozDePato(r, 600, 450, 860, 600)],
  'sobremesa-arroz-doce.jpg': [1200, 900, (r) => linen(r, 1200, 900, { base: '#ECE4D6' }) + arrozDoce(r, 560, 450, 360) + spoon(1010, 460, 330, -80)],
  'partilha-redes-sociais.jpg': [
    1200,
    630,
    (r) => {
      let s = wood(r, 1200, 630, { planks: 3 });
      s += bacalhauABras(r, 860, 330, 300);
      s += wineGlass(r, 1120, 110, 80);
      const g = linear(
        [
          ['0%', '#14294A', 0.96],
          ['55%', '#14294A', 0.82],
          ['100%', '#14294A', 0],
        ],
        ['0%', '0%', '100%', '0%'],
      );
      s += `<defs>${g.def}</defs><rect width="760" height="630" fill="${g.url}"/>`;
      s += `<text x="70" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" fill="#fff">Tasca do Largo</text>`;
      s += `<text x="72" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#fff" opacity=".9">Cozinha tradicional portuguesa · Coimbra</text>`;
      s += `<rect x="72" y="392" width="120" height="6" rx="3" fill="#E7B37A"/>`;
      return s;
    },
  ],
};

/* ───────────────────────── Pastelaria Sol ───────────────────────── */

function nata(r, cx, cy, R) {
  let s = shadow(cx + R * 0.08, cy + R * 0.12, R * 1.02, R, 0.42, 'blur-s');
  // Flaky puff-pastry rim: irregular golden layers with crisp light and dark edges
  const crust = radial([['0%', '#B26E28'], ['78%', '#C98632'], ['92%', '#E2A653'], ['100%', '#A9672A']], { cx: '50%', cy: '50%', r: '50%' });
  s += `<defs>${crust.def}</defs><path d="${blob(r, cx, cy, R, R, 0.05, 16)}" fill="${crust.url}"/>`;
  for (const [k, color] of [
    [0.96, '#8F5520'],
    [0.91, '#F1C27A'],
    [0.86, '#9E5F22'],
    [0.81, '#EBB566'],
  ]) {
    s += `<path d="${blob(r, cx, cy, R * k, R * k, 0.035, 18)}" fill="none" stroke="${color}" stroke-width="${n(R * 0.022)}" opacity=".75"/>`;
  }
  for (let i = 0; i < 46; i++) {
    const a = r() * Math.PI * 2;
    const rr = R * r.range(0.78, 0.97);
    const span = r.range(0.12, 0.3);
    const x1 = cx + Math.cos(a) * rr;
    const y1 = cy + Math.sin(a) * rr;
    const x2 = cx + Math.cos(a + span) * rr;
    const y2 = cy + Math.sin(a + span) * rr;
    s += `<path d="M${n(x1)} ${n(y1)} A${n(rr)} ${n(rr)} 0 0 1 ${n(x2)} ${n(y2)}" fill="none" stroke="${r.pick([
      '#F6D08E',
      '#7E4718',
      '#FBE2B0',
      '#9A5A1E',
    ])}" stroke-width="${n(R * r.range(0.012, 0.024))}" stroke-linecap="round" opacity=".85"/>`;
  }
  s += `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.75)}" fill="#7A4316"/>`;
  const g = radial([['0%', '#FAD877'], ['70%', '#F0BD4C'], ['100%', '#D9962E']]);
  s += `<defs>${g.def}</defs><path d="${blob(r, cx, cy, R * 0.7, R * 0.7, 0.03, 12)}" fill="${g.url}"/>`;
  for (let i = 0; i < r.range(5, 9); i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.5, R * 0.5);
    const k = R * r.range(0.1, 0.22);
    s += `<path d="${blob(r, x, y, k, k * 0.8, 0.35, 8)}" fill="#7A4115" opacity=".75" filter="url(#blur-s)"/>`;
    s += `<path d="${blob(r, x, y, k * 0.55, k * 0.45, 0.4, 7)}" fill="#3E200A" opacity=".85" filter="url(#blur-xs)"/>`;
  }
  s += `<ellipse cx="${n(cx - R * 0.25)}" cy="${n(cy - R * 0.3)}" rx="${n(R * 0.2)}" ry="${n(R * 0.07)}" fill="#fff" opacity=".25" filter="url(#blur-xs)"/>`;
  return s;
}

function bolaDeBerlim(r, cx, cy, R, cut = false) {
  let s = shadow(cx + R * 0.08, cy + R * 0.12, R * 1.02, R, 0.38);
  const g = radial([['0%', '#C27A33'], ['55%', '#B36A28'], ['72%', '#E7BB7A'], ['82%', '#D49650'], ['100%', '#9E5A20']], { cx: '50%', cy: '50%', r: '50%' });
  s += `<defs>${g.def}</defs><path d="${blob(r, cx, cy, R, R * 0.96, 0.04, 12)}" fill="${g.url}"/>`;
  if (cut) {
    s += `<path d="M${n(cx - R * 0.75)} ${n(cy - R * 0.05)} Q${n(cx)} ${n(cy - R * 0.28)} ${n(cx + R * 0.75)} ${n(cy - R * 0.05)} Q${n(cx)} ${n(
      cy + R * 0.35,
    )} ${n(cx - R * 0.75)} ${n(cy - R * 0.05)}Z" fill="#F3C63E" stroke="#E2B04F" stroke-width="4"/>`;
    s += `<ellipse cx="${n(cx - R * 0.15)}" cy="${n(cy - R * 0.02)}" rx="${n(R * 0.25)}" ry="${n(R * 0.06)}" fill="#FFF1B0" opacity=".7"/>`;
  }
  for (let i = 0; i < 220; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.95, R * 0.92);
    const k = r.range(2, 5);
    s += `<rect x="${n(x)}" y="${n(y)}" width="${n(k)}" height="${n(k)}" transform="rotate(${n(r() * 90)} ${n(x)} ${n(y)})" fill="#fff" opacity="${n(
      r.range(0.55, 0.95),
    )}"/>`;
  }
  return s;
}

function domRodrigo(r, cx, cy, R, color) {
  let s = shadow(cx + R * 0.08, cy + R * 0.12, R * 1.05, R, 0.4, 'blur-s');
  const petals = 11;
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2 + r() * 0.1;
    const px = cx + Math.cos(a) * R * 0.62;
    const py = cy + Math.sin(a) * R * 0.62;
    s += `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(R * 0.42)}" ry="${n(R * 0.2)}" transform="rotate(${n((a * 180) / Math.PI)} ${n(px)} ${n(py)})" fill="${color}"/>`;
    s += `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(R * 0.3)}" ry="${n(R * 0.06)}" transform="rotate(${n((a * 180) / Math.PI)} ${n(px)} ${n(py)})" fill="#fff" opacity=".35"/>`;
  }
  const g = radial([['0%', '#fff', 0.7], ['35%', color], ['100%', '#000', 0.55]], { cx: '40%', cy: '35%', r: '75%' });
  s += `<defs>${g.def}</defs><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(R * 0.42)}" fill="${color}"/><circle cx="${n(cx)}" cy="${n(cy)}" r="${n(
    R * 0.42,
  )}" fill="${g.url}" opacity=".6"/>`;
  return s;
}

function folar(r, cx, cy, R) {
  let s = plate(r, cx, cy, R * 1.12, { body: '#FBF8F2', well: '#F5F0E6' });
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    s += `<circle cx="${n(cx + Math.cos(a) * R * 1.0)}" cy="${n(cy + Math.sin(a) * R * 1.0)}" r="${n(R * 0.035)}" fill="#E9E1D2"/>`;
  }
  const g = radial([['0%', '#B8702C'], ['60%', '#8F4E1A'], ['100%', '#5E3010']]);
  s += `<defs>${g.def}</defs><path d="${blob(r, cx, cy, R * 0.86, R * 0.84, 0.03, 14)}" fill="${g.url}"/>`;
  const pts = [];
  for (let t = 0; t < Math.PI * 7; t += 0.15) {
    const rr = R * 0.08 + (t / (Math.PI * 7)) * R * 0.74;
    pts.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]);
  }
  s += `<path d="${smoothOpen(pts)}" fill="none" stroke="#4A2309" stroke-width="${n(R * 0.04)}" opacity=".8"/>`;
  s += `<path d="${smoothOpen(pts)}" fill="none" stroke="#E2A35A" stroke-width="${n(R * 0.012)}" opacity=".6" transform="translate(-4 -4)"/>`;
  for (let i = 0; i < 9; i++) {
    const [x, y] = inEllipse(r, cx, cy, R * 0.7, R * 0.7);
    s += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(R * 0.08)}" ry="${n(R * 0.025)}" fill="#fff" opacity=".22" transform="rotate(${n(r() * 180)} ${n(x)} ${n(y)})"/>`;
  }
  return s;
}

function tortaSlice(_r, cx, cy, w, h, angle) {
  const pts = [];
  for (let t = 0; t < Math.PI * 5.2; t += 0.12) {
    const k = 0.06 + (t / (Math.PI * 5.2)) * 0.4;
    pts.push([Math.cos(t) * w * k, Math.sin(t) * h * k]);
  }
  return `<g transform="translate(${n(cx)} ${n(cy)}) rotate(${angle})">
${shadow(10, 16, w * 0.5, h * 0.5, 0.35, 'blur-s')}
<ellipse rx="${n(w / 2)}" ry="${n(h / 2)}" fill="#F6C761"/>
<ellipse rx="${n(w / 2)}" ry="${n(h / 2)}" fill="none" stroke="#E9963A" stroke-width="${n(h * 0.06)}"/>
<path d="${smoothOpen(pts)}" fill="none" stroke="#E58A2E" stroke-width="${n(h * 0.045)}"/>
<path d="${smoothOpen(pts)}" fill="none" stroke="#FFF2C9" stroke-width="${n(h * 0.012)}" transform="translate(${n(h * 0.025)} 0)"/>
</g>`;
}

function orangeWhole(r, x, y, k) {
  const g = radial([['0%', '#FFB347'], ['60%', '#F28C1E'], ['100%', '#C9620E']], { cx: '38%', cy: '35%', r: '70%' });
  let s = `<defs>${g.def}</defs>${shadow(x + k * 0.1, y + k * 0.14, k, k * 0.96, 0.38)}<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="${g.url}"/>`;
  for (let i = 0; i < 90; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.95, k * 0.95);
    s += `<circle cx="${n(px)}" cy="${n(py)}" r="${n(k * 0.012)}" fill="#B9570A" opacity=".45"/>`;
  }
  s += `<ellipse cx="${n(x - k * 0.35)}" cy="${n(y - k * 0.4)}" rx="${n(k * 0.25)}" ry="${n(k * 0.12)}" fill="#fff" opacity=".35" filter="url(#blur-xs)"/>`;
  s += leaf(x + k * 0.3, y - k * 0.85, k * 0.7, -30, '#3E7A34');
  return s;
}

function orangeHalf(r, x, y, k) {
  let s = shadow(x + k * 0.1, y + k * 0.14, k, k * 0.96, 0.36);
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="#EE8418"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 0.92)}" fill="#FFE2B0"/>`;
  const segs = 11;
  for (let i = 0; i < segs; i++) {
    const a1 = (i / segs) * Math.PI * 2 + 0.04;
    const a2 = ((i + 1) / segs) * Math.PI * 2 - 0.04;
    const rr = k * 0.86;
    s += `<path d="M${n(x + Math.cos(a1) * k * 0.08)} ${n(y + Math.sin(a1) * k * 0.08)} L${n(x + Math.cos(a1) * rr)} ${n(y + Math.sin(a1) * rr)} A${n(rr)} ${n(
      rr,
    )} 0 0 1 ${n(x + Math.cos(a2) * rr)} ${n(y + Math.sin(a2) * rr)} Z" fill="#F7A132"/>`;
  }
  for (let i = 0; i < 40; i++) {
    const [px, py] = inEllipse(r, x, y, k * 0.8, k * 0.8);
    s += `<ellipse cx="${n(px)}" cy="${n(py)}" rx="${n(k * 0.04)}" ry="${n(k * 0.015)}" transform="rotate(${n(r() * 180)} ${n(px)} ${n(py)})" fill="#FFC870" opacity=".8"/>`;
  }
  s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 0.08)}" fill="#FFE9C4"/>`;
  return s;
}

function coffeeCup(_r, x, y, k, { drink = '#7A4A22', foam = '#C69565', glass = false } = {}) {
  let s = '';
  if (!glass) {
    s += shadow(x + k * 0.1, y + k * 0.14, k * 1.55, k * 1.5, 0.3);
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 1.55)}" fill="#F7F4EE"/><circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 1.1)}" fill="#EAE4DA"/>`;
    s += `<rect x="${n(x + k * 0.8)}" y="${n(y - k * 0.14)}" width="${n(k * 0.6)}" height="${n(k * 0.28)}" rx="${n(k * 0.14)}" fill="#FBF9F5"/>`;
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="#FBF9F5"/>`;
  } else {
    s += shadow(x + k * 0.15, y + k * 0.2, k * 1.05, k, 0.25);
    s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(k)}" fill="#fff" opacity=".35" stroke="#fff" stroke-width="${n(k * 0.04)}"/>`;
  }
  const g = radial([['0%', foam], ['70%', drink], ['100%', '#3F240E']]);
  s += `<defs>${g.def}</defs><circle cx="${n(x)}" cy="${n(y)}" r="${n(k * 0.8)}" fill="${g.url}"/>`;
  s += `<path d="M${n(x - k * 0.3)} ${n(y)} q${n(k * 0.15)} ${n(-k * 0.3)} ${n(k * 0.3)} 0 t${n(k * 0.3)} 0" fill="none" stroke="#F2E2CB" stroke-width="${n(k * 0.06)}" opacity=".6"/>`;
  s += `<path d="M${n(x - k * 0.62)} ${n(y - k * 0.2)} A${n(k * 0.66)} ${n(k * 0.66)} 0 0 1 ${n(x - k * 0.1)} ${n(y - k * 0.65)}" fill="none" stroke="#fff" stroke-width="${n(
    k * 0.05,
  )}" stroke-linecap="round" opacity=".55"/>`;
  return s;
}

function toast(r, x, y, k, angle) {
  return `<g transform="translate(${n(x)} ${n(y)}) rotate(${angle})">
${shadow(8, 14, k * 0.55, k * 0.5, 0.35, 'blur-s')}
<rect x="${n(-k / 2)}" y="${n(-k * 0.45)}" width="${n(k)}" height="${n(k * 0.9)}" rx="${n(k * 0.16)}" fill="#A8692D"/>
<rect x="${n(-k * 0.44)}" y="${n(-k * 0.39)}" width="${n(k * 0.88)}" height="${n(k * 0.78)}" rx="${n(k * 0.12)}" fill="#E2AC5E"/>
<path d="${blob(r, 0, 0, k * 0.22, k * 0.16, 0.3, 8)}" fill="#F6E08A"/>
<path d="${blob(r, -k * 0.05, -k * 0.03, k * 0.12, k * 0.07, 0.3, 7)}" fill="#FFF3B8"/>
</g>`;
}

function tosta(r, cx, cy, R) {
  let s = plate(r, cx, cy, R, { body: '#F8F4ED', well: '#F1EBE1' });
  const k = R * 0.95;
  for (const [dx, dy, rot] of [
    [-0.12, -0.08, 0],
    [0.14, 0.1, 180],
  ]) {
    s += `<path transform="translate(${n(cx + dx * R + 10)} ${n(cy + dy * R + 16)}) rotate(${rot})" d="M${n(-k * 0.4)} ${n(-k * 0.4)} L${n(k * 0.4)} ${n(
      -k * 0.4,
    )} L${n(-k * 0.4)} ${n(k * 0.4)} Z" fill="#000" opacity=".3" filter="url(#blur-s)"/>`;
  }
  for (const [dx, dy, rot] of [
    [-0.12, -0.08, 0],
    [0.14, 0.1, 180],
  ]) {
    s += `<g transform="translate(${n(cx + dx * R)} ${n(cy + dy * R)}) rotate(${rot})">
<path d="M${n(-k * 0.4)} ${n(-k * 0.4)} L${n(k * 0.4)} ${n(-k * 0.4)} L${n(-k * 0.4)} ${n(k * 0.4)} Z" fill="#B7742F" stroke="#9A5E22" stroke-width="${n(k * 0.03)}" stroke-linejoin="round"/>
<path d="M${n(-k * 0.34)} ${n(-k * 0.34)} L${n(k * 0.28)} ${n(-k * 0.34)} L${n(-k * 0.34)} ${n(k * 0.28)} Z" fill="#DCA051"/>
${[0, 1, 2, 3]
  .map((i) => `<line x1="${n(-k * 0.34 + i * k * 0.13)}" y1="${n(-k * 0.34)}" x2="${n(-k * 0.34)}" y2="${n(-k * 0.34 + i * k * 0.13)}" stroke="#7E4A1A" stroke-width="${n(k * 0.025)}" opacity=".7"/>`)
  .join('')}
<path d="M${n(k * 0.4)} ${n(-k * 0.4)} L${n(-k * 0.4)} ${n(k * 0.4)}" stroke="#F4CF5A" stroke-width="${n(k * 0.05)}"/>
<path d="M${n(k * 0.3)} ${n(-k * 0.28)} q${n(k * 0.05)} ${n(k * 0.06)} ${n(k * 0.02)} ${n(k * 0.12)}" stroke="#F4CF5A" stroke-width="${n(k * 0.04)}" stroke-linecap="round" fill="none"/>
<path d="M${n(k * 0.38)} ${n(-k * 0.36)} L${n(-k * 0.36)} ${n(k * 0.38)}" stroke="#E79AA0" stroke-width="${n(k * 0.025)}"/>
</g>`;
  }
  return s;
}

function bakingTray(_r, x, y, w, h) {
  let s = `<rect x="${n(x + 18)}" y="${n(y + 30)}" width="${n(w)}" height="${n(h)}" rx="40" fill="#000" opacity=".45" filter="url(#blur-m)"/>`;
  s += `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" rx="40" fill="#4A4643"/>`;
  s += `<rect x="${n(x + 26)}" y="${n(y + 26)}" width="${n(w - 52)}" height="${n(h - 52)}" rx="26" fill="#2E2B29"/>`;
  s += `<rect x="${n(x + 8)}" y="${n(y + 8)}" width="${n(w - 16)}" height="${n(h - 16)}" rx="34" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="4"/>`;
  return s;
}

const sol = {
  'hero-tabuleiro-pasteis-de-nata.jpg': [
    2400,
    1600,
    (r) => {
      let s = marble(r, 2400, 1600);
      s += bakingTray(r, 120, 110, 2160, 1380);
      const cols = 7;
      const rows = 4;
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const x = 300 + i * 300 + (j % 2) * 40 + (r() - 0.5) * 20;
          const y = 300 + j * 330 + (r() - 0.5) * 20;
          s += nata(r, x, y, 135);
        }
      return s;
    },
  ],
  'sobre-massa-e-farinha.jpg': [
    1200,
    1500,
    (r) => {
      let s = wood(r, 1200, 1500, { base: '#C49A6C', dark: '#8E6A45', light: '#DDBB92', planks: 6 });
      for (let i = 0; i < 9; i++) {
        const [x, y] = inEllipse(r, 600, 760, 420, 520);
        s += `<path d="${blob(r, x, y, r.range(80, 200), r.range(60, 160), 0.4, 9)}" fill="#fff" opacity="${n(r.range(0.25, 0.45))}" filter="url(#blur-m)"/>`;
      }
      for (let i = 0; i < 900; i++) {
        const [x, y] = inEllipse(r, 600, 760, 460, 600);
        s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r.range(1, 3.5))}" fill="#fff" opacity="${n(r.range(0.3, 0.8))}"/>`;
      }
      const dough = radial([['0%', '#FFF6E6'], ['70%', '#F1DDBC'], ['100%', '#D9BC92']], { cx: '40%', cy: '35%', r: '70%' });
      s += `<defs>${dough.def}</defs>${shadow(560, 640, 300, 270, 0.35)}<path d="${blob(r, 540, 610, 290, 260, 0.06, 12)}" fill="${dough.url}"/>`;
      s += `<g transform="translate(700 1150) rotate(-28)">${shadow(0, 30, 480, 60, 0.4)}<rect x="-470" y="-55" width="940" height="110" rx="55" fill="#D8B184"/><rect x="-470" y="-30" width="940" height="22" rx="11" fill="#fff" opacity=".22"/><rect x="-600" y="-28" width="140" height="56" rx="28" fill="#B98C5C"/><rect x="460" y="-28" width="140" height="56" rx="28" fill="#B98C5C"/></g>`;
      for (const [x, y, a] of [
        [930, 330, 20],
        [1040, 470, -15],
        [880, 520, 50],
      ])
        s += `<g transform="translate(${x} ${y}) rotate(${a})">${shadow(10, 16, 70, 92, 0.35, 'blur-s')}<ellipse rx="68" ry="90" fill="#F0E2CC"/><ellipse cx="-20" cy="-30" rx="18" ry="30" fill="#fff" opacity=".5"/></g>`;
      s += bowl(r, 230, 250, 150, { outer: '#F4F0E8', lip: '#FFFFFF', inner: '#E9E2D6' });
      s += `<circle cx="230" cy="250" r="95" fill="#F4C431"/><ellipse cx="205" cy="225" rx="30" ry="16" fill="#fff" opacity=".45"/>`;
      return s;
    },
  ],
  'sobre-cafe-e-torrada.jpg': [
    1200,
    900,
    (r) => {
      let s = marble(r, 1200, 900, { base: '#ECE9E3' });
      s += coffeeCup(r, 360, 330, 135);
      s += plate(r, 790, 520, 270);
      s += toast(r, 720, 470, 300, -12);
      s += toast(r, 880, 600, 280, 18);
      s += spoon(330, 650, 260, 10);
      s += `<g transform="translate(160 720) rotate(-25)"><rect x="-70" y="-24" width="140" height="48" rx="6" fill="#F7D046"/><rect x="-70" y="-6" width="140" height="12" fill="#0E5A6E"/></g>`;
      return s;
    },
  ],
  'sobre-laranjas-do-algarve.jpg': [
    1200,
    900,
    (r) => {
      let s = `<rect width="1200" height="900" fill="#1E6F80"/>`;
      for (let y = 0; y < 900; y += 150) for (let x = 0; x < 1200; x += 150) s += `<rect x="${x + 2}" y="${y + 2}" width="146" height="146" fill="#fff" opacity=".05"/>`;
      s += orangeWhole(r, 300, 300, 180);
      s += orangeWhole(r, 820, 220, 160);
      s += orangeHalf(r, 560, 600, 190);
      s += orangeHalf(r, 960, 640, 170);
      s += orangeWhole(r, 210, 720, 150);
      return s;
    },
  ],
  'pastel-de-nata.jpg': [
    1200,
    900,
    (r) => {
      let s = marble(r, 1200, 900);
      s += plate(r, 560, 470, 380, { rim: '#0E5A6E' });
      s += nata(r, 430, 380, 150);
      s += nata(r, 700, 410, 150);
      s += nata(r, 560, 640, 150);
      for (let i = 0; i < 60; i++) {
        const [x, y] = inEllipse(r, 430, 380, 90, 90);
        s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r.range(1.5, 3.5))}" fill="#6B3A12" opacity=".7"/>`;
      }
      s += coffeeCup(r, 1080, 150, 100);
      return s;
    },
  ],
  'bola-de-berlim.jpg': [
    1200,
    900,
    (r) => {
      let s = wood(r, 1200, 900, { base: '#C8A57E', dark: '#9A774F', light: '#E2C49C', planks: 4 });
      s += `<g transform="rotate(-6 600 450)">${shadow(610, 470, 470, 330, 0.3)}<rect x="150" y="140" width="900" height="620" rx="12" fill="#F4EEE2"/></g>`;
      s += bolaDeBerlim(r, 420, 430, 230);
      s += bolaDeBerlim(r, 800, 500, 230, true);
      return s;
    },
  ],
  'dom-rodrigo.jpg': [
    1200,
    900,
    (r) => {
      let s = marble(r, 1200, 900, { base: '#F1EEE9' });
      s += plate(r, 600, 450, 420, { rim: '#0E5A6E' });
      const colors = ['#C62E3A', '#2C5DB8', '#D9A630', '#2E8B57', '#7B3FA0', '#D9467A', '#9AA3AD'];
      const spots = [
        [600, 450],
        [600, 250],
        [790, 360],
        [790, 560],
        [600, 660],
        [410, 560],
        [410, 340],
      ];
      spots.forEach(([x, y], i) => {
        s += domRodrigo(r, x, y, 110, colors[i]);
      });
      return s;
    },
  ],
  'folar-de-olhao.jpg': [1200, 900, (r) => marble(r, 1200, 900, { base: '#EFEAE2' }) + folar(r, 600, 450, 340) + coffeeCup(r, 1070, 760, 90)],
  'torta-de-laranja.jpg': [
    1200,
    900,
    (r) => {
      let s = linen(r, 1200, 900, { base: '#F1E9DA' });
      s += plate(r, 560, 460, 390, { rim: '#0E5A6E' });
      s += tortaSlice(r, 430, 390, 300, 220, -20);
      s += tortaSlice(r, 690, 440, 300, 220, 15);
      s += tortaSlice(r, 520, 620, 300, 220, -5);
      s += orangeHalf(r, 1050, 200, 110);
      return s;
    },
  ],
  'galao.jpg': [
    1200,
    900,
    (r) => {
      let s = marble(r, 1200, 900, { base: '#EDEAE4' });
      s += coffeeCup(r, 560, 450, 230, { drink: '#C49A6C', foam: '#F4E6D2', glass: true });
      s += `<circle cx="560" cy="450" r="140" fill="#F7EEE0" opacity=".85"/><circle cx="530" cy="420" r="50" fill="#fff" opacity=".4"/>`;
      s += spoon(880, 620, 330, -35);
      s += `<g transform="translate(900 250) rotate(15)"><rect x="-80" y="-26" width="160" height="52" rx="6" fill="#F7D046"/><rect x="-80" y="-7" width="160" height="14" fill="#0E5A6E"/></g>`;
      return s;
    },
  ],
  'tosta-mista.jpg': [1200, 900, (r) => wood(r, 1200, 900, { planks: 3, base: '#7A5638' }) + tosta(r, 600, 450, 380)],
  'sumo-de-laranja.jpg': [
    1200,
    900,
    (r) => {
      let s = `<rect width="1200" height="900" fill="#F6EFE2"/>` + linen(r, 1200, 900, { base: '#F3EADB' });
      s += shadow(520, 470, 230, 220, 0.3);
      const g = radial([['0%', '#FFC15A'], ['70%', '#F5961E'], ['100%', '#D96F0B']]);
      s += `<defs>${g.def}</defs><circle cx="500" cy="440" r="220" fill="#fff" opacity=".45" stroke="#fff" stroke-width="10"/><circle cx="500" cy="440" r="185" fill="${g.url}"/>`;
      s += `<circle cx="500" cy="440" r="175" fill="none" stroke="#FFD58A" stroke-width="12" opacity=".7"/>`;
      for (let i = 0; i < 30; i++) {
        const [x, y] = inEllipse(r, 500, 440, 160, 160);
        s += `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r.range(3, 8))}" fill="#FFE2A8" opacity=".6"/>`;
      }
      s += `<circle cx="590" cy="380" r="22" fill="#0E5A6E"/><circle cx="590" cy="380" r="13" fill="#F5961E"/>`;
      s += orangeHalf(r, 930, 260, 150);
      s += orangeHalf(r, 940, 650, 140);
      s += orangeWhole(r, 200, 760, 120);
      return s;
    },
  ],
  'partilha-redes-sociais.jpg': [
    1200,
    630,
    (r) => {
      let s = marble(r, 1200, 630);
      for (const [x, y] of [
        [780, 150],
        [1010, 190],
        [700, 400],
        [930, 440],
        [1160, 430],
      ])
        s += nata(r, x, y, 115);
      const g = linear(
        [
          ['0%', '#0A3542', 0.97],
          ['55%', '#0A3542', 0.85],
          ['100%', '#0A3542', 0],
        ],
        ['0%', '0%', '100%', '0%'],
      );
      s += `<defs>${g.def}</defs><rect width="760" height="630" fill="${g.url}"/>`;
      s += `<text x="70" y="290" font-family="Georgia, 'Times New Roman', serif" font-size="84" font-weight="700" fill="#fff">Pastelaria Sol</text>`;
      s += `<text x="72" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="30" fill="#fff" opacity=".9">Pastelaria e café · Faro</text>`;
      s += `<rect x="72" y="392" width="120" height="6" rx="3" fill="#F4B940"/>`;
      return s;
    },
  ],
};

/* ───────────────────────── Render ───────────────────────── */

const filters = process.argv.slice(2);
const jobs = [
  ['tasca-do-largo', tasca],
  ['pastelaria-sol', sol],
];
let seed = 1;
for (const [folder, images] of jobs) {
  mkdirSync(`${OUT}${folder}`, { recursive: true });
  for (const [file, [w, h, draw]] of Object.entries(images)) {
    seed += 1;
    if (filters.length && !filters.some((f) => file.includes(f))) continue;
    const started = Date.now();
    const body = draw(makeRandom(seed * 7919));
    const markup = svg(w, h, body);
    await sharp(Buffer.from(markup), { limitInputPixels: false })
      .jpeg({ quality: 84, mozjpeg: true })
      .toFile(`${OUT}${folder}/${file}`);
    console.log(`✓ ${folder}/${file} (${w}×${h}, ${Date.now() - started} ms)`);
  }
}
