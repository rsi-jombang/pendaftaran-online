# Roadmap Pengembangan — Aplikasi Pendaftaran Pasien Poli

Frontend: Vite + React + TypeScript · Backend: Laravel (REST API)

Roadmap disusun per fase agar development frontend & backend (dikerjakan sendiri oleh pemilik proyek) bisa berjalan paralel setelah kontrak API disepakati di Fase 0.

> **Cara pakai untuk vibecoding:** jangan copy satu Fase penuh sebagai satu prompt ke AI/OpenCode — pecah dulu jadi per-item checklist. Lihat **Section "Breakdown Siap-Prompt"** di bagian paling bawah dokumen ini untuk versi yang sudah dipecah granular dan siap copy-paste satu per satu.

---

## Fase 0 — Fondasi & Kontrak (Minggu 1)

**Tujuan:** Menyamakan kontrak antara frontend dan backend sebelum coding fitur, agar tidak ada blokir paralel.

- [ ] Finalisasi `design.md` (sudah selesai) → breakdown jadi komponen UI.
- [ ] Susun kontrak REST API (endpoint, request/response shape, status code) — sudah tersedia contohnya di `architecture.md` Section 4.3.1, sinkronkan dengan implementasi backend Laravel yang kamu kerjakan sendiri.
- [ ] Setup project Vite + React + TS: ESLint, Prettier, Tailwind, folder structure sesuai `architecture.md`.
- [ ] Setup Axios instance + TanStack Query + Zustand skeleton.
- [ ] Setup design token Tailwind (`tailwind.config.ts`) sesuai palet warna & tipografi di `design.md`.
- [ ] Setup CI dasar (lint + type-check + build) di GitHub Actions.
- [ ] Setup environment `.env.example`, konfirmasi CORS dengan backend.

**Output:** Repo siap jalan, `npm run dev` menampilkan shell app kosong dengan routing dasar.

---

## Fase 1 — Komponen UI Dasar & Design System (Minggu 2)

**Tujuan:** Bangun komponen reusable dulu sebelum halaman, supaya semua halaman konsisten & cepat disusun.

- [ ] `shared/components/ui`: Button, Input, Card, Badge, Modal/Drawer, Skeleton, StepIndicator.
- [ ] `shared/components/layout`: Navbar, Footer, PageTransition (Framer Motion wrapper).
- [ ] `shared/components/feedback`: LoadingSpinner, ErrorState, EmptyState.
- [ ] Setup animasi dasar (fade/slide page transition, hover card, button press) sesuai prinsip motion di `design.md`.
- [ ] (Opsional tapi direkomendasikan) Storybook untuk dokumentasi komponen secara visual.

**Output:** Component library internal siap dipakai, bisa didemokan terpisah dari alur bisnis.

---

## Fase 2 — Landing Page & Poli Publik (List + Detail) (Minggu 3)

> **Catatan:** urutan berubah dari versi sebelumnya — halaman poli (publik, informasi) sekarang dikerjakan **sebelum** Cek NIK, karena dari sisi alur, user melihat info poli dulu sebelum masuk ke proses verifikasi.

- [ ] `LandingPage`: hero, keunggulan, preview poli, footer.
- [ ] `features/poli`: `api.ts`, `hooks.ts` (`usePoliList`, `usePoliDetail`), `types.ts`, `mock.ts`.
- [ ] `PoliListPage` (publik, `/poli`, tanpa guard): grid card poli, search + filter kategori, empty state.
- [ ] `features/schedule`: `api.ts`, `hooks.ts` (`useDoctorSchedule`), `types.ts`, `mock.ts`.
- [ ] `PoliDetailPage` (publik, `/poli/:poliId`, tanpa guard, **tanpa form**): header, `DateChipSelector`, `DoctorCard` list dengan tombol "Daftar" per dokter tersedia.
- [ ] Tombol "Daftar" pada `DoctorCard` → simpan `pendingSelection` ke Zustand store → navigate ke `/cek-nik`.

