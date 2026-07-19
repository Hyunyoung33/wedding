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

// 글자 하나하나가 흩어진 곳에서 떠올라 제자리를 찾는 웨이브 텍스트
function waveText(text, baseDelay) {
  return [...text]
    .map((ch, i) => {
      if (ch === ' ') return '<span class="wv-sp"></span>';
      const d = (baseDelay + i * 0.09 + Math.random() * 0.25).toFixed(2);
      const dx = Math.round((Math.random() - 0.5) * 70);
      const dy = Math.round((Math.random() - 0.5) * 70);
      return `<span class="wv" style="--d:${d}s;--dx:${dx}px;--dy:${dy}px">${ch}</span>`;
    })
    .join('');
}

// 떠다니는 빛망울 입자
function particles(n) {
  return Array.from({ length: n }, () => {
    const size = (2 + Math.random() * 5).toFixed(1);
    const left = (Math.random() * 100).toFixed(1);
    const top = (8 + Math.random() * 88).toFixed(1);
    const dur = (6 + Math.random() * 8).toFixed(1);
    const delay = (-Math.random() * 10).toFixed(1);
    const op = (0.35 + Math.random() * 0.45).toFixed(2);
    return `<span class="wv-particle" style="width:${size}px;height:${size}px;left:${left}%;top:${top}%;--op:${op};animation-duration:${dur}s;animation-delay:${delay}s"></span>`;
  }).join('');
}

// 웨이브 커버 (풀스크린 사진 + 상단 텍스트 웨이브 등장 + 빛망울)
function mountWave(el, w) {
  el.classList.add('intro-wave');
  const d = new Date(w.datetime);
  const h12 = d.getHours() % 12 || 12;
  const dateLine = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${DAYS_EN[d.getDay()].toUpperCase()} ${h12}:${String(d.getMinutes()).padStart(2, '0')}${d.getHours() < 12 ? 'AM' : 'PM'}`;

  el.innerHTML = `
    <img class="if-photo" src="${BASE}images/${w.mainImage}" alt="${w.groom.name}과 ${w.bride.name}의 웨딩 사진" />
    <div class="wv-overlay"></div>
    <div class="wv-particles" aria-hidden="true">${particles(16)}</div>
    <div class="wv-top">
      <p class="wv-label">${waveText('THE WEDDING OF', 0.3)}</p>
      <p class="wv-names">${waveText(w.groom.name, 1.0)}<span class="wv wv-amp" style="--d:1.35s;--dx:0px;--dy:26px">&amp;</span>${waveText(w.bride.name, 1.5)}</p>
      <p class="wv-venue">${waveText(`${w.venue.name} ${w.venue.hall}`, 2.0)}</p>
      <p class="wv-date">${waveText(dateLine, 2.6)}</p>
    </div>
  `;
}

export function mount(el, w) {
  // ?cover=wave / ?cover=full / ?cover=arch 로 미리보기 전환 가능 (비교용)
  const override = new URLSearchParams(location.search).get('cover');
  const style = override || w.coverStyle;
  if (style === 'wave' && w.mainImage) mountWave(el, w);
  else if (style === 'full' && w.mainImage) mountFull(el, w);
  else mountArch(el, w);
}
