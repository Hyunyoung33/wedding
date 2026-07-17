# 모바일 청첩장 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 두현민·박현영 결혼식 모바일 청첩장 — GitHub Pages에서 영구 무료 호스팅되고, 설정 파일 하나로 언제든 수정 가능한 정적 사이트 + Firebase 방명록/RSVP.

**Architecture:** Vite 기반 정적 사이트(vanilla JS, 섹션별 모듈). 모든 콘텐츠는 `src/data/wedding.js` 단일 설정 파일에 집중. 방명록/RSVP만 Firebase Firestore(무료 Spark 플랜)에 직접 쓰기. GitHub Actions로 main 푸시 시 자동 배포.

**Tech Stack:** Vite 6, Vitest(로직 테스트), Firebase JS SDK v10(Firestore), Kakao JS SDK(지도·공유), sharp(이미지 최적화 스크립트), GitHub Pages + Actions.

## Global Constraints

- 모바일 우선: 뷰포트 기준 375px, `max-width: 430px` 중앙 정렬 콘텐츠 컬럼.
- 모든 문구·날짜·연락처·계좌는 `src/data/wedding.js`에서만 온다. 섹션 코드에 하드코딩 금지.
- Firebase 실패 시에도 나머지 섹션은 정상 동작해야 한다 (동적 import + try/catch).
- 커밋 메시지는 한국어, `feat:`/`fix:`/`chore:` 프리픽스.
- 배포 경로: `https://<계정>.github.io/wedding/` → Vite `base: '/wedding/'`.
- 사용자(신랑신부)에게 받아야 하는 실제 정보(날짜·예식장·계좌 등)는 설정 파일에 `⚠️ 교체 필요` 주석과 함께 그럴듯한 플레이스홀더로 두고 진행. 실제 값 수집은 Task 10 체크포인트.

## 파일 구조

```
wedding-invitation/
├── index.html                  # 앱 셸 + OG 메타태그
├── vite.config.js
├── package.json
├── .gitignore
├── .github/workflows/deploy.yml
├── public/
│   ├── images/                 # optimize-images.mjs 출력 (webp)
│   └── bgm.mp3                 # (선택) 배경음악
├── scripts/
│   └── optimize-images.mjs     # 원본 사진 → webp 리사이즈
├── firebase/
│   └── firestore.rules         # 보안 규칙 (콘솔에 붙여넣기용)
└── src/
    ├── main.js                 # 섹션 조립 + 진입점
    ├── styles/main.css         # 전역 스타일 (디자인 시스템 변수)
    ├── data/wedding.js         # ★ 유일한 콘텐츠 설정 파일
    ├── lib/
    │   ├── dday.js             # D-day·달력 계산 (순수 함수)
    │   ├── clipboard.js        # 복사 유틸 (인앱브라우저 폴백)
    │   └── firebase.js         # 지연 초기화 Firestore 클라이언트
    ├── sections/               # 화면 섹션 (각각 mount(el) export)
    │   ├── intro.js  greeting.js  family.js  calendar.js
    │   ├── gallery.js  location.js  accounts.js
    │   ├── guestbook.js  rsvp.js  share.js
    └── tests/
        ├── dday.test.js
        └── validate.test.js
```

---

### Task 1: 프로젝트 스캐폴드 + 설정 파일

**Files:**
- Create: `package.json`, `vite.config.js`, `.gitignore`, `index.html`, `src/main.js`, `src/styles/main.css`, `src/data/wedding.js`

**Interfaces:**
- Produces: `WEDDING` 설정 객체 (아래 스키마 그대로 — 이후 모든 태스크가 import), 섹션 규약 `export function mount(rootEl)` — main.js가 각 섹션의 `<section id="...">`를 만들어 mount 호출.

- [ ] **Step 1: npm 프로젝트 초기화**

```bash
cd /Users/phyoung33-2/Desktop/HY/wedding-invitation
npm init -y
npm i -D vite vitest sharp
npm i firebase
```

- [ ] **Step 2: 설정 파일들 작성**

`vite.config.js`:
```js
import { defineConfig } from 'vite';
export default defineConfig({
  base: '/wedding/',
  build: { outDir: 'dist' },
  test: { environment: 'node' },
});
```

`.gitignore`:
```
node_modules/
dist/
.DS_Store
photos-original/
```

