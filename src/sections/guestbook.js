import { getDb } from '../lib/firebase.js';
import { toast } from '../lib/toast.js';

const PAGE = 10;
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export function mount(el, w) {
  el.innerHTML = `
    <p class="sec-label">Guestbook</p>
    <h2 class="sec-title">축하 메시지</h2>
    <form class="gb-form" autocomplete="off">
      <input name="name" type="text" maxlength="20" placeholder="성함" required />
      <textarea name="message" maxlength="500" rows="3" placeholder="따뜻한 축하의 말을 남겨주세요" required></textarea>
      <button class="btn gb-submit" type="submit">메시지 남기기</button>
    </form>
    <div class="gb-list" aria-live="polite"></div>
    <button class="btn gb-more" hidden>더 보기</button>
  `;

  const form = el.querySelector('.gb-form');
  const submitBtn = el.querySelector('.gb-submit');
  const list = el.querySelector('.gb-list');
  const moreBtn = el.querySelector('.gb-more');

  let shown = PAGE;
  let docs = [];

  function render() {
    if (!docs.length) {
      list.innerHTML = '<p class="gb-empty">첫 번째 축하 메시지를 남겨주세요 💐</p>';
      moreBtn.hidden = true;
      return;
    }
    list.innerHTML = docs
      .slice(0, shown)
      .map((d) => {
        const date = d.createdAt?.toDate?.();
        const when = date
          ? `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
          : '';
        return `<div class="gb-item"><div class="gb-head"><strong>${esc(d.name)}</strong><small>${when}</small></div><p>${esc(d.message)}</p></div>`;
      })
      .join('');
    moreBtn.hidden = shown >= docs.length;
  }

  async function load(db) {
    const { collection, query, orderBy, limit, getDocs } = await import('firebase/firestore');
    const snap = await getDocs(query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'), limit(200)));
    docs = snap.docs.map((s) => s.data());
    render();
  }

  moreBtn.addEventListener('click', () => {
    shown += PAGE;
    render();
  });

  getDb().then(async (db) => {
    if (!db) {
      // 아직 Firebase 미연결(설정 전) — 폼은 보여주되 제출은 안내만
      render();
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        toast('방명록 준비 중입니다');
      });
      return;
    }

    try {
      await load(db);
    } catch (e) {
      console.error('방명록 불러오기 실패', e);
      list.innerHTML = '<p class="gb-empty">방명록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p>';
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const message = form.message.value.trim();
      if (!name || !message) return;

      submitBtn.disabled = true;
      try {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        await addDoc(collection(db, 'guestbook'), { name, message, createdAt: serverTimestamp() });
        form.reset();
        toast('메시지가 등록되었습니다. 감사합니다!');
        await load(db);
      } catch (err) {
        console.error('방명록 등록 실패', err);
        toast('등록에 실패했어요. 잠시 후 다시 시도해주세요.');
      } finally {
        // 연속 도배 방지
        setTimeout(() => (submitBtn.disabled = false), 10000);
      }
    });
  });
}
