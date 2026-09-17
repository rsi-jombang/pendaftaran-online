#!/bin/bash
set -e
# Setup pendaftaran-online di /opt/docker-server-rsi (seperti antrian-bpjs)
# Tanpa composer/node di host — semua via docker exec / docker run

SRC="/opt/docker-server-rsi/www/pendaftaran-online"
COMPOSE="/opt/docker-server-rsi/docker-compose.yml"

echo "== 1. Clone/update repo =="
if [ ! -d "$SRC" ]; then
  cd /opt/docker-server-rsi/www
  git clone <REPO_URL> pendaftaran-online
else
  cd "$SRC" && git pull
fi

echo "== 2. Patch docker-compose.yml (wa-blas) =="
# Tempel manual blok dari deploy/docker-compose.patch.yml ke $COMPOSE jika belum ada
if ! grep -q "wa-blas:" "$COMPOSE"; then
  echo "Tambahkan blok wa-blas dari deploy/docker-compose.patch.yml ke $COMPOSE"
  echo "Lalu lanjutkan script."
  exit 1
fi

echo "== 3. Apache vhost =="
sudo cp "$SRC/deploy/apache/pendaftaran-online.conf" /opt/docker-server-rsi/apache/conf/sites-enabled/pendaftaran-online.conf

echo "== 4. Env =="
if [ ! -f "$SRC/rest-api/.env" ]; then
  cp "$SRC/rest-api/.env.example" "$SRC/rest-api/.env"
  echo "Edit $SRC/rest-api/.env : DB_HOST=mysql, DB_DATABASE=rsi_jombang, APP_URL=http://<server>/pendaftaran-online/rest-api/public, WA_GATEWAY_URL=http://wa-blas:3001, WA_API_KEY=xxx, WA_ENABLED=true"
  nano "$SRC/rest-api/.env"
fi
if [ ! -f "$SRC/wa-blas/.env" ]; then
  cp "$SRC/wa-blas/.env.example" "$SRC/wa-blas/.env"
  # WA_API_KEY harus sama dengan rest-api/.env
  nano "$SRC/wa-blas/.env"
fi
# Generate WA_API_KEY jika masih changeme (opsional)
# WA_KEY=$(openssl rand -base64 32); sed -i "s/changeme/$WA_KEY/g" "$SRC/rest-api/.env" "$SRC/wa-blas/.env"

echo "== 5. Composer via one-off (tanpa composer di host maupun di php74-fpm) =="
# php74-fpm di server tidak ada binary composer — pakai image composer:2 one-off (tanpa rebuild)
# mount ke /app dan ignore platform reqs agar tidak butuh ext yang sama persis
docker run --rm -v "$SRC/rest-api:/app" -w /app composer:2 composer install --no-dev --optimize-autoloader --ignore-platform-reqs
# artisan & permission tetap via php74-fpm (kode ada di /var/www/pendaftaran-online)
docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan key:generate --force
docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan migrate --force
docker exec php74-fpm chown -R www-data:www-data /var/www/pendaftaran-online/rest-api/storage /var/www/pendaftaran-online/rest-api/bootstrap/cache

echo "== 6. WA deps via node one-off (tanpa node host) =="
docker run --rm -v "$SRC/wa-blas:/app" -w /app node:20-slim sh -c "npm ci --omit=dev"

echo "== 7. Up =="
cd /opt/docker-server-rsi
docker compose up -d --build wa-blas
docker compose restart apache

echo "== 8. Verify =="
echo "REST: curl http://127.0.0.1/pendaftaran-online/rest-api/public/api/v1/poli-data"
curl -s http://127.0.0.1/pendaftaran-online/rest-api/public/api/v1/poli-data | head -c 500; echo
echo "WA (lokal): curl http://127.0.0.1:3001/status"
curl -s http://127.0.0.1:3001/status | head -c 500; echo
echo "WA internal: docker exec php74-fpm curl -s http://wa-blas:3001/status"
docker exec php74-fpm sh -c "apk add --no-cache curl >/dev/null 2>&1; curl -s http://wa-blas:3001/status" | head -c 500; echo

echo "== Scan QR =="
echo "Karena wa-blas bind 127.0.0.1, buat tunnel: ssh -L 3001:127.0.0.1:3001 user@<server>"
echo "Lalu buka http://localhost:3001/qr-image dan scan WhatsApp > Perangkat Tertaut"
