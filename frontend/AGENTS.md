# AGENTS.md

> File ini adalah instruksi wajib untuk AI coding agent (OpenCode, DeepSeek, atau agent lain) yang bekerja di repository ini. Baca file ini **sebelum** menulis atau mengubah kode apa pun.

---

## 0. Status Proyek

- Proyek ini **masih dalam tahap development**, belum production.
- **Frontend:** Vite + React + TypeScript.
- **Backend:** Laravel (REST API), **dikembangkan sendiri oleh pemilik proyek** — agent **tidak perlu dan tidak boleh** membuat, mengubah, atau mengasumsikan kode backend Laravel kecuali diminta eksplisit. Agent hanya boleh **mengonsumsi kontrak API** yang sudah didefinisikan di `architecture.md`.
- Realtime status antrian menggunakan **polling sederhana** (`refetchInterval` via TanStack Query), **bukan** WebSocket/Laravel Echo/Pusher. Jangan tambahkan dependensi realtime (Echo, Pusher, Soketi, dsb) kecuali diminta eksplisit oleh user.

---

## 1. Dokumen Sumber Kebenaran (Source of Truth)

Tiga file berikut adalah **acuan wajib** dan **tidak boleh dilanggar** tanpa izin eksplisit dari user. Jika ada instruksi task yang bertentangan dengan dokumen ini, **agent harus berhenti dan bertanya ke user**, bukan mengambil keputusan sendiri.

| File | Isi | Kapan wajib dibaca |
|---|---|---|
| `design.md` | Design system (warna, tipografi, spacing, komponen, animasi) & spesifikasi UX/UI 5 halaman | Sebelum membuat/mengubah **apa pun yang bersentuhan dengan UI** (komponen, styling, layout, animasi) |
| `architecture.md` | Tech stack, struktur folder, pola state management, kontrak REST API, routing, error handling | Sebelum membuat/mengubah **struktur project, folder, dependency, cara fetching data, atau routing** |
| `roadmap.md` | Urutan fase pengembangan & prioritas endpoint | Sebelum memulai fitur baru — cek fase mana yang sedang berjalan, jangan lompat ke fase yang belum jadi dependensinya |

**Aturan wajib:**
1. Sebelum mengerjakan task apa pun, agent **membaca ulang** ketiga file ini (bukan mengandalkan ingatan dari context sebelumnya jika sudah lama/panjang).
2. Jika task dari user tidak disebutkan detailnya (misal "buatkan halaman daftar poli"), agent **mengikuti spesifikasi di `design.md` section terkait**, bukan berimprovisasi bebas.
3. Jika ada kebutuhan baru yang **tidak tercakup** di ketiga file (misal fitur baru, halaman baru, library baru di luar yang disebut di `architecture.md`), agent **tidak boleh diam-diam menambahkannya** — agent harus:
   - Menyampaikan ke user bahwa hal tersebut belum ada di dokumen acuan, dan
   - Menyarankan untuk mengupdate `design.md`/`architecture.md`/`roadmap.md` terlebih dahulu (lihat Section 4), **kecuali** user secara eksplisit bilang "tidak usah update dokumen, langsung saja".

---

## 2. Aturan Konsistensi Teknis (dari `architecture.md`)

Agent **wajib** mengikuti keputusan berikut tanpa mengganti dengan preferensi/library lain:

- **Struktur folder:** feature-based (`pages/`, `features/`, `shared/`) sesuai `architecture.md` Section 2. Jangan membuat struktur folder baru (misal `components/` flat di root) tanpa alasan yang didiskusikan dengan user.
- **State server (data dari API):** TanStack Query — jangan pakai `useEffect` + `fetch` manual atau library state lain (SWR, Redux Toolkit Query, dll) untuk data dari API.
- **State UI/wizard lintas halaman:** Zustand (`registrationFlowStore`) — jangan pakai Context API manual atau Redux untuk kebutuhan ini.
- **Form & validasi:** React Hook Form + Zod — konsisten di semua form (NIK, registrasi pasien baru, form pendaftaran poli).
- **HTTP client:** Axios instance dari `shared/lib/axios.ts` — jangan panggil `fetch` langsung di komponen/hook baru.
- **Styling:** Tailwind CSS dengan design token dari `design.md` (warna, radius, shadow, spacing) — jangan menulis warna hex/spacing baru secara langsung (hardcode) di luar token yang sudah didefinisikan, kecuali kasus sangat spesifik dan didiskusikan.
- **Animasi:** Framer Motion, mengikuti prinsip durasi/easing di `design.md` Section 2.5 — jangan pakai library animasi lain (GSAP, React Spring, dll) kecuali diminta.
- **Routing:** React Router v6, struktur route sesuai `architecture.md` Section 5.
- **Realtime antrian:** polling via `refetchInterval`, **bukan** WebSocket — lihat Section 0.

**Larangan menambah dependency baru** (library UI, animasi, state management, dsb) tanpa menyebutkan alasan ke user dan mendapat konfirmasi — supaya bundle tidak membengkak dan stack tetap konsisten dengan `architecture.md`.

---

## 3. Aturan Konsistensi Desain (dari `design.md`)

