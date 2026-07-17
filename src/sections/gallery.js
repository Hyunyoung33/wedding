const BASE = import.meta.env.BASE_URL;

export function mount(el, w) {
  if (!w.gallery.length) {
    el.remove();
    return;
  }

  el.innerHTML = `
    <p class="sec-label">Gallery</p>
    <h2 class="sec-title">우리의 순간들</h2>
    <div class="gal-grid">
      ${w.gallery
        .map(
          (name, i) =>
            `<button class="gal-thumb" data-idx="${i}" aria-label="사진 ${i + 1} 크게 보기">
               <img src="${BASE}images/thumbs/${name}" alt="웨딩 사진 ${i + 1}" loading="lazy" />
             </button>`,
        )
        .join('')}
    </div>
  `;

  // 라이트박스
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = `
    <button class="lb-close" aria-label="닫기">×</button>
    <img alt="" />
    <div class="lb-nav">
      <button class="lb-prev" aria-label="이전 사진">‹</button>
      <span class="lb-count"></span>
      <button class="lb-next" aria-label="다음 사진">›</button>
    </div>
  `;
  document.body.appendChild(box);

  const img = box.querySelector('img');
  const count = box.querySelector('.lb-count');
  let cur = 0;

  function show(i) {
    cur = (i + w.gallery.length) % w.gallery.length;
    img.src = `${BASE}images/${w.gallery[cur]}`;
    count.textContent = `${cur + 1} / ${w.gallery.length}`;
  }

  function open(i) {
    show(i);
    box.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.classList.remove('open');
    document.body.style.overflow = '';
  }

  el.querySelectorAll('.gal-thumb').forEach((b) =>
    b.addEventListener('click', () => open(Number(b.dataset.idx))),
  );
  box.querySelector('.lb-close').addEventListener('click', close);
  box.querySelector('.lb-prev').addEventListener('click', () => show(cur - 1));
  box.querySelector('.lb-next').addEventListener('click', () => show(cur + 1));
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });

  // 좌우 스와이프
  let startX = 0;
  box.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  box.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 48) show(cur + (dx < 0 ? 1 : -1));
    },
    { passive: true },
  );
}
