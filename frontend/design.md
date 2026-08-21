# Design Document — Aplikasi Pendaftaran Pasien Poli Rumah Sakit

## 1. Overview

Aplikasi web untuk pendaftaran pasien ke poli rumah sakit secara mandiri (self-service registration). Pengguna melakukan pengecekan NIK, memilih poli, mengisi form pendaftaran, dan mendapatkan nomor antrian.

**Target pengguna:** Pasien / keluarga pasien, walk-in maupun yang mendaftar dari rumah, dengan rentang usia dan literasi digital yang beragam — sehingga UI harus **sederhana, jelas, dan tidak membingungkan**, meski tampil modern dan interaktif.

**Tone produk:** Medis, tenang, terpercaya, bersih (clean), tapi tetap hangat dan tidak kaku — bukan tampilan rumah sakit tahun 2010-an yang penuh warna biru pekat dan border tebal.

---

## 2. Design System

### 2.1 Warna (Color Palette)

Tema medis modern: dominan putih/abu terang sebagai kanvas, aksen teal/biru kehijauan sebagai warna identitas medis (kesan bersih & menyembuhkan), dengan warna status yang jelas.

| Token | Hex | Penggunaan |
|---|---|---|
| `--primary` | `#0F9B8E` (teal medis) | Tombol utama, header, ikon aktif |
| `--primary-dark` | `#0B7A70` | Hover/active state primary |
| `--primary-light` | `#E6F7F5` | Background lembut, badge, highlight card |
| `--secondary` | `#3B82C4` (biru klinis) | Aksen sekunder, link, ikon jadwal |
| `--accent` | `#FF7A59` (coral hangat) | CTA penting (Daftar Sekarang), notifikasi |
| `--success` | `#22A366` | Status terdaftar / berhasil |
| `--warning` | `#F5A623` | Status menunggu / peringatan |
| `--danger` | `#E5484D` | Error, NIK tidak valid, penuh |
| `--bg-base` | `#F7FAFA` | Background utama halaman |
| `--surface` | `#FFFFFF` | Card, panel, form |
| `--text-primary` | `#16221F` | Teks utama |
| `--text-secondary` | `#5B6B68` | Teks pendukung |
| `--border` | `#E2E8E7` | Garis pemisah, outline input |

> Semua warna status (success/warning/danger) juga dipakai konsisten untuk badge status antrian di halaman 5.

### 2.2 Tipografi

- **Font utama:** `Plus Jakarta Sans` atau `Inter` (fallback: system-ui, sans-serif) — modern, mudah dibaca di semua umur.
- **Font angka/nomor antrian:** `Space Grotesk` atau `JetBrains Mono` untuk nomor antrian besar (kesan digital display rumah sakit).

| Level | Size | Weight | Penggunaan |
|---|---|---|---|
| Display | 40–56px | 700 | Nomor antrian besar |
| H1 | 32px | 700 | Judul halaman |
| H2 | 24px | 600 | Judul section |
| H3 | 18px | 600 | Judul card |
| Body | 16px | 400 | Teks umum |
| Small | 14px | 400 | Caption, helper text |
| Label | 13px | 500 | Label form, uppercase tracking-wide |

### 2.3 Spacing & Grid

- Base unit **8px**. Spacing: 8 / 16 / 24 / 32 / 48 / 64.
- Container max-width: `1200px` desktop, full-width dengan padding `20px` di mobile.
- Grid card poli: 3 kolom desktop, 2 kolom tablet, 1 kolom mobile.

### 2.4 Komponen Dasar

- **Radius:** 16px untuk card besar, 12px untuk input/button, full-round untuk badge & avatar.
- **Shadow:** soft shadow (`0 4px 20px rgba(15,155,142,0.08)`), tanpa border tebal — kesan melayang, bukan kotak kaku.
- **Button:**
  - Primary: solid teal, hover sedikit gelap + scale 1.02, transisi 150ms.
  - Secondary: outline teal, fill on hover.
  - Disabled: abu, cursor not-allowed.
