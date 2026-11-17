# Worklog

A timesheet app for tracking working hours and time off. Supports bulk editing and public holidays by German region.

Built with Next.js, TypeScript, Tailwind CSS, Symfony, API Platform, and PostgreSQL.

## Run locally

Requires Docker and Docker Compose.

```sh
docker compose build
docker compose up -d
```

Open [localhost](https://localhost). [API docs](https://localhost/docs) are available too. You may need to accept the local HTTPS certificate.

Run tests with `make test` while the containers are running.

Local demo only; no user accounts or access controls.

[MIT license](LICENSE).
