function contactRow(label, name, phone) {
  if (!name || !phone) return '';
  return `
    <div class="contact-row">
      <span class="contact-label">${label}</span>
      <span class="contact-name">${name}</span>
      <span class="contact-btns">
        <a class="btn btn-sm" href="tel:${phone}" aria-label="${label} ${name}에게 전화">📞</a>
        <a class="btn btn-sm" href="sms:${phone}" aria-label="${label} ${name}에게 문자">✉️</a>
      </span>
    </div>`;
}

export function mount(el, w) {
  const groomRows = [
    contactRow('신랑', w.groom.name, w.groom.phone),
    contactRow('신랑 아버지', w.groom.father.name, w.groom.father.phone),
    contactRow('신랑 어머니', w.groom.mother.name, w.groom.mother.phone),
  ].join('');
  const brideRows = [
    contactRow('신부', w.bride.name, w.bride.phone),
    contactRow('신부 아버지', w.bride.father.name, w.bride.father.phone),
    contactRow('신부 어머니', w.bride.mother.name, w.bride.mother.phone),
  ].join('');

  el.innerHTML = `
    <p class="sec-label">Contact</p>
    <h2 class="sec-title">축하 인사 전하기</h2>
    <div class="contact-card"><h3>신랑측</h3>${groomRows}</div>
    <div class="contact-card"><h3>신부측</h3>${brideRows}</div>
  `;
}
