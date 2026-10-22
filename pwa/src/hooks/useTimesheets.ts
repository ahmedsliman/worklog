import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { METHOD_POST } from '@/lib/constants';
import { customFetch } from '@/lib/dataAccess';
import { OFF_META } from '@/lib/timesheet';
import { PagedCollection } from '@/types/collection';
import { Day } from '@/types/Day';
import { OffValues } from '@/types/Off';
import { Region } from '@/types/Region';
import { Year } from '@/types/Year';

const yearsQueryKey = ['years'] as const;

const fetchCollection = async <TData>(path: string): Promise<TData[]> => {
  const response = await customFetch<PagedCollection<TData>>(path);

  return response?.data.member ?? [];
};

export const useYears = () =>
  useQuery({
    queryKey: yearsQueryKey,
    queryFn: () => fetchCollection<Year>('/years'),
  });

export const useRegions = () =>
  useQuery({
    queryKey: ['regions'],
    queryFn: () => fetchCollection<Region>('/regions'),
    staleTime: Infinity,
  });

export const useCreateYear = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: { year: number; region: string }) =>
      customFetch('/years', {
        method: METHOD_POST,
        body: JSON.stringify(values),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: yearsQueryKey }),
  });
};

export const useYear = (id: string) =>
  useQuery({
    queryKey: ['years', id],
    queryFn: async () => {
      const response = await customFetch<Year>(`/years/${id}`);

      return response?.data;
    },
  });

type UpdateDaysInput = {
  days: Day[];
  hours: number | null;
  off: OffValues | null;
};

export const useUpdateDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ days, hours, off }: UpdateDaysInput) =>
      customFetch('/days/bulk', {
        method: METHOD_POST,
        body: JSON.stringify({
          days: days.map((day) => day['@id']),
          hours,
          off: off && OFF_META[off].iri,
        }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: yearsQueryKey }),
  });
};
