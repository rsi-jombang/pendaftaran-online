# Architecture Document — Aplikasi Pendaftaran Pasien Poli (Frontend)

Frontend: **Vite + React + TypeScript**, mengonsumsi **REST API Laravel** (backend terpisah/headless).

---

## 1. Tech Stack

| Layer | Pilihan | Alasan |
|---|---|---|
| Build tool | **Vite** | Dev server cepat, HMR instan, build produksi ringan |
| Framework | **React 18 + TypeScript** | Type-safety, ekosistem luas |
| Routing | **React Router v6** | Standar de-facto untuk multi-page flow (5 halaman) |
| State server/cache | **TanStack Query (React Query)** | Cache, refetch, loading/error state otomatis untuk REST API — cocok untuk cek NIK, list poli, jadwal, status antrian real-time |
| State lokal/global (UI) | **Zustand** | Ringan, untuk state alur pendaftaran (step wizard: NIK → poli → jadwal → status) tanpa boilerplate Redux |
| Form & validasi | **React Hook Form + Zod** | Validasi NIK, form pendaftaran, error handling rapi & type-safe |
| HTTP client | **Axios** | Interceptor untuk auth token, error handling terpusat, base URL config |
| Styling | **Tailwind CSS** | Konsisten dengan design token di `design.md` |
| Animasi | **Framer Motion** | Page transition, stagger card, checkmark animation, micro-interaction sesuai `design.md` |
| Icon | **lucide-react** | Sesuai rekomendasi design system |
| Realtime status antrian | **Polling via TanStack Query `refetchInterval`** (bukan WebSocket) | Update posisi antrian di Halaman Status — lihat Section 4.3.1 untuk contoh response. Upgrade ke Laravel Echo/Pusher bisa dipertimbangkan nanti, tidak untuk MVP saat ini. |
| Testing | **Vitest + React Testing Library** | Unit/integration test komponen & hooks |
| Linting/format | **ESLint + Prettier** | Konsistensi kode |

---

## 2. Struktur Folder

Menggunakan pendekatan **feature-based** (bukan type-based flat), agar tiap halaman/fitur mandiri dan mudah di-maintain seiring bertambahnya fitur.

```
src/
├── app/
│   ├── App.tsx                 # Root component, providers
│   ├── router.tsx               # Definisi route (React Router)
│   └── providers/
│       ├── QueryProvider.tsx    # TanStack Query client
│       └── ThemeProvider.tsx    # Design token / theme context (jika perlu)
│
├── pages/                       # 1 folder = 1 halaman utama
│   ├── landing/
│   │   └── LandingPage.tsx
│   ├── poli-list/                # PUBLIK — tanpa guard, murni informasi
│   │   ├── PoliListPage.tsx
│   │   └── components/
│   │       ├── PoliCard.tsx
│   │       └── PoliSearchFilter.tsx
│   ├── poli-detail/               # PUBLIK — tanpa guard, murni informasi (TIDAK ada form di sini)
│   │   ├── PoliDetailPage.tsx
│   │   └── components/
│   │       ├── DateChipSelector.tsx
│   │       └── DoctorCard.tsx     # tombol "Daftar" di sini → simpan pendingSelection → navigate /cek-nik
│   ├── nik-check/                 # GUARDED start of wizard (step 1/3)
│   │   ├── NikCheckPage.tsx
│   │   └── components/
│   │       ├── NikForm.tsx
│   │       ├── PatientFoundCard.tsx
│   │       └── NewPatientForm.tsx
│   ├── registration-form/         # GUARDED (step 2/3) — halaman baru, terpisah dari poli-detail
│   │   ├── RegistrationFormPage.tsx
│   │   └── components/
│   │       ├── SelectionSummaryChip.tsx   # ringkasan poli/dokter/tanggal dari pendingSelection
│   │       └── RegistrationForm.tsx
│   └── registration-status/       # GUARDED (step 3/3)
│       ├── RegistrationStatusPage.tsx
│       └── components/
│           ├── QueueNumberDisplay.tsx
│           └── PatientSummaryCard.tsx
│
├── features/                    # Logic domain per fitur (hooks + api + types)
│   ├── nik/
│   │   ├── api.ts               # checkNik(), registerNewPatient()
│   │   ├── hooks.ts             # useCheckNik(), useRegisterPatient()
│   │   └── types.ts
│   ├── poli/
│   │   ├── api.ts               # getPoliList(), getPoliDetail()
│   │   ├── hooks.ts             # usePoliList(), usePoliDetail()
│   │   └── types.ts
│   ├── schedule/
│   │   ├── api.ts               # getDoctorSchedule()
│   │   ├── hooks.ts             # useDoctorSchedule()
│   │   └── types.ts
│   ├── registration/
│   │   ├── api.ts               # submitRegistration()
│   │   ├── hooks.ts             # useSubmitRegistration()
│   │   └── types.ts
│   └── queue/
│       ├── api.ts               # getQueueStatus()
│       ├── hooks.ts             # useQueueStatus() (polling/realtime)
│       └── types.ts
│
├── shared/
│   ├── components/              # Komponen UI reusable lintas halaman
│   │   ├── ui/                  # Button, Input, Card, Badge, Modal, Skeleton...
│   │   ├── layout/               # Navbar, Footer, StepIndicator, PageTransition
│   │   └── feedback/             # ErrorState, EmptyState, LoadingSpinner
│   ├── hooks/                   # useDebounce, useStepper, dll
│   ├── lib/
│   │   ├── axios.ts              # Instance axios + interceptor
│   │   ├── queryClient.ts        # Konfigurasi TanStack Query
│   │   └── constants.ts
│   ├── store/
│   │   └── registrationFlowStore.ts  # Zustand: state wizard antar halaman
│   ├── types/
│   │   └── api.ts                # Tipe generik: ApiResponse<T>, ApiError, Pagination
│   └── utils/
│       ├── formatNik.ts
│       ├── formatDate.ts
│       └── maskNik.ts
│
├── assets/                       # Ilustrasi, ikon custom, font
├── styles/
│   └── globals.css               # Tailwind base + custom CSS variables (design tokens)
├── main.tsx
└── vite-env.d.ts
```

