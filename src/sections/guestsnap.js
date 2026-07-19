// 축하 사진 공유 — 하객이 찍은 사진/영상을 구글 포토 공유 앨범에 올리는 이벤트.
// wedding.js 의 guestSnap.url 이 있을 때만 표시. 업로드 버튼은 예식 당일부터 열린다.
import { daysUntil } from '../lib/dday.js';

const BASE = import.meta.env.BASE_URL;

export function mount(el, w) {
  const { url, photos = [] } = w.guestSnap ?? {};
  if (!url) {
    el.remove();
    return;
  }

  const d = new Date(w.datetime);
  const pad = (n) => String(n).padStart(2, '0');
  const openAt = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const locked = daysUntil(w.datetime) > 0;

  const stack = photos
    .slice(0, 3)
    .map((p, i) => `<figure class="snap-pol snap-pol-${i}"><img src="${BASE}images/thumbs/${p}" alt="" loading="lazy" /></figure>`)
    .join('');

  el.innerHTML = `
    ${stack ? `<div class="snap-stack" aria-hidden="true">${stack}</div>` : ''}
    <p class="sec-label">Capture Our Moments</p>
    <h2 class="sec-title">축하 사진 공유</h2>
    <p class="snap-desc">신랑 신부의 행복한 순간을 담아주세요.<br>예식 당일, 아래 버튼을 통해 사진을 올려주세요.<br>많은 참여 부탁드려요!</p>
    ${
      locked
        ? `<button class="btn snap-btn" disabled>사진 업로드</button>
           <p class="snap-open">${openAt}부터<br>업로드 가능합니다.</p>`
        : `<a class="btn snap-btn" href="${url}" target="_blank" rel="noopener">사진 업로드</a>`
    }
  `;
}
