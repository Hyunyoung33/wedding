import './styles/main.css';
import { WEDDING } from './data/wedding.js';

const SECTIONS = [
  ['intro', () => import('./sections/intro.js')],
  ['greeting', () => import('./sections/greeting.js')],
  ['family', () => import('./sections/family.js')],
  ['calendar', () => import('./sections/calendar.js')],
  ['gallery', () => import('./sections/gallery.js')],
  ['video', () => import('./sections/video.js')],
  ['guestsnap', () => import('./sections/guestsnap.js')],
  ['location', () => import('./sections/location.js')],
  ['accounts', () => import('./sections/accounts.js')],
  ['guestbook', () => import('./sections/guestbook.js')],
  ['rsvp', () => import('./sections/rsvp.js')],
  ['together', () => import('./sections/together.js')],
  ['share', () => import('./sections/share.js')],
];

const app = document.getElementById('app');
for (const [id, load] of SECTIONS) {
  const el = document.createElement('section');
  el.id = id;
  app.appendChild(el);
  load()
    .then((m) => m.mount(el, WEDDING))
    .catch((err) => {
      // 한 섹션이 실패해도 나머지 청첩장은 정상 동작해야 한다
      console.error(`[${id}] 섹션 로드 실패`, err);
      el.remove();
    });
}

// 접속 시 참석여부 안내 팝업
import('./lib/rsvp-popup.js').then((m) => m.showRsvpPopup(WEDDING)).catch(() => {});

// 배경음악 (설정에 bgm 파일이 있을 때만)
if (WEDDING.bgm) {
  const audio = new Audio(import.meta.env.BASE_URL + WEDDING.bgm);
  audio.loop = true;

  const btn = document.createElement('button');
  btn.id = 'bgm-toggle';
  btn.setAttribute('aria-label', '배경음악 켜기/끄기');
  btn.textContent = '♪';
  document.body.appendChild(btn);

  const setUi = () => btn.classList.toggle('playing', !audio.paused);

  btn.addEventListener('click', () => {
    (audio.paused ? audio.play() : Promise.resolve(audio.pause()))
      .catch(() => {})
      .finally(setUi);
  });

  // 모바일은 자동재생이 막혀 있어 첫 터치에서 재생을 시도한다
  document.addEventListener(
    'pointerdown',
    () => audio.play().catch(() => {}).finally(setUi),
    { once: true },
  );
}
