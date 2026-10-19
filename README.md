# Integrated HR Platform

Monorepo lima aplikasi HR: **HRIS**, **KPI/Performance**, **360 Feedback**, **LMS/Training**, dan **PRISMA**.
Empat aplikasi pertama menjadi sumber data, sedangkan PRISMA mengintegrasikan dan menganalisis data tersebut.
Struktur dan keputusan teknis mengikuti *Architecture Document - Integrated HR Platform* (lihat [docs/](docs/README.md)).

## Stack

| Lapisan | Pilihan |
| --- | --- |
| Runtime dan package manager | Bun 1.4.2 (workspaces + catalog) |
| Frontend | TanStack Start (SPA mode), TanStack Router/Query/Form/Table, Tailwind CSS v4, shadcn/ui |
| Backend | Elysia + Eden Treaty, OpenAPI bawaan Elysia |
| Validasi dan Data Contract | TypeBox |
| Database | PostgreSQL 17, satu database per aplikasi, Drizzle ORM |
| Authentication | Better Auth (session cookie httpOnly) per aplikasi |
| Lint dan format | Biome |
| Deployment | Docker Compose di satu VPS, Caddy untuk file statis dan reverse proxy |

## Structure

```
apps/
  hris/            api (Elysia) + web (TanStack Start SPA)
  kpi/             api + web
  feedback-360/    api + web (AI pipeline di api/src/modules/ai)
  lms/             api + web
  prisma/          api + web
packages/
  data-contract/   schema TypeBox bersama (versioned, src/v1) + fixture karyawan demo
  ui/              komponen shadcn/ui bersama + globals.css
  config/          tsconfig bersama
infra/             compose.yml (development), compose.prod.yml, Caddyfile, Dockerfile, init database
docs/              indeks dokumen desain dan keputusan
```

Aturan monorepo:

- Aplikasi **tidak saling mengimpor kode**. Komunikasi antar aplikasi hanya lewat API (`/v1`) dan file export.
- `packages/` hanya berisi library bersama, bukan layanan dan bukan logika bisnis domain.
- `@hr/data-contract` adalah satu-satunya tempat definisi entity lintas aplikasi (misalnya `employee_id`).
- Frontend hanya mengimpor **tipe** `App` dari API miliknya sendiri, untuk Eden Treaty.
- Versi dependency dipin **exact** di satu tempat: `workspaces.catalog` pada `package.json` root. Package memakai `"catalog:"`.

## Development Ports

| Aplikasi | API | Web | Database |
| --- | --- | --- | --- |
| HRIS | 4001 | 3001 | `hris` |
| KPI/Performance | 4002 | 3002 | `kpi` |
| 360 Feedback | 4003 | 3003 | `feedback_360` |
| LMS/Training | 4004 | 3004 | `lms` |
| PRISMA | 4005 | 3005 | `prisma` |

Layanan pendukung: PostgreSQL `5432`, Mailpit SMTP `1025` / UI `8025`, MinIO opsional `9000`/`9001` (`--profile storage`).

## Getting Started

Prasyarat: Bun 1.4.2 dan Docker (pengguna Windows memakai WSL2).

```bash
bun install
bun run infra:up                    # PostgreSQL (5 database) + Mailpit

# Salin env tiap API lalu isi BETTER_AUTH_SECRET (openssl rand -base64 32)
for app in hris kpi feedback-360 lms prisma; do cp apps/$app/api/.env.example apps/$app/api/.env; done

bun run db:migrate                  # migrasi Drizzle kelima aplikasi
bun run db:seed                     # 20 karyawan demo dari @hr/data-contract/fixtures
bun run dev:hris                    # atau `bun run dev` untuk semua aplikasi
```

Buka http://localhost:3001. Belum ada halaman registrasi; buat user pertama lewat API:

```bash
curl -X POST http://localhost:4001/api/auth/sign-up/email \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:3001' \
  -d '{"name":"Admin HR","email":"admin@example.com","password":"password123"}'
```

Dokumentasi OpenAPI tiap API tersedia di `http://localhost:400N/openapi`.

## Root Scripts

| Script | Fungsi |
| --- | --- |
| `infra:up` / `infra:down` | Menjalankan / menghentikan layanan pendukung |
| `db:migrate` / `db:seed` | Migrasi dan seed kelima database |
| `dev`, `dev:<app>` | Menjalankan API dan web (semua atau satu aplikasi) |
| `lint`, `format` | Biome check / perbaikan otomatis |
| `typecheck`, `test`, `build` | Dijalankan untuk semua workspace (juga di CI) |

Script per API: `db:generate` (membuat migrasi dari schema Drizzle) dan `auth:generate` (meregenerasi schema Better Auth setelah plugin berubah).

## Backend Pattern (`apps/<app>/api/src`)

```
index.ts        listen; app.ts membangun app dan mengekspor `type App`
env.ts          env divalidasi TypeBox (gagal cepat saat start)
auth.ts         konfigurasi Better Auth
modules/<domain>/routes.ts   route tipis (plugin Elysia per domain)
modules/<domain>/service.ts  logika bisnis, tanpa dependensi Elysia
modules/<domain>/schema.ts   schema request/response TypeBox
plugins/        error (format error Data Contract), logger (pino), auth (macro `auth: true`)
db/             schema Drizzle, migrations/, migrate.ts, seed.ts
```

- Semua endpoint domain berada di bawah prefix `/v1`. Handler Better Auth berada di `/api/auth/*`.
- Error selalu berbentuk `{ "error": { "code", "message", "field?" } }`, dengan `message` dalam bahasa Indonesia.
- Rantai `.use()`/route jangan diputus agar tipe `App` untuk Eden Treaty tetap utuh.
- Contoh modul: `health` (publik) dan `me` (butuh session).

## Frontend Pattern (`apps/<app>/web/src`)

- `lib/api.ts`: client Eden Treaty (`credentials: 'include'`). `lib/auth-client.ts`: client Better Auth.
- `routes/_authed.tsx`: auth guard level route. Semua halaman yang membutuhkan login berada di `routes/_authed/`.
- Form memakai TanStack Form dengan schema TypeBox lewat `toStandardSchema()` dari `@hr/data-contract`.
- `routeTree.gen.ts` dibuat otomatis oleh router plugin saat `dev`/`build` dan di-commit.
- Hasil build berupa file statis di `dist/client` dengan `_shell.html` sebagai fallback SPA.

## Deployment

Lihat komentar di `infra/compose.prod.yml`. Ringkasnya: salin `infra/env/*.env.example` menjadi `*.env`, isi nilai production,
lalu jalankan `docker compose -f infra/compose.prod.yml --env-file infra/env/caddy.env up -d --build`, diikuti migrasi per API.
