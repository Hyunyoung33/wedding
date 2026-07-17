import { formatDateKo } from '../data/wedding.js';

const BASE = import.meta.env.BASE_URL;
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDateEn(iso) {
  const d = new Date(iso);
  return `${DAYS_EN[d.getDay()]}, ${MONTHS_EN[d.getMonth()]} ${ordinal(d.getDate())}, ${d.getFullYear()}`;
}

// 아치형 커버 (아이보리 배경)
function mountArch(el, w) {
  el.classList.add('intro');
  el.innerHTML = `
    <p class="intro-label fade" style="--d:0.2s">WEDDING INVITATION</p>
    <h1 class="intro-names fade" style="--d:0.6s">
      ${w.groom.name}<span class="amp">그리고</span>${w.bride.name}
    </h1>
    ${w.mainImage ? `<figure class="intro-photo fade" style="--d:1s"><img src="${BASE}images/${w.mainImage}" alt="${w.groom.name}과 ${w.bride.name}의 웨딩 사진" /></figure>` : ''}
    <p class="intro-date fade" style="--d:1.4s">${formatDateKo(w.datetime)}</p>
    <p class="intro-venue fade" style="--d:1.6s">${w.venue.name} ${w.venue.hall}</p>
  `;
}

// 풀스크린 사진 커버 (사진 위 타이포)
function mountFull(el, w) {
  el.classList.add('intro-full');
  el.innerHTML = `
    <img class="if-photo" src="${BASE}images/${w.mainImage}" alt="${w.groom.name}과 ${w.bride.name}의 웨딩 사진" />
    <div class="if-overlay"></div>
    <div class="if-top fade" style="--d:0.4s">
      <p class="if-script">our<br>wedding<br>day</p>
    </div>
    <div class="if-bottom">
      <p class="if-date fade" style="--d:0.9s">– ${formatDateEn(w.datetime)} –</p>
      <p class="if-names fade" style="--d:1.2s">${w.groom.name} · ${w.bride.name}</p>
      <p class="if-venue fade" style="--d:1.5s">${formatDateKo(w.datetime)}<br>${w.venue.name} ${w.venue.hall}</p>
    </div>
  `;
}

export function mount(el, w) {
  // ?cover=full / ?cover=arch 로 미리보기 전환 가능 (비교용)
  const override = new URLSearchParams(location.search).get('cover');
  const style = override || w.coverStyle;
  if (style === 'full' && w.mainImage) mountFull(el, w);
  else mountArch(el, w);
}