`package.json`의 scripts:
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "test": "vitest run",
  "images": "node scripts/optimize-images.mjs"
}
```

- [ ] **Step 3: `src/data/wedding.js` 작성 (스키마 확정)**

```js
// ★ 청첩장의 모든 내용은 이 파일에서만 수정합니다.
export const WEDDING = {
  groom: {
    name: '두현민', phone: '010-0000-0000',            // ⚠️ 교체 필요
    father: { name: '두○○', phone: '' },               // ⚠️ 교체 필요
    mother: { name: '○○○', phone: '' },                // ⚠️ 교체 필요
  },
  bride: {
    name: '박현영', phone: '010-0000-0000',            // ⚠️ 교체 필요
    father: { name: '박○○', phone: '' },               // ⚠️ 교체 필요
    mother: { name: '○○○', phone: '' },                // ⚠️ 교체 필요
  },
  datetime: '2026-11-14T12:30:00+09:00',               // ⚠️ 교체 필요
  venue: {
    name: '○○웨딩홀', hall: '○○홀',                    // ⚠️ 교체 필요
    address: '서울특별시 ○○구 ○○로 00',                // ⚠️ 교체 필요
    lat: 37.5665, lng: 126.9780,                        // ⚠️ 교체 필요
    tel: '', subway: '', bus: '', parking: '',          // ⚠️ 교체 필요
  },
  greeting: {
    title: '소중한 분들을 초대합니다',
    message: '서로가 마주보며 다져온 사랑을\n이제 함께 한 곳을 바라보며\n걸어갈 수 있는 큰 사랑으로 키우고자 합니다.\n\n저희 두 사람이 사랑의 이름으로\n지켜나갈 수 있게 앞날을\n축복해 주시면 감사하겠습니다.',
  },
  accounts: {
    groom: [ { bank: '○○은행', number: '000-0000-0000', holder: '두현민', kakaopay: '' } ], // ⚠️
    bride: [ { bank: '○○은행', number: '000-0000-0000', holder: '박현영', kakaopay: '' } ], // ⚠️
  },
  gallery: [],            // scripts/optimize-images.mjs 실행 후 파일명 채움
  mainImage: '',          // 커버 사진 파일명
  bgm: '',                // 'bgm.mp3' 넣으면 활성화
  videoUrl: '',           // 유튜브 링크 넣으면 식전영상 섹션 활성화
  share: {
    title: '두현민 ♥ 박현영, 결혼합니다',
    description: '', // 비우면 날짜·장소로 자동 생성
    thumbnail: 'images/og.jpg',
  },
  keys: {
    kakaoJs: '',                                        // ⚠️ Task 5에서 발급
    firebase: null,  // ⚠️ Task 8에서 발급. { apiKey, authDomain, projectId, ... }
  },
};
```

- [ ] **Step 4: `index.html` + `src/main.js` + `src/styles/main.css` 앱 셸 작성**

`index.html` (OG 태그는 Task 7에서 실값으로 채움):
```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>두현민 ♥ 박현영 결혼합니다</title>
  <meta property="og:title" content="두현민 ♥ 박현영, 결혼합니다" />
  <meta property="og:type" content="website" />
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

`src/main.js`:
```js
import './styles/main.css';
import { WEDDING } from './data/wedding.js';

const SECTIONS = [
  ['intro', () => import('./sections/intro.js')],
  ['greeting', () => import('./sections/greeting.js')],
  ['family', () => import('./sections/family.js')],
  ['calendar', () => import('./sections/calendar.js')],
  ['gallery', () => import('./sections/gallery.js')],
  ['location', () => import('./sections/location.js')],
  ['accounts', () => import('./sections/accounts.js')],
  ['guestbook', () => import('./sections/guestbook.js')],
  ['rsvp', () => import('./sections/rsvp.js')],
  ['share', () => import('./sections/share.js')],
];

const app = document.getElementById('app');
for (const [id, load] of SECTIONS) {
  const el = document.createElement('section');
  el.id = id;
  app.appendChild(el);
  load().then(m => m.mount(el, WEDDING)).catch(err => {
    console.error(`[${id}] 섹션 로드 실패`, err);
    el.remove(); // 실패한 섹션만 조용히 제거 (graceful degradation)
  });
}
```

