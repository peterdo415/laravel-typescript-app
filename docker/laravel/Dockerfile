FROM php:8.3-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    linux-headers \
    oniguruma-dev \
    libxml2-dev \
    libzip-dev \
    icu-dev \
    $PHPIZE_DEPS

# Install PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    mbstring \
    zip \
    intl \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN composer install

# Configure PHP
COPY laravel/php.ini /usr/local/etc/php/php.ini

# Set working directory
WORKDIR /var/www/html

# Switch to non-root user
RUN addgroup -g 1000 laravel && \
    adduser -u 1000 -G laravel -h /var/www/html -s /bin/sh -D laravel

USER laravel

# Start PHP-FPM
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"] 