- **Input:** border tipis, focus ring teal glow (`box-shadow` bukan border tebal), label mengambang (floating label) opsional.
- **Icon set:** gunakan set line-icon medis (stetoskop, kalender, jam, lokasi, user) — konsisten stroke width 1.5–2px, dari `lucide-react`.

### 2.5 Kontrak Komponen Dasar (Component Contract)

Agar tidak ada tebak-tebak props saat implementasi, komponen di `shared/components/ui` **wajib** minimal mendukung interface berikut. Agent/developer boleh menambah props lain sesuai kebutuhan, tapi field di bawah ini adalah minimum wajib.

**`Button`**
```ts
interface ButtonProps {
  variant: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";           // default: md
  disabled?: boolean;
  loading?: boolean;                    // tampilkan spinner inline, teks tetap terlihat
  fullWidth?: boolean;                  // untuk CTA mobile sticky
  icon?: ReactNode;                     // opsional, di kiri teks
  onClick?: () => void;
}
```

**`Input`**
```ts
interface InputProps {
  label: string;
  error?: string;                       // jika ada, border jadi --danger + teks error di bawah
  helperText?: string;
  leadingIcon?: ReactNode;
  state?: "default" | "success" | "error"; // untuk kasus validasi NIK real-time
  ...standard HTML input props (value, onChange, placeholder, maxLength, dst)
}
```

**`Card`**
```ts
interface CardProps {
  variant?: "default" | "interactive" | "selected" | "disabled";
  // interactive = hover elevate; selected = border teal + checkmark (dipakai di DoctorCard);
  // disabled = opacity turun (dipakai di PoliCard/DoctorCard saat kuota penuh)
  onClick?: () => void;
  children: ReactNode;
}
```

**`Badge`**
```ts
interface BadgeProps {
  status: "success" | "warning" | "danger" | "info" | "neutral";
  children: ReactNode;
  pulse?: boolean;   // animasi pulse halus, dipakai untuk status "Menunggu" di Halaman 5
}
```

**`Skeleton`**
```ts
interface SkeletonProps {
  variant: "text" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
}
```

**`StepIndicator`**
```ts
interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
  steps: string[]; // label tiap step, contoh: ["Cek NIK", "Pilih Poli", "Jadwal & Form", "Status"]
}
```

### 2.6 Motion & Animasi (prinsip umum)

- Durasi standar: 150–300ms, easing `ease-out` / `cubic-bezier(0.16, 1, 0.3, 1)` (smooth, tidak "mantul" berlebihan — kesan medis harus tenang).
- Page transition: fade + slide-up halus (opacity 0→1, translateY 12px→0), 250–300ms.
- Micro-interaction: hover card `translateY(-4px)` + shadow membesar; tombol tekan `scale(0.97)`.
- Loading state: skeleton shimmer, bukan spinner polos, untuk kesan modern.
- Animasi elemen medis: heartbeat/pulse halus pada ikon status "menunggu", checkmark animasi draw-on saat berhasil daftar.
- Gunakan `prefers-reduced-motion` untuk menonaktifkan animasi non-esensial bagi pengguna yang membutuhkannya.

---

## 3. Struktur Halaman & Alur

```
[1] Landing Page
        │
        ▼
[2] Cek NIK ── belum terdaftar ──► Form Registrasi Pasien Baru ──┐
        │                                                          │
     sudah terdaftar                                               │
        │                                                          │
        ▼                                                          │
[3] Daftar Poli ◄─────────────────────────────────────────────────┘
        │
        ▼
[4] Detail Jadwal Poli + Form Pendaftaran
        │
        ▼
[5] Status Pendaftaran (Identitas + Nomor Antrian)
```

---

## 4. Detail Per Halaman

### 4.1 Halaman 1 — Landing Page

**Tujuan:** Memberi kesan terpercaya & modern, entry point ke alur pendaftaran.

