#!/bin/sh
set -e

cd /var/www/html

# Cache config & route saat runtime agar mengikuti .env di server
php artisan config:cache || true
php artisan route:cache || true

# Storage permissions
chown -R www-data:www-data storage bootstrap/cache

exec "$@"