**Prinsip:**
- `pages/*` hanya bertanggung jawab menyusun layout & memanggil hook dari `features/*` — tidak berisi logic fetching langsung.
- `features/*` adalah domain layer: API call + React Query hooks + tipe data, terpisah dari UI.
- `shared/*` adalah lintas-fitur: komponen generik, utilitas, konfigurasi global.
- Tidak ada import silang antar `features/*` — jika perlu berbagi, naikkan ke `shared/*`.

---

## 3. Alur Data & State Management

### 3.1 Dua jenis state, dua tools berbeda

| Jenis state | Tool | Contoh |
|---|---|---|
| **Server state** (data dari API) | TanStack Query | List poli (publik), jadwal dokter (publik), hasil cek NIK, status antrian |
| **Client/UI state** (alur wizard, pilihan sementara) | Zustand | Jadwal yang dipilih di halaman publik (`pendingSelection`), data pasien hasil verifikasi NIK, hasil registrasi — dipakai lintas halaman guarded (Cek NIK → Form Pendaftaran → Status) |

> **Catatan penting:** Halaman `poli-list` dan `poli-detail` bersifat **publik** dan **tidak menyimpan apa pun ke Zustand** kecuali saat user benar-benar klik tombol "Daftar" pada dokter tertentu — di titik itu baru `pendingSelection` diisi.

### 3.2 Registration Flow Store (Zustand) — contoh shape

```ts
interface PendingSelection {
  poliId: string;
  poliName: string;         // untuk ditampilkan di ringkasan tanpa refetch
  doctorId: string;
  doctorName: string;
  date: string;
  practiceHours: string;
}

interface RegistrationFlowState {
  patient: PatientData | null;            // hasil dari cek NIK / registrasi baru
  pendingSelection: PendingSelection | null; // diisi dari PoliDetailPage (publik) saat klik "Daftar"
  registrationResult: RegistrationResult | null; // nomor antrian, dsb — hasil submit

  setPatient: (patient: PatientData) => void;
  setPendingSelection: (selection: PendingSelection) => void;
  setRegistrationResult: (result: RegistrationResult) => void;
  clearPendingSelection: () => void;      // dipanggil setelah submit sukses
  reset: () => void;                      // dipanggil dari tombol "Kembali ke Beranda"
}
```

State ini **tidak disimpan di localStorage** secara default (data pasien sensitif) — cukup in-memory per sesi. Jika ingin tahan refresh, gunakan `sessionStorage` dengan enkripsi minimal atau simpan hanya `registration_id` lalu refetch dari API (lebih aman).

