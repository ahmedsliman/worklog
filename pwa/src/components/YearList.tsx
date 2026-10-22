'use client';

import Link from 'next/link';
import { FC } from 'react';

import { useYears } from '@/hooks/useTimesheets';
import { getId } from '@/lib/dataAccess';

import { CreateYearForm } from './CreateYearForm';

export const YearList: FC = () => {
  const { data: years, error, isLoading } = useYears();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-800">Timesheets</h1>
        <p className="mt-2 text-sm text-slate-600">
          Create a timesheet per year, then record hours and days off.
        </p>
      </header>

      <CreateYearForm />

      {isLoading && (
        <p className="text-sm text-slate-600" data-testid="years-loading">
          Loading...
        </p>
      )}

      {error && (
        <p
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          Could not load the timesheets.
        </p>
      )}

      {!isLoading && !error && years?.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 px-6 py-10 text-center text-sm text-slate-600">
          No timesheets yet. Pick a year and a region above to create one.
        </p>
      )}

      {years && years.length > 0 && (
        <ul className="flex flex-col gap-3">
          {years.map((year) => (
            <li key={year['@id']}>
              <Link
                className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 hover:border-slate-400 hover:bg-slate-50"
                href={`/years/${getId(year['@id'])}`}
              >
                <span className="text-2xl font-bold text-slate-800">
                  {year.year}
                </span>
                <span className="text-sm text-slate-600">
                  {year.region?.value}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
