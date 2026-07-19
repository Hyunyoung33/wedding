import { copyText } from '../lib/clipboard.js';
import { toast } from '../lib/toast.js';

// 행 전체(이름·계좌)를 탭하면 계좌번호가 복사된다. 카카오페이 링크가 있으면 노란 원형 버튼 표시.
function accountRow(acc) {
  return `
    <div class="acc-row" role="button" tabindex="0" data-copy="${acc.bank} ${acc.number}">
      <div class="acc-info">
        <span class="acc-holder">
          <svg class="acc-copy-ico" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
          ${acc.label ? `${acc.label} · ` : ''}${acc.holder}
        </span>
        <span class="acc-bank">${acc.bank} ${acc.number}</span>
      </div>
      ${acc.kakaopay ? `<a class="acc-pay" href="${acc.kakaopay}" target="_blank" rel="noopener" aria-label="카카오페이로 송금" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" width="22" height="22" fill="#3c1e1e" aria-hidden="true"><path d="M12 4C7 4 3 7.2 3 11.2c0 2.6 1.7 4.8 4.3 6.1l-1 3.6c-.1.4.3.7.6.5l4.3-2.9c.3 0 .5.1.8.1 5 0 9-3.2 9-7.4S17 4 12 4z"/></svg></a>` : ''}
    </div>`;
}

export function mount(el, w) {
  const group = (title, accs) => `
    <details class="acc-group">
      <summary>${title}<span class="acc-chev">▾</span></summary>
      <div class="acc-body">${accs.map(accountRow).join('')}</div>
    </details>`;

  el.innerHTML = `
    <p class="sec-label">Account</p>
    <h2 class="sec-title">마음 전하실 곳</h2>
    <p class="acc-note">참석이 어려우신 분들을 위해<br>계좌번호를 기재하였습니다.<br>너그러운 마음으로 양해 부탁드립니다.</p>
    ${group('신랑측', w.accounts.groom)}
    ${group('신부측', w.accounts.bride)}
  `;

  el.querySelectorAll('.acc-row').forEach((row) => {
    const copy = async () => {
      toast((await copyText(row.dataset.copy)) ? '계좌번호가 복사되었습니다' : '복사에 실패했습니다');
    };
    row.addEventListener('click', copy);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        copy();
      }
    });
  });
}
