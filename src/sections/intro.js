import { formatDateKo } from '../data/wedding.js';

const BASE = import.meta.env.BASE_URL;

export function mount(el, w) {
  el.classList.add('intro');
  el.innerHTML = `
    <p class="intro-label fade" style="--d:0.2s">WEDDING INVITATION</p>
    <h1 class="intro-names fade" style="--d:0.6s">
      ${w.groom.name}<span class="amp">그리고</span>${w.bride.name}
    </h1>
    ${w.mainImage ? `<figure class="intro-photo fade" style="--d:1s"><img src="${BASE}images/${w.mainImage}" alt="${w.groom.name}과 ${w.bride.name}의 웨딩 사진" /></figure>` : ''}
    <p class="intro-date fade" style="--d:1.4s">${formatDateKo(w.datetime)}</p>
    <p class="intro-venue fade" style="--d:1.6s">${w.venue.name} ${w.venue.hall}</p>
  `;
}
