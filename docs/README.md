# Documentation

Dokumen desain disimpan sebagai Claude Docs (bukan di repository). Repository ini mengikuti versi terbaru dari dokumen berikut:

| Dokumen | Isi |
| --- | --- |
| [Architecture Document - Integrated HR Platform](https://claude.ai/artifact/6KCggEvUkxvUDKasDizvKg) | Stack, struktur monorepo, pola backend/frontend, deployment |
| [Data Contract dan Integration Specification](https://claude.ai/artifact/3KAnvR5sGP683fyAvWBU6x) | Entitas lintas aplikasi, jalur file dan API, versi kontrak |
| [Database Design - Integrated HR Platform](https://claude.ai/artifact/DrrDKbpt4N3xLeNTWzp7RK) | Schema database tiap aplikasi |
| [Roadmap and Time Estimate](https://claude.ai/artifact/XmsnWKPM1NTCWKbpDtvgGW) | Fase dan estimasi |
| SRS per aplikasi | HRIS, KPI/Performance, 360 Feedback, LMS/Training, PRISMA |

## Decisions Applied in This Skeleton

| Keputusan | Pilihan | Status di dokumen |
| --- | --- | --- |
| Runtime | Bun (workspaces), versi dipin di `.bun-version` | Diputuskan |
| Frontend | TanStack Start, SPA mode | Diputuskan |
| Backend | Elysia + Eden Treaty | Diputuskan |
| Validasi / Data Contract | TypeBox | Diputuskan (lihat hasil spike) |
| Database / ORM | PostgreSQL per aplikasi / Drizzle | Diputuskan |
| Authentication | Better Auth per aplikasi | Diputuskan (lihat hasil spike) |
| Deployment | Docker Compose di satu VPS | Diputuskan |
| UI | Tailwind CSS v4 + shadcn/ui di `packages/ui` | Rekomendasi |
| Lint/format | Biome | Pilihan skeleton (dokumen hanya menyebut "lint") |
| CI | GitHub Actions: lint, typecheck, test, build | Rekomendasi |

## Spike Verification Results (19 October 2026)

| Item | Hasil |
| --- | --- |
| TanStack Start (dev dan build) memakai Bun; build SPA berfungsi | Berhasil. Build menghasilkan `dist/client/_shell.html` + assets; diuji dengan Caddy (`try_files {path} /_shell.html`) dan Playwright. |
| TypeBox dengan TanStack Form | Berhasil lewat adapter `toStandardSchema()` di `@hr/data-contract`, karena TypeBox 0.34 belum mengimplementasikan Standard Schema. Format (`email`, `date`, `date-time`) didaftarkan di `src/v1/formats.ts` agar validasi di browser sama dengan di server. |
| Better Auth dengan Elysia, Drizzle, PostgreSQL; cookie lintas origin; pencabutan session | Berhasil untuk sign-up, sign-in, session setelah reload, dan sign-out (web :3001 → API :4001). Handler dipasang eksplisit di `/api/auth/*`; `.mount()` di root menelan semua 404. |
| Eden Treaty lintas package di monorepo | Berhasil: web mengimpor `type App` dari `@hr/<app>-api` dan `tsc` lulus. |
| Waktu `tsc` dengan 30–50 route Elysia | **Belum diukur.** Skeleton baru memiliki 2 route per aplikasi; ukur saat modul SRS pertama ditambahkan. |

## Open Items

- Kode error HTTP (`E401`, `E403`, `E404`, `E429`, `E500`) di `@hr/data-contract` adalah usulan dan belum tercantum di Data Contract v1.
- Plugin Better Auth (organization/admin, api-key untuk PRISMA, two-factor) ditambahkan sesuai SRS.
- Skema domain production, penyedia VPS, enkripsi backup, dan lokasi model lokal (GPU) belum diputuskan.