**Output:** Landing → Semua Poli → Detail Poli berjalan end-to-end sebagai halaman publik murni informasi, tombol "Daftar" sudah terhubung ke alur berikutnya.

---

## Fase 3 — Cek NIK (Minggu 4)

- [ ] `features/nik`: `api.ts`, `hooks.ts` (`useCheckNik` mutation), `types.ts`, `mock.ts`.
- [ ] `NikCheckPage` (`/cek-nik`, guarded start of wizard, StepIndicator step 1/3): form input NIK + validasi (Zod), state hasil (terdaftar/belum), animasi expand hasil. Tampilkan ringkasan `pendingSelection` (jika ada) di atas form.
- [ ] Form registrasi pasien baru (modal/drawer) + integrasi `POST /api/patients`.
- [ ] Simpan hasil ke Zustand store (`patient`).
- [ ] Logic percabangan setelah sukses: kalau `pendingSelection` ada → navigate `/daftar`; kalau tidak ada → navigate `/poli`.
- [ ] Unit test: validasi format NIK, mock API cek NIK (skenario terdaftar/tidak/error).

**Output:** Alur Poli Publik → Cek NIK berjalan end-to-end, dengan percabangan navigasi yang benar.

---

## Fase 4 — Form Pendaftaran (Minggu 5)

> Halaman ini sekarang **terpisah** dari `PoliDetailPage` — dulunya digabung, sekarang jadi halaman guarded tersendiri.

- [ ] `features/registration`: `api.ts`, `hooks.ts` (`useSubmitRegistration` mutation), `types.ts`, `mock.ts`.
- [ ] `RegistrationFormPage` (`/daftar`, guarded, StepIndicator step 2/3): route guard (redirect `/poli` jika `pendingSelection` kosong, redirect `/cek-nik` jika `patient` kosong).
- [ ] `SelectionSummaryChip`: ringkasan poli/dokter/tanggal dari `pendingSelection`.
- [ ] `RegistrationForm` (React Hook Form + Zod): data pasien auto-terisi, field keluhan, metode kedatangan, checkbox persetujuan, sticky button mobile.
- [ ] Submit handler: mutation ke `POST /api/registrations`, error 422 mapping ke field form.
- [ ] Setelah sukses: simpan `registrationResult` ke Zustand, `clearPendingSelection()`, navigate ke `/status/:registrationId`.

**Output:** Alur inti pendaftaran (Poli Publik → Cek NIK → Form Pendaftaran) selesai dan bisa submit data nyata ke Laravel.

---

## Fase 5 — Status Pendaftaran (Minggu 6)

- [ ] `features/queue`: `getQueueStatus`, `useQueueStatus`.
- [ ] `RegistrationStatusPage` (`/status/:registrationId`, guarded, StepIndicator step 3/3): identitas pasien (NIK disamarkan), detail poli/dokter/jadwal, `QueueNumberDisplay` besar dengan animasi.
- [ ] Checkmark animation (Framer Motion path draw) saat halaman pertama muncul.
- [ ] Polling (`refetchInterval`, misal tiap 15–30 detik) — cukup untuk MVP.
- [ ] Tombol cetak/unduh bukti pendaftaran (`window.print()` styled).
- [ ] Route guard refresh-safe: fetch dari API berdasarkan `registrationId` di URL, tidak wajib bergantung ke Zustand saja.
- [ ] Tombol "Kembali ke Beranda" → `reset()` Zustand store, navigate ke `/`.

**Output:** Alur end-to-end lengkap (MVP): Landing → Poli Publik → Cek NIK → Form Pendaftaran → Status.

---

## Fase 6 — Polish, QA, & Aksesibilitas (Minggu 8)

