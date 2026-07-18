// 게스트스냅 — 하객이 찍은 사진/영상을 구글 포토 공유 앨범에 올리는 이벤트.
// wedding.js 의 guestSnap.url 이 있을 때만 표시. 업로드 버튼은 예식 당일부터 열린다.
import { daysUntil } from '../lib/dday.js';

const BASE = import.meta.env.BASE_URL;
const br = (s) => s.replaceAll('\n', '<br>');

export function mount(el, w) {
  const { url, photo, reward } = w.guestSnap ?? {};
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
      <p class="snap-open">${d.getFullYear()}년 ${dateKo}부터<br>사진 및 영상 업로드가 가능합니다.</p>
      <hr class="snap-divider" />
      <p class="snap-headline">📸 저희의 스냅 작가님이 되어주세요! 📸</p>
      <p class="snap-list-title">[이런 순간들을 담아주세요!]</p>
      <p class="snap-line">1. 행복한 신랑 &amp; 신부 사진</p>
      <p class="snap-line">2. 신랑 &amp; 신부 행진</p>
      <p class="snap-line">3. 가족 &amp; 친구들과 함께한 순간</p>
      <p class="snap-line">4. 여러분들의 사진</p>
      ${reward ? `<p class="snap-reward">🎁 ${br(reward)}</p>` : ''}
      <p class="snap-note">당일, 아래 업로드 버튼을 통해 올려주세요!<br>많은 참여 부탁드려요! 💖</p>
      ${
        locked
          ? `<button class="btn snap-btn" disabled>사진 및 영상 업로드 (${dateKo} OPEN)</button>`
          : `<a class="btn snap-btn" href="${url}" target="_blank" rel="noopener">사진 및 영상 업로드</a>`
      }
    </div>
  `;
}
