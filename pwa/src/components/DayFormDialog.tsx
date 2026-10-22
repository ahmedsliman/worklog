import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useUpdateDays } from '@/hooks/useTimesheets';
import { FIELD_CLASS, formatDayLabel, OFF_META } from '@/lib/timesheet';
import { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';

const WORK = 'work';
const MAX_HOURS = 10;

const TYPES = [
  { value: WORK, label: 'Hours worked' },
  { value: OffValues.vacation, label: OFF_META[OffValues.vacation].label },
  { value: OffValues.sick, label: OFF_META[OffValues.sick].label },
] as const;

const schema = z
  .object({
    type: z.enum([WORK, OffValues.vacation, OffValues.sick]),
    hours: z.string().optional(),
  })
  .refine(
    ({ type, hours }) => {
      if (type !== WORK) {
        return true;
      }

      const value = Number(hours);

      return (
        Boolean(hours?.trim()) &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= MAX_HOURS
      );
    },
    { message: `Enter 0 to ${MAX_HOURS} hours`, path: ['hours'] },
  );

type FormValues = z.infer<typeof schema>;

type Props = {
  days: Day[];
  onClose: () => void;
};

const toFormValues = (day: Day): FormValues => ({
  type: day.off?.value ?? WORK,
  hours: String(day.hours ?? 8),
});

const getDefaultValues = (days: Day[]): FormValues => {
  const [first, ...rest] = days.map(toFormValues);
  const isSame = rest.every(
    (values) => values.type === first.type && values.hours === first.hours,
  );

  return isSame ? first : { type: WORK, hours: '8' };
};

export const DayFormDialog: FC<Props> = ({ days, onClose }) => {
  const updateDays = useUpdateDays();
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm<FormValues>({
    defaultValues: getDefaultValues(days),
    resolver: zodResolver(schema),
  });
  const isWork = watch('type') === WORK;
  const hasEntry = days.some(
    (day) => day.off !== undefined || day.hours !== undefined,
  );

  const clear = () =>
    updateDays.mutate({ days, hours: null, off: null }, { onSuccess: onClose });

  const onSubmit = ({ type, hours }: FormValues) =>
    updateDays.mutate(
      {
        days,
        hours: type === WORK ? Number(hours) : null,
        off: type === WORK ? null : type,
      },
      { onSuccess: onClose },
    );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        type="button"
      />

      <form
        aria-labelledby="day-dialog-title"
        aria-modal="true"
        className="relative flex w-full max-w-md flex-col gap-4 rounded-lg bg-white p-6 shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
        role="dialog"
      >
        <div>
          <h2
            className="text-lg font-bold text-slate-800"
            id="day-dialog-title"
          >
            {days.length === 1 ? 'Edit day' : `Edit ${days.length} days`}
          </h2>
          <p className="text-sm text-slate-600">
            {days.length === 1
              ? formatDayLabel(days[0])
              : 'Applies to all selected days.'}
          </p>
        </div>

        <fieldset className="flex gap-4">
          <legend className="mb-1 text-sm text-slate-700">Type</legend>
          {TYPES.map(({ value, label }) => (
            <label
              className="flex items-center gap-2 text-sm text-slate-800"
              key={value}
            >
              <input type="radio" value={value} {...register('type')} />
              {label}
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700" htmlFor="hours">
            Hours
          </label>
          <input
            autoFocus
            className={FIELD_CLASS}
            disabled={!isWork}
            id="hours"
            type="number"
            {...register('hours')}
          />
          {isWork && errors.hours && (
            <span className="text-xs text-red-700" role="alert">
              {errors.hours.message}
            </span>
          )}
        </div>

        {updateDays.error && (
          <p className="text-sm text-red-700" role="alert">
            Could not save. Please try again.
          </p>
        )}

        <div className="flex justify-end gap-2">
          {hasEntry && (
            <button
              className="mr-auto rounded-md px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
              disabled={updateDays.isPending}
              onClick={clear}
              type="button"
            >
              Clear entry
            </button>
          )}
          <button
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-lime-400 disabled:opacity-50"
            disabled={updateDays.isPending}
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