`src/styles/main.css` — 디자인 토큰만 우선 확정(색·서체는 디자인 단계에서 사용자와 조정):
```css
:root {
  --bg: #faf8f5; --ink: #3d3a37; --accent: #b98a6f; --muted: #9b948d;
  --serif: 'Noto Serif KR', serif; --maxw: 430px;
}
* { margin: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--ink); font-family: var(--serif); }
section { max-width: var(--maxw); margin: 0 auto; padding: 56px 24px; }
```

- [ ] **Step 5: dev 서버 기동 확인 후 커밋**

Run: `npm run dev` → 브라우저에서 빈 섹션들이 에러 없이 렌더되는지 확인 (섹션 파일이 아직 없으므로 콘솔에 로드 실패 로그가 뜨고 페이지는 비어있으면 정상).
```bash
git add -A && git commit -m "feat: 프로젝트 스캐폴드 + 통합 설정 파일(wedding.js)"
```

---

### Task 2: D-day·달력 로직 (TDD) + 달력 섹션

**Files:**
- Create: `src/lib/dday.js`, `src/tests/dday.test.js`, `src/sections/calendar.js`

**Interfaces:**
- Consumes: `WEDDING.datetime` (ISO 문자열)
- Produces: `daysUntil(iso, now?) => number`(당일 0, 지나면 음수), `countdownParts(iso, now?) => {days,hours,minutes,seconds}`(지나면 전부 0), `calendarWeeks(iso) => number[][]`(해당 월 달력, 앞뒤 빈칸은 0)

- [ ] **Step 1: 실패하는 테스트 작성** — `src/tests/dday.test.js`

```js
import { describe, it, expect } from 'vitest';
import { daysUntil, countdownParts, calendarWeeks } from '../lib/dday.js';

describe('daysUntil', () => {
  it('100일 전이면 100', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-08-06T23:59:00+09:00'))).toBe(100);
  });
  it('당일이면 0 (시간 무관)', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-11-14T23:00:00+09:00'))).toBe(0);
  });
  it('지났으면 음수', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-11-15T01:00:00+09:00'))).toBe(-1);
  });
});

describe('countdownParts', () => {
  it('1일 2시간 3분 4초 전', () => {
    expect(countdownParts('2026-11-14T12:30:00+09:00', new Date('2026-11-13T10:26:56+09:00')))
      .toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });
  it('지났으면 전부 0', () => {
    expect(countdownParts('2026-11-14T12:30:00+09:00', new Date('2026-11-20T00:00:00+09:00')))
      .toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('calendarWeeks', () => {
  it('2026년 11월: 1일이 일요일, 30일이 월요일', () => {
    const weeks = calendarWeeks('2026-11-14T12:30:00+09:00');
    expect(weeks[0][0]).toBe(1);          // 첫 주 일요일 = 1일
    expect(weeks.at(-1)[1]).toBe(30);     // 마지막 주 월요일 = 30일
    expect(weeks.flat().filter(Boolean).length).toBe(30);
  });
});
```

- [ ] **Step 2: 테스트 실패 확인**

Run: `npx vitest run src/tests/dday.test.js`
Expected: FAIL — "Cannot find module '../lib/dday.js'"

- [ ] **Step 3: `src/lib/dday.js` 구현**

```js
const DAY = 86400000;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function daysUntil(iso, now = new Date()) {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(now)) / DAY);
}

export function countdownParts(iso, now = new Date()) {
  let ms = Math.max(0, new Date(iso) - now);
  const days = Math.floor(ms / DAY); ms -= days * DAY;
  const hours = Math.floor(ms / 3600000); ms -= hours * 3600000;
  const minutes = Math.floor(ms / 60000); ms -= minutes * 60000;
  return { days, hours, minutes, seconds: Math.floor(ms / 1000) };
}

export function calendarWeeks(iso) {
  const d = new Date(iso);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const cells = Array(first.getDay()).fill(0);
  for (let i = 1; i <= last.getDate(); i++) cells.push(i);
  while (cells.length % 7) cells.push(0);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
```

- [ ] **Step 4: 테스트 통과 확인**

Run: `npx vitest run src/tests/dday.test.js` — Expected: PASS (6 tests)

- [ ] **Step 5: `src/sections/calendar.js` 작성** — `calendarWeeks`로 달력 표 렌더, 예식일 강조, `countdownParts`로 1초마다 갱신되는 카운트다운, `daysUntil`로 "현민 ♥ 현영의 결혼식이 N일 남았습니다" 문구. `setInterval`은 `mount`에서 시작.

