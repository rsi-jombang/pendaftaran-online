# Roadmap Pengembangan — Aplikasi Pendaftaran Pasien Poli

Frontend: Vite + React + TypeScript · Backend: Laravel (REST API)

Roadmap disusun per fase agar development frontend & backend (dikerjakan sendiri oleh pemilik proyek) bisa berjalan paralel setelah kontrak API disepakati di Fase 0.

> **Cara pakai untuk vibecoding:** jangan copy satu Fase penuh sebagai satu prompt ke AI/OpenCode — pecah dulu jadi per-item checklist. Lihat **Section "Breakdown Siap-Prompt"** di bagian paling bawah dokumen ini untuk versi yang sudah dipecah granular dan siap copy-paste satu per satu.

---

## Fase 0 — Fondasi & Kontrak

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

## Fase 1 — Komponen UI Dasar & Design System

**Tujuan:** Bangun komponen reusable dulu sebelum halaman, supaya semua halaman konsisten & cepat disusun.

- [ ] `shared/components/ui`: Button, Input, Card, Badge, Modal/Drawer, Skeleton, StepIndicator.
- [ ] `shared/components/layout`: Navbar, Footer, PageTransition (Framer Motion wrapper).
- [ ] `shared/components/feedback`: LoadingSpinner, ErrorState, EmptyState.
- [ ] Setup animasi dasar (fade/slide page transition, hover card, button press) sesuai prinsip motion di `design.md`.
- [ ] (Opsional tapi direkomendasikan) Storybook untuk dokumentasi komponen secara visual.

**Output:** Component library internal siap dipakai, bisa didemokan terpisah dari alur bisnis.

---

## Fase 2 — Landing Page & Cek NIK

- [ ] `LandingPage`: hero, keunggulan, preview poli, footer — statis (belum butuh API kompleks, kecuali preview poli via `GET /api/poli`).
- [ ] `features/nik`: `api.ts`, `hooks.ts` (`useCheckNik` mutation), `types.ts`.
- [ ] `NikCheckPage`: form input NIK + validasi (Zod), state hasil (terdaftar/belum), animasi expand hasil.
- [ ] Form registrasi pasien baru (modal/drawer) + integrasi `POST /api/patients`.
- [ ] Simpan hasil ke Zustand store (`registrationFlowStore`).
- [ ] Unit test: validasi format NIK, mock API cek NIK (skenario terdaftar/tidak/error).

**Output:** Alur Halaman 1 → 2 berjalan end-to-end dengan API asli (bukan mock) jika backend sudah siap endpoint terkait; jika belum, pakai MSW (Mock Service Worker) agar frontend tidak terblokir.

---

## Fase 3 — Daftar Poli

- [ ] `features/poli`: `getPoliList`, `usePoliList`.
- [ ] `PoliListPage`: grid card poli, search + filter kategori, empty state (poli tidak ditemukan).
- [ ] Animasi stagger fade-in grid, hover elevate card.
- [ ] Handling kuota penuh (card disabled state).
- [ ] Route guard: redirect ke `/cek-nik` jika `patient` belum ada di store.

**Output:** Halaman 3 selesai dan terhubung ke Halaman 2 & 4.

---

## Fase 4 — Detail Jadwal Poli & Form Pendaftaran

- [ ] `features/schedule`: `getDoctorSchedule`, `useDoctorSchedule` (query per tanggal).
- [ ] `PoliDetailPage`:
  - [ ] `DateChipSelector` (7 hari ke depan, horizontal scroll di mobile).
  - [ ] `DoctorCard` list per tanggal terpilih, state disabled untuk kuota penuh.
  - [ ] Transisi fade saat ganti tanggal.
- [ ] `RegistrationForm` (React Hook Form + Zod): ringkasan pilihan, field keluhan, checkbox persetujuan.
- [ ] `features/registration`: `submitRegistration`, `useSubmitRegistration` (mutation) → `POST /api/registrations`.
- [ ] Error handling 422 dari backend → mapping ke field form.
- [ ] Navigasi ke `/status/:registrationId` setelah sukses, simpan hasil ke Zustand.