- Gunakan **CSS variable / Tailwind token** yang sudah didefinisikan di `design.md` Section 2.1–2.4 (warna primary/secondary/accent, radius 16px/12px, shadow soft, font Plus Jakarta Sans/Inter).
- Setiap halaman baru **mengikuti struktur section** yang sudah dirinci per halaman di `design.md` Section 4 (misal Halaman 3 wajib punya search+filter, grid card dengan badge kuota, stagger fade-in) — jangan menyederhanakan atau menghilangkan elemen yang sudah dispesifikasikan tanpa konfirmasi.
- Progress/step indicator (step 1–4) harus konsisten muncul di Halaman 2–5 sesuai alur di `design.md` Section 3.
- Perhatikan **aksesibilitas** (Section 6 di `design.md`): kontras warna, ukuran font ≥16px body, tap target ≥44px, `prefers-reduced-motion`. Agent tidak boleh mengabaikan ini demi "kecepatan development".
- Nomor antrian, NIK yang disamarkan, dan elemen sensitif lain harus mengikuti format yang sudah dispesifikasikan (misal masking NIK di `design.md` Halaman 5), bukan menampilkan data mentah.

---

## 4. Kapan Agent Boleh/Harus Mengusulkan Update Dokumen

Agent **boleh mengusulkan** perubahan ke `design.md` / `architecture.md` / `roadmap.md` jika:
- User meminta fitur/halaman baru yang belum tercakup.
- Ditemukan keterbatasan teknis yang membuat spesifikasi di dokumen tidak bisa diimplementasikan persis (misal kendala library, kendala API dari backend Laravel milik user).
- User secara eksplisit meminta perubahan arsitektur/desain.

Dalam kasus ini, agent **menjelaskan dulu perubahan yang diusulkan** ke user (ringkas, poin-poin) sebelum mengubah file dokumen atau mulai coding berdasarkan asumsi baru. **Jangan mengubah `design.md`/`architecture.md`/`roadmap.md` secara diam-diam** hanya karena mengerjakan task kode — dokumen ini adalah kontrak, bukan catatan yang bisa ditimpa otomatis.

---

## 5. Kontrak API dengan Backend Laravel

- Backend Laravel dikembangkan **oleh user sendiri**, bukan oleh agent ini.
- Agent **tidak boleh mengasumsikan** endpoint, response shape, atau nama field yang tidak tercantum di `architecture.md` Section 4. Jika suatu fitur butuh data/endpoint yang belum ada di daftar endpoint (`architecture.md` Section 4.3), agent harus:
  1. Menandai kebutuhan tersebut secara eksplisit ke user (nama endpoint yang diusulkan, method, payload yang dibutuhkan), dan
  2. **Tidak** menebak-nebak struktur backend Laravel atau membuat kode backend tanpa diminta.
- Selama endpoint asli belum tersedia/belum dikonfirmasi user, agent boleh menggunakan **mock data lokal** (bukan MSW kalau tidak diminta — cukup sederhana, misal fixture JSON di `features/*/mock.ts`) supaya development frontend tidak terblokir, dan **beri komentar jelas** di kode bahwa itu mock, mudah dicari (`// TODO: replace mock — waiting for real endpoint from backend`).
- Tipe TypeScript (`features/*/types.ts`) harus mengikuti shape `ApiResponse<T>` / `ApiError` yang sudah didefinisikan di `architecture.md` Section 4.4 — jangan membuat konvensi response baru.

---

## 6. Alur Kerja yang Diharapkan dari Agent

Setiap kali menerima task pengembangan (fitur, halaman, komponen, perbaikan bug), agent mengikuti urutan berikut:

1. **Cek roadmap.md** — pastikan fase/urutan task sesuai (misal jangan mengerjakan Fase 4 sebelum Fase 2–3 selesai, kecuali user minta lain).
2. **Cek design.md** — untuk apa pun yang tampil di layar, cocokkan dengan spesifikasi halaman terkait.
3. **Cek architecture.md** — untuk struktur folder, pola state, tipe API yang dipakai.
4. **Implementasi** mengikuti pola yang sudah ada di codebase (konsistensi penamaan file, konvensi hook, dsb) — jangan memperkenalkan pola baru yang berbeda dari kode yang sudah ada tanpa alasan.
5. Jika ragu atau ada konflik antara task dan dokumen → **tanyakan ke user**, jangan berasumsi.

---

## 7. Larangan Umum

- Jangan mengganti stack inti (Vite/React/TS, TanStack Query, Zustand, Axios, Tailwind, Framer Motion, React Router) dengan alternatif lain.
- Jangan membuat halaman/komponen di luar 5 halaman yang sudah dispesifikasikan tanpa konfirmasi user.
- Jangan menambahkan autentikasi/login untuk alur pasien publik — alur ini didesain **tanpa login** (lihat `architecture.md` Section 6).
- Jangan menambahkan WebSocket/Echo/Pusher untuk status antrian (masih pakai polling — lihat Section 0).
- Jangan menyimpan data pasien sensitif (NIK lengkap, dsb) ke `localStorage` tanpa masking — sesuai catatan keamanan di `architecture.md` Section 3.2.
- Jangan mengubah isi `design.md`, `architecture.md`, atau `roadmap.md` sebagai efek samping dari task coding tanpa sepengetahuan user.