- [ ] Review responsive di semua breakpoint (mobile-first, banyak pasien akses dari HP).
- [ ] Audit aksesibilitas: kontras warna, ukuran tap target, `prefers-reduced-motion`.
- [ ] Loading/error state di-review ulang untuk semua request (skeleton, retry button).
- [ ] Cross-browser testing (Chrome, Safari iOS — penting karena banyak pengguna mobile Indonesia pakai Safari/Chrome Android).
- [ ] Testing menyeluruh (Vitest + RTL) untuk hooks & komponen kritikal (form validasi, step flow).
- [ ] Performance pass: lazy load route, cek bundle size, optimasi gambar.

**Output:** Aplikasi siap UAT (User Acceptance Test) bersama pihak rumah sakit.

---

## Fase 7 — Realtime Upgrade (Opsional, Minggu 9+)

- [ ] Integrasi Laravel Echo + Pusher/Soketi untuk update posisi antrian tanpa polling.
- [ ] Notifikasi push/browser saat mendekati giliran (opsional, butuh service worker).
- [ ] Dashboard sederhana untuk staff loket memanggil antrian (bisa jadi app terpisah, di luar scope frontend pasien ini).

---

## Fase 8 — Deployment & Go-Live (Minggu 10)

- [ ] Setup hosting frontend (static hosting/CDN, mis. Nginx/Vercel/Netlify tergantung infrastruktur RS).
- [ ] Setup reverse proxy agar frontend & API Laravel satu domain (hindari isu CORS produksi).
- [ ] Setup monitoring error frontend (mis. Sentry) dan analytics dasar (opsional).
- [ ] Staging environment untuk UAT final sebelum production.
- [ ] Dokumentasi handover (README, cara deploy, environment variable).

---

## Ringkasan Timeline (indikatif, sesuaikan kapasitas tim)

| Fase | Durasi | Fokus |
|---|---|---|
| 0 | 1 minggu | Setup & kontrak API |
| 1 | 1 minggu | Component library |
| 2 | 1 minggu | Landing + Poli Publik (List + Detail) |
| 3 | 1 minggu | Cek NIK |
| 4 | 1 minggu | Form Pendaftaran (halaman baru, terpisah) |
| 5 | 1 minggu | Status Pendaftaran |
| 6 | 1 minggu | Polish, QA, Aksesibilitas |
| 7 | opsional | Realtime |
| 8 | 1 minggu | Deployment |

**Total estimasi MVP (Fase 0–6 + 8): ~8 minggu**, dengan asumsi backend Laravel dikembangkan paralel dan kontrak API sudah disepakati di Fase 0.

---

## Dependensi Kritis ke Backend Laravel (dikerjakan sendiri)

Agar frontend tidak terblokir menunggu backend selesai, prioritaskan endpoint berikut lebih dulu:

1. `GET /api/poli` dan `GET /api/poli/{id}` — dibutuhkan sejak Fase 2 (poli publik, sebelum cek NIK).
2. `GET /api/poli/{id}/schedules` — dibutuhkan Fase 2 (detail poli publik).
3. `POST /api/patients/check-nik` — dibutuhkan Fase 3.
4. `POST /api/registrations` — dibutuhkan Fase 4.
5. `GET /api/registrations/{id}` — dibutuhkan Fase 5.

Jika backend belum siap di fase terkait, frontend memakai **mock JSON sederhana** (lihat `architecture.md` Section 4.3.1) di `features/*/mock.ts` — sesuai aturan `AGENTS.md` Section 5, ditandai jelas dengan komentar `TODO: replace mock`.

---

## Breakdown Siap-Prompt (Vibecoding Checklist)

Setiap baris di bawah adalah **satu unit kerja yang idealnya jadi satu sesi prompt terpisah** ke OpenCode/DeepSeek — jangan digabung banyak sekaligus. Setelah tiap unit selesai, review dulu (cek terhadap Acceptance Criteria di `design.md` kalau berkaitan dengan halaman) sebelum lanjut ke unit berikutnya.

