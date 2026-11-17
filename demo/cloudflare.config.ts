import { defineConfig } from "cf/config";

export default defineConfig({
  accountId: "3d7bcb0d186d3c90c0d1584f61169602",
  worker: {
    name: "worklog-demo",
    compatibilityDate: "2026-11-17",
    workersDev: true,
    assets: { notFoundHandling: "single-page-application" },
    observability: { enabled: true, traces: { enabled: true } },
  },
});
