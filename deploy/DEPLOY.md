# DEPLOY pendaftaran-online di /opt/docker-server-rsi

> Status per 2026-09-18: **wa-blas sudah jalan di server** (jangan diutak-atik). Yang
> belum ada: folder `rest-api` dan Apache handler-nya. Runbook ini hanya menambah,
> **tidak mengubah** service/konfigurasi existing.

## Arsitektur target

```
Browser/HP (Internet)
   │  http://IP_PUBLIK:PORT/pendaftaran-online/rest-api/public/api/v1/...
   ▼
apache:80/443 (existing)          ── volume ./www:/var/www ──┐
   │  <Directory /var/www/pendaftaran-online/rest-api/public>
   │  SetHandler proxy:fcgi://php74-fpm:9000
   ▼
php74-fpm (existing, cocok Laravel 8 / php^7.3)
   ▼
mysql57 (existing)  DB=rsi_jombang  (tabel smis_*, antrians*, antrians_non_bpjs)
   ▲
   └─ wa-blas (existing, 127.0.0.1:3001 lokal)  ← http://wa-blas:3001 (webnet)
```

Tidak ada service baru, tidak ada rebuild image, tidak ada vhost baru — hanya:
1. Upload folder `rest-api` ke `www/pendaftaran-online/rest-api`.
2. `.env` + `composer install` + `artisan key:generate` (via one-off container).
3. 1 file Apache di `apache/conf/sites-enabled/`.
4. Reload apache.

## Prasyarat (jalankan di server, read-only)

```bash
docker exec php74-fpm php -v
docker exec php74-fpm php -m | grep -iE "pdo_mysql|mbstring|bcmath|xml"
docker exec php74-fpm which composer   # kemungkinan kosong → pakai one-off composer:2
grep -E "^DB_" /opt/docker-server-rsi/www/antrian-bpjs/.env          # pola kredensial SIMRS
cat /opt/docker-server-rsi/www/pendaftaran-online/wa-blas/.env       # WA_API_KEY harus sama
docker exec mysql57 mysql -e "SHOW TABLES FROM rsi_jombang LIKE 'smis_rg_patient';"
docker exec mysql57 mysql -e "SHOW COLUMNS FROM rsi_jombang.antrians_non_bpjs LIKE 'id_vaksin';"
echo "IP server: $(hostname -I | awk '{print $1}')"
```

## 1. Upload rest-api (dari laptop Windows, SSH port 3311)

Pilih salah satu. `rest-api.zip` di root repo adalah arsip yang sama — extract di server
atau kirim folder via scp:

```bash
# opsi A — rsync (lebih baik, incremental)
rsync -avz --progress --exclude vendor --exclude node_modules --exclude .env \
  -e "ssh -p 3311" rest-api/ \
  simrs-rsijombang@192.168.0.2:/opt/docker-server-rsi/www/pendaftaran-online/rest-api/

# opsi B — scp (PowerShell)
scp -P 3311 -r "D:\Web Dev\pendaftaran-online\rest-api" \
  simrs-rsijombang@192.168.0.2:/opt/docker-server-rsi/www/pendaftaran-online/
```

Setelah upload, samakan kepemilikan dengan tetangganya:

```bash
chown -R www-data:www-data /opt/docker-server-rsi/www/pendaftaran-online/rest-api
```

## 2. Env produksi

Template lengkap: `deploy/.env.server.example`. Praktisnya:

```bash
SRC=/opt/docker-server-rsi/www/pendaftaran-online/rest-api
cp "$SRC/.env.example" "$SRC/.env"
```

Yang WAJIB diubah (nilai `??`):

```ini
APP_ENV=production
APP_DEBUG=false
APP_URL=http://IP_PUBLIK:PORT/pendaftaran-online/rest-api/public
DB_CONNECTION=mysql
DB_HOST=mysql            # nama service di webnet (bukan 127.0.0.1)
DB_PORT=3306
DB_DATABASE=rsi_jombang
DB_USERNAME=??           # tiru dari antrian-bpjs/.env
DB_PASSWORD=??           # tiru dari antrian-bpjs/.env
CACHE_DRIVER=file
QUEUE_CONNECTION=sync
WA_GATEWAY_URL=http://wa-blas:3001
WA_API_KEY=??            # HARUS sama persis dengan www/pendaftaran-online/wa-blas/.env
WA_ENABLED=true
```

Sinkronkan kunci WA (jalankan sekali, dari server):

