import { describe, it, expect } from 'vitest';
import { daysUntil, countdownParts, calendarWeeks } from '../lib/dday.js';

describe('daysUntil', () => {
  it('100일 전이면 100', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-08-06T23:59:00+09:00'))).toBe(100);
  });
  it('당일이면 0 (시간 무관)', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-11-14T23:00:00+09:00'))).toBe(0);
  });
  it('지났으면 음수', () => {
    expect(daysUntil('2026-11-14T12:30:00+09:00', new Date('2026-11-15T01:00:00+09:00'))).toBe(-1);
  });
});

describe('countdownParts', () => {
  it('1일 2시간 3분 4초 전', () => {
    expect(countdownParts('2026-11-14T12:30:00+09:00', new Date('2026-11-13T10:26:56+09:00')))
      .toEqual({ days: 1, hours: 2, minutes: 3, seconds: 4 });
  });
  it('지났으면 전부 0', () => {
    expect(countdownParts('2026-11-14T12:30:00+09:00', new Date('2026-11-20T00:00:00+09:00')))
      .toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe('calendarWeeks', () => {
  it('2026년 11월: 1일이 일요일, 30일이 월요일', () => {
    const weeks = calendarWeeks('2026-11-14T12:30:00+09:00');
    expect(weeks[0][0]).toBe(1);
    expect(weeks.at(-1)[1]).toBe(30);
    expect(weeks.flat().filter(Boolean).length).toBe(30);
  });
  it('모든 주는 7칸', () => {
    for (const w of calendarWeeks('2026-11-14T12:30:00+09:00')) expect(w).toHaveLength(7);
  });
});
