import calendar from "./calendar.json";
import { UnprocessableEntityError } from "../pwa/src/types/error";
import type { Year } from "../pwa/src/types/Year";
import type { Day } from "../pwa/src/types/Day";

const STORAGE_KEY = "worklog-demo-v1";
const holidays: Record<
  string,
  Record<string, { "@id": string; value: string }>
> = calendar.holidays;

const load = (): Year[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return [];
  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const save = (years: Year[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(years));

export const getId = (iri?: string) => iri?.split("/").pop() ?? "";

export const resetDemo = () => localStorage.removeItem(STORAGE_KEY);

const createYear = (year: number, regionIri: string, years: Year[]): Year => {
  const region = calendar.regions.find((entry) => entry["@id"] === regionIri);
  if (!region || !Number.isInteger(year) || year < 2020 || year > 2030) {
    throw new UnprocessableEntityError("Choose a valid year and region.");
  }
  if (
    years.some(
      (entry) => entry.year === year && entry.region?.["@id"] === regionIri,
    )
  ) {
    throw new UnprocessableEntityError(
      "This region already has a timesheet for that year.",
    );
  }
  const id = crypto.randomUUID();
  const days: Day[] = [];
  for (
    let date = new Date(Date.UTC(year, 0, 1));
    date.getUTCFullYear() === year;
    date.setUTCDate(date.getUTCDate() + 1)
  ) {
    const day = date.toISOString().slice(0, 10);
    days.push({
      "@id": `/days/${id}-${day}`,
      date: `${day}T00:00:00+00:00`,
      publicHoliday: holidays[regionIri]?.[day],
    });
  }
  return { "@id": `/years/${id}`, year, region, days };
};

export const customFetch = async <TData>(
  path: string,
  init: RequestInit = {},
): Promise<{ data: TData } | undefined> => {
  const years = load();
  let data: unknown;
  if (path === "/regions") {
    data = { member: calendar.regions };
  } else if (path === "/years" && init.method === "POST") {
    const input = JSON.parse(String(init.body));
    const year = createYear(input.year, input.region, years);
    save([...years, year]);
    data = year;
  } else if (path === "/years") {
    data = { member: years.map(({ days: _days, ...year }) => year) };
  } else if (path.startsWith("/years/")) {
    data = years.find((year) => year["@id"] === path);
    if (!data) throw new Error("Timesheet not found in this browser.");
  } else if (path === "/days/bulk" && init.method === "POST") {
    const input = JSON.parse(String(init.body));
    if (
      input.hours !== null &&
      (!Number.isInteger(input.hours) || input.hours < 0 || input.hours > 10)
    ) {
      throw new UnprocessableEntityError("Enter 0 to 10 hours");
    }
    if (
      input.off !== null &&
      !["/offs/VACATION", "/offs/SICK"].includes(input.off)
    ) {
      throw new UnprocessableEntityError("Choose a valid type of time off.");
    }
    const selected = new Set(input.days);
    for (const year of years) {
      for (const day of year.days ?? []) {
        if (!selected.has(day["@id"])) continue;
        day.hours = input.off ? undefined : (input.hours ?? undefined);
        day.off = input.off
          ? ({
              "@id": input.off,
              value: input.off === "/offs/VACATION" ? "Urlaub" : "Krank",
            } as Day["off"])
          : undefined;
      }
    }
    save(years);
    return;
  } else {
    throw new Error("Unsupported demo operation.");
  }
  return { data: data as TData };
};
