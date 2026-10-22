import Link from 'next/link';
import { FC, useState } from 'react';

import {
  getDaysOfMonth,
  HOLIDAY_CLASSES,
  isEditable,
  MONTHS,
  OFF_META,
  WEEKEND_CLASSES,
} from '@/lib/timesheet';
import { cn } from '@/lib/utils';
import { Day } from '@/types/Day';
import { Year } from '@/types/Year';

import { DayFormDialog } from './DayFormDialog';
import { MonthGrid } from './MonthGrid';

const LEGEND = [
  { label: 'Weekend', classes: WEEKEND_CLASSES },
  { label: 'Public holiday', classes: HOLIDAY_CLASSES },
  ...Object.values(OFF_META),
];

const idOf = (day: Day) => day['@id'] ?? '';

type Props = {
  year: Year;
};

export const YearDetail: FC<Props> = ({ year }) => {
  const days = year.days ?? [];

  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);

  const isSelected = (day: Day) => selection.has(idOf(day));

  const toggle = (day: Day) => {
    setSelection((current) => {
      const next = new Set(current);

      if (!next.delete(idOf(day))) {
        next.add(idOf(day));
      }

      return next;
    });
  };

  const first = days.findIndex(isSelected);
  const last = days.findLastIndex(isSelected);
  const daysInRange = days.slice(first, last + 1).filter(isEditable);

  const selectRange = () => setSelection(new Set(daysInRange.map(idOf)));

  const closeDialog = () => {
    setIsEditing(false);
    setSelection(new Set());
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <header>
        <Link className="text-sm text-slate-600 hover:text-slate-800" href="/">
          ← All timesheets
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-800">
          {year.year} {year.region?.value}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Select days, then click Edit selected. For a range, select the first
          and last day.
        </p>
      </header>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
        {LEGEND.map(({ label, classes }) => (
          <li className="flex items-center gap-2" key={label}>
            <span
              aria-hidden="true"
              className={cn('size-3 rounded-sm border', classes)}
            />
            {label}
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MONTHS.map((name, index) => (
          <MonthGrid
            days={getDaysOfMonth(days, index)}
            isSelected={isSelected}
            key={name}
            name={name}
            onToggle={toggle}
          />
        ))}
      </div>

      {selection.size > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 bg-slate-800">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm text-white" role="status">
              {selection.size === 1
                ? '1 day selected'
                : `${selection.size} days selected`}
            </p>

            <div className="flex items-center gap-2">
              {daysInRange.length > selection.size && (
                <button
                  className="rounded-md border border-slate-500 px-4 py-2 text-sm text-white hover:bg-slate-700"
                  onClick={selectRange}
                  type="button"
                >
                  Select days in between
                </button>
              )}
              <button
                className="rounded-md border border-slate-500 px-4 py-2 text-sm text-white hover:bg-slate-700"
                onClick={() => setSelection(new Set())}
                type="button"
              >
                Clear
              </button>
              <button
                className="rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-lime-400"
                onClick={() => setIsEditing(true)}
                type="button"
              >
                Edit selected
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <DayFormDialog days={days.filter(isSelected)} onClose={closeDialog} />
      )}
    </div>
  );
};