### Fase 0 — Setup (pecah jadi 3 prompt)
1. Init project Vite+React+TS, ESLint/Prettier, Tailwind + design token dari `design.md`.
2. Buat struktur folder kosong sesuai `architecture.md` (pages/, features/, shared/) + axios instance + queryClient + Zustand store skeleton (dengan `pendingSelection`).
3. Setup routing dasar (6 route: `/`, `/poli`, `/poli/:id`, `/cek-nik`, `/daftar`, `/status/:id`, placeholder page) + `.env.example`.

### Fase 1 — Component Library (pecah jadi 3 prompt)
1. `shared/components/ui`: Button, Input, Badge, Skeleton — sesuai Component Contract di `design.md` Section 2.5.
2. `shared/components/ui`: Card, StepIndicator + `shared/components/layout`: Navbar, Footer, PageTransition.
3. `shared/components/feedback`: LoadingSpinner, ErrorState, EmptyState.

### Fase 2 — Landing Page & Poli Publik (pecah jadi 6 prompt)
1. `LandingPage`: hero + navbar + footer (statis dulu, tanpa data API).
2. `features/poli` (api.ts, hooks.ts, types.ts, mock.ts) + `LandingPage` section keunggulan & preview poli (hubungkan ke `usePoliList`).
3. `PoliListPage` (`/poli`, publik): grid card + skeleton loading + search/filter + empty state.
4. `features/schedule` (api.ts, hooks.ts, types.ts, mock.ts).
5. `PoliDetailPage` (`/poli/:id`, publik) — header + breadcrumb + `DateChipSelector` (belum ada DoctorCard).
6. `DoctorCard` list + tombol "Daftar" per dokter → simpan `pendingSelection` ke Zustand → navigate `/cek-nik`.
   - Verifikasi terhadap Acceptance Criteria Halaman Landing, Daftar Semua Poli, dan Detail Poli di `design.md` sebelum lanjut Fase 3.

### Fase 3 — Cek NIK (pecah jadi 3 prompt)
1. `features/nik` (api.ts, hooks.ts, types.ts, mock.ts) + `NikCheckPage` form + validasi + ringkasan `pendingSelection` (jika ada).
2. State hasil cek NIK (terdaftar/belum) + form registrasi pasien baru + simpan `patient` ke Zustand.
3. Logic percabangan navigasi (ada `pendingSelection` → `/daftar`, tidak ada → `/poli`) + error handling + refresh-safe.
   - Verifikasi terhadap Acceptance Criteria Halaman Cek NIK.

### Fase 4 — Form Pendaftaran (pecah jadi 3 prompt)
1. `features/registration` (api.ts, hooks.ts, types.ts, mock.ts) + `RegistrationFormPage` kerangka + route guard (`pendingSelection`/`patient` kosong) + `SelectionSummaryChip`.
2. `RegistrationForm` lengkap: validasi Zod, field lengkap, checkbox persetujuan, sticky button mobile.
3. Submit handler: mutation, error 422 mapping, `clearPendingSelection()`, navigasi ke `/status/:id`.
   - Verifikasi terhadap Acceptance Criteria Halaman Form Pendaftaran sebelum lanjut.

### Fase 5 — Status Pendaftaran (pecah jadi 3 prompt)
1. `features/queue` (api.ts, hooks.ts dengan `refetchInterval`, types.ts, mock.ts).
2. `RegistrationStatusPage`: `QueueNumberDisplay` + checkmark animation + detail info (NIK masked).
3. Tombol cetak/unduh + route guard refresh-safe + reset store di tombol "Kembali ke Beranda".
   - Verifikasi terhadap Acceptance Criteria Halaman Status — **ini penanda MVP selesai**.

### Fase 6–8
Lebih cocok dikerjakan manual/review langsung (polish, testing, deployment) daripada full vibecoding — gunakan AI per-isu spesifik saja (misal "perbaiki kontras warna di komponen X"), bukan prompt besar sekaligus.