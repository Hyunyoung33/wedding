// 비밀 확인 페이지 — RSVP 명단 + 집계. ?admin=<키> 로 접속했을 때만 main.js가 호출.
import { getDb } from './firebase.js';

export async function mountAdmin(root, w) {
  root.innerHTML = '<p class="adm-loading">불러오는 중…</p>';
  const db = await getDb();
  if (!db) {
    root.innerHTML = '<p class="adm-loading">데이터베이스에 연결하지 못했어요.</p>';
    return;
  }
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore');

  let rows = [];
  try {
    const snap = await getDocs(query(collection(db, 'rsvp'), orderBy('createdAt', 'desc')));
    rows = snap.docs.map((d) => d.data());
  } catch (e) {
    root.innerHTML = '<p class="adm-loading">읽기 권한이 없어요. Firebase 규칙에서 rsvp read를 허용했는지 확인하세요.</p>';
    return;
  }

  const attending = rows.filter((r) => r.attending);
  const sum = (list) => list.reduce((n, r) => n + (r.count || 1), 0);
  const groom = attending.filter((r) => r.side === 'groom');
  const bride = attending.filter((r) => r.side === 'bride');
  const meal = attending.filter((r) => r.meal);

  const stat = (label, value) => `<div class="adm-stat"><span>${label}</span><strong>${value}</strong></div>`;
  const esc = (s) => String(s ?? '').replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

  const list = rows.length
    ? rows
        .map(
          (r) => `<tr>
        <td>${esc(r.name)}</td>
        <td>${r.side === 'groom' ? '신랑측' : '신부측'}</td>
        <td>${r.attending ? '참석' : '불참'}</td>
        <td>${r.attending ? (r.count || 1) + '명' : '-'}</td>
        <td>${r.attending ? (r.meal ? '식사O' : '식사X') : '-'}</td>
      </tr>`,
        )
        .join('')
    : '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px">아직 응답이 없어요</td></tr>';

  root.innerHTML = `
    <section class="adm">
      <h2 class="sec-title" style="margin-bottom:8px">참석 확인</h2>
      <p style="text-align:center;color:var(--muted);font-size:13px;margin-bottom:24px">${w.groom.name} · ${w.bride.name}</p>
      <div class="adm-stats">
        ${stat('총 참석 인원', sum(attending) + '명')}
        ${stat('신랑측', sum(groom) + '명')}
        ${stat('신부측', sum(bride) + '명')}
        ${stat('식사 인원', sum(meal) + '명')}
        ${stat('응답 수', rows.length + '건')}
        ${stat('불참', rows.filter((r) => !r.attending).length + '명')}
      </div>
      <table class="adm-table">
        <thead><tr><th>성함</th><th>구분</th><th>참석</th><th>인원</th><th>식사</th></tr></thead>
        <tbody>${list}</tbody>
      </table>
    </section>
  `;
}