### 3.3 Alur end-to-end

```
LandingPage / PoliListPage (PUBLIK, tanpa guard)
   │ GET /api/poli → React Query (cache)
   │ klik card poli → navigate /poli/:id  (TIDAK menyimpan apa pun ke Zustand)
   ▼
PoliDetailPage (PUBLIK, tanpa guard, informasi saja — TIDAK ada form)
   │ GET /api/poli/:id/schedules?date=...  → React Query (refetch saat ganti tanggal)
   │ klik "Daftar" pada dokter tertentu
   │ → simpan pendingSelection { poliId, doctorId, date, ... } ke Zustand
   │ → navigate /cek-nik
   ▼
NikCheckPage (GUARDED start of wizard, step 1/3)
   │ POST /api/patients/check-nik  → React Query mutation
   │ jika terdaftar → simpan patient ke Zustand
   │ jika belum → tampilkan form baru → POST /api/patients → simpan patient ke Zustand
   │ lalu:
   │   jika pendingSelection ADA → navigate /daftar (Form Pendaftaran)
   │   jika pendingSelection KOSONG (user datang dari CTA generik) → navigate /poli (pilih jadwal dulu)
   ▼
RegistrationFormPage (GUARDED, step 2/3)
   │ baca pendingSelection dari Zustand untuk ringkasan pilihan
   │ redirect ke /poli jika pendingSelection kosong; redirect ke /cek-nik jika patient kosong
   │ submit form → POST /api/registrations → React Query mutation
   │ response berisi queue_number → simpan registrationResult ke Zustand
   │ clearPendingSelection() → navigate /status/:registrationId
   ▼
RegistrationStatusPage (GUARDED, step 3/3)
   │ GET /api/registrations/:id  (initial data dari mutation response, lalu refetch)
   │ polling via refetchInterval (bukan WebSocket) untuk update posisi antrian — lihat Section 4.3.1
   │ tombol "Kembali ke Beranda" → reset() Zustand store
```

---

## 4. Integrasi REST API Laravel

### 4.1 Axios instance (`shared/lib/axios.ts`)

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // contoh: https://rs-domain.com/api
  headers: { Accept: "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // sisipkan token jika ada sesi/auth (mis. untuk staff), publik tidak butuh
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Normalisasi error Laravel (422 validation, 404, 500) ke bentuk ApiError konsisten
    return Promise.reject(normalizeApiError(error));
  }
);
```

### 4.2 Konvensi kontrak API (disepakati dengan backend Laravel)

- Response sukses: `{ "data": { ... }, "message": "..." }`
- Response error validasi (422): `{ "message": "...", "errors": { "nik": ["..."] } }` — sesuai default Laravel validation.
- Semua tanggal dalam format ISO 8601 (`2026-08-20T09:00:00+07:00`), konversi tampilan dilakukan di frontend (`utils/formatDate.ts`).
- Endpoint publik (tanpa auth) untuk seluruh alur pasien, karena ini self-service tanpa login.

### 4.3 Contoh endpoint yang dibutuhkan dari backend

| Method | Endpoint | Kebutuhan |
|---|---|---|
| POST | `/api/patients/check-nik` | Cek NIK terdaftar/tidak |
| POST | `/api/patients` | Registrasi pasien baru |
| GET | `/api/poli` | List poli + kuota hari ini |
| GET | `/api/poli/{id}` | Detail poli |
| GET | `/api/poli/{id}/schedules?date=YYYY-MM-DD` | Jadwal dokter per tanggal |
| POST | `/api/registrations` | Submit pendaftaran → return nomor antrian |
| GET | `/api/registrations/{id}` | Status pendaftaran & posisi antrian |
| GET | `/api/registrations/{id}/queue-status` (opsional, polling) | Posisi antrian real-time |

> Dokumen ini akan disinkronkan dengan OpenAPI/Postman collection dari backend Laravel (dikembangkan sendiri oleh pemilik proyek) agar tipe TypeScript (`features/*/types.ts`) selalu sesuai kontrak. Sebelum endpoint asli tersedia, gunakan contoh mock di Section 4.3.1 sebagai acuan sementara — **bukan** untuk ditebak-tebak sendiri oleh agent/AI.

#### 4.3.1 Contoh Mock Request/Response per Endpoint

Digunakan sebagai fixture (`features/*/mock.ts`) selama backend belum tersedia. Struktur field boleh disesuaikan setelah kontrak asli dari backend Laravel dikonfirmasi — tandai perubahan tersebut ke `architecture.md` ini.

**`POST /api/patients/check-nik`**
```json
// Request
{ "nik": "3578012345670001" }