```bash
WA_KEY=$(openssl rand -base64 32)
sed -i "s/^WA_API_KEY=.*/WA_API_KEY=$WA_KEY/" \
  /opt/docker-server-rsi/www/pendaftaran-online/rest-api/.env \
  /opt/docker-server-rsi/www/pendaftaran-online/wa-blas/.env
```

## 3. Setup (composer, key, permission, migrasi AMAN)

```bash
cd /opt/docker-server-rsi
bash deploy/setup-server.sh
```

Yang dilakukan script (manual jika mau dijalankan satuan):

```bash
SRC=/opt/docker-server-rsi/www/pendaftaran-online/rest-api

# composer via one-off (php74-fpm di server TIDAK punya binary composer)
docker run --rm -v "$SRC:/app" -w /app composer:2 composer install \
  --no-dev --optimize-autoloader --ignore-platform-reqs

# artisan via php74-fpm (kode terlihat di /var/www/)
docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan key:generate --force

# PERHATIAN: JANGAN `php artisan migrate` biasa — itu akan jalan create_users/
# password_resets/failed_jobs ke DB SIMRS rsi_jombang. HANYA jalankan migrasi lokal:
docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan migrate \
  --force --path=database/migrations/2026_09_17_000000_add_id_vaksin_to_antrians_non_bpjs.php

# permission
docker exec php74-fpm chown -R www-data:www-data \
  /var/www/pendaftaran-online/rest-api/storage \
  /var/www/pendaftaran-online/rest-api/bootstrap/cache
```

Verifikasi `id_vaksin`:

```bash
docker exec mysql57 mysql -e "SHOW COLUMNS FROM rsi_jombang.antrians_non_bpjs LIKE 'id_vaksin';"
```

> Jika kolom sudah ada → langkah `migrate` boleh dilewati (cek hasil langkah 0).

## 4. Apache handler

```bash
cp /opt/docker-server-rsi/www/pendaftaran-online/deploy/apache/pendaftaran-online.conf \
   /opt/docker-server-rsi/apache/conf/sites-enabled/pendaftaran-online.conf
docker exec apache apachectl configtest
docker exec apache apache2ctl graceful
```

File tersebut hanya `<Directory>` handler (pola identik `antrian-bpjs`), tidak
menyentuh `000-default.conf`. koneksi diarahkan ke `php74-fpm`.

## 5. Verifikasi

```bash
# API lokal (dari server)
curl -s http://127.0.0.1/pendaftaran-online/rest-api/public/api/test
curl -s http://127.0.0.1/pendaftaran-online/rest-api/public/api/v1/poli-data?today=1
# kalau 404, coba dengan index.php:
curl -s "http://127.0.0.1/pendaftaran-online/rest-api/public/index.php/api/v1/poli-data?today=1"

# WA lokal
curl -s http://127.0.0.1:3001/status
# WA dari sudut pandang php74-fpm
docker exec php74-fpm sh -c "curl -s http://wa-blas:3001/status"

# log apache
tail -f /opt/docker-server-rsi/logs/apache/*.log
```

Uji alur lengkap mengikuti `testing.http` (base URL diubah ke pola server):
`check-nik` → `poli/{slug}/schedules?date=...` → `POST /registration` →
`GET /registrations/{id}` → notifikasi WA terkirim (cek `docker logs wa-blas --tail=20`).

Scan QR sekali menjalankan: `ssh -L 3001:127.0.0.1:3001 user@server`, buka
`http://localhost:3001/qr-image`, scan WhatsApp > Perangkat Tertaut.

## 6. Frontend (via Hostinger cPanel)

Frontend disajikan dari **cPanel Hostinger** (HTTPS), sementara API berjalan di
server RS (HTTP). Browser memblokir mixed content — ini diatasi dengan
**proxy server-side** (`frontend/public/proxy.php`). Browser hanya bicara
ke `https://pendaftaran.rsi-jombang.id/proxy.php/...` (same-origin, HTTPS),
lalu PHP di Hostinger meneruskan ke `http://IP_PUBLIK:9999/.../api/...`.

### Siapkan

1. **Ganti IP placeholder** di dua file sebelum build:
   - `frontend/public/proxy.php` — cari baris `$apiBaseUrl = 'http://0.0.0.0:9999/...'`
     → ganti `0.0.0.0` dengan IP publik server RS yang sudah terbukti jalan.
   - `frontend/public/test_connection.php` — `$host = '0.0.0.0'` → ganti ke IP yang sama.