**Output:** Alur inti pendaftaran (Halaman 3→4) selesai dan bisa submit data nyata ke Laravel.

---

## Fase 5 — Status Pendaftaran

- [ ] `features/queue`: `getQueueStatus`, `useQueueStatus`.
- [ ] `RegistrationStatusPage`: identitas pasien (NIK disamarkan), detail poli/dokter/jadwal, `QueueNumberDisplay` besar dengan animasi.
- [ ] Checkmark animation (Framer Motion path draw) saat halaman pertama muncul.
- [ ] Keputusan realtime: mulai dengan **polling** (`refetchInterval`, misal tiap 15–30 detik) — cukup untuk MVP.
- [ ] Tombol cetak/unduh bukti pendaftaran (PDF sederhana via `window.print()` styled, atau endpoint backend yang generate PDF).
- [ ] Route guard: jika akses langsung via URL dengan `registrationId` valid, fetch dari API (tidak wajib bergantung ke Zustand saja) — penting untuk refresh-safe.

**Output:** Alur end-to-end 5 halaman selesai (MVP lengkap).

---

## Fase 6 — Polish, QA, & Aksesibilitas

- [ ] Review responsive di semua breakpoint (mobile-first, banyak pasien akses dari HP).
- [ ] Audit aksesibilitas: kontras warna, ukuran tap target, `prefers-reduced-motion`.
- [ ] Loading/error state di-review ulang untuk semua request (skeleton, retry button).
- [ ] Cross-browser testing (Chrome, Safari iOS — penting karena banyak pengguna mobile Indonesia pakai Safari/Chrome Android).
- [ ] Testing menyeluruh (Vitest + RTL) untuk hooks & komponen kritikal (form validasi, step flow).
- [ ] Performance pass: lazy load route, cek bundle size, optimasi gambar.

**Output:** Aplikasi siap UAT (User Acceptance Test) bersama pihak rumah sakit.

---

## Fase 7 — Realtime Upgrade (Opsional)

- [ ] Integrasi Laravel Echo + Pusher/Soketi untuk update posisi antrian tanpa polling.
- [ ] Notifikasi push/browser saat mendekati giliran (opsional, butuh service worker).
- [ ] Dashboard sederhana untuk staff loket memanggil antrian (bisa jadi app terpisah, di luar scope frontend pasien ini).

---

## Fase 8 — Deployment & Go-Live

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
| 2 | 1 minggu | Landing + Cek NIK |
| 3 | 1 minggu | Daftar Poli |
| 4 | 2 minggu | Detail Jadwal + Form (paling kompleks) |
| 5 | 1 minggu | Status Pendaftaran |
| 6 | 1 minggu | Polish, QA, Aksesibilitas |
| 7 | opsional | Realtime |
| 8 | 1 minggu | Deployment |

**Total estimasi MVP (Fase 0–6 + 8): ~9 minggu**, dengan asumsi backend Laravel dikembangkan paralel dan kontrak API sudah disepakati di Fase 0.

---

## Dependensi Kritis ke Backend Laravel (dikerjakan sendiri)

Agar frontend tidak terblokir menunggu backend selesai, prioritaskan endpoint berikut lebih dulu:

1. `POST /api/patients/check-nik` — dibutuhkan sejak Fase 2.
2. `GET /api/poli` — dibutuhkan sejak Fase 2 (preview di landing) & Fase 3.
3. `GET /api/poli/{id}/schedules` — dibutuhkan Fase 4.
4. `POST /api/registrations` — dibutuhkan Fase 4.
5. `GET /api/registrations/{id}` — dibutuhkan Fase 5.

Jika backend belum siap di fase terkait, frontend memakai **mock JSON sederhana** (lihat `architecture.md` Section 4.3.1) di `features/*/mock.ts` — sesuai aturan `AGENTS.md` Section 5, ditandai jelas dengan komentar `TODO: replace mock`.

