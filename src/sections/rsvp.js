import { getDb } from '../lib/firebase.js';
import { toast } from '../lib/toast.js';

const DONE_KEY = 'rsvp-done';

function thanksCard(el) {
  el.innerHTML = `
    <p class="sec-label">R.S.V.P.</p>
    <h2 class="sec-title">참석 의사 전달</h2>
    <div class="rsvp-thanks">전달해 주셔서 감사합니다 💐<br><small>참석 여부는 언제든 신랑·신부에게 직접 알려주셔도 됩니다.</small></div>
  `;
}

export function mount(el, w) {
  if (localStorage.getItem(DONE_KEY)) {
    thanksCard(el);
    return;
  }

  el.innerHTML = `
    <p class="sec-label">R.S.V.P.</p>
    <h2 class="sec-title">참석 의사 전달</h2>
    <p class="rsvp-note">축하의 마음으로 참석해 주시는 한 분 한 분을<br>더 정성껏 모실 수 있도록 참석 의사를 전해주세요.</p>
    <form class="rsvp-form" autocomplete="off">
      <div class="rsvp-field">
        <span class="rsvp-label">어느 분의 하객이신가요?</span>
        <div class="rsvp-seg" role="radiogroup">
          <label><input type="radio" name="side" value="groom" checked /><span>신랑측</span></label>
          <label><input type="radio" name="side" value="bride" /><span>신부측</span></label>
        </div>
      </div>
      <div class="rsvp-field">
        <span class="rsvp-label">참석 여부</span>
        <div class="rsvp-seg" role="radiogroup">
          <label><input type="radio" name="attending" value="yes" checked /><span>참석</span></label>
          <label><input type="radio" name="attending" value="no" /><span>불참</span></label>
        </div>
      </div>
      <div class="rsvp-field">
        <span class="rsvp-label">성함</span>
        <input name="name" type="text" maxlength="20" placeholder="성함을 입력해주세요" required />
      </div>
      <div class="rsvp-field rsvp-when-attending">
        <span class="rsvp-label">동행 인원 (본인 포함)</span>
        <select name="count">
          ${Array.from({ length: 10 }, (_, i) => `<option value="${i + 1}">${i + 1}명</option>`).join('')}
        </select>
      </div>
      <div class="rsvp-field rsvp-when-attending">
        <span class="rsvp-label">식사 여부</span>
        <div class="rsvp-seg" role="radiogroup">
          <label><input type="radio" name="meal" value="yes" checked /><span>식사함</span></label>
          <label><input type="radio" name="meal" value="no" /><span>식사 안 함</span></label>
        </div>
      </div>
      <button class="btn rsvp-submit" type="submit">참석 의사 전달하기</button>
    </form>
  `;

  const form = el.querySelector('.rsvp-form');
  const submitBtn = el.querySelector('.rsvp-submit');

  // 불참 선택 시 인원·식사 항목 숨김
  form.addEventListener('change', () => {
    const attending = form.attending.value === 'yes';
    el.querySelectorAll('.rsvp-when-attending').forEach((f) => (f.hidden = !attending));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    if (!name) return;

    const db = await getDb();
    if (!db) {
      toast('참석 의사 전달 기능 준비 중입니다');
      return;
    }

    submitBtn.disabled = true;
    const attending = form.attending.value === 'yes';
    try {
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      await addDoc(collection(db, 'rsvp'), {
        side: form.side.value,
        name,
        attending,
        count: attending ? Number(form.count.value) : 1,
        meal: attending ? form.meal.value === 'yes' : false,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem(DONE_KEY, '1');
      thanksCard(el);
    } catch (err) {
      console.error('RSVP 전송 실패', err);
      toast('전송에 실패했어요. 잠시 후 다시 시도해주세요.');
      submitBtn.disabled = false;
    }
  });
}