- [ ] **Step 6: 브라우저 확인 + 커밋**

Run: `npm run dev` → 달력에 예식일 표시·카운트다운 동작 확인.
```bash
git add -A && git commit -m "feat: D-day 로직(TDD) + 달력·카운트다운 섹션"
```

---

### Task 3: 이미지 최적화 스크립트 + 갤러리

**Files:**
- Create: `scripts/optimize-images.mjs`, `src/sections/gallery.js`
- Modify: `src/data/wedding.js` (gallery 목록, mainImage)

**Interfaces:**
- Consumes: `photos-original/` 폴더(사용자가 고른 원본 사진, git 미추적)
- Produces: `public/images/*.webp` (긴 변 1600px, 품질 80) + `public/images/thumbs/*.webp` (긴 변 400px), `WEDDING.gallery` 파일명 배열

- [ ] **Step 1: `scripts/optimize-images.mjs` 작성**

```js
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'photos-original', OUT = 'public/images', THUMB = 'public/images/thumbs';
await mkdir(THUMB, { recursive: true });
const files = (await readdir(SRC)).filter(f => /\.(jpe?g|png|heic)$/i.test(f)).sort();
const names = [];
for (const [i, f] of files.entries()) {
  const name = `photo-${String(i + 1).padStart(2, '0')}.webp`;
  await sharp(path.join(SRC, f)).rotate().resize(1600, 1600, { fit: 'inside' }).webp({ quality: 80 }).toFile(path.join(OUT, name));
  await sharp(path.join(SRC, f)).rotate().resize(400, 400, { fit: 'inside' }).webp({ quality: 70 }).toFile(path.join(THUMB, name));
  names.push(name);
}
console.log('gallery:', JSON.stringify(names, null, 2)); // wedding.js에 붙여넣기
```

- [ ] **Step 2: 샘플 사진으로 스크립트 검증** — `웨딩촬영` 폴더에서 사진 2~3장을 `photos-original/`에 복사 후 `npm run images` 실행. `public/images/`에 webp 생성 확인. **⚠️ 사용자 체크포인트: 최종 사진 선별(메인 1장 + 갤러리 10~20장)은 사용자에게 요청.**

- [ ] **Step 3: `src/sections/gallery.js` 작성** — 썸네일 그리드(3열), 탭하면 전체화면 라이트박스(원본 webp, 좌우 스와이프 = `touchstart/touchend` X좌표 비교, 닫기 버튼). 모든 `<img>`에 `loading="lazy"`.

- [ ] **Step 4: 브라우저 확인 + 커밋**

라이트박스 열기/스와이프/닫기 동작 확인 후:
```bash
git add -A && git commit -m "feat: 이미지 최적화 파이프라인 + 갤러리(라이트박스)"
```

---

### Task 4: 인트로·인사말·가족 소개 섹션

**Files:**
- Create: `src/sections/intro.js`, `src/sections/greeting.js`, `src/sections/family.js`

**Interfaces:**
- Consumes: `WEDDING.groom/bride/datetime/venue/greeting/mainImage`

- [ ] **Step 1: `intro.js`** — 풀스크린 커버: 메인 사진 배경, 두 사람 이름, 날짜(`2026. 11. 14 토요일 낮 12시 30분` 형식으로 datetime에서 생성), 예식장 이름. CSS 페이드인 애니메이션(`@keyframes`, 순차 delay).

- [ ] **Step 2: `greeting.js`** — `WEDDING.greeting.title/message` 렌더 (`\n` → `<br>`), 하단에 "신랑 아버지 ○○○ · 어머니 ○○○ 의 장남 현민" 형식 혼주 소개.

- [ ] **Step 3: `family.js`** — 신랑/신부/양가 혼주 연락처 카드. 각 항목에 `tel:` 전화 버튼 + `sms:` 문자 버튼. phone이 빈 문자열이면 버튼 숨김.

```js
const call = (p) => `<a href="tel:${p}" class="btn-call">📞</a><a href="sms:${p}" class="btn-sms">✉️</a>`;
```

- [ ] **Step 4: 브라우저 확인 + 커밋**

```bash
git add -A && git commit -m "feat: 인트로 커버 + 인사말 + 가족 연락처 섹션"
```

