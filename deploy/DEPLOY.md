# Deploy pendaftaran-online di /opt/docker-server-rsi (seperti antrian-bpjs)

## Arsitektur
- **Kode:** `/opt/docker-server-rsi/www/pendaftaran-online/rest-api` → terlihat oleh `apache:/var/www` dan `php74-fpm:/var/www` via volume `www:/var/www` existing. Tidak perlu service PHP baru.
- **Apache:** satu file `apache/conf/sites-enabled/pendaftaran-online.conf` berisi `<Directory /var/www/pendaftaran-online/rest-api/public>` + `SetHandler proxy:fcgi://php74-fpm:9000` (pola identik `antrian-bpjs` di `000-default.conf`).
- **WA gateway:** service `wa-blas` baru di `docker-compose.yml`, `127.0.0.1:3001:3001` (lokal saja), `webnet`. `rest-api` panggil `http://wa-blas:3001`.
- **Deps:** tanpa `composer`/`node` di host **maupun di container php74-fpm** — `composer` via one-off `composer:2`, `npm` via one-off `node:20-slim` (tanpa rebuild image existing).

## Langkah
1. Clone: `cd /opt/docker-server-rsi/www && git clone <REPO_URL> pendaftaran-online`
2. Patch compose: tempel blok `deploy/docker-compose.patch.yml` ke `docker-compose.yml`.
3. Apache: `sudo cp www/pendaftaran-online/deploy/apache/pendaftaran-online.conf apache/conf/sites-enabled/`
4. Env:
   - `www/pendaftaran-online/rest-api/.env`: `DB_HOST=mysql`, `DB_PORT=3306`, `DB_DATABASE=rsi_jombang`, `APP_URL=http://<server>`, `WA_GATEWAY_URL=http://wa-blas:3001`, `WA_API_KEY` (sama dengan wa-blas), `WA_ENABLED=true`
   - `www/pendaftaran-online/wa-blas/.env`: `PORT=3001`, `WA_API_KEY` sama, `CORS_ORIGIN=*`
   - `WA_API_KEY`: `openssl rand -base64 32`
5. Jalankan `bash www/pendaftaran-online/deploy/setup-server.sh` (composer: `docker run composer:2`, npm: `docker run node:20-slim` — tanpa rebuild php74-fpm).
6. Verifikasi: `curl http://127.0.0.1/pendaftaran-online/rest-api/public/api/v1/poli-data`, `curl http://127.0.0.1:3001/status`.
7. Scan QR: `ssh -L 3001:127.0.0.1:3001 user@server` → `http://localhost:3001/qr-image`.

## Alternatif wa-blas terpisah
`docker compose -f deploy/docker-compose.wa-blas.yml up -d --build` (network `webserver_webnet` external).

## Catatan
- `rest-api/Dockerfile`, `nginx.conf`, `docker-entrypoint.sh` di repo adalah cadangan untuk deploy terpisah (tidak dipakai di mode apache+php74-fpm ini).
- `docker-compose.yml` di root repo untuk dev lokal (app nginx :8080); di server yang dipakai adalah patch `wa-blas` saja.