**Struktur:**
- **Header/Navbar:** Logo RS (kiri), menu (Beranda, Layanan, Jadwal Dokter, Kontak), tombol CTA "Daftar Poli Sekarang" (kanan, warna accent).
- **Hero section:**
  - Headline besar: contoh *"Pendaftaran Poli Lebih Cepat, Tanpa Antre Lama"*.
  - Sub-headline singkat penjelas layanan online.
  - Tombol CTA utama besar: **"Cek Status Pendaftaran / Daftar Sekarang"** → ke halaman Cek NIK.
  - Ilustrasi/foto medis modern di sisi kanan (flat illustration bertema kesehatan, bukan foto stok generik).
  - Animasi: elemen hero fade-in bertahap (headline → sub → button → ilustrasi, stagger 100ms).
- **Section "Keunggulan"** (3–4 kartu ikon): Cepat, Tanpa Antre di Lokasi, Real-time, Aman & Terverifikasi NIK. Animasi: reveal on scroll (fade+slide up saat masuk viewport).
- **Section "Poli Tersedia"** — preview singkat 4–6 poli unggulan dalam card kecil, dengan tombol "Lihat Semua Poli".
- **Section Info RS:** jam operasional, lokasi (mini map), kontak darurat.
- **Footer:** info kontak, media sosial, jam layanan, disclaimer.

**Interaktivitas:** navbar sticky dengan efek blur background saat scroll; parallax ringan pada ilustrasi hero (opsional, subtle).

**✅ Acceptance Criteria:**
- [ ] Navbar sticky, berubah background (blur/solid) setelah scroll > 50px.
- [ ] Klik CTA "Daftar Poli Sekarang" (navbar maupun hero) mengarahkan ke `/cek-nik`.
- [ ] Hero, section keunggulan, dan section poli tampil dengan animasi fade-in bertahap (bukan muncul instan).
- [ ] Section "Poli Tersedia" menampilkan data asli dari `GET /api/poli` (atau mock jika backend belum siap) — bukan hardcode statis di komponen.
- [ ] Responsive: di mobile, hero stack vertikal (teks di atas, ilustrasi di bawah atau disembunyikan), tidak ada horizontal scroll.
- [ ] Semua CTA/link punya `focus state` yang terlihat (keyboard navigation).

---

### 4.2 Halaman 2 — Pengecekan NIK

**Tujuan:** Verifikasi cepat status kepesertaan/rekam medis pasien.

**Struktur:**
- Layout terpusat (centered card), progress indicator kecil di atas (step 1 dari 4: *Cek NIK → Pilih Poli → Jadwal & Form → Status*).
- Card berisi:
  - Judul: *"Masukkan NIK Anda"*.
  - Input NIK (16 digit), dengan validasi real-time (format angka, panjang digit) — border berubah merah/hijau saat mengetik.
  - Icon KTP/identitas di dalam input (leading icon).
  - Tombol **"Cek NIK"** (disabled sampai 16 digit terisi).
  - Teks kecil di bawah: link "Butuh bantuan?" untuk kontak admin.

**State hasil pengecekan (muncul dengan animasi expand di bawah form, tanpa reload halaman):**

1. **NIK sudah terdaftar:**
   - Card sukses hijau muda, ikon centang, teks *"Data Anda ditemukan, [Nama Pasien]"*.
   - Auto-redirect (dengan animasi transisi) ke Halaman 3 (Daftar Poli) setelah ±1.5 detik, atau tombol manual "Lanjut Pilih Poli".

2. **NIK belum terdaftar:**
   - Card info kuning, ikon info, teks *"NIK belum terdaftar sebagai pasien"*.
   - Tombol **"Daftar sebagai Pasien Baru"** → membuka form registrasi data pasien baru (nama, tanggal lahir, jenis kelamin, alamat, no. HP, dll) — bisa berupa modal/drawer atau halaman terpisah — setelah submit lanjut otomatis ke Halaman 3.

**Animasi:** loading state saat submit ("Memeriksa data...") dengan skeleton/spinner halus bertema medis (misal denyut/pulse icon), lalu hasil muncul dengan slide-down + fade.