---

### Task 5: 오시는 길 (카카오맵 + 내비 딥링크)

**Files:**
- Create: `src/sections/location.js`, `src/lib/clipboard.js`, `src/tests/validate.test.js`(clipboard는 브라우저 API라 단위테스트 제외, 주소 관련 헬퍼만)

**Interfaces:**
- Consumes: `WEDDING.venue`, `WEDDING.keys.kakaoJs`
- Produces: `copyText(text) => Promise<boolean>` (Task 6·7에서 재사용)

- [ ] **Step 1: ⚠️ 사용자 체크포인트 — 카카오 개발자 키 발급 안내.** https://developers.kakao.com → 앱 생성 → JavaScript 키 복사 → 플랫폼에 배포 도메인(`https://<계정>.github.io`)과 `http://localhost:5173` 등록. 키를 `WEDDING.keys.kakaoJs`에 기입. (키 발급 전에는 지도 대신 주소 텍스트만 표시되게 구현)

- [ ] **Step 2: `src/lib/clipboard.js`**

```js
export async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy'); // 카톡 인앱브라우저 폴백
    ta.remove(); return ok;
  }
}
```

- [ ] **Step 3: `location.js`** — 구성: 예식장 이름·홀·주소·전화 / 카카오맵(`kakao.maps.load` 후 마커 1개, 키 없으면 스킵) / 버튼 4개:

```js
const { lat, lng, name, address } = WEDDING.venue;
const links = {
  kakaomap: `https://map.kakao.com/link/map/${encodeURIComponent(name)},${lat},${lng}`,
  navermap: `nmap://place?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}&appname=wedding`,
  tmap: `tmap://route?goalname=${encodeURIComponent(name)}&goaly=${lat}&goalx=${lng}`,
};
// 주소 복사 버튼: copyText(address) 후 "주소가 복사되었습니다" 토스트
```
nmap/tmap 스킴은 앱 미설치 시 무반응이므로 각 버튼에 웹 폴백(네이버맵 웹 URL) 처리: `setTimeout`으로 1.5초 내 페이지 이탈(blur) 없으면 웹 URL로 이동. 하단에 `venue.subway/bus/parking` 안내 텍스트(빈 값이면 해당 줄 숨김).

- [ ] **Step 4: 브라우저 확인 + 커밋** — 지도 로드, 주소 복사 토스트 확인.

```bash
git add -A && git commit -m "feat: 오시는 길(카카오맵·내비 딥링크·주소복사)"
```

---

### Task 6: 계좌번호 섹션

**Files:**
- Create: `src/sections/accounts.js`

**Interfaces:**
- Consumes: `WEDDING.accounts`, `copyText`

- [ ] **Step 1: `accounts.js`** — "마음 전하실 곳" 제목. 신랑측/신부측 2개 아코디언(`<details>` 기반, CSS로 부드럽게). 각 계좌 행: `은행 계좌번호 (예금주)` + [복사] 버튼(`copyText(\`${bank} ${number}\`)` 후 토스트) + kakaopay 링크 있으면 카카오페이 버튼.

- [ ] **Step 2: 브라우저 확인 + 커밋** — 아코디언 개폐, 복사 동작 확인.

```bash
git add -A && git commit -m "feat: 계좌번호 안내(아코디언·복사·카카오페이)"
```

---

### Task 7: 공유(OG·카카오톡) + BGM + 식전영상

**Files:**
- Create: `src/sections/share.js`, `public/bgm.mp3`(사용자 제공 시)
- Modify: `index.html`(OG 태그 완성), `src/main.js`(BGM 플로팅 버튼)

**Interfaces:**
- Consumes: `WEDDING.share`, `WEDDING.keys.kakaoJs`, `WEDDING.bgm`, `WEDDING.videoUrl`, `copyText`

- [ ] **Step 1: `index.html` OG 태그 완성** — `og:title`, `og:description`(날짜·장소), `og:image`(**절대 URL**: `https://<계정>.github.io/wedding/images/og.jpg` — 카톡 크롤러는 상대경로 못 읽음), `og:url`. og.jpg는 메인 사진에서 800×400 크롭으로 생성(optimize 스크립트에 추가).

