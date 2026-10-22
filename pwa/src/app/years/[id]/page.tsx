'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FC } from 'react';

import { YearDetail } from '@/components/YearDetail';
import { useYear } from '@/hooks/useTimesheets';

const YearPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: year, error, isLoading } = useYear(id);

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading...</p>;
  }

  if (error || !year) {
    return (
      <div className="text-sm text-red-700" role="alert">
        <p>Could not load this timesheet.</p>
        <Link className="text-slate-800 underline" href="/">
          Back to timesheets
        </Link>
      </div>
    );
  }

  return <YearDetail year={year} />;
};

export default YearPage;
