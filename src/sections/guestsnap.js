// 게스트스냅 — 하객이 찍은 사진/영상을 구글 포토 공유 앨범에 올리는 이벤트.
// wedding.js 의 guestSnap.url 이 있을 때만 표시됩니다.
export function mount(el, w) {
  if (!w.guestSnap?.url) {
    el.remove();
    return;
  }

  el.innerHTML = `
    <p class="sec-label">Guest Snap</p>
    <h2 class="sec-title">저희의 스냅 작가님이 되어주세요 📸</h2>
    <div class="snap-card">
      <p class="snap-desc">
        신랑·신부의 행복한 순간을 담아주세요.<br>
        예식 당일, 여러분이 찍어주신 사진과 영상이<br>
        저희에게 가장 소중한 선물이 됩니다.
      </p>
      <ul class="snap-list">
        <li>행복한 신랑 &amp; 신부의 순간</li>
        <li>신랑 &amp; 신부 행진</li>
        <li>가족 · 친구들과 함께한 순간</li>
        <li>여러분들의 즐거운 사진</li>
      </ul>
      <a class="btn snap-btn" href="${w.guestSnap.url}" target="_blank" rel="noopener">사진 · 영상 올리러 가기</a>
    </div>
  `;
}