- [ ] **Step 2: `share.js`** — 버튼 2개: [카카오톡으로 공유하기](Kakao SDK `Kakao.Share.sendDefault({ objectType: 'feed', ... })`, SDK는 `<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js">` — index.html에 추가 후 `Kakao.init(keys.kakaoJs)`) / [링크 복사](`copyText(location.href)`).

- [ ] **Step 3: BGM** — `WEDDING.bgm`이 비어있지 않으면 우상단 고정 음표 토글 버튼. 모바일 자동재생 불가 → 첫 사용자 터치(`pointerdown` once)에서 `audio.play()` 시도, 버튼으로 토글. **⚠️ 사용자 체크포인트: 저작권 무료 BGM 선택(추천 목록 제공) 또는 생략.**

- [ ] **Step 4: 식전영상** — `WEDDING.videoUrl` 있으면 갤러리 아래에 유튜브 `<iframe>` 임베드 섹션 (main.js SECTIONS에 조건부 추가).

- [ ] **Step 5: 확인 + 커밋** — 링크 복사 동작, (키 있으면) 카톡 공유 팝업 확인.

```bash
git add -A && git commit -m "feat: 카카오톡 공유·OG 태그·BGM·식전영상"
```

---

### Task 8: Firebase 초기화 + 방명록

**Files:**
- Create: `src/lib/firebase.js`, `src/sections/guestbook.js`, `firebase/firestore.rules`

**Interfaces:**
- Consumes: `WEDDING.keys.firebase`
- Produces: `getDb() => Promise<Firestore|null>` (null이면 섹션이 안내문 표시), 컬렉션 스키마 `guestbook: {name: string(≤20), message: string(≤500), createdAt: Timestamp}` / `rsvp: {side: 'groom'|'bride', name: string(≤20), attending: boolean, count: number(1~10), meal: boolean, createdAt: Timestamp}`

- [ ] **Step 1: ⚠️ 사용자 체크포인트 — Firebase 프로젝트 생성 안내.** console.firebase.google.com → 프로젝트 생성(애널리틱스 끔) → 웹 앱 추가 → 설정 객체를 `WEDDING.keys.firebase`에 붙여넣기 → Firestore 데이터베이스 생성(서울 리전 `asia-northeast3`, 프로덕션 모드).

