// 게스트스냅 — 하객이 찍은 사진/영상을 구글 포토 공유 앨범에 올리는 이벤트.
// wedding.js 의 guestSnap.url 이 있을 때만 표시. 업로드 버튼은 예식 당일부터 열린다.
import { daysUntil } from '../lib/dday.js';

const BASE = import.meta.env.BASE_URL;

export function mount(el, w) {
  const { url, photo } = w.guestSnap ?? {};
  if (!url) {
    el.remove();
    return;
  }

  const d = new Date(w.datetime);
  const dateKo = `${d.getMonth() + 1}월 ${d.getDate()}일`;
  const locked = daysUntil(w.datetime) > 0;

  el.innerHTML = `
    <p class="sec-label">Guest Snap</p>
    <h2 class="sec-title">게스트스냅</h2>
    <p class="snap-sub">신랑 · 신부의 행복한 순간을 담아주세요</p>
    ${photo ? `<figure class="snap-photo"><img src="${BASE}images/${photo}" alt="게스트스냅 안내 사진" loading="lazy" /></figure>` : ''}
    <div class="snap-card">
      <p class="snap-note">예식 당일, 찍어주신 사진과 영상을<br>아래 버튼을 눌러 올려주세요 💖</p>
      ${
        locked
          ? `<button class="btn snap-btn" disabled>사진 및 영상 업로드 (${dateKo} OPEN)</button>`
          : `<a class="btn snap-btn" href="${url}" target="_blank" rel="noopener">사진 및 영상 업로드</a>`
      }
    </div>
  `;
}