// Response 200 — NIK terdaftar
{
  "data": {
    "found": true,
    "patient": {
      "id": "PAT-00123",
      "nik": "3578012345670001",
      "name": "Siti Aminah",
      "birth_date": "1990-05-12",
      "gender": "female",
      "phone": "081234567890"
    }
  }
}

// Response 200 — NIK belum terdaftar
{ "data": { "found": false, "patient": null } }
```

**`POST /api/patients`** (registrasi pasien baru)
```json
// Request
{
  "nik": "3578012345670099",
  "name": "Budi Santoso",
  "birth_date": "1985-02-20",
  "gender": "male",
  "address": "Jl. Melati No. 10, Surabaya",
  "phone": "081298765432"
}

// Response 201
{
  "data": {
    "id": "PAT-00456",
    "nik": "3578012345670099",
    "name": "Budi Santoso",
    "birth_date": "1985-02-20",
    "gender": "male",
    "address": "Jl. Melati No. 10, Surabaya",
    "phone": "081298765432"
  },
  "message": "Pasien baru berhasil didaftarkan"
}
```

**`GET /api/poli`**
```json
{
  "data": [
    {
      "id": "POLI-01",
      "name": "Poli Anak",
      "category": "Spesialis",
      "icon": "baby",
      "doctors_today": 3,
      "quota_remaining": 12,
      "quota_status": "available"
    },
    {
      "id": "POLI-02",
      "name": "Poli Gigi",
      "category": "Spesialis",
      "icon": "tooth",
      "doctors_today": 1,
      "quota_remaining": 0,
      "quota_status": "full"
    }
  ]
}
```

**`GET /api/poli/{id}`** (dipakai oleh PoliDetailPage — publik)
```json
{
  "data": {
    "id": "POLI-01",
    "name": "Poli Anak",
    "category": "Spesialis",
    "icon": "baby",
    "description": "Melayani pemeriksaan dan konsultasi kesehatan anak usia 0-18 tahun.",
    "doctors_today": 3,
    "quota_remaining": 12,
    "quota_status": "available"
  }
}
```

**`GET /api/poli/{id}/schedules?date=2026-08-20`**
```json
{
  "data": {
    "poli": { "id": "POLI-01", "name": "Poli Anak" },
    "date": "2026-08-20",
    "doctors": [
      {
        "id": "DOK-01",
        "name": "dr. Sarah Wijaya, Sp.A",
        "avatar_url": "https://.../avatar-01.jpg",
        "practice_hours": "09:00-12:00",
        "quota_remaining": 5,
        "quota_status": "available"
      },
      {
        "id": "DOK-02",
        "name": "dr. Andi Prasetyo, Sp.A",
        "avatar_url": "https://.../avatar-02.jpg",
        "practice_hours": "13:00-16:00",
        "quota_remaining": 0,
        "quota_status": "full"
      }
    ]
  }
}
```

**`POST /api/registrations`**
```json
// Request
{
  "patient_id": "PAT-00123",
  "poli_id": "POLI-01",
  "doctor_id": "DOK-01",
  "date": "2026-08-20",
  "complaint": "Demam sejak 2 hari",
  "arrival_method": "datang_langsung"
}

// Response 201
{
  "data": {
    "registration_id": "REG-20260820-014",
    "queue_number": "A-014",
    "status": "waiting",
    "estimated_wait_minutes": 25,
    "queue_position": 4
  },
  "message": "Pendaftaran berhasil"
}
```

**`GET /api/registrations/{id}`** (dipakai juga untuk polling)
```json
{
  "data": {
    "registration_id": "REG-20260820-014",
    "queue_number": "A-014",
    "status": "waiting",            // "waiting" | "in_service" | "done"
    "queue_position": 3,
    "estimated_wait_minutes": 20,
    "patient": {
      "name": "Siti Aminah",
      "nik_masked": "35xxxxxxxxxx0001"
    },
    "poli": { "name": "Poli Anak" },
    "doctor": { "name": "dr. Sarah Wijaya, Sp.A" },
    "schedule": { "date": "2026-08-20", "practice_hours": "09:00-12:00" }
  }
}
```

**Response error validasi (422) — contoh umum**
```json
{
  "message": "Data yang dikirim tidak valid",
  "errors": {
    "nik": ["Format NIK harus 16 digit angka"],
    "phone": ["Nomor HP wajib diisi"]
  }
}
```

### 4.4 Tipe respons generik

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}
```