- [ ] **Step 2: `firebase/firestore.rules` 작성** (콘솔 규칙 탭에 붙여넣기)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /guestbook/{doc} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name','message','createdAt'])
        && request.resource.data.name is string && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 20
        && request.resource.data.message is string && request.resource.data.message.size() > 0
        && request.resource.data.message.size() <= 500;
      allow update, delete: if false;
    }
    match /rsvp/{doc} {
      allow read: if false;
      allow create: if request.resource.data.keys().hasOnly(['side','name','attending','count','meal','createdAt'])
        && request.resource.data.side in ['groom','bride']
        && request.resource.data.name is string && request.resource.data.name.size() > 0
        && request.resource.data.name.size() <= 20
        && request.resource.data.attending is bool
        && request.resource.data.count is int && request.resource.data.count >= 1
        && request.resource.data.count <= 10;
      allow update, delete: if false;
    }
  }
}
```

- [ ] **Step 3: `src/lib/firebase.js`** — 동적 import로 번들 분리 + 키 없으면 null:

```js
import { WEDDING } from '../data/wedding.js';
let dbPromise;
export function getDb() {
  if (!WEDDING.keys.firebase) return Promise.resolve(null);
  dbPromise ??= (async () => {
    try {
      const { initializeApp } = await import('firebase/app');
      const { getFirestore } = await import('firebase/firestore');
      return getFirestore(initializeApp(WEDDING.keys.firebase));
    } catch (e) { console.error('firebase init 실패', e); return null; }
  })();
  return dbPromise;
}
```

- [ ] **Step 4: `guestbook.js`** — 작성 폼(이름 20자·메시지 500자 `maxlength`, 제출 시 `addDoc` + `serverTimestamp()`) + 목록(`query(orderBy('createdAt','desc'), limit(50))`, 더보기 버튼). 연속 제출 방지: 제출 후 버튼 10초 비활성화. `getDb()`가 null이거나 실패 시 "방명록을 불러오지 못했어요" 문구만.

- [ ] **Step 5: 실제 쓰기 테스트 + 커밋** — dev 서버에서 방명록 작성 → Firestore 콘솔에서 문서 확인 → 규칙 검증(수정·삭제가 콘솔 외에서 안 되는지는 규칙 시뮬레이터로 확인).

```bash
git add -A && git commit -m "feat: Firebase 연동 + 방명록(보안 규칙 포함)"
```

---

### Task 9: RSVP 섹션

**Files:**
- Create: `src/sections/rsvp.js`
- Create: `docs/rsvp-확인방법.md` (신랑신부용 콘솔 확인 가이드, 스크린샷 없이 단계 텍스트)

**Interfaces:**
- Consumes: `getDb()`, rsvp 컬렉션 스키마(Task 8)

- [ ] **Step 1: `rsvp.js`** — "참석 의사 전달" 섹션: 신랑측/신부측 선택 → 성함 → 참석/불참 → 동행 인원(본인 포함, 1~10 셀렉트) → 식사 여부 → 전달 버튼. 제출 성공 시 폼을 "전달해 주셔서 감사합니다 💐" 카드로 교체. `localStorage`에 제출 플래그 저장해 재방문 시 중복 제출 방지(완전 차단 아닌 UX 수준 — 서버측은 규칙상 create 자유).

- [ ] **Step 2: `docs/rsvp-확인방법.md`** — Firebase 콘솔 로그인 → Firestore → rsvp 컬렉션 → 표로 보기 단계 안내. 참석 합계 계산법 포함.

- [ ] **Step 3: 실제 제출 테스트 + 커밋** — 제출 → 콘솔 확인 → 새로고침 시 감사 카드 유지 확인.

```bash
git add -A && git commit -m "feat: RSVP 참석 의사 수집 + 확인 가이드"
```

---

### Task 10: 실제 콘텐츠 반영 + 디자인 폴리시

- [ ] **Step 1: ⚠️ 사용자 체크포인트 — 실제 정보 수집.** 예식 일시 / 예식장(이름·홀·주소·전화) / 양가 혼주 성함 / 연락처 / 계좌번호 / 인사말 수정 여부 / 메인·갤러리 사진 최종 선별. 받은 값으로 `wedding.js`의 모든 `⚠️` 항목 교체.
- [ ] **Step 2: 디자인 시안 확인.** dev 서버 화면을 브라우저(모바일 뷰포트 375px)로 사용자에게 보여주고 색감·서체·섹션 순서 피드백 반영. 서체는 눈누(noonnu) 무료 웹폰트 중 선택.
- [ ] **Step 3: 커밋**

```bash
git add -A && git commit -m "feat: 실제 예식 정보 반영 + 디자인 확정"
```

---

### Task 11: GitHub Pages 배포

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: `deploy.yml` 작성**

```yaml
name: Deploy to GitHub Pages
on:
  push: { branches: [main] }
permissions: { contents: read, pages: write, id-token: write }
jobs:
  deploy:
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: ⚠️ 사용자 체크포인트 — GitHub 저장소 생성.** `wedding` 이름의 저장소 생성(공개 필수 — Pages 무료 조건). `gh repo create` 사용 가능하면 대신 실행. 저장소 Settings → Pages → Source를 "GitHub Actions"로 설정.

- [ ] **Step 3: 푸시 + 배포 확인**

```bash
git remote add origin https://github.com/<계정>/wedding.git
git push -u origin main
```
Actions 완료 후 `https://<계정>.github.io/wedding/` 접속 확인.

- [ ] **Step 4: 카카오 개발자 콘솔에 배포 도메인 등록 재확인, Firebase 승인 도메인(`<계정>.github.io`) 추가.**

---

### Task 12: 최종 검증

- [ ] 모바일 뷰포트(375px)에서 전 섹션 스크롤 검증 — 레이아웃 깨짐 없음
- [ ] Lighthouse 모바일 성능 확인 (이미지 lazy loading 동작)
- [ ] 실기기에서 링크 열기 + 카카오톡 공유 카드 썸네일 확인 (https://developers.kakao.com/tool/debugger/sharing 캐시 초기화 활용)
- [ ] 방명록·RSVP 실기기 제출 → Firestore 콘솔 데이터 확인
- [ ] 전화/문자/지도/내비/계좌복사 버튼 실기기 동작 확인
- [ ] 수정 워크플로 리허설: `wedding.js` 문구 하나 변경 → push → 1~2분 내 반영 확인

```bash
git add -A && git commit -m "chore: 최종 검증 완료"
```
