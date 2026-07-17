export function mount(el, w) {
  const line = (person) =>
    `<p class="parents-line">${[person.father.name, person.mother.name].filter(Boolean).join(' · ')}<small>의 ${person.order}</small> <strong>${person.name.slice(1) || person.name}</strong></p>`;

  el.innerHTML = `
    <p class="sec-label">Invitation</p>
    <h2 class="sec-title">${w.greeting.title}</h2>
    <p class="greeting-msg">${w.greeting.message.replaceAll('\n', '<br>')}</p>
    <div class="parents">
      ${line(w.groom)}
      ${line(w.bride)}
    </div>
  `;
}
