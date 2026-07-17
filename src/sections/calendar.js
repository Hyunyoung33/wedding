import { daysUntil, countdownParts, calendarWeeks } from '../lib/dday.js';
import { formatDateKo } from '../data/wedding.js';

const DAYS_HEADER = ['일', '월', '화', '수', '목', '금', '토'];

export function mount(el, w) {
  const wd = new Date(w.datetime);
  const weeks = calendarWeeks(w.datetime);

  const grid = weeks
    .map(
      (week) =>
        `<tr>${week
          .map((d, i) => {
            if (!d) return '<td></td>';
            const isDay = d === wd.getDate();
            const cls = [isDay ? 'wday' : '', i === 0 ? 'sun' : ''].join(' ').trim();
            return `<td class="${cls}"><span>${d}</span></td>`;
          })
          .join('')}</tr>`,
    )
    .join('');

  el.innerHTML = `
    <p class="sec-label">Save the Date</p>
    <h2 class="sec-title">${formatDateKo(w.datetime)}</h2>
    <table class="cal" aria-label="예식 달력">
      <thead><tr>${DAYS_HEADER.map((d, i) => `<th class="${i === 0 ? 'sun' : ''}">${d}</th>`).join('')}</tr></thead>
      <tbody>${grid}</tbody>
    </table>
    <div class="countdown" aria-live="off">
      ${['days', 'hours', 'minutes', 'seconds']
        .map(
          (k, i) =>
            `<div class="cd-cell"><strong data-cd="${k}">0</strong><small>${['일', '시간', '분', '초'][i]}</small></div>`,
        )
        .join('')}
    </div>
    <p class="dday-msg"></p>
  `;

  const msg = el.querySelector('.dday-msg');
  const cells = Object.fromEntries(
    [...el.querySelectorAll('[data-cd]')].map((n) => [n.dataset.cd, n]),
  );

  const groomFirst = w.groom.name.slice(1) || w.groom.name;
  const brideFirst = w.bride.name.slice(1) || w.bride.name;

  function tick() {
    const parts = countdownParts(w.datetime);
    for (const k in cells) cells[k].textContent = parts[k];
    const d = daysUntil(w.datetime);
    msg.textContent =
      d > 0
        ? `${groomFirst} ♥ ${brideFirst}의 결혼식이 ${d}일 남았습니다`
        : d === 0
          ? `${groomFirst} ♥ ${brideFirst}, 오늘 결혼합니다 🎉`
          : `${groomFirst} ♥ ${brideFirst}, 결혼식이 ${-d}일 지났습니다`;
  }
  tick();
  setInterval(tick, 1000);
}
