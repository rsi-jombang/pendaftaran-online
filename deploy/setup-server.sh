#!/bin/bash
# Setup pendaftaran-online (rest-api) di /opt/docker-server-rsi
# Mengikuti pola antrian-bpjs: Apache + php74-fpm + mysql57 + wa-blas existing.
# TANPA composer/node di host — semua lewat one-off container.
#
# Prasyarat:
#   1) Folder rest-api SUDAH di-upload ke $SRC (lihat deploy/DEPLOY.md)
#   2) .env rest-api sudah diisi (DB_HOST=mysql, DB rsi_jombang, WA sinkron wa-blas)
#   3) wa-blas sudah jalan (tidak diutak-atik di sini)
#
# Usage: bash deploy/setup-server.sh   (dari /opt/docker-server-rsi/www/pendaftaran-online)

set -e

SRC="/opt/docker-server-rsi/www/pendaftaran-online"
REST="$SRC/rest-api"
APACHE_CONF="$SRC/deploy/apache/pendaftaran-online.conf"
TARGET_CONF="/opt/docker-server-rsi/apache/conf/sites-enabled/pendaftaran-online.conf"
MIGRATION="database/migrations/2026_09_17_000000_add_id_vaksin_to_antrians_non_bpjs.php"

echo "== 0. Cek prasyarat =="
[ -d "$REST" ] || { echo "ERROR: $REST tidak ada. Upload dulu (DEPLOY.md langkah 1)."; exit 1; }
[ -f "$REST/.env" ] || { echo "ERROR: .env belum ada. Buat dari .env.example dan isi dulu."; exit 1; }
grep -q "^APP_KEY=$" "$REST/.env" || echo "  info: APP_KEY sudah terisi (skip key:generate)."
docker ps --format '{{.Names}}' | grep -qx wa-blas || echo "  WARN: wa-blas tidak terdeteksi."

echo "== 1. Composer (one-off) =="
docker run --rm -v "$REST:/app" -w /app composer:2 composer install \
  --no-dev --optimize-autoloader --ignore-platform-reqs

echo "== 2. Artisan =="
if grep -q "^APP_KEY=$" "$REST/.env"; then
  docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan key:generate --force
fi

echo "== 3. Migrasi AMAN (hanya add_id_vaksin, bukan default Laravel) =="
if docker exec mysql57 mysql -N -e "SHOW COLUMNS FROM rsi_jombang.antrians_non_bpjs LIKE 'id_vaksin';" | grep -q id_vaksin; then
  echo "  id_vaksin sudah ada — migrasi dilewati."
else
  docker exec -w /var/www/pendaftaran-online/rest-api php74-fpm php artisan migrate \
    --force --path="$MIGRATION"
fi

echo "== 4. Permission =="
docker exec php74-fpm bash -c "chown -R www-data:www-data \
  /var/www/pendaftaran-online/rest-api/storage \
  /var/www/pendaftaran-online/rest-api/bootstrap/cache \
  && chmod -R 775 /var/www/pendaftaran-online/rest-api/storage \
  /var/www/pendaftaran-online/rest-api/bootstrap/cache"

echo "== 5. Apache handler =="
[ -f "$APACHE_CONF" ] || { echo "ERROR: $APACHE_CONF tidak ada."; exit 1; }
cp "$APACHE_CONF" "$TARGET_CONF"
docker exec apache apachectl configtest || { echo "ERROR: configtest gagal — periksa $TARGET_CONF"; exit 1; }
docker exec apache apache2ctl graceful

echo "== 6. Verifikasi =="
echo "REST : $(curl -s -m 8 http://127.0.0.1/pendaftaran-online/rest-api/public/api/test | head -c 200)"
echo "WA   : $(curl -s -m 8 http://127.0.0.1:3001/status | head -c 200)"

echo ""
echo "SELESAI. Uji lengkap sesuai deploy/DEPLOY.md bagian 5."
echo "Scan QR (sekali): ssh -L 3001:127.0.0.1:3001 user@SERVER lalu buka http://localhost:3001/qr-image"