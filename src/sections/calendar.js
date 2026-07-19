import { daysUntil, countdownParts, calendarWeeks } from '../lib/dday.js';

const DAYS_HEADER = ['일', '월', '화', '수', '목', '금', '토'];
const DAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

export function mount(el, w) {
  const wd = new Date(w.datetime);
  const weeks = calendarWeeks(w.datetime);
  const holidays = w.holidays ?? [];
  const pad = (n) => String(n).padStart(2, '0');

  const h = wd.getHours();
  const ampm = h < 12 ? '오전' : h < 18 ? '낮' : '저녁';
  const timeLine = `${DAYS_KO[wd.getDay()]} ${ampm} ${h % 12 || 12}시 ${wd.getMinutes()}분`;

  const grid = weeks
    .map(
      (week) =>
        `<tr>${week
          .map((d, i) => {
            if (!d) return '<td></td>';
            const isDay = d === wd.getDate();
            const rosy = i === 0 || holidays.includes(d);
            const cls = [isDay ? 'wday' : '', rosy ? 'sun' : ''].join(' ').trim();
            return `<td class="${cls}"><span>${d}</span></td>`;
          })
          .join('')}</tr>`,
    )
    .join('');

  el.innerHTML = `
    <p class="cal-date">${wd.getFullYear()}.${pad(wd.getMonth() + 1)}.${pad(wd.getDate())}</p>
    <p class="cal-time">${timeLine}</p>
    <div class="cal-wrap">
      <table class="cal" aria-label="예식 달력">
        <thead><tr>${DAYS_HEADER.map((d, i) => `<th class="${i === 0 ? 'sun' : ''}">${d}</th>`).join('')}</tr></thead>
        <tbody>${grid}</tbody>
      </table>
    </div>
    <div class="countdown" aria-live="off">
      ${['DAYS', 'HOUR', 'MIN', 'SEC']
        .map(
          (label, i) =>
            `${i > 0 ? '<span class="cd-colon">:</span>' : ''}<div class="cd-cell"><small>${label}</small><strong data-cd="${['days', 'hours', 'minutes', 'seconds'][i]}">0</strong></div>`,
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
    for (const k in cells) cells[k].textContent = String(parts[k]).padStart(2, '0');
    const d = daysUntil(w.datetime);
    msg.innerHTML =
      d > 0
        ? `${groomFirst}, ${brideFirst}의 결혼식이 <em>${d}</em>일 남았습니다.`
        : d === 0
          ? `${groomFirst}, ${brideFirst} 오늘 결혼합니다 🎉`
          : `${groomFirst}, ${brideFirst}의 결혼식이 ${-d}일 지났습니다.`;
  }
  tick();
  setInterval(tick, 1000);
}