2. **Build produksi** (base URL `/proxy.php` sudah diset di `.env.production`):

```bash
cd frontend
npm install
npm run build   # tsc -b && vite build
```

Pastikan `dist/proxy.php` ada dan JS bundle berisi `/proxy.php` (bukan `http://...`):

```bash
ls frontend/dist/proxy.php frontend/dist/test_connection.php
grep -rl "proxy.php" frontend/dist/assets/ | head -3
```

### Deploy ke Hostinger

Upload seluruh isi `frontend/dist/` ke DocumentRoot cPanel (`public_html` atau
folder `pendaftaran.rsi-jombang.id`), menjaga struktur:

```
public_html/
  index.html
  assets/...
  proxy.php           ← dari dist/proxy.php
  test_connection.php ← dari dist/test_connection.php
  logo.png, ...       ← dari public/
```

Gunakan File Manager / FTP — jangan taruh `proxy.php` di subfolder.

### Uji berurutan

```
https://pendaftaran.rsi-jombang.id/test_connection.php
https://pendaftaran.rsi-jombang.id/proxy.php/api/test
https://pendaftaran.rsi-jombang.id/proxy.php/v1/poli-data?today=1
POST https://pendaftaran.rsi-jombang.id/proxy.php/v1/patients/check-nik
```

Lalu buka situsnya — seluruh alur poli-data, schedules, daftar, status
harus berjalan tanpa error mixed-content.

### Catatan

- `proxy.php` hanya meneruskan ke satu host (hardcode `$apiBaseUrl`), bukan open proxy.
- Jika Hostinger memblokir outbound ke port 9999, `test_connection.php` akan menunjukkan
  error spesifik. Hubungi support Hostinger minta izin `outbound TCP ke IP_PUBLIK:9999`.
  Kalau tidak bisa dapat izin, jatuh ke jalur HTTPS-domain (lihat opsi di note di atas).
- CORS di `rest-api/config/cors.php` tetap `['*']` — karena proksi PHP berjalan server-side
  dan browser tidak melihat response cross-origin, CORS tidak berpengaruh (aman dibiarkan).

## Checklist aman (sebelum go-live)

- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] `WA_API_KEY` bukan `changeme`, SAMA di rest-api dan wa-blas
- [ ] CORS `allowed_origins` dibatasi ke asal frontend
- [ ] Port publik di router hanya NAT untuk Apache (80/443); **3001 tidak dibuka**
- [ ] `rest-api/vendor` tidak ikut ter-commit; `.env` server tidak pernah di-upload ke repo
- [ ] Backup DB SIMRS sebelum migrasi: `docker exec mysql57 mysqldump rsi_jombang > /tmp/rsi_jombang-$(date +%F).sql`

## Akses observasi read-only (`deploy/ssh-readonly/RO.md`)

Untuk verifikasi server tanpa hak ubah, disiapkan user SSH `roagent` dengan mekanisme `command=` + allowlist (`ssh-readonly` gate + `rodig` wrapper untuk `docker exec` read-only).

- **User**: `roagent`, shell `/bin/false`, BUKAN member group docker.
- **Boleh**: baca file umum, `docker ps/logs/inspect`, `rodig sql SELECT/SHOW/DESCRIBE/EXPLAIN`, `rodig phpl php -v/-m/-l`, `rodig artl route:list|--version|about`, `curl` GET ke `127.0.0.1:80/:3001`.
- **Dilarang**: baca file `*.env`, modifikasi apapun, `docker exec` langsung, artisan yang menulis (`migrate`, `config:cache`, dsb).
- **Setup**: lihat `deploy/ssh-readonly/RO.md` (Bagian A laptop → Bagian B server → Bagian C uji).
- **Revoke**: hapus baris di `authorized_keys` atau `sudo userdel -r roagent`.

Setelah akses siap, lanjutkan verifikasi sinkronisasi `WA_API_KEY` (perbaiki 401) dan checklist aman di atas sebelum go-live.


## restart untuk scan qr ulang 
- cd /opt/docker-server-rsi
- docker compose stop wa-blas
<!-- - sudo cp -r www/pendaftaran-online/wa-blas/.wwebjs_auth /tmp/.wwebjs_auth.bak-$(date +%F)   # backup dulu -->
- sudo rm -rf www/pendaftaran-online/wa-blas/.wwebjs_auth
- docker compose up -d wa-blas
- sleep 15 && curl -s http://127.0.0.1:3001/status