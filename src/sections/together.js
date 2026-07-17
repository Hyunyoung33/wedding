// '함께한 시간' — 처음 만난 날부터 실시간 카운터. firstMet이 없으면 표시하지 않음.
import { togetherParts } from '../lib/dday.js';

export function mount(el, w) {
  if (!w.firstMet) {
    el.remove();
    return;
  }

  el.innerHTML = `
    <p class="sec-label">Our Time</p>
    <h2 class="sec-title">함께한 시간</h2>
    <p class="together-counter">"<span></span>"</p>
    <p class="together-note">${w.groom.name.slice(1)} ♥ ${w.bride.name.slice(1)}, 처음 만난 날부터 지금까지</p>
  `;

  const span = el.querySelector('.together-counter span');
  function tick() {
    const t = togetherParts(w.firstMet);
    span.textContent = `${t.years}년 ${t.days}일 ${t.hours}시간 ${t.minutes}분 ${t.seconds}초`;
  }
  tick();
  setInterval(tick, 1000);
}