---

## 5. Routing

```tsx
const router = createBrowserRouter([
  // Publik — tanpa guard
  { path: "/", element: <LandingPage /> },
  { path: "/poli", element: <PoliListPage /> },
  { path: "/poli/:poliId", element: <PoliDetailPage /> },

  // Guarded — alur pendaftaran (wizard, berurutan)
  { path: "/cek-nik", element: <NikCheckPage /> },
  { path: "/daftar", element: <RegistrationFormPage /> },
  { path: "/status/:registrationId", element: <RegistrationStatusPage /> },

  { path: "*", element: <NotFoundPage /> },
]);
```

- **`/` , `/poli`, `/poli/:poliId` — publik, tanpa guard sama sekali.** Bisa diakses kapan saja, tidak butuh `patient` atau state Zustand apa pun. `PoliDetailPage` di sini **hanya menampilkan info + jadwal**, tidak ada form pendaftaran — tombol "Daftar" pada tiap dokter menyimpan `pendingSelection` ke Zustand lalu navigate ke `/cek-nik`.
- **`/cek-nik` — guarded start of wizard.** Tidak butuh guard masuk (siapa saja boleh cek NIK), tapi keluarnya bercabang: kalau `pendingSelection` ada di store → ke `/daftar`; kalau tidak ada → ke `/poli`.
- **`/daftar` (RegistrationFormPage) — route guard wajib:** redirect ke `/poli` jika `pendingSelection` kosong, redirect ke `/cek-nik` jika `patient` kosong. Ini halaman form pendaftaran yang terpisah dari `PoliDetailPage`.
- **`/status/:registrationId` — route guard ringan:** gunakan `registrationResult` dari Zustand sebagai initial data kalau ada, tapi tetap fetch dari `GET /api/registrations/:id` via `registrationId` di URL agar refresh-safe (tidak wajib bergantung ke Zustand saja).
- Animasi transisi antar route menggunakan Framer Motion `AnimatePresence` di level `App.tsx`.

---

## 6. Environment & Konfigurasi

`.env`:
```
VITE_API_BASE_URL=https://api.rumahsakit.example/api
VITE_PUSHER_KEY=            # jika pakai realtime
VITE_PUSHER_CLUSTER=
```

- **CORS:** backend Laravel perlu mengizinkan origin frontend (dev: `http://localhost:5173`).
- Tidak menggunakan Laravel Sanctum SPA cookie-based auth untuk alur publik ini (tanpa login) — cukup REST API stateless. Jika nanti ada panel admin/staff di app terpisah, baru pertimbangkan Sanctum token.

---

## 7. Error Handling & Loading UX

- Setiap request via React Query → 3 state ditangani seragam lewat komponen `shared/components/feedback`: `LoadingSpinner`/`Skeleton`, `ErrorState` (dengan tombol retry), `EmptyState`.
- Validasi form (Zod) berjalan di client sebelum submit, ditambah penanganan error 422 dari server (map `errors.field` ke pesan di bawah input terkait via React Hook Form `setError`).
- Global fallback: `ErrorBoundary` di level `App.tsx` untuk crash tak terduga.

---

## 8. Performance

- Lazy load tiap `pages/*` dengan `React.lazy` + `Suspense` (code-splitting per halaman).
- React Query cache: `staleTime` disesuaikan (list poli bisa 1–5 menit, status antrian near-real-time via `refetchInterval` pendek).
- Gambar/ilustrasi memakai format WebP + `loading="lazy"`.
- Bundle analyze via `vite-bundle-visualizer` sebelum rilis.

---

## 9. Deployment

- Build: `vite build` → output `dist/` statis, di-deploy ke Nginx/static hosting/CDN — **terpisah dari backend Laravel** (arsitektur decoupled, bukan Laravel Blade).
- Backend Laravel hanya menyajikan REST API (`/api/*`), tidak menyajikan halaman frontend.
- Pertimbangkan reverse proxy (Nginx) agar frontend (`/`) dan API (`/api`) berada di bawah domain yang sama untuk menghindari isu CORS di produksi.