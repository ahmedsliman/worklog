import { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

const LOCALE = 'en-GB';

export const FIELD_CLASS =
  'h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 disabled:bg-slate-100';

export const WEEKEND_CLASSES = 'border-slate-200 bg-slate-100 text-slate-500';
export const HOLIDAY_CLASSES = 'border-sky-300 bg-sky-200 text-sky-900';

export const OFF_META: Record<
  OffValues,
  { label: string; iri: string; classes: string }
> = {
  [OffValues.vacation]: {
    label: 'Vacation',
    iri: '/offs/VACATION',
    classes: 'border-emerald-300 bg-emerald-200 text-emerald-900',
  },
  [OffValues.sick]: {
    label: 'Sick',
    iri: '/offs/SICK',
    classes: 'border-rose-300 bg-rose-200 text-rose-900',
  },
};

export const toDate = (day: Day): Date => new Date(day.date ?? '');

export const isWeekend = (date: Date): boolean => {
  const day = date.getUTCDay();

  return day === 0 || day === 6;
};

export const isEditable = (day: Day): boolean =>
  !isWeekend(toDate(day)) && !day.publicHoliday;

export const formatDayLabel = (day: Day): string =>
  new Intl.DateTimeFormat(LOCALE, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(toDate(day));

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const getDaysOfMonth = (days: Day[], month: number): Day[] =>
  days.filter((day) => toDate(day).getUTCMonth() === month);

export const getLeadingBlanks = (days: Day[]): number =>
  (toDate(days[0]).getUTCDay() + 6) % 7;
