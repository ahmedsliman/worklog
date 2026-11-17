# Worklog

A timesheet app for tracking working hours and time off. Supports bulk editing and public holidays by German region.

[Try the demo](https://worklog-demo.ahmedsliman.workers.dev) — entries are saved in your browser.

Built with Next.js, TypeScript, Tailwind CSS, Symfony, API Platform, and PostgreSQL.

## Run locally

Requires Docker and Docker Compose.

```sh
docker compose build
docker compose up -d
```

Open [localhost](https://localhost). [API docs](https://localhost/docs) are available too. You may need to accept the local HTTPS certificate.

Run tests with `make test` while the containers are running.

The hosted demo runs entirely in the browser. The local app uses the PHP API and PostgreSQL; neither version has user accounts.

To build the hosted demo, install the `pwa/` dependencies, then run `npm ci && npm run build` in `demo/`. Deploy with `npm run deploy`.

[MIT license](LICENSE).
