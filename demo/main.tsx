import { createRoot } from "react-dom/client";
import { QueryProvider } from "../pwa/src/components/QueryProvider";
import { YearList } from "../pwa/src/components/YearList";
import { YearDetail } from "../pwa/src/components/YearDetail";
import { useYear } from "../pwa/src/hooks/useTimesheets";
import { resetDemo } from "./dataAccess";
import "../pwa/src/styles/globals.css";

function Detail({ id }: { id: string }) {
  const { data, isLoading, error } = useYear(id);
  if (isLoading) return <p>Loading...</p>;
  if (error || !data)
    return (
      <p role="alert">
        This timesheet is not available in this browser.{" "}
        <a href="/">All timesheets</a>
      </p>
    );
  return <YearDetail year={data} />;
}

function Demo() {
  const id = new URLSearchParams(window.location.search).get("year");
  return (
    <main className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
      <aside className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <p>
          <strong>Worklog demo.</strong> Entries stay in this browser. Use
          sample data only.
        </p>
        <button
          className="underline"
          type="button"
          onClick={() => {
            if (
              window.confirm("Delete all demo entries saved in this browser?")
            ) {
              resetDemo();
              window.location.assign("/");
            }
          }}
        >
          Reset demo
        </button>
      </aside>
      {id ? <Detail id={id} /> : <YearList />}
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <Demo />
  </QueryProvider>,
);
