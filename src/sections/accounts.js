import { copyText } from '../lib/clipboard.js';
import { toast } from '../lib/toast.js';

function accountRow(acc) {
  return `
    <div class="acc-row">
      <div class="acc-info">
        ${acc.label ? `<span class="acc-label">${acc.label}</span>` : ''}
        <span class="acc-bank">${acc.bank} ${acc.number}</span>
        <span class="acc-holder">${acc.holder}</span>
      </div>
      <div class="acc-btns">
        <button class="btn btn-sm acc-copy" data-copy="${acc.bank} ${acc.number}">복사</button>
        ${acc.kakaopay ? `<a class="btn btn-sm acc-pay" href="${acc.kakaopay}" target="_blank" rel="noopener">카카오페이</a>` : ''}
      </div>
    </div>`;
}

export function mount(el, w) {
  const group = (title, accs, open) => `
    <details class="acc-group"${open ? ' open' : ''}>
      <summary>${title}</summary>
      ${accs.map(accountRow).join('')}
    </details>`;

  el.innerHTML = `
    <p class="sec-label">Account</p>
    <h2 class="sec-title">마음 전하실 곳</h2>
    <p class="acc-note">참석이 어려우신 분들을 위해<br>계좌번호를 안내드립니다.<br>너그러운 양해 부탁드립니다.</p>
    ${group('신랑측 계좌번호', w.accounts.groom, false)}
    ${group('신부측 계좌번호', w.accounts.bride, false)}
  `;

  el.querySelectorAll('.acc-copy').forEach((b) =>
    b.addEventListener('click', async () => {
      toast((await copyText(b.dataset.copy)) ? '계좌번호가 복사되었습니다' : '복사에 실패했습니다');
    }),
  );
}