**✅ Acceptance Criteria:**
- [ ] Input NIK hanya menerima angka, maksimal 16 digit; tombol "Cek NIK" disabled sampai tepat 16 digit terisi.
- [ ] Submit memanggil `POST /api/patients/check-nik` (lihat contoh payload di `architecture.md` Section 4.3.1) — bukan validasi dummy di frontend saja.
- [ ] Kasus "NIK terdaftar": nama pasien dari response API ditampilkan, ada auto-redirect ATAU tombol manual lanjut (pilih salah satu, konsisten).
- [ ] Kasus "NIK belum terdaftar": form registrasi baru muncul dengan field sesuai `architecture.md` (nama, tanggal lahir, jenis kelamin, alamat, no. HP), validasi Zod aktif per field.
- [ ] Kasus error network/500: tampil `ErrorState` dengan tombol retry — bukan halaman blank/crash.
- [ ] Data pasien hasil cek NIK tersimpan ke Zustand store sebelum navigasi ke Halaman 3.
- [ ] Refresh browser di halaman ini tidak menyebabkan crash (state kosong ditangani, kembali ke form awal).

---

### 4.3 Halaman 3 — Daftar Poli

**Tujuan:** Pasien memilih poli tujuan dengan cepat dan visual jelas.

**Struktur:**
- Progress indicator: step 2 dari 4.
- Search bar + filter di atas grid (cari nama poli, filter berdasarkan kategori: Umum, Spesialis, Gigi, dll).
- **Grid card poli** (3 kolom desktop / 1 kolom mobile), tiap card berisi:
  - Ikon/ilustrasi khas poli (jantung untuk Kardiologi, gigi untuk Gigi & Mulut, dll — warna ikon konsisten primary/secondary).
  - Nama poli (contoh: Poli Anak, Poli Gigi, Poli Penyakit Dalam).
  - Info singkat: jumlah dokter tersedia hari ini, estimasi kuota tersisa (badge: "Kuota tersisa 12" / "Kuota Penuh" berwarna sesuai status).
  - Tombol "Pilih Poli" atau seluruh card clickable.
- Card dengan kuota penuh: tampil dengan opacity lebih rendah + badge merah "Penuh", tetap bisa diklik untuk lihat jadwal hari berikutnya.

**Interaktivitas & Animasi:**
- Hover card: elevate (translateY -4px, shadow membesar), ikon sedikit scale-up.
- Grid muncul dengan stagger fade-in saat halaman load (card muncul satu-satu, delay 50ms antar card).
- Filter/search: hasil grid re-render dengan transisi fade cepat (tanpa flicker/reload kasar).

**✅ Acceptance Criteria:**
- [ ] Data poli diambil dari `GET /api/poli`, ditampilkan sebagai grid card dengan skeleton loading saat fetching.
- [ ] Search box memfilter card secara real-time (debounce ~300ms) tanpa request baru ke server jika data sudah di-cache (filter client-side dari data yang sudah ada).
- [ ] Card dengan kuota penuh: visual disabled (opacity turun, badge "Penuh"), tapi tetap bisa diklik untuk redirect ke halaman detail (agar user bisa lihat jadwal hari lain).
- [ ] Klik card poli → menyimpan `selectedPoli` ke Zustand store → navigasi ke `/poli/:poliId`.
- [ ] Redirect ke `/cek-nik` jika `patient` di store kosong (user belum lewat Halaman 2 — misal akses langsung via URL).
- [ ] State kosong (tidak ada poli sama sekali / hasil search kosong) menampilkan `EmptyState`, bukan grid kosong tanpa keterangan.

---

### 4.4 Halaman 4 — Detail Jadwal Poli + Form Pendaftaran

**Tujuan:** Menampilkan info jadwal lengkap lalu memudahkan pasien langsung mengisi form di bawahnya (satu halaman, tanpa pindah-pindah).

**Struktur (top → bottom, satu scroll flow):**

**A. Header Detail Poli**
- Judul poli + ikon, breadcrumb (Beranda / Daftar Poli / [Nama Poli]).
- Tombol "← Ganti Poli".

