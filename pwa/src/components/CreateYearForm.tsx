import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useCreateYear, useRegions } from '@/hooks/useTimesheets';
import { FIELD_CLASS } from '@/lib/timesheet';
import { UnprocessableEntityError } from '@/types/error';

const YEAR_MIN = 2020;
const YEAR_MAX = 2030;

const YEARS = Array.from(
  { length: YEAR_MAX - YEAR_MIN + 1 },
  (_, index) => YEAR_MIN + index,
);

const schema = z.object({
  year: z.string().min(1, 'Choose a year'),
  region: z.string().min(1, 'Choose a region'),
});

type FormValues = z.infer<typeof schema>;

export const CreateYearForm: FC = () => {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<FormValues>({
    defaultValues: { year: '', region: '' },
    resolver: zodResolver(schema),
  });
  const { data: regions, isLoading: isLoadingRegions } = useRegions();
  const createYear = useCreateYear();

  const onSubmit = (values: FormValues) => {
    createYear.mutate(
      { region: values.region, year: Number(values.year) },
      {
        onSuccess: () => reset(),
        onError: (error) =>
          error instanceof UnprocessableEntityError
            ? setError('year', {
                message: 'This region already has a timesheet for that year.',
              })
            : setError('root', { message: 'Could not create the timesheet.' }),
      },
    );
  };

  return (
    <form
      className="rounded-lg border border-slate-200 bg-white p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="mb-4 text-base font-semibold text-slate-800">
        New timesheet
      </h2>

      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700" htmlFor="year">
            Year
          </label>
          <select className={FIELD_CLASS} id="year" {...register('year')}>
            <option value="">Select year</option>
            {YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.year && (
            <span className="text-xs text-red-700" role="alert">
              {errors.year.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-700" htmlFor="region">
            Region
          </label>
          <select
            className={FIELD_CLASS}
            disabled={isLoadingRegions}
            id="region"
            {...register('region')}
          >
            <option value="">Select region</option>
            {regions?.map((region) => (
              <option key={region['@id']} value={region['@id']}>
                {region.value}
              </option>
            ))}
          </select>
          {errors.region && (
            <span className="text-xs text-red-700" role="alert">
              {errors.region.message}
            </span>
          )}
        </div>

        <button
          className="h-10 rounded-md bg-lime-300 px-4 text-sm font-semibold text-slate-800 hover:bg-lime-400 disabled:opacity-50"
          disabled={createYear.isPending}
          type="submit"
        >
          {createYear.isPending ? 'Creating...' : 'Create timesheet'}
        </button>
      </div>

      {errors.root && (
        <p className="mt-4 text-sm text-red-700" role="alert">
          {errors.root.message}
        </p>
      )}
    </form>
  );
};
