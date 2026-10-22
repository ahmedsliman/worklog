import { FC } from 'react';

import {
  formatDayLabel,
  HOLIDAY_CLASSES,
  isEditable,
  isWeekend,
  OFF_META,
  toDate,
  WEEKEND_CLASSES,
} from '@/lib/timesheet';
import { cn } from '@/lib/utils';
import { Day } from '@/types/Day';

type Props = {
  day: Day;
  selected: boolean;
  onToggle: (day: Day) => void;
};

const getStateClasses = (day: Day, weekend: boolean): string => {
  if (day.off) {
    return OFF_META[day.off.value].classes;
  }

  if (day.publicHoliday) {
    return HOLIDAY_CLASSES;
  }

  if (weekend) {
    return WEEKEND_CLASSES;
  }

  return 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50';
};

export const DayCell: FC<Props> = ({ day, selected, onToggle }) => {
  const date = toDate(day);
  const tooltip = [formatDayLabel(day), day.publicHoliday?.value]
    .filter(Boolean)
    .join(', ');

  return (
    <button
      aria-pressed={selected}
      className={cn(
        'flex min-h-14 flex-col rounded border p-1 text-left sm:min-h-16',
        getStateClasses(day, isWeekend(date)),
        selected && 'ring-2 ring-slate-800 ring-offset-1',
      )}
      data-testid={`day-${day.date?.slice(0, 10)}`}
      disabled={!isEditable(day)}
      onClick={() => onToggle(day)}
      title={tooltip}
      type="button"
    >
      <span className="text-xs">{date.getUTCDate()}</span>

      <span className="mt-auto flex w-full flex-col">
        {day.hours !== undefined && (
          <span className="text-sm font-semibold">{day.hours} h</span>
        )}

        {day.off && (
          <span className="truncate text-xs">
            {OFF_META[day.off.value].label}
          </span>
        )}

        {day.publicHoliday && (
          <span className="line-clamp-2 break-words text-xs leading-tight">
            {day.publicHoliday.value}
          </span>
        )}
      </span>
    </button>
  );
};