**B. Section Jadwal Dokter**
- Tab atau list horizontal-scroll untuk memilih **tanggal** (7 hari ke depan, tampil sebagai chip tanggal: hari + tanggal, hari ini di-highlight).
- Setelah tanggal dipilih → tampil **list/card dokter** yang praktik di tanggal tersebut:
  - Foto/avatar dokter, nama, spesialisasi, jam praktik, sisa kuota (badge angka).
  - Card dokter dengan kuota penuh dinonaktifkan (disabled state, badge "Penuh").
  - Radio-select style card (klik untuk memilih dokter → card ter-highlight dengan border teal + checkmark).

**C. Form Pendaftaran** (muncul di bawah, smooth-scroll otomatis ke sini setelah dokter dipilih, atau selalu tampil tapi disabled sampai dokter dipilih)
- Ringkasan pilihan di atas form (chip: "Poli Anak · dr. Sarah · Rabu, 20 Agustus · 09.00–12.00").
- Field form:
  - Data pasien (auto-terisi dari hasil cek NIK, read-only atau editable minimal).
  - Keluhan singkat / catatan (textarea opsional).
  - Metode kedatangan: Datang langsung / dijemput (jika relevan).
  - Checkbox persetujuan data.
- Tombol besar **"Konfirmasi Pendaftaran"** (full-width di mobile), sticky di bawah layar pada mobile agar selalu terlihat.

**Animasi & interaktivitas:**
- Transisi antar tanggal: konten dokter fade-out/fade-in saat ganti tanggal (bukan reload kasar).
- Saat memilih dokter: card lain sedikit redup (opacity turun), card terpilih menonjol.
- Progress indicator step 3 dari 4.
- Submit form: tombol berubah menjadi loading state (spinner inline + teks "Memproses...") → transisi ke Halaman 5.

**✅ Acceptance Criteria:**
- [ ] Chip tanggal default memilih hari ini; klik chip lain memicu `GET /api/poli/:id/schedules?date=...` dan re-render list dokter dengan transisi fade (bukan reload halaman).
- [ ] Dokter dengan kuota penuh tampil disabled, tidak bisa dipilih.
- [ ] Memilih dokter meng-highlight card terpilih (border teal + checkmark) dan meng-enable form pendaftaran di bawahnya.
- [ ] Form pendaftaran menggunakan React Hook Form + Zod; field wajib (checkbox persetujuan) tidak bisa disubmit kalau belum dicentang.
- [ ] Data pasien di form terisi otomatis dari Zustand store (hasil Halaman 2), tidak perlu input ulang.
- [ ] Submit memanggil `POST /api/registrations` (lihat contoh payload di `architecture.md` Section 4.3.1); error 422 dari server dipetakan ke field form yang relevan.
- [ ] Setelah sukses, response (termasuk `queue_number` dan `registration_id`) disimpan ke Zustand dan user dinavigasikan ke `/status/:registrationId`.
- [ ] Redirect ke `/poli` jika `selectedPoli` kosong di store (akses langsung tanpa lewat Halaman 3).

---

### 4.5 Halaman 5 — Status Pendaftaran

**Tujuan:** Konfirmasi jelas & mudah dibaca dari jarak jauh (seperti layar antrian), menampilkan identitas dan nomor antrian.

**Struktur:**
- Progress indicator: step 4 dari 4 — selesai (centang penuh).
- **Hero status card** (di tengah, paling menonjol):
  - Ikon centang besar dengan animasi draw-on (checkmark path animation) saat halaman pertama kali muncul.
  - Teks: *"Pendaftaran Berhasil!"*.
  - **Nomor antrian besar** ditampilkan sangat dominan (font Display, misal `A-014`), dengan sedikit efek scale-in / pop saat muncul.
  - Badge status warna (Menunggu Panggilan / Sedang Dilayani / Selesai) dengan animasi pulse halus jika status "Menunggu".
