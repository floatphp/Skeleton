# PHP/Apache image
FROM php:8.3-apache

# Working directory
WORKDIR /var/www/html

# PHP extensions
RUN docker-php-ext-install pdo_mysql mysqli

# Copy application files
COPY . .

# Expose port 80
EXPOSE 80
