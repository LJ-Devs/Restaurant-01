/**
 * Opening-hours logic. Used when building the page AND in the visitor's
 * browser (for the "Aberto agora / Fechado agora" badge), so it must not
 * import anything that only works on the server.
 */

import type { WeeklyHours, Weekday } from '../config/types';

/** Monday first, as in Portugal. Index 0 = Monday … 6 = Sunday. */
export const WEEKDAYS: readonly Weekday[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY = 24 * 60;

/** "12:30" → 750 (minutes after midnight). */
export function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/** 750 → "12:30". Values after midnight wrap around (1500 → "01:00"). */
export function toTime(minutes: number): string {
  const m = ((minutes % DAY) + DAY) % DAY;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/**
 * Compact weekly schedule sent to the browser.
 * Index 0 = Monday. Each shift is [open, close] in minutes after midnight;
 * a close value above 1440 means the shift ends after midnight.
 */
export type Schedule = Array<Array<[number, number]>>;

export function toSchedule(hours: WeeklyHours): Schedule {
  return WEEKDAYS.map((day) =>
    hours[day]
      .map(({ open, close }): [number, number] => {
        const start = toMinutes(open);
        let end = toMinutes(close);
        if (end <= start) end += DAY;
        return [start, end];
      })
      .sort((a, b) => a[0] - b[0]),
  );
}

export interface OpenStatus {
  isOpen: boolean;
  /** When open: closing time, in minutes after today's midnight. */
  closesAt?: number;
  /** When closed: the next opening. */
  next?: { inDays: number; dayIndex: number; at: number };
}

/** Is the business open on `dayIndex` (0 = Monday) at `minutes` after midnight? */
export function getOpenStatus(schedule: Schedule, dayIndex: number, minutes: number): OpenStatus {
  for (const [start, end] of schedule[dayIndex]) {
    if (minutes >= start && minutes < end) return { isOpen: true, closesAt: end };
  }
  // A late shift from yesterday that continues after midnight
  const yesterday = (dayIndex + 6) % 7;
  for (const [, end] of schedule[yesterday]) {
    if (end > DAY && minutes < end - DAY) return { isOpen: true, closesAt: end - DAY };
  }
  for (let inDays = 0; inDays <= 7; inDays++) {
    const day = (dayIndex + inDays) % 7;
    const start = schedule[day].map(([s]) => s).find((s) => inDays > 0 || s > minutes);
    if (start !== undefined) return { isOpen: false, next: { inDays, dayIndex: day, at: start } };
  }
  return { isOpen: false };
}

/** Current weekday (0 = Monday) and minutes after midnight in Portugal (Europe/Lisbon). */
export function nowInLisbon(date: Date = new Date()): { dayIndex: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Lisbon',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '';
  const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
  return { dayIndex, minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')) };
}
