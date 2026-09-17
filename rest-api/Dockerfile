FROM php:8.1-fpm-alpine

# System deps + PHP extensions untuk Laravel 8
RUN apk add --no-cache \
    bash icu-dev libzip-dev zip oniguruma-dev \
    $PHPIZE_DEPS \
  && docker-php-ext-install \
    pdo_mysql bcmath intl mbstring zip opcache \
  && pecl install redis && docker-php-ext-enable redis \
  && apk del $PHPIZE_DEPS

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Install dependencies dulu (layer cache)
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy source
COPY . .

RUN composer dump-autoload --optimize \
  && chown -R www-data:www-data storage bootstrap/cache

# Entry point: cache config/route saat runtime (pakai .env dari server)
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
