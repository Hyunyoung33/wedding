// 접속 시 참석여부 안내 팝업. 이미 응답했거나 '오늘 하루 보지 않기'를 누른 날은 뜨지 않는다.
import { formatDateKo } from '../data/wedding.js';

const HIDE_KEY = 'rsvp-popup-hide-date';

export function showRsvpPopup(w) {
  if (!w.rsvpPopup) return;
  if (localStorage.getItem('rsvp-done')) return;
  const today = new Date().toDateString();
  if (localStorage.getItem(HIDE_KEY) === today) return;

  const box = document.createElement('div');
  box.className = 'rsvp-popup';
  box.innerHTML = `
    <div class="rsvp-popup-card" role="dialog" aria-label="참석 여부 전달 안내">
      <button class="rp-close" aria-label="닫기">×</button>
      <h3>참석 여부 전달</h3>
      <p class="rp-desc">
        소중한 시간을 내어 결혼식에<br>
        참석해주시는 모든 분들께 감사드립니다.<br>
        참석 여부를 회신해 주시면<br>
        더욱 정성껏 모시겠습니다.
      </p>
      <div class="rp-info">
        <p>♡ 신랑 ${w.groom.name}, 신부 ${w.bride.name}</p>
        <p>🗓 ${formatDateKo(w.datetime)}</p>
        <p>📍 ${w.venue.name} ${w.venue.hall}</p>
      </div>
      <button class="btn rp-go">참석 여부 전달하기</button>
      <button class="rp-hide">오늘 하루 보지 않기</button>
    </div>
  `;
  document.body.appendChild(box);
  document.body.style.overflow = 'hidden';

  const close = () => {
    box.remove();
    document.body.style.overflow = '';
  };
  box.querySelector('.rp-close').addEventListener('click', close);
  box.addEventListener('click', (e) => {
    if (e.target === box) close();
  });
  box.querySelector('.rp-go').addEventListener('click', () => {
    close();
    document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
  });
  box.querySelector('.rp-hide').addEventListener('click', () => {
    localStorage.setItem(HIDE_KEY, today);
    close();
  });
}
