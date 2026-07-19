// photos-original/ 폴더의 원본 사진을 웹용으로 최적화합니다.
// 사용법: photos-original/ 에 사진을 넣고 `npm run images` 실행
// 출력: public/images/*.webp (본문용), public/images/thumbs/*.webp (썸네일),
//        public/images/og.jpg (카카오톡 공유 썸네일 — 첫 번째 사진 기준)

import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'photos-original';
const OUT = 'public/images';
const THUMB = 'public/images/thumbs';

await mkdir(THUMB, { recursive: true });

const files = (await readdir(SRC))
  .filter((f) => /\.(jpe?g|png|heic)$/i.test(f))
  .sort();

if (!files.length) {
  console.error(`${SRC}/ 폴더에 사진이 없습니다.`);
  process.exit(1);
}

const names = [];
for (const [i, f] of files.entries()) {
  const name = `photo-${String(i + 1).padStart(2, '0')}.webp`;
  const src = path.join(SRC, f);
  await sharp(src).rotate().resize(1600, 1600, { fit: 'inside' }).webp({ quality: 80 }).toFile(path.join(OUT, name));
  await sharp(src).rotate().resize(400, 400, { fit: 'inside' }).webp({ quality: 70 }).toFile(path.join(THUMB, name));
  names.push(name);
  console.log(`${f} → ${name}`);
}

// 카카오톡/OG 공유 썸네일 (800×400). 인자로 파일명을 주면 그 사진, 없으면 첫 사진.
const ogSrc = process.argv[2] && files.includes(process.argv[2]) ? process.argv[2] : files[0];
await sharp(path.join(SRC, ogSrc))
  .rotate()
  .resize(800, 400, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, 'og.jpg'));
console.log(`${ogSrc} → og.jpg (공유 썸네일)`);

console.log('\nwedding.js 의 gallery 에 붙여넣을 목록:');
console.log(JSON.stringify(names, null, 2));