- **Detail informasi** (card di bawahnya):
  - Nama pasien, NIK (sebagian disamarkan, misal `32xxxxxxxxxx123`), poli, dokter, tanggal & jam praktik.
  - Estimasi jumlah antrian di depan / estimasi waktu tunggu.
- **Aksi:**
  - Tombol "Unduh/Cetak Bukti Pendaftaran" (PDF/kartu digital).
  - Tombol "Simpan ke layar utama / Kirim ke WhatsApp" (opsional).
  - Link "Kembali ke Beranda".
- Opsional: live-update posisi antrian (polling/websocket) dengan animasi angka berkurang (count-down transition) jika terhubung ke sistem antrian real-time.

**Animasi:** seluruh halaman masuk dengan efek celebratory ringan tapi tetap profesional — bukan confetti berlebihan, cukup checkmark animation + fade/scale nomor antrian, agar tetap terasa medis-profesional bukan seperti e-commerce.

**✅ Acceptance Criteria:**
- [ ] Data status diambil dari `GET /api/registrations/:id` — bisa langsung dari state hasil submit Halaman 4 sebagai initial data, lalu tetap fetch ulang agar refresh-safe.
- [ ] NIK ditampilkan dengan masking (contoh: `32xxxxxxxxxx123`), tidak pernah menampilkan NIK penuh di halaman ini.
- [ ] Nomor antrian menggunakan font Display sesuai `design.md` Section 2.2, tampil dominan di atas fold (tanpa perlu scroll di desktop).
- [ ] Polling aktif (`refetchInterval`, lihat `architecture.md` Section 4) untuk update posisi antrian/status secara berkala — bukan sekali fetch lalu statis.
- [ ] Badge status berubah warna sesuai state (`Menunggu` = warning + pulse, `Sedang Dilayani` = info, `Selesai` = success).
- [ ] Halaman ini bisa diakses ulang lewat refresh/reload URL langsung (tidak bergantung penuh ke Zustand yang hilang saat refresh).
- [ ] Tombol "Kembali ke Beranda" me-reset Zustand store (`reset()`) agar user bisa mulai alur baru dari awal.

---

## 5. Responsive Behavior

| Breakpoint | Perilaku utama |
|---|---|
| Desktop (≥1024px) | Grid 3 kolom, sidebar/step indicator horizontal di atas, form 2 kolom |
| Tablet (768–1023px) | Grid 2 kolom, navigasi tetap horizontal |
| Mobile (<768px) | Grid 1 kolom, tombol CTA sticky bottom, step indicator ringkas (dot indicator), form 1 kolom, chip tanggal horizontal-scroll |

---

## 6. Aksesibilitas & Usability (penting untuk konteks RS)

- Kontras warna teks minimal WCAG AA.
- Ukuran font dasar tidak lebih kecil dari 16px untuk body text (banyak pasien lansia).
- Semua tombol utama memiliki target tap minimal 44x44px.
- Status/error tidak hanya mengandalkan warna — selalu disertai ikon + teks.
- Dukungan `prefers-reduced-motion`.
- Bahasa sederhana, hindari istilah medis/teknis yang membingungkan pasien awam.

---

## 7. Stack Implementasi

> Keputusan final stack ada di `architecture.md` — section ini hanya ringkasan agar `design.md` tidak berdiri sendiri.

- **Frontend:** Vite + React + TypeScript, Tailwind CSS untuk styling sesuai design token di atas, Framer Motion untuk animasi.
- **Icon:** `lucide-react`.
- **Backend:** Laravel (REST API, dikembangkan terpisah) — endpoint cek NIK, list poli, jadwal dokter, submit pendaftaran, status antrian. Status antrian di Halaman 5 memakai **polling sederhana**, bukan WebSocket (lihat `architecture.md` & `AGENTS.md`).

---

*Dokumen ini adalah spesifikasi desain (UX/UI) sekaligus checklist verifikasi (Acceptance Criteria) per halaman — dipakai sebagai acuan implementasi maupun bahan review setelah AI/developer selesai mengerjakan sebuah halaman.*