---

## Breakdown Siap-Prompt (Vibecoding Checklist)

Setiap baris di bawah adalah **satu unit kerja yang idealnya jadi satu sesi prompt terpisah** ke OpenCode/DeepSeek — jangan digabung banyak sekaligus. Setelah tiap unit selesai, review dulu (cek terhadap Acceptance Criteria di `design.md` kalau berkaitan dengan halaman) sebelum lanjut ke unit berikutnya.

### Fase 0 — Setup (pecah jadi 3 prompt)
1. Init project Vite+React+TS, ESLint/Prettier, Tailwind + design token dari `design.md`.
2. Buat struktur folder kosong sesuai `architecture.md` (pages/, features/, shared/) + axios instance + queryClient + Zustand store skeleton.
3. Setup routing dasar (5 route, placeholder page) + `.env.example`.

### Fase 1 — Component Library (pecah jadi 3 prompt)
1. `shared/components/ui`: Button, Input, Badge, Skeleton — sesuai Component Contract di `design.md` Section 2.5.
2. `shared/components/ui`: Card, StepIndicator + `shared/components/layout`: Navbar, Footer, PageTransition.
3. `shared/components/feedback`: LoadingSpinner, ErrorState, EmptyState.

### Fase 2 — Landing Page & Cek NIK (pecah jadi 4 prompt)
1. `LandingPage`: hero + navbar + footer (statis dulu, tanpa data API).
2. `LandingPage`: section keunggulan + preview poli (hubungkan ke `GET /api/poli` atau mock).
3. `features/nik` (api.ts, hooks.ts, types.ts, mock.ts) + `NikCheckPage` form + validasi.
4. State hasil cek NIK (terdaftar/belum) + form registrasi pasien baru + simpan ke Zustand + navigasi ke `/poli`.
   - Verifikasi terhadap Acceptance Criteria Halaman 2 di `design.md` sebelum lanjut Fase 3.

### Fase 3 — Daftar Poli (pecah jadi 3 prompt)
1. `features/poli` (api.ts, hooks.ts, types.ts, mock.ts).
2. `PoliListPage`: grid card + skeleton loading + search/filter.
3. Empty state, kuota penuh state, route guard, animasi stagger.
   - Verifikasi terhadap Acceptance Criteria Halaman 3.

### Fase 4 — Detail Jadwal & Form (fase terberat — pecah jadi 6 prompt, JANGAN digabung)
1. `features/schedule` (api.ts, hooks.ts, types.ts, mock.ts).
2. `PoliDetailPage` — header + `DateChipSelector` saja (belum ada dokter/form).
3. `DoctorCard` list + state pilih dokter + transisi fade antar tanggal.
4. `features/registration` (api.ts, hooks.ts, types.ts, mock.ts) + skeleton `RegistrationForm` (belum submit).
5. `RegistrationForm` lengkap: validasi Zod, ringkasan pilihan, checkbox persetujuan, sticky button mobile.
6. Submit handler: mutation, error 422 mapping, navigasi ke `/status/:id`.
   - Verifikasi terhadap Acceptance Criteria Halaman 4 sebelum lanjut.

### Fase 5 — Status Pendaftaran (pecah jadi 3 prompt)
1. `features/queue` (api.ts, hooks.ts dengan `refetchInterval`, types.ts, mock.ts).
2. `RegistrationStatusPage`: `QueueNumberDisplay` + checkmark animation + detail info (NIK masked).
3. Tombol cetak/unduh + route guard refresh-safe + reset store di tombol "Kembali ke Beranda".
   - Verifikasi terhadap Acceptance Criteria Halaman 5 — **ini penanda MVP selesai**.

### Fase 6–8
Lebih cocok dikerjakan manual/review langsung (polish, testing, deployment) daripada full vibecoding — gunakan AI per-isu spesifik saja (misal "perbaiki kontras warna di komponen X"), bukan prompt besar sekaligus.