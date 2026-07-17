const DAY = 86400000;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// 예식일까지 남은 일수. 당일 0, 지났으면 음수.
export function daysUntil(iso, now = new Date()) {
  return Math.round((startOfDay(new Date(iso)) - startOfDay(now)) / DAY);
}

// 실시간 카운트다운용. 지났으면 전부 0.
export function countdownParts(iso, now = new Date()) {
  let ms = Math.max(0, new Date(iso) - now);
  const days = Math.floor(ms / DAY);
  ms -= days * DAY;
  const hours = Math.floor(ms / 3600000);
  ms -= hours * 3600000;
  const minutes = Math.floor(ms / 60000);
  ms -= minutes * 60000;
  return { days, hours, minutes, seconds: Math.floor(ms / 1000) };
}

// 예식 월의 달력 그리드. 앞뒤 빈칸은 0.
export function calendarWeeks(iso) {
  const d = new Date(iso);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const cells = Array(first.getDay()).fill(0);
  for (let i = 1; i <= last.getDate(); i++) cells.push(i);
  while (cells.length % 7) cells.push(0);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
