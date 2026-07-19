// 디자인 QR 생성: 동그란 점 + 둥근 파인더 + 중앙 하트, 그리고 기계판독 검증
import QRCode from 'qrcode';
import sharp from 'sharp';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { writeFileSync, readFileSync } from 'node:fs';

const URL_ = 'https://hyunyoung33.github.io/wedding/';
const INK = '#3d3a37';      // 점 색 (청첩장 잉크색)
const ACCENT = '#8a5a3c';   // 파인더 안쪽 점 (스캔 대비를 위해 진한 브라운)
const HEART = '#c98a8f';    // 중앙 하트 (로즈)

const qr = QRCode.create(URL_, { errorCorrectionLevel: 'H' });
const size = qr.modules.size;
const get = (r, c) => qr.modules.data[r * size + c] === 1;

const MARGIN = 4;
const total = size + MARGIN * 2;

const inFinder = (r, c) =>
  (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);

// 중앙 하트 자리 (지름 ~ 모듈 7.5칸)
const CX = size / 2, CY = size / 2, HOLE_R = 3.75;
const inHole = (r, c) => Math.hypot(r + 0.5 - CY, c + 0.5 - CX) < HOLE_R;

let dots = '';
for (let r = 0; r < size; r++) {
  for (let c = 0; c < size; c++) {
    if (!get(r, c) || inFinder(r, c) || inHole(r, c)) continue;
    dots += `<rect x="${MARGIN + c}" y="${MARGIN + r}" width="1" height="1" rx="0.35" fill="${INK}"/>`;
  }
}

// 둥근 파인더 3개
function finder(x, y) {
  return `
    <rect x="${x}" y="${y}" width="7" height="7" rx="2.2" fill="${INK}"/>
    <rect x="${x + 1}" y="${y + 1}" width="5" height="5" rx="1.6" fill="#ffffff"/>
    <rect x="${x + 2}" y="${y + 2}" width="3" height="3" rx="1.1" fill="${ACCENT}"/>`;
}

// 중앙 하트 (셀 좌표계)
const hx = MARGIN + CX, hy = MARGIN + CY - 0.4, s = 5.2; // s = 하트 폭
const heart = `
  <path transform="translate(${hx} ${hy}) scale(${s / 24})" fill="${HEART}"
    d="M0 6 C -1.8 1.2 -6 0 -8.4 2.4 C -11 5 -10 9.2 -6.8 12.2 L 0 18 L 6.8 12.2 C 10 9.2 11 5 8.4 2.4 C 6 0 1.8 1.2 0 6 Z"
    />`;

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="2000" height="2000">
  <rect width="${total}" height="${total}" fill="#ffffff"/>
  ${dots}
  ${finder(MARGIN, MARGIN)}
  ${finder(MARGIN + size - 7, MARGIN)}
  ${finder(MARGIN, MARGIN + size - 7)}
  ${heart}
</svg>`;

writeFileSync('/Users/phyoung33-2/Desktop/HY/청첩장-QR코드-디자인.svg', svg);

// PNG 렌더 + 판독 검증
const png = await sharp(Buffer.from(svg)).resize(1200, 1200).png().toBuffer();
writeFileSync('/Users/phyoung33-2/Desktop/HY/청첩장-QR코드-디자인.png',
  await sharp(Buffer.from(svg)).resize(2000, 2000).png().toBuffer());

const decoded = PNG.sync.read(png);
const result = jsQR(new Uint8ClampedArray(decoded.data), decoded.width, decoded.height);
console.log('판독 결과:', result ? result.data : '실패!');
console.log(result && result.data === URL_ ? '✅ 검증 통과' : '❌ 검증 실패');
