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
  load()
    .then((m) => m.mount(el, WEDDING))
    .catch((err) => {
      // 한 섹션이 실패해도 나머지 청첩장은 정상 동작해야 한다
      console.error(`[${id}] 섹션 로드 실패`, err);
      el.remove();
    });
}
