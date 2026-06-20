import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import type { Expense } from '@/types';

/** Today as a local 'yyyy-MM-dd' string (matches how expense dates are stored). */
export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/** Parse a stored 'yyyy-MM-dd' into a local Date (midnight local). */
export function parseDay(dateISO: string): Date {
  return parseISO(dateISO);
}

/** 'yyyy-MM' key for a given date. */
export function monthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

/** Human group label for a list section header. */
export function groupLabel(dateISO: string, now: Date = new Date()): string {
  const date = parseDay(dateISO);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  const diff = differenceInCalendarDays(now, date);
  if (diff > 0 && diff < 7) return format(date, 'EEEE'); // e.g. "Monday"
  if (date.getFullYear() === now.getFullYear()) return format(date, 'MMM d');
  return format(date, 'MMM d, yyyy');
}

export interface DateRange {
  start: Date;
  end: Date;
}

export function monthRange(ref: Date = new Date()): DateRange {
  return { start: startOfMonth(ref), end: endOfMonth(ref) };
}

/** Week range, Monday-start to match most budgeting mental models. */
export function weekRange(ref: Date = new Date()): DateRange {
  return {
    start: startOfWeek(ref, { weekStartsOn: 1 }),
    end: endOfWeek(ref, { weekStartsOn: 1 }),
  };
}

export function isInRange(dateISO: string, range: DateRange): boolean {
  const t = parseDay(dateISO).getTime();
  return t >= range.start.getTime() && t <= range.end.getTime();
}

export function isSameMonthKey(dateISO: string, key: string): boolean {
  return dateISO.slice(0, 7) === key;
}

export interface MonthSlot {
  monthKey: string;
  label: string;
}

/** The trailing 12 months ending with the month of `ref`, oldest first. */
export function last12Months(ref: Date = new Date()): MonthSlot[] {
  const start = startOfMonth(subMonths(ref, 11));
  const end = endOfMonth(ref);
  return eachMonthOfInterval({ start, end }).map((d) => ({
    monthKey: monthKey(d),
    label: format(d, 'MMM'),
  }));
}

export interface DayGroup {
  dateISO: string;
  label: string;
  expenses: Expense[];
}

/**
 * Group expenses by calendar day, days newest first and, within a day,
 * by createdAt newest first.
 */
export function groupExpensesByDay(expenses: Expense[], now: Date = new Date()): DayGroup[] {
  const byDay = new Map<string, Expense[]>();
  for (const e of expenses) {
    const list = byDay.get(e.date);
    if (list) list.push(e);
    else byDay.set(e.date, [e]);
  }
  return [...byDay.entries()]
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([dateISO, list]) => ({
      dateISO,
      label: groupLabel(dateISO, now),
      expenses: list.sort((a, b) => b.createdAt - a.createdAt),
    }));
}
