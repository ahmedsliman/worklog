import { FC } from 'react';

import { getLeadingBlanks, WEEKDAYS } from '@/lib/timesheet';
import { Day } from '@/types/Day';

import { DayCell } from './DayCell';

type Props = {
  name: string;
  days: Day[];
  isSelected: (day: Day) => boolean;
  onToggle: (day: Day) => void;
};

export const MonthGrid: FC<Props> = ({ name, days, isSelected, onToggle }) => (
  <section className="rounded-lg border border-slate-200 bg-white p-3">
    <h3 className="mb-2 text-sm font-semibold text-slate-800">{name}</h3>

    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((weekday) => (
        <div className="text-center text-xs text-slate-500" key={weekday}>
          {weekday}
        </div>
      ))}

      {Array.from({ length: getLeadingBlanks(days) }, (_, index) => (
        <div key={`blank-${index}`} />
      ))}

      {days.map((day) => (
        <DayCell
          day={day}
          key={day['@id']}
          onToggle={onToggle}
          selected={isSelected(day)}
        />
      ))}
    </div>
  </section>
);
